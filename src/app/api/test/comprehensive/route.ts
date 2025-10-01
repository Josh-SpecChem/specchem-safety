import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { plants, profiles } from '@/lib/db/schema';
import { 
  plantSchema, 
  paginationSchema,
  enrollmentFiltersSchema,
  createProfileSchema
} from '@/lib/schemas';
import { eq } from 'drizzle-orm';

interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  details?: Record<string, unknown>;
  error?: string;
}

interface TestResults {
  success: boolean;
  timestamp: string;
  tests: Record<string, TestResult>;
  summary: {
    total: number;
    passed: number;
    failed: number;
    successRate?: string;
  };
}

/**
 * Comprehensive test API endpoint for Drizzle ORM and Zod validation
 * GET: Runs all validation and database tests
 */
export async function GET() {
  const results: TestResults = {
    success: true,
    timestamp: new Date().toISOString(),
    tests: {},
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };

  // Test 1: Database Connection
  try {
    console.log('🔌 Testing Drizzle Database Connection...');
    const plantsResult = await db.select().from(plants).limit(5);
    
    results.tests.databaseConnection = {
      name: 'Database Connection',
      status: 'passed',
      details: {
        plantsCount: plantsResult.length,
        sample: plantsResult[0] || null
      }
    };
    results.summary.passed++;
  } catch (error) {
    results.tests.databaseConnection = {
      name: 'Database Connection',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    results.success = false;
    results.summary.failed++;
  }
  results.summary.total++;

  // Test 2: Zod Plant Schema Validation
  try {
    console.log('🔍 Testing Plant Schema Validation...');
    
    const validPlant = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Plant',
      location: 'Test Location',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedPlant = plantSchema.parse(validPlant);
    
    // Test invalid data should fail
    let invalidFailed = false;
    try {
      plantSchema.parse({
        id: 'invalid-uuid',
        name: '',
        location: '',
        isActive: 'not-boolean',
      });
    } catch {
      invalidFailed = true; // This should happen
    }

    results.tests.plantSchemaValidation = {
      name: 'Plant Schema Validation',
      status: invalidFailed ? 'passed' : 'failed',
      details: {
        validDataPassed: true,
        invalidDataRejected: invalidFailed,
        validatedSample: validatedPlant
      }
    };
    
    if (invalidFailed) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
      results.success = false;
    }
  } catch (error) {
    results.tests.plantSchemaValidation = {
      name: 'Plant Schema Validation',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    results.success = false;
    results.summary.failed++;
  }
  results.summary.total++;

  // Test 3: Pagination Schema
  try {
    console.log('📄 Testing Pagination Schema...');
    
    const validPagination = paginationSchema.parse({ page: 1, limit: 20 });
    
    let invalidPaginationFailed = false;
    try {
      paginationSchema.parse({ page: -1, limit: 1000 });
    } catch {
      invalidPaginationFailed = true;
    }

    results.tests.paginationSchema = {
      name: 'Pagination Schema',
      status: invalidPaginationFailed ? 'passed' : 'failed',
      details: {
        validDataPassed: true,
        invalidDataRejected: invalidPaginationFailed,
        validatedSample: validPagination
      }
    };
    
    if (invalidPaginationFailed) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
      results.success = false;
    }
  } catch (error) {
    results.tests.paginationSchema = {
      name: 'Pagination Schema',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    results.success = false;
    results.summary.failed++;
  }
  results.summary.total++;

  // Test 4: Enrollment Filters Schema
  try {
    console.log('📋 Testing Enrollment Filters Schema...');
    
    const validFilters = enrollmentFiltersSchema.parse({
      plantId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'enrolled',
      page: 1,
      limit: 50
    });

    results.tests.enrollmentFiltersSchema = {
      name: 'Enrollment Filters Schema',
      status: 'passed',
      details: {
        validatedSample: validFilters
      }
    };
    results.summary.passed++;
  } catch (error) {
    results.tests.enrollmentFiltersSchema = {
      name: 'Enrollment Filters Schema',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    results.success = false;
    results.summary.failed++;
  }
  results.summary.total++;

  // Test 5: Profile Schema and Database Integration
  try {
    console.log('👤 Testing Profile Schema Integration...');
    
    // Test profile creation schema
    const validProfile = createProfileSchema.parse({
      id: '123e4567-e89b-12d3-a456-426614174000',
      plantId: '123e4567-e89b-12d3-a456-426614174001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      jobTitle: 'Test Manager',
      status: 'active'
    });

    // Try to get actual profiles from database for compatibility test
    const profilesResult = await db.select().from(profiles).limit(1);
    
    results.tests.profileSchemaIntegration = {
      name: 'Profile Schema Integration',
      status: 'passed',
      details: {
        schemaValidationPassed: true,
        validatedSample: validProfile,
        profilesInDatabase: profilesResult.length,
        databaseSample: profilesResult[0] || null
      }
    };
    results.summary.passed++;
  } catch (error) {
    results.tests.profileSchemaIntegration = {
      name: 'Profile Schema Integration',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    results.success = false;
    results.summary.failed++;
  }
  results.summary.total++;

  // Test 6: Complex Query with Joins
  try {
    console.log('🔗 Testing Complex Queries...');
    
    const profilesWithPlants = await db
      .select({
        profileId: profiles.id,
        email: profiles.email,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        plantName: plants.name,
      })
      .from(profiles)
      .innerJoin(plants, eq(profiles.plantId, plants.id))
      .limit(3);

    results.tests.complexQueries = {
      name: 'Complex Queries',
      status: 'passed',
      details: {
        joinQueryResults: profilesWithPlants.length,
        sampleResults: profilesWithPlants
      }
    };
    results.summary.passed++;
  } catch (error) {
    results.tests.complexQueries = {
      name: 'Complex Queries',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    results.success = false;
    results.summary.failed++;
  }
  results.summary.total++;

  // Calculate success rate
  results.summary.successRate = results.summary.total > 0 
    ? ((results.summary.passed / results.summary.total) * 100).toFixed(1) + '%'
    : '0%';

  console.log('✨ Test Results:', results.summary);

  return NextResponse.json(results, { 
    status: results.success ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}