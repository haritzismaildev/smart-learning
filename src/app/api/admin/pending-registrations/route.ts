import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET(request: NextRequest) {
  try {
    // Verify token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin or superadmin
    const userResult = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userRole = userResult.rows[0].role;
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';

    // Build query
    let query = `
      SELECT 
        id, nik, full_name, email, phone, whatsapp, address,
        children_data, number_of_children, status,
        created_at, updated_at
      FROM pending_registrations
    `;

    const params: any[] = [];
    
    if (status !== 'all') {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    // Log activity
    await pool.query(
      `SELECT log_user_activity($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        decoded.userId,
        'view_registrations',
        'user_management',
        'read',
        `Admin viewed pending registrations (filter: ${status})`,
        'pending_registrations',
        null,
        request.headers.get('x-forwarded-for') || 'unknown',
        true
      ]
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({
      error: 'Server error'
    }, { status: 500 });
  }
}