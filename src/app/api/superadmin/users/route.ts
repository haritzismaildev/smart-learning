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

    // 2. ONLY SuperAdmin can view all users
    if (decoded.role !== 'superadmin') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden - SuperAdmin access required'
      }, { status: 403 });
    }

    // 3. Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // Filter by role
    const status = searchParams.get('status'); // Filter by status
    const search = searchParams.get('search'); // Search by name/email
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // 4. Build WHERE clause dynamically
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (role) {
      conditions.push(`role = $${paramCount++}`);
      values.push(role);
    }

    if (status) {
      conditions.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (search) {
      conditions.push(`(full_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    // 5. Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, values);
    const totalUsers = parseInt(countResult.rows[0].total);

    // 6. Get users with pagination
    values.push(limit, offset);
    const usersQuery = `
      SELECT 
        id,
        full_name,
        email,
        role,
        status,
        nik,
        phone,
        whatsapp,
        address,
        age,
        grade_level,
        approved_by,
        approved_at,
        last_login,
        login_count,
        failed_login_count,
        created_at,
        updated_at,
        notes
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount++} OFFSET $${paramCount}
    `;

    const usersResult = await client.query(usersQuery, values);

    // 7. Get statistics
    const statsQuery = `
      SELECT 
        role,
        status,
        COUNT(*) as count
      FROM users
      GROUP BY role, status
      ORDER BY role, status
    `;
    const statsResult = await client.query(statsQuery);

    // 8. Log admin activity
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
        'view_users',
        'user_management',
        'read',
        `Viewed users list - Filters: role=${role}, status=${status}, search=${search}`,
        request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        true
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        users: usersResult.rows,
        pagination: {
          page,
          limit,
          total: totalUsers,
          total_pages: Math.ceil(totalUsers / limit)
        },
        statistics: statsResult.rows
      }
    });

  } catch (error: any) {
    console.error('Error fetching users:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    }, { status: 500 });
  } finally {
    client.release();
  }
}