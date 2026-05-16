// Security utilities and best practices for AgroMoz

/**
 * Security headers configuration
 * Apply these headers in next.config.ts or middleware
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove HTML tags and dangerous characters
  return input
    .replace(/[<>\"']/g, '') // Remove angle brackets and quotes
    .trim()
    .substring(0, 500); // Limit length
};

/**
 * Validate URL to prevent open redirects
 */
export const isValidRedirectUrl = (url: string, allowedOrigins: string[] = []): boolean => {
  try {
    const parsedUrl = new URL(url);
    return allowedOrigins.includes(parsedUrl.origin) || !url.startsWith('http');
  } catch {
    return false;
  }
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number; // milliseconds

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * CSRF token generator
 */
export const generateCSRFToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Check if email is valid and safe
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 100;
};

/**
 * Hash a password (client-side temporary - should use server-side)
 * Note: This is for demo only. Use bcrypt on the server.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Environment variable validators
 */
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || defaultValue || '';
};

export const isProduction = () => process.env.NODE_ENV === 'production';
export const isDevelopment = () => process.env.NODE_ENV === 'development';
