import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

interface JWTPayload {
    userId: number;
    email: string;
    role: string;
}

export async function GET(request: NextRequest) {
    const client = await pool.connect();

    try {
        // 1. Verify JWT token
        const authHeader = request.headers.get('authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                success: false,
                error: 'Unauthorized - No token provided'
            }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload;

        // 2. Only SuperAdmin can export audit logs
        if (decoded.role !== 'superadmin') {
            return NextResponse.json({
                success: false,
                error: 'Forbidden - SuperAdmin access required'
            }, { status: 403 });
        }

        // 3. Get query parameters
        const { searchParams } = new URL(request.url);
        const logType = searchParams.get('log_type') || 'user_activities';
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');

        // 4. Determine table and query
        let tableName = '';
        let dateColumn = '';
        let selectColumns = '';

        switch (logType) {
        case 'visitors':
            tableName = 'audit_visitors';
            dateColumn = 'accessed_at';
            selectColumns = `
            session_id,
            visitor_fingerprint,
            ip_address,
            country,
            city,
            page_url,
            device_type,
            browser,
            os,
            accessed_at
            `;
            break;
        case 'login_attempts':
            tableName = 'audit_login_attempts';
            dateColumn = 'attempted_at';
            selectColumns = `
            email,
            username,
            success,
            failure_reason,
            ip_address,
            country,
            city,
            device_type,
            browser,
            attempted_at
            `;
            break;
        case 'user_activities':
            tableName = 'audit_user_activities';
            dateColumn = 'started_at';
            selectColumns = `
            user_email,
            user_role,
            activity_type,
            activity_category,
            activity_action,
            activity_description,
            resource_type,
            resource_id,
            ip_address,
            success,
            started_at
            `;
            break;
        case 'data_changes':
            tableName = 'audit_data_changes';
            dateColumn = 'changed_at';
            selectColumns = `
            user_email,
            user_role,
            table_name,
            record_id,
            operation,
            changed_fields,
            change_reason,
            changed_at
            `;
            break;
        case 'security_events':
            tableName = 'security_events';
            dateColumn = 'detected_at';
            selectColumns = `
            event_type,
            severity,
            title,
            description,
            email,
            ip_address,
            attack_vector,
            blocked,
            detected_at
            `;
            break;
        default:
            tableName = 'audit_user_activities';
            dateColumn = 'started_at';
            selectColumns = '*';
        }

        // 5. Build WHERE clause
        const conditions: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (startDate) {
            conditions.push(`${dateColumn} >= $${paramCount++}`);
            values.push(startDate);
        }
        if (endDate) {
            conditions.push(`${dateColumn} <= $${paramCount++}`);
            values.push(endDate);
        }

        const whereClause = conditions.length > 0 
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

        // 6. Fetch data
        const query = `
        SELECT ${selectColumns}
        FROM ${tableName}
        ${whereClause}
        ORDER BY ${dateColumn} DESC
        LIMIT 10000
        `;

        const result = await client.query(query, values);

        // 7. Convert to CSV
        const rows = result.rows;
        if (rows.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No data found for export'
            }, { status: 404 });
        }

        // Get column headers
        const headers = Object.keys(rows[0]);
        
        // Build CSV content
        let csvContent = headers.join(',') + '\n';
        
        rows.forEach(row => {
        const values = headers.map(header => {
            let value = row[header];
            
            // Handle special cases
            if (value === null || value === undefined) {
            return '';
            }
            if (typeof value === 'object') {
            value = JSON.stringify(value);
            }
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            value = `"${value.replace(/"/g, '""')}"`;
            }
            
            return value;
        });
        
        csvContent += values.join(',') + '\n';
        });

        // 8. Log export activity
        await client.query(
            `INSERT INTO audit_user_activities (
                user_id,
                username,
                user_email,
                user_role,
                activity_type,
                activity_category,
                activity_action,
                activity_description,
                ip_address,
                success
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                decoded.userId,
                decoded.email,
                decoded.email,
                decoded.role,
                'export_audit_logs',
                'audit',
                'export',
                `Exported ${logType} audit logs (${rows.length} records) - Date range: ${startDate || 'all'} to ${endDate || 'all'}`,
                request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
                true
            ]
        );

        // 9. Log high-severity security event (export is sensitive)
        await client.query(
            `INSERT INTO security_events (
                event_type,
                severity,
                title,
                description,
                user_id,
                email,
                ip_address,
                resolved
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                'audit_export',
                'high',
                'Audit Logs Exported',
                `SuperAdmin ${decoded.email} exported ${rows.length} ${logType} records`,
                decoded.userId,
                decoded.email,
                request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
                true
            ]
        );

        // 10. Return CSV file
        const filename = `audit_${logType}_${new Date().toISOString().split('T')[0]}.csv`;
        
        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch(error) {
        console.error('Error exporting audit logs:', error);

        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({
                success: false,
                error: 'Invalid token'
            }, { status: 401 });
        }

        return NextResponse.json({
            success: false,
            error: 'Failed to export audit logs',
            details: error.message
        }, { status: 500 });
    } finally {
        client.release();
    }
}