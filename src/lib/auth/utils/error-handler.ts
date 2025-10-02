/**
 * Authentication Error Classes
 * Standardized error handling for authentication operations
 */

export class AuthenticationError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class TokenExpiredError extends Error {
  constructor(message: string = 'Token has expired') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends Error {
  constructor(message: string = 'Invalid token provided') {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

export class TenantAccessError extends Error {
  constructor(message: string = 'Access denied: insufficient permissions for this tenant') {
    super(message);
    this.name = 'TenantAccessError';
  }
}

export class AuthErrorHandler {
  static handle(error: Error): never {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    if (error instanceof AuthorizationError) {
      throw error;
    }
    
    if (error instanceof TokenExpiredError) {
      throw error;
    }
    
    if (error instanceof InvalidTokenError) {
      throw error;
    }
    
    if (error instanceof TenantAccessError) {
      throw error;
    }
    
    if (error.message.includes('expired')) {
      throw new TokenExpiredError();
    }
    
    if (error.message.includes('invalid')) {
      throw new InvalidTokenError();
    }
    
    throw new AuthenticationError('Authentication failed', error);
  }
}
