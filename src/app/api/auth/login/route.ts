import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Helper to get client IP
function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

// Helper to get geolocation
async function getGeolocation(ip: string) {
  return {
    country: 'Indonesia',
    city: 'Jakarta',
    latitude: -6.2088,
    longitude: 106.8456
  };
}

// Helper to parse device info from user agent
function parseUserAgent(userAgent: string) {
  const isMobile = /mobile/i.test(userAgent);
  const isTablet = /tablet|ipad/i.test(userAgent);
  
  let browser = 'Unknown';
  if (/chrome/i.test(userAgent)) browser = 'Chrome';
  else if (/firefox/i.test(userAgent)) browser = 'Firefox';
  else if (/safari/i.test(userAgent)) browser = 'Safari';
  else if (/edge/i.test(userAgent)) browser = 'Edge';
  
  let os = 'Unknown';
  if (/windows/i.test(userAgent)) os = 'Windows';
  else if (/mac/i.test(userAgent)) os = 'macOS';
  else if (/linux/i.test(userAgent)) os = 'Linux';
  else if (/android/i.test(userAgent)) os = 'Android';
  else if (/ios|iphone|ipad/i.test(userAgent)) os = 'iOS';
  
  return {
    device_type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
    browser,
    os
  };
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { email, password } = await request.json();

    // Get request metadata
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || '';
    const geo = await getGeolocation(clientIp);
    const deviceInfo = parseUserAgent(userAgent);

    // Validation
    if (!email || !password) {
      return NextResponse.json({
        error: 'Email dan password harus diisi'
      }, { status: 400 });
    }

    await client.query('BEGIN');

    // Find user
    const userResult = await client.query(
      `SELECT id, email, password, full_name, role, status, 
              failed_login_count, last_failed_login
       FROM users 
       WHERE email = $1`,
      [email]
    );

    // Check if user exists
    if (userResult.rows.length === 0) {
      // Log failed attempt (user not found)
      await client.query(
        `SELECT log_login_attempt($1, $2, $3, $4, $5)`,
        [email, false, clientIp, 'user_not_found', null]
      );

      await client.query('COMMIT');
      
      return NextResponse.json({
        error: 'Email atau password salah'
      }, { status: 401 });
    }

    const user = userResult.rows[0];

    // Check account status
    if (user.status !== 'active') {
      // Log failed attempt (account not active)
      await client.query(
        `SELECT log_login_attempt($1, $2, $3, $4, $5)`,
        [email, false, clientIp, `account_${user.status}`, user.id]
      );

      await client.query('COMMIT');

      let message = 'Akun Anda belum aktif';
      if (user.status === 'pending') {
        message = 'Akun Anda masih menunggu approval admin';
      } else if (user.status === 'suspended') {
        message = 'Akun Anda telah ditangguhkan';
      } else if (user.status === 'rejected') {
        message = 'Pendaftaran Anda ditolak';
      }

      return NextResponse.json({
        error: message
      }, { status: 403 });
    }

    // Check if account is locked (too many failed attempts)
    if (user.failed_login_count >= 5) {
      const lockUntil = new Date(user.last_failed_login);
      lockUntil.setMinutes(lockUntil.getMinutes() + 30);
      
      if (new Date() < lockUntil) {
        // Log security event
        await client.query(
          `INSERT INTO security_events (
            event_type, severity, title, description,
            user_id, email, ip_address, blocked
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            'account_locked',
            'medium',
            'Account Locked - Too Many Failed Attempts',
            `User ${email} attempted to login while account is locked`,
            user.id,
            email,
            clientIp,
            true
          ]
        );

        await client.query('COMMIT');

        return NextResponse.json({
          error: 'Akun terkunci karena terlalu banyak percobaan login gagal. Coba lagi dalam 30 menit.'
        }, { status: 429 });
      } else {
        // Reset failed login count after lock period
        await client.query(
          'UPDATE users SET failed_login_count = 0 WHERE id = $1',
          [user.id]
        );
      }
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Log failed attempt (wrong password)
      await client.query(
        `SELECT log_login_attempt($1, $2, $3, $4, $5)`,
        [email, false, clientIp, 'wrong_password', user.id]
      );

      // Check for brute force
      const newFailedCount = user.failed_login_count + 1;
      
      if (newFailedCount >= 5) {
        // Log security event
        await client.query(
          `INSERT INTO security_events (
            event_type, severity, title, description,
            user_id, email, ip_address, blocked
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            'brute_force',
            'high',
            'Brute Force Attack Detected',
            `Multiple failed login attempts for user ${email}`,
            user.id,
            email,
            clientIp,
            true
          ]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        error: 'Email atau password salah'
      }, { status: 401 });
    }

    // Login successful!

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create session
    const sessionToken = jwt.sign(
      {
        userId: user.id,
        timestamp: Date.now()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await client.query(
      `INSERT INTO user_sessions (
        user_id, session_token, ip_address, user_agent,
        device_type, browser, os,
        country, city, latitude, longitude,
        expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        user.id,
        sessionToken,
        clientIp,
        userAgent,
        deviceInfo.device_type,
        deviceInfo.browser,
        deviceInfo.os,
        geo.country,
        geo.city,
        geo.latitude,
        geo.longitude,
        expiresAt
      ]
    );

    // Log successful login attempt
    await client.query(
      `SELECT log_login_attempt($1, $2, $3, $4, $5)`,
      [email, true, clientIp, null, user.id]
    );

    // Log user activity
    await client.query(
      `SELECT log_user_activity($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        user.id,
        'login',
        'authentication',
        'login_success',
        `User logged in successfully from ${deviceInfo.device_type}`,
        'session',
        sessionToken,
        clientIp,
        true
      ]
    );

    await client.query('COMMIT');

    // Return success response
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Login error:', error);
    
    return NextResponse.json({
      error: 'Terjadi kesalahan server'
    }, { status: 500 });
  } finally {
    client.release();
  }
}