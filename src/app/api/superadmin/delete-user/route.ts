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

    // 2. ONLY SuperAdmin can delete users
    if (decoded.role !== 'superadmin') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden - SuperAdmin access required'
      }, { status: 403 });
    }

    // 3. Get user_id from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: user_id'
      }, { status: 400 });
    }

    // 4. Prevent self-deletion
    if (parseInt(userId) === decoded.userId) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete your own account'
      }, { status: 400 });
    }

    // 5. Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    await client.query('BEGIN');

    // 6. Get user details before deletion
    const userResult = await client.query(
      `SELECT id, full_name, email, role, status 
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const user = userResult.rows[0];

    // 7. Prevent deleting other superadmins (extra safety)
    if (user.role === 'superadmin') {
      await client.query('ROLLBACK');
      return NextResponse.json({
        success: false,
        error: 'Cannot delete SuperAdmin accounts'
      }, { status: 403 });
    }

    // 8. Soft delete: Update status to 'deleted'
    await client.query(
      `UPDATE users
       SET status = 'deleted',
           updated_at = CURRENT_TIMESTAMP,
           metadata = jsonb_set(
             COALESCE(metadata, '{}'),
             '{deleted_info}',
             jsonb_build_object(
               'deleted_at', CURRENT_TIMESTAMP,
               'deleted_by', $1,
               'deleted_by_email', $2
             )
           )
       WHERE id = $3`,
      [decoded.userId, decoded.email, userId]
    );

    // 9. If parent, also soft-delete their children
    let deletedChildren = 0;
    if (user.role === 'parent') {
      const childrenResult = await client.query(
        `UPDATE users
         SET status = 'deleted',
             updated_at = CURRENT_TIMESTAMP
         WHERE id IN (
           SELECT child_id 
           FROM parent_children 
           WHERE parent_id = $1
         )
         RETURNING id`,
        [userId]
      );
      deletedChildren = childrenResult.rowCount || 0;
    }

    // 10. Log security event (user deletion is critical)
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
        'user_deletion',
        'high',
        'User Account Deleted',
        `SuperAdmin ${decoded.email} deleted user: ${user.full_name} (${user.email}) - Role: ${user.role}`,
        decoded.userId,
        decoded.email,
        ip,
        true
      ]
    );

    // 11. Log admin activity
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
        resource_id,
        ip_address,
        success
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        decoded.userId,
        decoded.email,
        decoded.email,
        decoded.role,
        'delete_user',
        'user_management',
        'delete',
        `Deleted user: ${user.full_name} (${user.email}) - Role: ${user.role}`,
        'user',
        userId,
        ip,
        true
      ]
    );

    // 12. Log data change
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
        'users',
        userId,
        'DELETE',
        JSON.stringify({ 
          status: user.status,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }),
        JSON.stringify({ status: 'deleted' }),
        ['status'],
        `User account deleted by SuperAdmin`,
        ip
      ]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        deleted_user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        },
        deleted_children: deletedChildren
      }
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error deleting user:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    }, { status: 500 });
  } finally {
    client.release();
  }
}