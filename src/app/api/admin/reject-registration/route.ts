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

export async function POST(request: NextRequest) {
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

    // 2. Check if user is admin or superadmin
    if (!['admin', 'superadmin'].includes(decoded.role)) {
      return NextResponse.json({
        success: false,
        error: 'Forbidden - Admin access required'
      }, { status: 403 });
    }

    // 3. Get request body
    const body = await request.json();
    const { registration_id, rejection_reason } = body;

    if (!registration_id || !rejection_reason) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: registration_id, rejection_reason'
      }, { status: 400 });
    }

    // 4. Get client IP for audit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    await client.query('BEGIN');

    // 5. Get registration details
    const registrationResult = await client.query(
      `SELECT id, email, full_name, status 
       FROM pending_registrations 
       WHERE id = $1`,
      [registration_id]
    );

    if (registrationResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({
        success: false,
        error: 'Registration not found'
      }, { status: 404 });
    }

    const registration = registrationResult.rows[0];

    if (registration.status !== 'pending') {
      await client.query('ROLLBACK');
      return NextResponse.json({
        success: false,
        error: `Registration already ${registration.status}`
      }, { status: 400 });
    }

    // 6. Update registration status to rejected
    await client.query(
      `UPDATE pending_registrations
       SET status = 'rejected',
           reviewed_by = $1,
           reviewed_at = CURRENT_TIMESTAMP,
           rejection_reason = $2
       WHERE id = $3`,
      [decoded.userId, rejection_reason, registration_id]
    );

    // 7. Send rejection email (logged, not actually sent)
    await client.query(
      `INSERT INTO email_notifications (
        recipient_email,
        email_type,
        subject,
        body,
        registration_id,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        registration.email,
        'registration_rejected',
        'Pendaftaran Ditolak - Smart Learning',
        `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Smart Learning</h1>
            </div>
            
            <div style="background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #2d3748;">Pendaftaran Ditolak</h2>
              
              <p>Halo ${registration.full_name},</p>
              
              <p>Terima kasih telah mendaftar di Smart Learning. Namun dengan berat hati kami informasikan bahwa pendaftaran Anda ditolak.</p>
              
              <div style="background: #fff5f5; border-left: 4px solid #fc8181; padding: 15px; margin: 20px 0;">
                <h3 style="color: #c53030; margin-top: 0;">Alasan Penolakan:</h3>
                <p style="color: #2d3748; margin-bottom: 0;">${rejection_reason}</p>
              </div>
              
              <p>Jika Anda merasa ini adalah kesalahan atau ingin mendaftar ulang dengan data yang benar, silakan hubungi kami di:</p>
              
              <ul>
                <li>Email: support@smartlearning.id</li>
                <li>WhatsApp: +62 812-3456-7890</li>
              </ul>
              
              <p>Terima kasih atas pengertian Anda.</p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              
              <p style="color: #718096; font-size: 12px; text-align: center;">
                © 2025 Smart Learning by Haritz - CreativeJawiProduction.prod<br>
                Made with ❤️ for Indonesian Children Education
              </p>
            </div>
          </body>
        </html>
        `,
        registration_id,
        'pending'
      ]
    );

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
        'reject_registration',
        'user_management',
        'reject',
        `Rejected registration for ${registration.full_name} - Reason: ${rejection_reason}`,
        'pending_registration',
        registration_id,
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
        'pending_registrations',
        registration_id,
        'UPDATE',
        JSON.stringify({ status: 'pending' }),
        JSON.stringify({ status: 'rejected', rejection_reason }),
        ['status', 'rejection_reason', 'reviewed_by', 'reviewed_at'],
        `Registration rejected: ${rejection_reason}`,
        ip
      ]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Registration rejected successfully',
      data: {
        registration_id,
        email: registration.email,
        full_name: registration.full_name,
        rejection_reason,
        email_sent: true
      }
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error rejecting registration:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to reject registration',
      details: error.message
    }, { status: 500 });
  } finally {
    client.release();
  }
}