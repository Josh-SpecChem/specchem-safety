import { NextRequest, NextResponse } from 'next/server';
import { ConfigurationService } from '@/lib/configuration';
import { ConfigValidationService } from '@/lib/config-validation';
import { dbManager } from '@/lib/db/connection';

/**
 * Health Check Endpoint
 * Provides comprehensive health status for the application
 * Used for monitoring, load balancers, and deployment verification
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    // Initialize health status
    const healthStatus = {
      status: 'healthy' as 'healthy' | 'warning' | 'error',
      timestamp,
      uptime: process.uptime(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        configuration: { status: 'unknown', details: '' },
        database: { status: 'unknown', details: '' },
        supabase: { status: 'unknown', details: '' },
        memory: { status: 'unknown', details: '' },
      },
      responseTime: 0,
    };

    // Check configuration
    try {
      const configHealth = ConfigValidationService.getHealthStatus();
      healthStatus.checks.configuration = {
        status: configHealth.status,
        details: configHealth.issues.length > 0 ? configHealth.issues.join(', ') : 'OK'
      };
      
      if (configHealth.status === 'error') {
        healthStatus.status = 'error';
      } else if (configHealth.status === 'warning' && healthStatus.status === 'healthy') {
        healthStatus.status = 'warning';
      }
    } catch (error) {
      healthStatus.checks.configuration = {
        status: 'error',
        details: error instanceof Error ? error.message : 'Configuration check failed'
      };
      healthStatus.status = 'error';
    }

    // Check database connection
    try {
      const isDbHealthy = await dbManager.healthCheck();
      healthStatus.checks.database = {
        status: isDbHealthy ? 'healthy' : 'error',
        details: isDbHealthy ? 'Connected' : 'Connection failed'
      };
      
      if (!isDbHealthy) {
        healthStatus.status = 'error';
      }
    } catch (error) {
      healthStatus.checks.database = {
        status: 'error',
        details: error instanceof Error ? error.message : 'Database check failed'
      };
      healthStatus.status = 'error';
    }

    // Check Supabase connection
    try {
      const supabaseConfig = ConfigurationService.getSupabaseConfig();
      if (supabaseConfig.url && supabaseConfig.anonKey) {
        healthStatus.checks.supabase = {
          status: 'healthy',
          details: 'Configuration valid'
        };
      } else {
        healthStatus.checks.supabase = {
          status: 'error',
          details: 'Missing Supabase configuration'
        };
        healthStatus.status = 'error';
      }
    } catch (error) {
      healthStatus.checks.supabase = {
        status: 'error',
        details: error instanceof Error ? error.message : 'Supabase check failed'
      };
      healthStatus.status = 'error';
    }

    // Check memory usage
    try {
      const memUsage = process.memoryUsage();
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
      };
      
      // Consider memory usage healthy if heap used is less than 500MB
      const isMemoryHealthy = memUsageMB.heapUsed < 500;
      healthStatus.checks.memory = {
        status: isMemoryHealthy ? 'healthy' : 'warning',
        details: `Heap: ${memUsageMB.heapUsed}MB, RSS: ${memUsageMB.rss}MB`
      };
      
      if (!isMemoryHealthy && healthStatus.status === 'healthy') {
        healthStatus.status = 'warning';
      }
    } catch (error) {
      healthStatus.checks.memory = {
        status: 'error',
        details: error instanceof Error ? error.message : 'Memory check failed'
      };
    }

    // Calculate response time
    healthStatus.responseTime = Date.now() - startTime;

    // Determine HTTP status code
    const httpStatus = healthStatus.status === 'error' ? 503 : 200;

    return NextResponse.json(healthStatus, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    // Fallback error response
    const errorResponse = {
      status: 'error',
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
    };

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

/**
 * Simple health check for load balancers
 * Returns minimal response for basic connectivity checks
 */
export async function HEAD() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
