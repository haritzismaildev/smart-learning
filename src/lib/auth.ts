// src/lib/auth.ts
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from './config';
import type { 
  User, 
  JWTPayload, 
  UserRole, 
  ValidationResult, 
  PasswordValidation,
  AuthRequest 
} from '@/types';

const JWT_SECRET = config.jwt.secret;
const JWT_EXPIRES_IN = config.jwt.expiresIn;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.full_name,
  };
  
  return jwt.sign(
    payload, 
    String(JWT_SECRET), 
    { expiresIn: String(JWT_EXPIRES_IN) } as any
  );
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, String(JWT_SECRET)) as JWTPayload;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Token verification failed:', error.message);
    }
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Authentication result type
 */
interface AuthResult {
  authenticated: boolean;
  user: JWTPayload | null;
  error: string | null;
}

/**
 * Middleware to authenticate requests
 */
export async function authenticateRequest(request: Request): Promise<AuthResult> {
  const token = extractTokenFromHeaders(request.headers);
  
  if (!token) {
    return {
      authenticated: false,
      user: null,
      error: 'No authentication token provided'
    };
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return {
      authenticated: false,
      user: null,
      error: 'Invalid or expired token'
    };
  }
  
  return {
    authenticated: true,
    user: decoded,
    error: null
  };
}

/**
 * Check if user has required role
 */
export function hasRole(user: JWTPayload | null, allowedRoles: UserRole | UserRole[]): boolean {
  if (!user || !user.role) {
    return false;
  }
  
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(user.role);
  }
  
  return user.role === allowedRoles;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (password.length < 6) {
    errors.push('Password harus minimal 6 karakter');
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push('Password harus mengandung huruf');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password harus mengandung angka');
  }
  
  if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    strength = 'strong';
  } else if (password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)) {
    strength = 'medium';
  }
  
  return {
    valid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Generate a random password for child accounts
 */
export function generateRandomPassword(length: number = 8): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

/**
 * Validate user input for registration
 */
export function validateRegistrationInput(input: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  age?: number;
  parentId?: number;
}): ValidationResult {
  const errors: string[] = [];
  
  if (!input.email) {
    errors.push('Email harus diisi');
  } else if (!isValidEmail(input.email)) {
    errors.push('Format email tidak valid');
  }
  
  if (!input.password) {
    errors.push('Password harus diisi');
  } else {
    const passwordValidation = validatePassword(input.password);
    if (!passwordValidation.valid) {
      errors.push(...passwordValidation.errors);
    }
  }
  
  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.push('Nama lengkap harus minimal 2 karakter');
  }
  
  if (!['parent', 'child'].includes(input.role)) {
    errors.push('Role harus parent atau child');
  }
  
  if (input.role === 'child') {
    if (!input.parentId) {
      errors.push('Child account harus memiliki parent ID');
    }
    if (!input.age) {
      errors.push('Child account harus memiliki umur');
    } else if (input.age < 6 || input.age > 12) {
      errors.push('Umur anak harus antara 6-12 tahun');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create error response
 */
export function createAuthError(message: string, status: number = 401): Response {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: message 
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(data: T, status: number = 200): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        items: data,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        }
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Extract user from request (helper for authenticated routes)
 */
export async function getUserFromRequest(request: Request): Promise<JWTPayload | null> {
  const auth = await authenticateRequest(request);
  return auth.authenticated ? auth.user : null;
}

/**
 * Require authentication middleware
 */
export async function requireAuth(request: Request): Promise<{ user: JWTPayload } | Response> {
  const auth = await authenticateRequest(request);
  
  if (!auth.authenticated) {
    return createAuthError(auth.error || 'Unauthorized', 401);
  }
  
  return { user: auth.user! };
}

/**
 * Require specific role middleware
 */
export async function requireRole(
  request: Request, 
  allowedRoles: UserRole | UserRole[]
): Promise<{ user: JWTPayload } | Response> {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }
  
  const { user } = authResult;
  
  if (!hasRole(user, allowedRoles)) {
    return createAuthError('Insufficient permissions', 403);
  }
  
  return { user };
}

/**
 * Sanitize user object (remove sensitive data)
 */
export function sanitizeUser(user: any): Omit<User, 'password'> {
  const { password, ...sanitized } = user;
  return sanitized;
}