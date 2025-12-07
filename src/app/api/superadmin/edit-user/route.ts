import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export async function PUT(request: NextRequest) {
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

    // 2. ONLY SuperAdmin can edit users
    if (decoded.role !== 'superadmin') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden - SuperAdmin access required'
      }, { status: 403 });
    }

    // 3. Get request body
    const body = await request.json();
    const { 
      user_id, 
      full_name, 
      email, 
      role, 
      status, 
      password, // Optional - only if changing password
      nik,
      phone,
      whatsapp,
      address,
      age,
      grade_level
    } = body;

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'Missing required field: user_id'
      }, { status: 400 });
    }

    // 4. Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    await client.query('BEGIN');

    // 5. Get current user data
    const currentUserResult = await client.query(
      `SELECT * FROM users WHERE id = $1`,
      [user_id]
    );

    if (currentUserResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const currentUser = currentUserResult.rows[0];

    // 6. Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    const changedFields: string[] = [];
    const oldData: any = {};
    const newData: any = {};

    // Update full_name
    if (full_name && full_name !== currentUser.full_name) {
      updates.push(`full_name = $${paramCount++}`);
      values.push(full_name);
      changedFields.push('full_name');
      oldData.full_name = currentUser.full_name;
      newData.full_name = full_name;
    }

    // Update email
    if (email && email !== currentUser.email) {
      // Check if email already exists
      const emailCheck = await client.query(
        `SELECT id FROM users WHERE email = $1 AND id != $2`,
        [email, user_id]
      );
      if (emailCheck.rows.length > 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: 'Email already exists'
        }, { status: 400 });
      }
      updates.push(`email = $${paramCount++}`);
      values.push(email);
      changedFields.push('email');
      oldData.email = currentUser.email;
      newData.email = email;
    }

    // Update role (careful with this!)
    if (role && role !== currentUser.role) {
      if (!['superadmin', 'admin', 'parent', 'teacher', 'child'].includes(role)) {
        await client.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: 'Invalid role'
        }, { status: 400 });
      }
      updates.push(`role = $${paramCount++}`);
      values.push(role);
      changedFields.push('role');
      oldData.role = currentUser.role;
      newData.role = role;
    }

    // Update status
    if (status && status !== currentUser.status) {
      if (!['pending', 'active', 'suspended', 'rejected', 'deleted'].includes(status)) {
        await client.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: 'Invalid status'
        }, { status: 400 });
      }
      updates.push(`status = $${paramCount++}`);
      values.push(status);
      changedFields.push('status');
      oldData.status = currentUser.status;
      newData.status = status;
    }

    // Update password (if provided)
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramCount++}`);
      values.push(hashedPassword);
      changedFields.push('password');
      oldData.password = '[REDACTED]';
      newData.password = '[REDACTED - Changed]';
    }

    // Update NIK
    if (nik && nik !== currentUser.nik) {
      updates.push(`nik = $${paramCount++}`);
      values.push(nik);
      changedFields.push('nik');
      oldData.nik = currentUser.nik;
      newData.nik = nik;
    }

    // Update phone
    if (phone && phone !== currentUser.phone) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
      changedFields.push('phone');
      oldData.phone = currentUser.phone;
      newData.phone = phone;
    }

    // Update whatsapp
    if (whatsapp && whatsapp !== currentUser.whatsapp) {
      updates.push(`whatsapp = $${paramCount++}`);
      values.push(whatsapp);
      changedFields.push('whatsapp');
      oldData.whatsapp = currentUser.whatsapp;
      newData.whatsapp = whatsapp;
    }

    // Update address
    if (address && address !== currentUser.address) {
      updates.push(`address = $${paramCount++}`);
      values.push(address);
      changedFields.push('address');
      oldData.address = currentUser.address;
      newData.address = address;
    }

    // Update age (for children)
    if (age !== undefined && age !== currentUser.age) {
      updates.push(`age = $${paramCount++}`);
      values.push(age);
      changedFields.push('age');
      oldData.age = currentUser.age;
      newData.age = age;
    }

    // Update grade_level (for children)
    if (grade_level !== undefined && grade_level !== currentUser.grade_level) {
      updates.push(`grade_level = $${paramCount++}`);
      values.push(grade_level);
      changedFields.push('grade_level');
      oldData.grade_level = currentUser.grade_level;
      newData.grade_level = grade_level;
    }

    // Check if there are any updates
    if (updates.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({
        success: false,
        error: 'No changes detected'
      }, { status: 400 });
    }

    // Add updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // 7. Execute update
    values.push(user_id);
    const updateQuery = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const updateResult = await client.query(updateQuery, values);
    const updatedUser = updateResult.rows[0];

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
        'edit_user',
        'user_management',
        'update',
        `Updated user: ${currentUser.full_name} (${currentUser.email}) - Fields: ${changedFields.join(', ')}`,
        'user',
        user_id,
        ip,
        true
      ]
    );

    // 9. Log data change
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
        user_id,
        'UPDATE',
        JSON.stringify(oldData),
        JSON.stringify(newData),
        changedFields,
        `User details updated by SuperAdmin`,
        ip
      ]
    );

    await client.query('COMMIT');

    // Remove sensitive data from response
    delete updatedUser.password;

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser,
        changed_fields: changedFields
      }
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating user:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update user',
      details: error.message
    }, { status: 500 });
  } finally {
    client.release();
  }
}