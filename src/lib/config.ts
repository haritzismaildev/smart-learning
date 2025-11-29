import type { Config, AppConfig, DatabaseConfig, JWTConfig } from '@/types';

/**
 * Application Configuration
 * Centralized config untuk semua environment variables dengan TypeScript
 */

// Detect environment
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Get port from environment or default
const PORT = parseInt(process.env.PORT || process.env.NEXT_PUBLIC_PORT || '3000', 10);

// Get host from environment or default
const HOST = process.env.NEXT_PUBLIC_HOST || 'localhost';

/**
 * Build API URL dynamically
 */
const getApiUrl = (): string => {
  // Priority 1: Explicit NEXT_PUBLIC_API_URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Priority 2: Vercel deployment (automatic)
  if (isProduction && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Priority 3: Build from HOST and PORT
  const protocol = process.env.NEXT_PUBLIC_HTTPS === 'true' ? 'https' : 'http';
  return `${protocol}://${HOST}:${PORT}`;
};

/**
 * Database configuration
 */
const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'smart_learning',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

/**
 * JWT configuration
 */
const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || 'fallback-secret-key-change-this-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

/**
 * App configuration
 */
const appConfig: AppConfig = {
  name: 'Smart Learning',
  version: '1.0.0',
  description: 'Aplikasi Pembelajaran untuk Anak SD',
  port: PORT,
  host: HOST,
  apiUrl: getApiUrl(),
  isDevelopment,
  isProduction,
};

/**
 * Combined configuration object
 */
export const config: Config = {
  app: appConfig,
  db: dbConfig,
  jwt: jwtConfig,
};

/**
 * Export individual configs for convenience
 */
export const API_URL = appConfig.apiUrl;
export const APP_NAME = appConfig.name;
export const APP_VERSION = appConfig.version;
export const IS_DEV = isDevelopment;
export const IS_PROD = isProduction;
export const IS_TEST = isTest;

/**
 * Helper function to get full API endpoint
 * @param path - API path (e.g., 'auth/login')
 * @returns Full API URL
 */
export function getApiEndpoint(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/api/${cleanPath}`;
}

/**
 * Helper untuk client-side API calls
 * @returns API URL for client-side usage
 */
export function getClientApiUrl(): string {
  // Di client-side, gunakan relative URL jika same-origin
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '';
  }
  return API_URL;
}

/**
 * Validate required environment variables
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check critical variables
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'fallback-secret-key-change-this-in-production') {
    errors.push('JWT_SECRET is not set or using default value. Please set a secure JWT_SECRET.');
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET is too short. Minimum 32 characters recommended.');
  }

  if (!process.env.DB_PASSWORD && isProduction) {
    errors.push('DB_PASSWORD is not set in production environment.');
  }

  if (!process.env.DB_HOST) {
    errors.push('DB_HOST is not set. Using default: localhost');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get database connection string
 * @returns PostgreSQL connection string
 */
export function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const { user, password, host, port, database } = dbConfig;
  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

/**
 * Check if running in server-side
 */
export const isServer = typeof window === 'undefined';

/**
 * Check if running in client-side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Log configuration on startup (hanya di development & server-side)
 */
if (IS_DEV && isServer) {
  console.log('\n📋 ===============================================');
  console.log('   SMART LEARNING - APPLICATION CONFIG');
  console.log('   ===============================================');
  console.log(`   Environment:     ${process.env.NODE_ENV}`);
  console.log(`   API URL:         ${API_URL}`);
  console.log(`   Port:            ${PORT}`);
  console.log(`   Host:            ${HOST}`);
  console.log(`   Database:        ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  console.log(`   DB User:         ${dbConfig.user}`);
  console.log('   ===============================================\n');

  // Validate configuration
  const validation = validateConfig();
  if (!validation.valid) {
    console.warn('⚠️  Configuration warnings:');
    validation.errors.forEach(error => console.warn(`   - ${error}`));
    console.log('');
  }
}

export default config;