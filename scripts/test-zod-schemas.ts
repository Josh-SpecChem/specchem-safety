#!/usr/bin/env tsx

/**
 * Standalone Zod validation test - no database connection required
 * Tests that our Zod schemas are working correctly
 */

import { 
  plantSchema, 
  courseSchema,
  profileSchema,
  enrollmentSchema,
  progressSchema,
  paginationSchema,
  enrollmentFiltersSchema,
  createPlantSchema,
  createCourseSchema,
  createProfileSchema,
  createEnrollmentSchema,
  createProgressSchema
} from '../src/lib/schemas.js';

function testZodValidation() {
  console.log('🧪 Testing Zod Schema Validation (No Database Required)\n');
  
  const tests = [
    {
      name: 'Plant Schema',
      schema: plantSchema,
      validData: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Plant',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      invalidData: {
        id: 'invalid-uuid',
        name: '',
        isActive: 'not-boolean',
      }
    },
    {
      name: 'Create Plant Schema',
      schema: createPlantSchema,
      validData: {
        name: 'New Plant',
        isActive: true,
      },
      invalidData: {
        name: '',
        isActive: 'not-boolean',
      }
    },
    {
      name: 'Course Schema',
      schema: courseSchema,
      validData: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        slug: 'test-course',
        title: 'Test Course',
        version: '1.0',
        isPublished: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      invalidData: {
        id: 'invalid-uuid',
        slug: '',
        title: '',
        version: '',
        isPublished: 'not-boolean',
      }
    },
    {
      name: 'Create Course Schema',
      schema: createCourseSchema,
      validData: {
        slug: 'new-course',
        title: 'New Course',
        version: '1.0',
        isPublished: false,
      },
      invalidData: {
        slug: '',
        title: '',
        version: '',
        isPublished: 'not-boolean',
      }
    },
    {
      name: 'Profile Schema',
      schema: profileSchema,
      validData: {
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
      invalidData: {
        id: 'invalid-uuid',
        plantId: 'invalid-uuid',
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        status: 'invalid-status',
      }
    },
    {
      name: 'Create Profile Schema',
      schema: createProfileSchema,
      validData: {
        id: '123e4567-e89b-12d3-a456-426614174002',
        plantId: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@specchem.com',
        jobTitle: 'Plant Manager',
        status: 'active',
      },
      invalidData: {
        id: 'invalid-uuid',
        plantId: 'invalid-uuid',
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        status: 'invalid-status',
      }
    },
    {
      name: 'Enrollment Schema',
      schema: enrollmentSchema,
      validData: {
        id: '123e4567-e89b-12d3-a456-426614174003',
        userId: '123e4567-e89b-12d3-a456-426614174002',
        courseId: '123e4567-e89b-12d3-a456-426614174001',
        plantId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'enrolled',
        enrolledAt: '2024-01-01T00:00:00.000Z',
        completedAt: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      invalidData: {
        id: 'invalid-uuid',
        userId: 'invalid-uuid',
        courseId: 'invalid-uuid',
        plantId: 'invalid-uuid',
        status: 'invalid-status',
      }
    },
    {
      name: 'Progress Schema',
      schema: progressSchema,
      validData: {
        id: '123e4567-e89b-12d3-a456-426614174004',
        userId: '123e4567-e89b-12d3-a456-426614174002',
        courseId: '123e4567-e89b-12d3-a456-426614174001',
        plantId: '123e4567-e89b-12d3-a456-426614174000',
        progressPercent: 75,
        currentSection: 'safety-basics',
        lastActiveAt: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      invalidData: {
        id: 'invalid-uuid',
        userId: 'invalid-uuid',
        courseId: 'invalid-uuid',
        plantId: 'invalid-uuid',
        progressPercent: 150, // Invalid - over 100
        currentSection: '',
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
      const result = test.schema.parse(test.validData);
      console.log(`    ✅ Valid data passed validation`);
      console.log(`    📋 Parsed result:`, Object.keys(result).join(', '));
      passedTests++;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`    ❌ Valid data failed validation: ${errorMessage}`);
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
  console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  return passedTests === totalTests;
}

function testSchemaCompleteness() {
  console.log('\n🔍 Testing Schema Completeness...');
  
  const requiredSchemas = [
    'plantSchema', 'createPlantSchema', 'updatePlantSchema',
    'courseSchema', 'createCourseSchema', 'updateCourseSchema', 
    'profileSchema', 'createProfileSchema', 'updateProfileSchema',
    'enrollmentSchema', 'createEnrollmentSchema', 'updateEnrollmentSchema',
    'progressSchema', 'createProgressSchema', 'updateProgressSchema',
    'activityEventSchema', 'createActivityEventSchema',
    'questionEventSchema', 'createQuestionEventSchema',
    'adminRoleRecordSchema', 'createAdminRoleSchema', 'updateAdminRoleSchema',
    'paginationSchema', 'enrollmentFiltersSchema', 'progressFiltersSchema',
    'userFiltersSchema', 'plantFilterSchema', 'courseFilterSchema'
  ];
  
  const availableSchemas = Object.keys({
    plantSchema, createPlantSchema,
    courseSchema, createCourseSchema,
    profileSchema, createProfileSchema,
    enrollmentSchema, createEnrollmentSchema,
    progressSchema, createProgressSchema,
    paginationSchema, enrollmentFiltersSchema
  }).filter(key => key !== undefined);
  
  console.log(`📋 Required schemas: ${requiredSchemas.length}`);
  console.log(`📋 Available schemas: ${availableSchemas.length}`);
  console.log(`📋 Missing schemas: ${requiredSchemas.length - availableSchemas.length}`);
  
  const missingSchemas = requiredSchemas.filter(schema => !availableSchemas.includes(schema));
  if (missingSchemas.length > 0) {
    console.log(`⚠️  Missing schemas: ${missingSchemas.join(', ')}`);
  } else {
    console.log(`✅ All required schemas are available`);
  }
  
  return missingSchemas.length === 0;
}

async function runAllTests() {
  console.log('🧪 Starting Zod Schema Validation Test Suite\n');
  console.log('=' .repeat(60));
  
  const validationResult = testZodValidation();
  const completenessResult = testSchemaCompleteness();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`📊 Validation Tests: ${validationResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📊 Schema Completeness: ${completenessResult ? '✅ PASS' : '❌ FAIL'}`);
  
  if (validationResult && completenessResult) {
    console.log('\n🎉 ALL TESTS PASSED! Zod schemas are working correctly.');
    console.log('✅ Database schema contracts are properly defined');
    console.log('✅ API validation is ready to use');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
  }
  
  console.log('\n✨ Testing complete!');
}

// Run the tests
runAllTests().catch(console.error);
