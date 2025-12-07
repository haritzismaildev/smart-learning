import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const nik = searchParams.get('nik');

        if (!nik || nik.length !== 16) {
        return NextResponse.json({ 
            exists: true, 
            error: 'NIK harus 16 digit' 
        }, { status: 400 });
        }

        // Check in users table
        const userCheck = await pool.query(
        'SELECT id FROM users WHERE nik = $1',
        [nik]
        );

        // Check in pending registrations
        const pendingCheck = await pool.query(
        'SELECT id FROM pending_registrations WHERE nik = $1 AND status != $2',
        [nik, 'rejected']
        );

        const exists = userCheck.rows.length > 0 || pendingCheck.rows.length > 0;

        // Log visitor activity
        const clientIp = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown';

        await pool.query(
        `SELECT log_visitor($1, $2, $3, $4)`,
        [
            request.headers.get('x-session-id') || `anonymous-${Date.now()}`,
            clientIp,
            '/api/auth/check-nik',
            request.headers.get('user-agent')
        ]
        );

        return NextResponse.json({ exists });
    } catch (error) {
        console.error('Error checking NIK:', error);
        return NextResponse.json({ 
        exists: true, 
        error: 'Server error' 
        }, { status: 500 });
    } 
}