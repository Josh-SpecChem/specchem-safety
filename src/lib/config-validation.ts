import { ConfigurationService } from './configuration';

/**
 * Configuration Validation Service
 * Provides comprehensive validation and health checking for the application configuration
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: Record<string, any>;
}

export interface HealthStatus {
  status: 'healthy' | 'warning' | 'error';
  issues: string[];
  warnings: string[];
  timestamp: string;
}

export class ConfigValidationService {
  /**
   * Validate all configuration settings
   */
  static validateAllConfigs(): boolean {
    try {
      const config = ConfigurationService.getConfig();
      return true;
    } catch (error) {
      console.error('Configuration validation failed:', error);
      return false;
    }
  }

  /**
   * Get detailed configuration summary
   */
  static getConfigSummary(): Record<string, any> {
    try {
      return ConfigurationService.getConfigSummary();
    } catch (error) {
      console.error('Failed to get configuration summary:', error);
      return {
        error: 'Configuration summary unavailable',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get configuration health status
   */
  static getHealthStatus(): HealthStatus {
    try {
      const healthStatus = ConfigurationService.getHealthStatus();
      return {
        ...healthStatus,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        issues: [error instanceof Error ? error.message : 'Unknown configuration error'],
        warnings: [],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Validate environment variables for specific environment
   */
  static validateForEnvironment(environment: 'development' | 'production' | 'test'): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let isValid = true;

    try {
      // Test configuration parsing for the specified environment
      const isValidForEnv = ConfigurationService.validateForEnvironment(environment);
      
      if (!isValidForEnv) {
        isValid = false;
        errors.push(`Configuration validation failed for ${environment} environment`);
      }

      // Get configuration summary
      const summary = this.getConfigSummary();
      
      // Check for environment-specific requirements
      if (environment === 'production') {
        const config = ConfigurationService.getConfig();
        
        if (!config.NEXTAUTH_SECRET) {
          warnings.push('NEXTAUTH_SECRET is recommended for production');
        }
        
        if (!config.NEXTAUTH_URL) {
          warnings.push('NEXTAUTH_URL is recommended for production');
        }
        
        if (config.ENABLE_DEBUG) {
          warnings.push('Debug mode should be disabled in production');
        }
      }

      return {
        isValid,
        errors,
        warnings,
        summary
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown validation error'],
        warnings,
        summary: {}
      };
    }
  }

  /**
   * Validate database configuration
   */
  static validateDatabaseConfig(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let isValid = true;

    try {
      const dbConfig = ConfigurationService.getDatabaseConfig();
      
      if (!dbConfig.url) {
        isValid = false;
        errors.push('DATABASE_URL is required');
      } else {
        // Validate URL format
        try {
          new URL(dbConfig.url);
        } catch {
          isValid = false;
          errors.push('DATABASE_URL must be a valid URL');
        }
      }

      return {
        isValid,
        errors,
        warnings,
        summary: {
          url: dbConfig.url ? '✓ Set' : '✗ Missing',
          ssl: dbConfig.ssl ? 'Enabled' : 'Disabled'
        }
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Database configuration validation failed'],
        warnings,
        summary: {}
      };
    }
  }

  /**
   * Validate Supabase configuration
   */
  static validateSupabaseConfig(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let isValid = true;

    try {
      const supabaseConfig = ConfigurationService.getSupabaseConfig();
      
      if (!supabaseConfig.url) {
        isValid = false;
        errors.push('NEXT_PUBLIC_SUPABASE_URL is required');
      } else {
        // Validate Supabase URL format
        if (!supabaseConfig.url.includes('supabase.co')) {
          warnings.push('NEXT_PUBLIC_SUPABASE_URL does not appear to be a valid Supabase URL');
        }
      }

      if (!supabaseConfig.anonKey) {
        isValid = false;
        errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
      } else if (supabaseConfig.anonKey.length < 20) {
        warnings.push('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be too short');
      }

      if (!supabaseConfig.serviceRoleKey) {
        isValid = false;
        errors.push('SUPABASE_SERVICE_ROLE_KEY is required');
      } else if (supabaseConfig.serviceRoleKey.length < 20) {
        warnings.push('SUPABASE_SERVICE_ROLE_KEY appears to be too short');
      }

      return {
        isValid,
        errors,
        warnings,
        summary: {
          url: supabaseConfig.url ? '✓ Set' : '✗ Missing',
          anonKey: supabaseConfig.anonKey ? '✓ Set' : '✗ Missing',
          serviceRoleKey: supabaseConfig.serviceRoleKey ? '✓ Set' : '✗ Missing'
        }
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Supabase configuration validation failed'],
        warnings,
        summary: {}
      };
    }
  }

  /**
   * Get comprehensive validation report
   */
  static getValidationReport(): {
    overall: ValidationResult;
    database: ValidationResult;
    supabase: ValidationResult;
    environment: ValidationResult;
  } {
    const config = ConfigurationService.getConfig();
    
    return {
      overall: {
        isValid: this.validateAllConfigs(),
        errors: [],
        warnings: [],
        summary: this.getConfigSummary()
      },
      database: this.validateDatabaseConfig(),
      supabase: this.validateSupabaseConfig(),
      environment: this.validateForEnvironment(config.NODE_ENV as 'development' | 'production' | 'test')
    };
  }
}
