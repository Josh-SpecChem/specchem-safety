#!/usr/bin/env node

/**
 * Test script to verify Drizzle ORM and Zod are working correctly
 * Run with: node scripts/test-integrations.js
 */

import { db } from '../src/lib/db/index.js';
import { plants } from '../src/lib/db/schema.js';
import { plantSchema, userProfileSchema } from '../src/lib/schemas.js';

async function testDrizzleConnection() {
  console.log('🔍 Testing Drizzle ORM connection...');
  
  try {
    // Test basic query
    const plantsQuery = await db.select().from(plants).limit(3);
    console.log('✅ Drizzle query successful!');
    console.log(`📊 Found ${plantsQuery.length} plants in database`);
    
    if (plantsQuery.length > 0) {
      console.log('📋 Sample plant data:', {
        id: plantsQuery[0].id,
        name: plantsQuery[0].name,
        isActive: plantsQuery[0].isActive,
      });
    }
    
    return { success: true, count: plantsQuery.length };
  } catch (error) {
    console.error('❌ Drizzle connection failed:', error.message);
    return { success: false, error: error.message };
  }
}

function testZodValidation() {
  console.log('\n🔍 Testing Zod validation...');
  
  try {
    // Test valid plant data
    const validPlant = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Plant',
      location: 'Test Location',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const validatedPlant = plantSchema.parse(validPlant);
    console.log('✅ Plant schema validation successful!');
    console.log('📋 Validated plant:', validatedPlant.name);
    
    // Test valid user profile
    const validUser = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      email: 'test@specchem.com',
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Safety Coordinator',
      role: 'employee',
      isActive: true,
      plantId: '123e4567-e89b-12d3-a456-426614174000',
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
    };
    
    const validatedUser = userProfileSchema.parse(validUser);
    console.log('✅ User profile schema validation successful!');
    console.log('📋 Validated user:', `${validatedUser.firstName} ${validatedUser.lastName}`);
    
    // Test invalid data (should throw)
    try {
      plantSchema.parse({ name: '' }); // Invalid - missing required fields
      console.log('❌ Should have failed validation');
    } catch (validationError) {
      console.log('✅ Validation correctly rejected invalid data');
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ Zod validation failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting integration tests...\n');
  
  const drizzleResult = await testDrizzleConnection();
  const zodResult = testZodValidation();
  
  console.log('\n📊 Test Results Summary:');
  console.log(`Drizzle ORM: ${drizzleResult.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Zod Validation: ${zodResult.success ? '✅ PASS' : '❌ FAIL'}`);
  
  if (drizzleResult.success && zodResult.success) {
    console.log('\n🎉 All integrations are working correctly!');
    console.log('✅ Ready to proceed with API integration');
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runTests().catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
}

export { testDrizzleConnection, testZodValidation };