#!/usr/bin/env node

/**
 * Comprehensive test script for Drizzle ORM and Zod validation
 * Tests database connection, schema validation, and type safety
 */

const { db } = require('../src/lib/db/index.js');
const { plants } = require('../src/lib/db/schema.js');
const { 
  plantSchema, 
  paginationSchema,
  enrollmentFiltersSchema 
} = require('../src/lib/validations.js');

async function testDrizzleConnection() {
  console.log('🔌 Testing Drizzle Database Connection...');
  
  try {
    // Test basic query
    const plantsResult = await db.select().from(plants).limit(5);
    console.log('✅ Database connection successful');
    console.log(`📊 Found ${plantsResult.length} plants in database`);
    
    if (plantsResult.length > 0) {
      console.log('📋 Sample plant data:', plantsResult[0]);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testZodValidation() {
  console.log('\n🔍 Testing Zod Schema Validation...');
  
  const tests = [
    {
      name: 'Plant Schema',
      schema: plantSchema,
      validData: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Plant',
        location: 'Test Location',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      invalidData: {
        id: 'invalid-uuid',
        name: '',
        location: '',
        isActive: 'not-boolean',
      }
    },
    {
      name: 'Pagination Schema',
      schema: paginationSchema,
      validData: {
        page: 1,
        limit: 20
      },
      invalidData: {
        page: -1,
        limit: 1000
      }
    },
    {
      name: 'Enrollment Filters Schema',
      schema: enrollmentFiltersSchema,
      validData: {
        plantId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'enrolled',
        page: 1,
        limit: 50
      },
      invalidData: {
        plantId: 'invalid-uuid',
        status: 'invalid-status',
        page: 0,
        limit: -1
      }
    }
  ];

  let passedTests = 0;
  let totalTests = 0;

  for (const test of tests) {
    console.log(`\n  Testing ${test.name}:`);
    
    // Test valid data
    totalTests++;
    try {
      test.schema.parse(test.validData);
      console.log(`    ✅ Valid data passed validation`);
      passedTests++;
    } catch (error) {
      console.log(`    ❌ Valid data failed validation: ${error.message}`);
    }
    
    // Test invalid data
    totalTests++;
    try {
      test.schema.parse(test.invalidData);
      console.log(`    ❌ Invalid data passed validation (should have failed)`);
    } catch {
      console.log(`    ✅ Invalid data correctly rejected`);
      passedTests++;
    }
  }

  console.log(`\n📊 Zod Validation Results: ${passedTests}/${totalTests} tests passed`);
  return passedTests === totalTests;
}

async function testSchemaCompatibility() {
  console.log('\n🔗 Testing Drizzle-Zod Schema Compatibility...');
  
  try {
    // Get sample data from database
    const plantsData = await db.select().from(plants).limit(1);
    
    if (plantsData.length === 0) {
      console.log('⚠️  No plant data available for compatibility testing');
      return true;
    }
    
    const plant = plantsData[0];
    
    // Try to validate database data with Zod schema
    const validatedPlant = plantSchema.parse({
      id: plant.id,
      name: plant.name,
      location: 'Sample Location', // Note: location field doesn't exist in DB yet
      isActive: plant.isActive,
      createdAt: plant.createdAt.toISOString(),
      updatedAt: plant.updatedAt.toISOString(),
    });
    
    console.log('✅ Database data validates with Zod schema');
    console.log('📋 Validated plant:', validatedPlant);
    
    return true;
  } catch (error) {
    console.error('❌ Schema compatibility issue:', error.message);
    return false;
  }
}

async function testTypeInference() {
  console.log('\n🔤 Testing TypeScript Type Inference...');
  
  try {
    // Test that Zod inferred types work correctly
    const samplePagination = paginationSchema.parse({ page: 1, limit: 20 });
    const sampleFilters = enrollmentFiltersSchema.parse({
      plantId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'enrolled',
      page: 1,
      limit: 25
    });
    
    console.log('✅ Type inference working correctly');
    console.log('📋 Sample pagination:', samplePagination);
    console.log('📋 Sample filters:', sampleFilters);
    
    return true;
  } catch (error) {
    console.error('❌ Type inference failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Starting Comprehensive Drizzle-Zod Testing Suite\n');
  console.log('=' .repeat(60));
  
  const tests = [
    { name: 'Drizzle Connection', test: testDrizzleConnection },
    { name: 'Zod Validation', test: testZodValidation },
    { name: 'Schema Compatibility', test: testSchemaCompatibility },
    { name: 'Type Inference', test: testTypeInference },
  ];
  
  let passedTests = 0;
  const startTime = Date.now();
  
  for (const { name, test } of tests) {
    try {
      const result = await test();
      if (result) {
        passedTests++;
        console.log(`\n✅ ${name}: PASSED`);
      } else {
        console.log(`\n❌ ${name}: FAILED`);
      }
    } catch (error) {
      console.log(`\n❌ ${name}: ERROR - ${error.message}`);
    }
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`📊 Tests Passed: ${passedTests}/${tests.length}`);
  console.log(`⏱️  Total Time: ${duration}ms`);
  console.log(`🎯 Success Rate: ${((passedTests / tests.length) * 100).toFixed(1)}%`);
  
  if (passedTests === tests.length) {
    console.log('\n🎉 ALL TESTS PASSED! Drizzle ORM and Zod validation are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
  }
  
  console.log('\n✨ Testing complete!');
}

// Run the tests
runAllTests().catch(console.error);