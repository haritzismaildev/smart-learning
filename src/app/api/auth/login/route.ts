import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { 
  comparePassword, 
  generateToken, 
  isValidEmail, 
  sanitizeUser,
  createAuthError, 
  createSuccessResponse 
} from '@/lib/auth';
import type { LoginCredentials, AuthResponse } from '@/types';

/**
 * POST /api/auth/login
 * Login user dengan email dan password
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();
    const { email, password } = body;
    
    // Validation
    if (!email || !password) {
      return createAuthError('Email dan password harus diisi', 400);
    }
    
    if (!isValidEmail(email)) {
      return createAuthError('Format email tidak valid', 400);
    }
    
    // Get user from database
    const user = await getUserByEmail(email);
    
    if (!user) {
      return createAuthError('Email atau password salah', 401);
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, (user as any).password);
    
    if (!isPasswordValid) {
      return createAuthError('Email atau password salah', 401);
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Remove password from response
    const sanitizedUser = sanitizeUser(user);
    
    const response: AuthResponse = {
      token,
      user: sanitizedUser as any
    };
    
    return createSuccessResponse(response);
    
  } catch (error) {
    console.error('Login error:', error);
    return createAuthError('Terjadi kesalahan saat login', 500);
  }
}

/**
 * OPTIONS /api/auth/login
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}