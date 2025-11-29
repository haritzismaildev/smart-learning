// src/lib/config.js
/**
 * Application Configuration
 * Centralized config untuk semua environment variables
 */

// Detect environment
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Get port from environment or default
const PORT = process.env.PORT || process.env.NEXT_PUBLIC_PORT || 3000;

// Get host from environment or default
const HOST = process.env.NEXT_PUBLIC_HOST || 'localhost';

// Build API URL
const getApiUrl = () => {
  // Jika sudah ada NEXT_PUBLIC_API_URL di .env, pakai itu
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Jika production dan ada VERCEL_URL (deploy di Vercel)
  if (isProduction && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Development: build from HOST and PORT
  const protocol = process.env.NEXT_PUBLIC_HTTPS === 'true' ? 'https' : 'http';
  return `${protocol}://${HOST}:${PORT}`;
};

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'smart_learning',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

// JWT configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback-secret-key-change-this',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

// App configuration
const appConfig = {
  name: 'Smart Learning',
  version: '1.0.0',
  description: 'Aplikasi Pembelajaran untuk Anak SD',
  port: PORT,
  host: HOST,
  apiUrl: getApiUrl(),
  isDevelopment,
  isProduction,
};

// Export all configs
export const config = {
  app: appConfig,
  db: dbConfig,
  jwt: jwtConfig,
};

// Export individual configs for convenience
export const API_URL = appConfig.apiUrl;
export const APP_NAME = appConfig.name;
export const IS_DEV = isDevelopment;
export const IS_PROD = isProduction;

// Helper function to get full API endpoint
export function getApiEndpoint(path) {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/api/${cleanPath}`;
}

// Helper untuk client-side API calls
export function getClientApiUrl() {
  // Di client-side, gunakan relative URL jika same-origin
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '';
  }
  return API_URL;
}

// Log configuration on startup (hanya di development)
if (isDevelopment && typeof window === 'undefined') {
  console.log('📋 Application Configuration:');
  console.log('  - Environment:', process.env.NODE_ENV);
  console.log('  - API URL:', API_URL);
  console.log('  - Port:', PORT);
  console.log('  - Host:', HOST);
  console.log('  - Database:', `${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
}

export default config;