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

    // 2. Only SuperAdmin and Admin can view audit logs
    if (!['superadmin', 'admin'].includes(decoded.role)) {
      return NextResponse.json({
        success: false,
        error: 'Forbidden - Admin access required'
      }, { status: 403 });
    }

    // 3. Get query parameters
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Filters
    const logType = searchParams.get('log_type'); // visitors, login_attempts, user_activities, data_changes, security_events
    const userEmail = searchParams.get('user_email');
    const activityType = searchParams.get('activity_type');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const success = searchParams.get('success'); // true/false/all
    const severity = searchParams.get('severity'); // low/medium/high/critical

    // 4. Determine which table to query
    let tableName = '';
    let dateColumn = '';
    let conditions: string[] = [];
    let values: any[] = [];
    let paramCount = 1;

    switch (logType) {
      case 'visitors':
        tableName = 'audit_visitors';
        dateColumn = 'accessed_at';
        break;
      case 'login_attempts':
        tableName = 'audit_login_attempts';
        dateColumn = 'attempted_at';
        if (userEmail) {
          conditions.push(`email ILIKE $${paramCount++}`);
          values.push(`%${userEmail}%`);
        }
        if (success === 'true') {
          conditions.push(`success = true`);
        } else if (success === 'false') {
          conditions.push(`success = false`);
        }
        break;
      case 'user_activities':
        tableName = 'audit_user_activities';
        dateColumn = 'started_at';
        if (userEmail) {
          conditions.push(`user_email ILIKE $${paramCount++}`);
          values.push(`%${userEmail}%`);
        }
        if (activityType) {
          conditions.push(`activity_type = $${paramCount++}`);
          values.push(activityType);
        }
        if (success === 'true') {
          conditions.push(`success = true`);
        } else if (success === 'false') {
          conditions.push(`success = false`);
        }
        break;
      case 'data_changes':
        tableName = 'audit_data_changes';
        dateColumn = 'changed_at';
        if (userEmail) {
          conditions.push(`user_email ILIKE $${paramCount++}`);
          values.push(`%${userEmail}%`);
        }
        break;
      case 'security_events':
        tableName = 'security_events';
        dateColumn = 'detected_at';
        if (severity) {
          conditions.push(`severity = $${paramCount++}`);
          values.push(severity);
        }
        if (userEmail) {
          conditions.push(`email ILIKE $${paramCount++}`);
          values.push(`%${userEmail}%`);
        }
        break;
      default:
        // Default to user_activities
        tableName = 'audit_user_activities';
        dateColumn = 'started_at';
    }

    // Add date range filters
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

    // 5. Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${tableName}
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, values);
    const totalLogs = parseInt(countResult.rows[0].total);

    // 6. Get logs with pagination
    values.push(limit, offset);
    const logsQuery = `
      SELECT *
      FROM ${tableName}
      ${whereClause}
      ORDER BY ${dateColumn} DESC
      LIMIT $${paramCount++} OFFSET $${paramCount}
    `;

    const logsResult = await client.query(logsQuery, values);

    // 7. Get statistics by log type
    const statsQuery = `
      SELECT 
        'visitors' as type,
        COUNT(*) as count
      FROM audit_visitors
      UNION ALL
      SELECT 
        'login_attempts' as type,
        COUNT(*) as count
      FROM audit_login_attempts
      UNION ALL
      SELECT 
        'user_activities' as type,
        COUNT(*) as count
      FROM audit_user_activities
      UNION ALL
      SELECT 
        'data_changes' as type,
        COUNT(*) as count
      FROM audit_data_changes
      UNION ALL
      SELECT 
        'security_events' as type,
        COUNT(*) as count
      FROM security_events
    `;
    const statsResult = await client.query(statsQuery);

    // 8. Log this audit trail access
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
        'view_audit_logs',
        'audit',
        'read',
        `Viewed ${logType || 'all'} audit logs - Filters: ${JSON.stringify({ userEmail, activityType, startDate, endDate })}`,
        request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        true
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        logs: logsResult.rows,
        pagination: {
          page,
          limit,
          total: totalLogs,
          total_pages: Math.ceil(totalLogs / limit)
        },
        statistics: statsResult.rows,
        filters_applied: {
          log_type: logType,
          user_email: userEmail,
          activity_type: activityType,
          start_date: startDate,
          end_date: endDate,
          success: success,
          severity: severity
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch audit logs',
      details: error.message
    }, { status: 500 });
  } finally {
    client.release();
  }
}