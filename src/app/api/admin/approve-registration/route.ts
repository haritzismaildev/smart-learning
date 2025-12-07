import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Generate random password
function generatePassword(length: number = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Generate username from name
function generateUsername(fullName: string, index: number): string {
  const cleaned = fullName.toLowerCase().replace(/[^a-z]/g, '');
  const random = Math.floor(Math.random() * 1000);
  return `${cleaned}${index}${random}`;
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
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
    const userResult = await client.query(
      'SELECT id, role, full_name FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const admin = userResult.rows[0];
    if (admin.role !== 'admin' && admin.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { registration_id } = await request.json();

    if (!registration_id) {
      return NextResponse.json({ error: 'Registration ID required' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Get registration details
    const regResult = await client.query(
      `SELECT * FROM pending_registrations WHERE id = $1 AND status = 'pending'`,
      [registration_id]
    );

    if (regResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Registration not found or already processed' }, { status: 404 });
    }

    const registration = regResult.rows[0];

    // 1. Create parent user account
    const parentResult = await client.query(
      `INSERT INTO users (
        nik, full_name, email, password, role, status,
        phone, whatsapp, address,
        approved_by, approved_at,
        age, grade_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, $11, $12)
      RETURNING id`,
      [
        registration.nik,
        registration.full_name,
        registration.email,
        registration.password_hash,
        'parent',
        'active',
        registration.phone,
        registration.whatsapp,
        registration.address,
        admin.id,
        null, // age not applicable for parent
        null  // grade_level not applicable for parent
      ]
    );

    const parentId = parentResult.rows[0].id;

    // 2. Create child accounts
    const childrenData = typeof registration.children_data === 'string' 
      ? JSON.parse(registration.children_data) 
      : registration.children_data;

    const childrenCredentials: Array<{
      child_name: string;
      username: string;
      temp_password: string;
      age: number;
      grade_level: number;
    }> = [];

    for (let i = 0; i < childrenData.length; i++) {
      const child = childrenData[i];
      const username = generateUsername(child.full_name, i + 1);
      const tempPassword = generatePassword(10);
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      // Create child user
      const childResult = await client.query(
        `INSERT INTO users (
          full_name, email, password, role, status,
          age, grade_level,
          parent_id,
          approved_by, approved_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        RETURNING id`,
        [
          child.full_name,
          username + '@child.smartlearning.local', // Dummy email
          passwordHash,
          'child',
          'active',
          child.age,
          child.grade_level,
          parentId,
          admin.id
        ]
      );

      const childId = childResult.rows[0].id;

      // Link parent-child relationship
      await client.query(
        `INSERT INTO parent_children (parent_id, child_id)
         VALUES ($1, $2)`,
        [parentId, childId]
      );

      childrenCredentials.push({
        child_name: child.full_name,
        username,
        temp_password: tempPassword,
        age: child.age,
        grade_level: child.grade_level
      });
    }

    // 3. Update registration status
    await client.query(
      `UPDATE pending_registrations 
       SET status = 'approved', 
           reviewed_by = $1, 
           reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [admin.id, registration_id]
    );

    // 4. Send email with credentials
    await sendApprovalEmail(
      registration.email,
      registration.full_name,
      childrenCredentials,
      client
    );

    // 5. Log activity
    await client.query(
      `SELECT log_user_activity($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        admin.id,
        'approve_registration',
        'user_management',
        'create',
        `Admin approved registration for ${registration.full_name} and created ${childrenCredentials.length} child accounts`,
        'pending_registrations',
        registration_id.toString(),
        request.headers.get('x-forwarded-for') || 'unknown',
        true
      ]
    );

    // 6. Log data change
    await client.query(
      `SELECT log_data_change($1, $2, $3, $4, $5, $6, $7)`,
      [
        admin.id,
        'pending_registrations',
        registration_id.toString(),
        'UPDATE',
        JSON.stringify({ status: 'pending' }),
        JSON.stringify({ status: 'approved', reviewed_by: admin.id }),
        request.headers.get('x-forwarded-for') || 'unknown'
      ]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Registration approved successfully',
      data: {
        parent_id: parentId,
        children_count: childrenCredentials.length,
        email_sent: true
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error approving registration:', error);
    return NextResponse.json({
      error: 'Server error'
    }, { status: 500 });
  } finally {
    client.release();
  }
}

// Helper function to send approval email
async function sendApprovalEmail(
  email: string,
  parentName: string,
  children: Array<any>,
  client: any
): Promise<boolean> {
  try {
    const subject = 'Pendaftaran Disetujui - Smart Learning';
    
    const childrenTable = children.map((child, idx) => `
      <tr>
        <td style="padding: 10px; border: 1px solid #E5E7EB;">${idx + 1}</td>
        <td style="padding: 10px; border: 1px solid #E5E7EB;"><strong>${child.child_name}</strong></td>
        <td style="padding: 10px; border: 1px solid #E5E7EB;"><code>${child.username}</code></td>
        <td style="padding: 10px; border: 1px solid #E5E7EB;"><code>${child.temp_password}</code></td>
        <td style="padding: 10px; border: 1px solid #E5E7EB;">${child.age} tahun, Kelas ${child.grade_level}</td>
      </tr>
    `).join('');

    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <h2 style="color: #10B981;">Selamat! Pendaftaran Anda Disetujui! 🎉</h2>
        
        <p>Halo <strong>${parentName}</strong>,</p>
        
        <p>Kami dengan senang hati memberitahukan bahwa pendaftaran Anda di <strong>Smart Learning</strong> telah <strong>DISETUJUI</strong>!</p>
        
        <div style="background-color: #D1FAE5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #047857;">✅ Akun Anda Sudah Aktif</h3>
          <p style="margin-bottom: 0;">Anda sudah bisa login menggunakan email dan password yang Anda daftarkan.</p>
        </div>

        <h3>🔑 Kredensial Login untuk Anak-Anak:</h3>
        <p>Berikut adalah username dan password untuk setiap anak Anda:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #4F46E5; color: white;">
              <th style="padding: 10px; border: 1px solid #E5E7EB;">No</th>
              <th style="padding: 10px; border: 1px solid #E5E7EB;">Nama Anak</th>
              <th style="padding: 10px; border: 1px solid #E5E7EB;">Username</th>
              <th style="padding: 10px; border: 1px solid #E5E7EB;">Password Sementara</th>
              <th style="padding: 10px; border: 1px solid #E5E7EB;">Info</th>
            </tr>
          </thead>
          <tbody>
            ${childrenTable}
          </tbody>
        </table>

        <div style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #92400E;">⚠️ PENTING:</h4>
          <ul style="margin-bottom: 0;">
            <li>Simpan username dan password ini dengan aman</li>
            <li>Bantu anak Anda login untuk pertama kali</li>
            <li>Anak dapat mengganti password setelah login</li>
            <li>Setiap anak login dengan username masing-masing</li>
          </ul>
        </div>

        <h3>📱 Cara Login:</h3>
        <ol>
          <li>Buka <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Smart Learning</a></li>
          <li>Masukkan username dan password</li>
          <li>Mulai belajar!</li>
        </ol>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
             style="background-color: #4F46E5; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Login Sekarang
          </a>
        </div>

        <p style="color: #6B7280; font-size: 12px; margin-top: 30px;">
          Butuh bantuan? Hubungi support@smartlearning.id<br>
          © 2025 Smart Learning by CreativeJawiProduction.prod
        </p>
      </div>
    `;

    // Log email notification
    await client.query(
      `INSERT INTO email_notifications (
        recipient_email, recipient_name, email_type,
        subject, body, status,
        children_credentials
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        email,
        parentName,
        'approval_granted',
        subject,
        body,
        'sent',
        JSON.stringify(children)
      ]
    );

    console.log('📧 Approval email logged for:', email);
    console.log('👶 Children credentials:', children.length);

    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
    return false;
  }
}