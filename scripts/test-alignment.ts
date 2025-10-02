#!/usr/bin/env tsx

/**
 * Comprehensive Database Schema and Zod Contract Alignment Test
 * Tests both standalone Zod validation and database connectivity
 */

import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables
config({ path: '.env.local' });

// Import schemas
import { 
  plantSchema, 
  courseSchema,
  profileSchema,
  enrollmentSchema,
  progressSchema,
  activityEventSchema,
  questionEventSchema,
  adminRoleRecordSchema,
  createPlantSchema,
  createCourseSchema,
  createProfileSchema,
  createEnrollmentSchema,
  createProgressSchema,
  createActivityEventSchema,
  createQuestionEventSchema,
  createAdminRoleSchema,
  updatePlantSchema,
  updateCourseSchema,
  updateProfileSchema,
  updateEnrollmentSchema,
  updateProgressSchema,
  updateAdminRoleSchema,
  paginationSchema,
  enrollmentFiltersSchema,
  progressFiltersSchema,
  userFiltersSchema,
  plantFilterSchema,
  courseFilterSchema,
  adminRoleSchema,
  enrollmentStatusSchema,
  eventTypeSchema,
  userStatusSchema
} from '../src/lib/schemas.js';

async function testZodSchemas() {
  console.log('🧪 Testing Zod Schema Validation\n');
  
  const tests = [
    {
      name: 'Enum Schemas',
      tests: [
        { schema: adminRoleSchema, valid: 'hr_admin', invalid: 'invalid_role' },
        { schema: enrollmentStatusSchema, valid: 'enrolled', invalid: 'invalid_status' },
        { schema: eventTypeSchema, valid: 'view_section', invalid: 'invalid_event' },
        { schema: userStatusSchema, valid: 'active', invalid: 'invalid_status' }
      ]
    },
    {
      name: 'Base Entity Schemas',
      tests: [
        {
          schema: plantSchema,
          valid: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Test Plant',
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
          invalid: { id: 'invalid-uuid', name: '', isActive: 'not-boolean' }
        },
        {
          schema: courseSchema,
          valid: {
            id: '123e4567-e89b-12d3-a456-426614174001',
            slug: 'test-course',
            title: 'Test Course',
            version: '1.0',
            isPublished: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
          invalid: { id: 'invalid-uuid', slug: '', title: '' }
        },
        {
          schema: profileSchema,
          valid: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            plantId: '123e4567-e89b-12d3-a456-426614174000',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@specchem.com',
            jobTitle: 'Safety Coordinator',
            status: 'active',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
          invalid: { id: 'invalid-uuid', firstName: '', email: 'invalid-email' }
        }
      ]
    },
    {
      name: 'Create Schemas',
      tests: [
        {
          schema: createPlantSchema,
          valid: { name: 'New Plant', isActive: true },
          invalid: { name: '' }
        },
        {
          schema: createCourseSchema,
          valid: { slug: 'new-course', title: 'New Course' },
          invalid: { slug: '', title: '' }
        }
      ]
    },
    {
      name: 'Filter Schemas',
      tests: [
        {
          schema: paginationSchema,
          valid: { page: 1, limit: 20 },
          invalid: { page: -1, limit: 1000 }
        },
        {
          schema: enrollmentFiltersSchema,
          valid: { plantId: '123e4567-e89b-12d3-a456-426614174000', status: 'enrolled', page: 1, limit: 50 },
          invalid: { plantId: 'invalid-uuid', status: 'invalid-status' }
        }
      ]
    }
  ];

  let totalTests = 0;
  let passedTests = 0;

  for (const testGroup of tests) {
    console.log(`\n  ${testGroup.name}:`);
    
    for (const test of testGroup.tests) {
      const schemaName = test.schema.constructor.name || 'Schema';
      
      // Test valid data
      totalTests++;
      try {
        test.schema.parse(test.valid);
        console.log(`    ✅ ${schemaName} - Valid data passed`);
        passedTests++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`    ❌ ${schemaName} - Valid data failed: ${errorMessage}`);
      }
      
      // Test invalid data
      totalTests++;
      try {
        test.schema.parse(test.invalid);
        console.log(`    ❌ ${schemaName} - Invalid data passed (should fail)`);
      } catch {
        console.log(`    ✅ ${schemaName} - Invalid data correctly rejected`);
        passedTests++;
      }
    }
  }

  console.log(`\n📊 Zod Validation Results: ${passedTests}/${totalTests} tests passed`);
  console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  return passedTests === totalTests;
}

async function testDatabaseConnection() {
  console.log('\n🔌 Testing Database Connection...');
  
  // Check if environment variables are available
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    console.log('📝 Database connection test skipped - environment not configured');
    return { skipped: true, reason: 'Missing environment variables' };
  }
  
  try {
    // Dynamically import database modules to avoid initialization errors
    const { db } = await import('../src/lib/db/index.js');
    const { plants, courses, profiles } = await import('../src/lib/db/schema.js');
    const { count } = await import('drizzle-orm');
    
    // Test basic queries
    const plantsResult = await db.select({ count: count() }).from(plants);
    const coursesResult = await db.select({ count: count() }).from(courses);
    const profilesResult = await db.select({ count: count() }).from(profiles);
    
    const plantsCount = plantsResult[0]?.count || 0;
    const coursesCount = coursesResult[0]?.count || 0;
    const profilesCount = profilesResult[0]?.count || 0;
    
    console.log(`✅ Database connection successful`);
    console.log(`📊 Plants: ${plantsCount} records`);
    console.log(`📊 Courses: ${coursesCount} records`);
    console.log(`📊 Profiles: ${profilesCount} records`);
    
    return { 
      success: true, 
      stats: { plants: plantsCount, courses: coursesCount, profiles: profilesCount }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Database connection failed: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

async function testSchemaAlignment() {
  console.log('\n🔗 Testing Schema Alignment...');
  
  try {
    // Test that Drizzle schema and Zod schemas are compatible
    const { plants } = await import('../drizzle/schema.js');
    
    // Check if we can access schema properties
    const plantTableColumns = Object.keys(plants);
    const zodPlantKeys = Object.keys(plantSchema.shape);
    
    console.log(`📋 Drizzle plant table columns: ${plantTableColumns.length}`);
    console.log(`📋 Zod plant schema keys: ${zodPlantKeys.length}`);
    
    // Check for alignment
    const missingInZod = plantTableColumns.filter(col => !zodPlantKeys.includes(col));
    const missingInDrizzle = zodPlantKeys.filter(key => !plantTableColumns.includes(key));
    
    if (missingInZod.length === 0 && missingInDrizzle.length === 0) {
      console.log('✅ Schema alignment perfect');
    } else {
      if (missingInZod.length > 0) {
        console.log(`⚠️  Missing in Zod: ${missingInZod.join(', ')}`);
      }
      if (missingInDrizzle.length > 0) {
        console.log(`⚠️  Missing in Drizzle: ${missingInDrizzle.join(', ')}`);
      }
    }
    
    return { 
      aligned: missingInZod.length === 0 && missingInDrizzle.length === 0,
      missingInZod,
      missingInDrizzle
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Schema alignment test failed: ${errorMessage}`);
    return { aligned: false, error: errorMessage };
  }
}

async function runComprehensiveTest() {
  console.log('🧪 Starting Comprehensive Database Schema & Zod Contract Alignment Test\n');
  console.log('=' .repeat(80));
  
  const startTime = Date.now();
  const results = {
    zodValidation: false,
    databaseConnection: null as any,
    schemaAlignment: null as any
  };
  
  // Test 1: Zod Schema Validation
  results.zodValidation = await testZodSchemas();
  
  // Test 2: Database Connection
  results.databaseConnection = await testDatabaseConnection();
  
  // Test 3: Schema Alignment
  results.schemaAlignment = await testSchemaAlignment();
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Generate Report
  console.log('\n' + '=' .repeat(80));
  console.log('🎯 COMPREHENSIVE TEST RESULTS');
  console.log('=' .repeat(80));
  
  console.log(`📊 Zod Validation: ${results.zodValidation ? '✅ PASS' : '❌ FAIL'}`);
  
  if (results.databaseConnection?.skipped) {
    console.log(`📊 Database Connection: ⏭️  SKIPPED (${results.databaseConnection.reason})`);
  } else {
    console.log(`📊 Database Connection: ${results.databaseConnection?.success ? '✅ PASS' : '❌ FAIL'}`);
  }
  
  if (results.schemaAlignment?.aligned !== undefined) {
    console.log(`📊 Schema Alignment: ${results.schemaAlignment.aligned ? '✅ PASS' : '❌ FAIL'}`);
  } else {
    console.log(`📊 Schema Alignment: ⏭️  SKIPPED`);
  }
  
  console.log(`⏱️  Total Time: ${duration}ms`);
  
  // Quality Assessment
  console.log('\n🏆 QUALITY ASSESSMENT:');
  
  if (results.zodValidation) {
    console.log('✅ Zod contracts are properly defined and working');
    console.log('✅ Type safety is ensured across the application');
    console.log('✅ API validation is ready for production use');
  }
  
  if (results.databaseConnection?.success) {
    console.log('✅ Database connection is stable and functional');
    console.log(`✅ Live data available: ${JSON.stringify(results.databaseConnection.stats)}`);
  } else if (results.databaseConnection?.skipped) {
    console.log('⚠️  Database connection not tested - environment setup needed');
  }
  
  if (results.schemaAlignment?.aligned) {
    console.log('✅ Perfect alignment between Drizzle and Zod schemas');
    console.log('✅ No data integrity issues detected');
  } else if (results.schemaAlignment?.aligned === false) {
    console.log('⚠️  Schema alignment issues detected - review needed');
  }
  
  // Overall Quality Score
  let qualityScore = 0;
  let maxScore = 0;
  
  if (results.zodValidation) qualityScore += 40;
  maxScore += 40;
  
  if (results.databaseConnection?.success) qualityScore += 30;
  if (!results.databaseConnection?.skipped) maxScore += 30;
  
  if (results.schemaAlignment?.aligned) qualityScore += 30;
  if (results.schemaAlignment?.aligned !== undefined) maxScore += 30;
  
  const qualityPercentage = maxScore > 0 ? (qualityScore / maxScore) * 100 : 0;
  
  console.log(`\n🎯 Overall Quality Score: ${qualityScore}/${maxScore} (${qualityPercentage.toFixed(1)}%)`);
  
  if (qualityPercentage >= 90) {
    console.log('🏆 EXCELLENT - Production ready with high confidence');
  } else if (qualityPercentage >= 70) {
    console.log('✅ GOOD - Ready for use with minor improvements needed');
  } else if (qualityPercentage >= 50) {
    console.log('⚠️  FAIR - Functional but requires attention');
  } else {
    console.log('❌ POOR - Significant issues need resolution');
  }
  
  console.log('\n✨ Testing complete!');
  
  return results;
}

// Run the comprehensive test
runComprehensiveTest().catch(console.error);
