import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper to get client IP
function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

// Helper to get geolocation (placeholder - integrate with IP geolocation service)
async function getGeolocation(ip: string) {
  // TODO: Integrate with ipapi.co or similar service
  // For now, return placeholder
  return {
    country: 'Indonesia',
    city: 'Jakarta',
    latitude: -6.2088,
    longitude: 106.8456
  };
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { parent, children } = body;

    // Get request metadata
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || '';
    const geo = await getGeolocation(clientIp);

    // Validation
    if (!parent || !children || children.length === 0) {
      return NextResponse.json({
        error: 'Data tidak lengkap'
      }, { status: 400 });
    }

    // Validate NIK
    if (!parent.nik || parent.nik.length !== 16) {
      return NextResponse.json({
        error: 'NIK harus 16 digit'
      }, { status: 400 });
    }

    // Validate email
    if (!parent.email || !parent.email.includes('@')) {
      return NextResponse.json({
        error: 'Email tidak valid'
      }, { status: 400 });
    }

    // Validate password
    if (!parent.password || parent.password.length < 8) {
      return NextResponse.json({
        error: 'Password minimal 8 karakter'
      }, { status: 400 });
    }

    // Validate children
    if (children.length > 5) {
      return NextResponse.json({
        error: 'Maksimal 5 anak'
      }, { status: 400 });
    }

    for (const child of children) {
      if (!child.full_name || child.full_name.length < 3) {
        return NextResponse.json({
          error: 'Nama anak minimal 3 karakter'
        }, { status: 400 });
      }
      if (child.age < 6 || child.age > 12) {
        return NextResponse.json({
          error: 'Umur anak harus antara 6-12 tahun'
        }, { status: 400 });
      }
      if (child.grade_level < 1 || child.grade_level > 6) {
        return NextResponse.json({
          error: 'Kelas harus antara 1-6'
        }, { status: 400 });
      }
    }

    await client.query('BEGIN');

    // Check if NIK already exists
    const nikExists = await client.query(
      'SELECT check_nik_exists($1) as exists',
      [parent.nik]
    );

    if (nikExists.rows[0].exists) {
      await client.query('ROLLBACK');
      return NextResponse.json({
        error: 'NIK sudah terdaftar'
      }, { status: 409 });
    }

    // Check if email already exists
    const emailCheck = await client.query(
      `SELECT id FROM users WHERE email = $1
       UNION
       SELECT id FROM pending_registrations WHERE email = $1 AND status != 'rejected'`,
      [parent.email]
    );

    if (emailCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({
        error: 'Email sudah terdaftar'
      }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(parent.password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insert pending registration
    const registrationResult = await client.query(
      `INSERT INTO pending_registrations (
        nik, full_name, email, password_hash,
        phone, whatsapp, address,
        children_data, number_of_children,
        verification_token,
        ip_address, user_agent,
        country, city, latitude, longitude
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id`,
      [
        parent.nik,
        parent.full_name,
        parent.email,
        passwordHash,
        parent.phone,
        parent.whatsapp,
        parent.address,
        JSON.stringify(children),
        children.length,
        verificationToken,
        clientIp,
        userAgent,
        geo.country,
        geo.city,
        geo.latitude,
        geo.longitude
      ]
    );

    const registrationId = registrationResult.rows[0].id;

    // Log visitor activity
    await client.query(
      `INSERT INTO audit_visitors (
        session_id, ip_address, page_url, user_agent,
        country, city, latitude, longitude,
        device_type, page_title
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        `registration-${registrationId}`,
        clientIp,
        '/api/auth/register',
        userAgent,
        geo.country,
        geo.city,
        geo.latitude,
        geo.longitude,
        'desktop', // TODO: Parse from user agent
        'Registration - Parent'
      ]
    );

    // TODO: Send verification email
    const emailSent = await sendVerificationEmail(
      parent.email,
      parent.full_name,
      verificationToken,
      registrationId,
      client
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil! Silakan cek email untuk verifikasi.',
      data: {
        registration_id: registrationId,
        email: parent.email,
        children_count: children.length,
        verification_sent: emailSent
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    
    return NextResponse.json({
      error: 'Terjadi kesalahan. Silakan coba lagi.'
    }, { status: 500 });
  } finally {
    client.release();
  }
}

// Helper function to send verification email
async function sendVerificationEmail(
  email: string,
  fullName: string,
  token: string,
  registrationId: number,
  client: any
): Promise<boolean> {
  try {
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
    
    const subject = 'Verifikasi Email - Smart Learning';
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Selamat Datang di Smart Learning!</h2>
        
        <p>Halo <strong>${fullName}</strong>,</p>
        
        <p>Terima kasih telah mendaftar di Smart Learning. Untuk melanjutkan, silakan verifikasi email Anda dengan mengklik tombol di bawah:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Verifikasi Email
          </a>
        </div>
        
        <p>Atau copy link berikut ke browser Anda:</p>
        <p style="background-color: #F3F4F6; padding: 10px; border-radius: 5px; word-break: break-all;">
          ${verificationLink}
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
        
        <h3>Langkah Selanjutnya:</h3>
        <ol>
          <li>Verifikasi email Anda (klik tombol di atas)</li>
          <li>Tunggu approval dari admin (1-2 hari kerja)</li>
          <li>Anda akan menerima email berisi username dan password untuk anak-anak Anda</li>
        </ol>
        
        <p style="color: #6B7280; font-size: 12px; margin-top: 30px;">
          Email ini dikirim otomatis. Jangan balas email ini.<br>
          © 2025 Smart Learning by CreativeJawiProduction.prod
        </p>
      </div>
    `;

    // Log email notification
    await client.query(
      `INSERT INTO email_notifications (
        recipient_email, recipient_name, email_type,
        subject, body, status, registration_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        email,
        fullName,
        'registration_verification',
        subject,
        body,
        'sent', // In production, this should be 'pending' until actually sent
        registrationId
      ]
    );

    // TODO: Actually send email using your email service (SendGrid, AWS SES, etc)
    console.log('📧 Verification email logged for:', email);
    console.log('🔗 Verification link:', verificationLink);

    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}