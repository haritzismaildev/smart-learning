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

export async function DELETE(request: NextRequest) {
    const client = await pool.connect();

    try {
        // 1. verify JWT Token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return NextResponse.json({
                success: false,
                error: 'Unauthorized - No token provided'
            }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '89d2ac5905860244901d9ba553111fa8af90fbcd5b20e698b0b246f8f3ab8a8d3959dee6d7b56d235b99e14c38770814d349a0cb97d6e8e64c746c3c648d0120') as JWTPayload;

        // 2. ONLY Superadmin can delete audit logs
        if (decoded.role !== 'superadmin') {
            return NextResponse.json({
                success: false,
                error: 'Forbidden - Superadmin access required'
            }, {status: 403 });
        }

        // 3. Get request body
        const body = await request.json();
        const { 
        log_type, 
        older_than_days, 
        confirmation_text 
        } = body;

        // 4. Require Confirmation
        if (confirmation_text !== 'DELETE AUDIT LOGS') {
            return NextResponse.json({
                success: false,
                error: 'Confirmation text does not match. Please type exactly: DELETE AUDIT LOGS'
            }, { status: 400 });
        }

        if (!log_type || !older_than_days) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: log_type, older_than_days'
            }, { status: 400 });
        }

        // 5. Validate older_than_days (minimum 90 days for safety)
        if (older_than_days < 90) {
            return NextResponse.json({
                success: false,
                error: 'For safety, can only delete logs older than 90 days'
            }, { status: 400 });
        }

        await client.query('BEGIN');

        // 6. Determine table and date column
        let tableName = '';
        let dateColumn = '';

        switch (log_type) {
        case 'visitors':
            tableName = 'audit_visitors';
            dateColumn = 'accessed_at';
            break;
        case 'login_attempts':
            tableName = 'audit_login_attempts';
            dateColumn = 'attempted_at';
            break;
        case 'user_activities':
            tableName = 'audit_user_activities';
            dateColumn = 'started_at';
            break;
        case 'data_changes':
            tableName = 'audit_data_changes';
            dateColumn = 'changed_at';
            break;
        case 'security_events':
            // CANNOT delete security_events for compliance
            await client.query('ROLLBACK');
            return NextResponse.json({
            success: false,
            error: 'Cannot delete security_events - these must be retained for compliance'
            }, { status: 403 });
        default:
            await client.query('ROLLBACK');
            return NextResponse.json({
            success: false,
            error: 'Invalid log_type'
            }, { status: 400 });
        }

        // 7. Count records to be deleted
        const countResult = await client.query(
            `SELECT COUNT(*) as count
             FROM ${tableName}
             WHERE ${dateColumn} < NOW() - INTERVAL '${older_than_days} days'`
        );
        const recordsToDelete = parseInt(countResult.rows[0].count);

        if (recordsToDelete === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({
                success: false,
                error: 'No records found older than ${older_than_days} days'
            }, { status: 404 });
        }

        // 8. Create backup record in audit_data_changes BEFORE deletion
        await client.query(
            `INSERT INTO audit_data_changes (
                user_id,
                user_email,
                user_role,
                table_name,
                record_id,
                operation,
                old_data,
                new_data,
                changed_fields,
                change_reason,
                ip_address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                decoded.userId,
                decoded.email,
                decoded.role,
                tableName,
                null,
                'DELETE',
                JSON.stringify({ records_deleted: recordsToDelete, older_than_days }),
                JSON.stringify({ status: 'deleted' }),
                ['bulk_delete'],
                `Bulk deletion of ${recordsToDelete} audit logs from ${tableName} older than ${older_than_days} days`,
                request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
            ]
        );

        // 9. Execute deletion
        const deleteResult = await client.query(
        `DELETE FROM ${tableName}
        WHERE ${dateColumn} < NOW() - INTERVAL '${older_than_days} days'`
        );

        const deletedCount = deleteResult.rowCount || 0;

        // 10. Log CRITICAL security event
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
            'audit_deletion',
            'critical',
            '⚠️ CRITICAL: Audit Logs Deleted',
            `SuperAdmin ${decoded.email} deleted ${deletedCount} records from ${tableName} (older than ${older_than_days} days). This is a high-risk action that affects audit integrity.`,
            decoded.userId,
            decoded.email,
            request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
            true
        ]
        );

        // 11. Log user activity (this one stays even if others are deleted)
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
            resource_type,
            ip_address,
            success
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
         [
            decoded.userId,
            decoded.email,
            decoded.email,
            decoded.role,
            'delete_audit_logs',
            'audit',
            'delete',
            `⚠️ DELETED ${deletedCount} audit records from ${tableName} (older than ${older_than_days} days)`,
            tableName,
            request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
            true
         ]
        );

        await client.query('COMMIT');

        return NextResponse.json({
        success: true,
        message: 'Audit logs deleted successfully',
        data: {
            table: tableName,
            records_deleted: deletedCount,
            older_than_days: older_than_days,
            deleted_by: decoded.email,
            security_event_created: true,
            warning: 'This action has been logged as a CRITICAL security event'
        }
        });

    } catch(error: any) {
        await client.query('ROLLBACK');
        console.error('Error deleting audit logs:', error);
        
        if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({
            success: false,
            error: 'Invalid token'
        }, { status: 401 });
        }

        return NextResponse.json({
        success: false,
        error: 'Failed to delete audit logs',
        details: error.message
        }, { status: 500 });
    } finally {
        client.release();
    }
}