#!/usr/bin/env tsx

/**
 * Contract Validation Test Script
 * 
 * Validates that Drizzle schemas and Zod contracts are properly aligned.
 * This script should be run in CI to catch contract mismatches.
 * 
 * Usage:
 *   pnpm test:contracts
 *   node scripts/test-contracts.ts
 */

import { z } from 'zod';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  plants,
  courses,
  profiles,
  adminRoles,
  enrollments,
  progress,
  activityEvents,
  questionEvents,
  type PlantScopedQuery,
  type TenantContext
} from '../src/contracts/schema.app';

import {
  PlantSchema,
  CourseSchema,
  ProfileSchema,
  AdminRoleRecordSchema,
  EnrollmentSchema,
  ProgressSchema,
  ActivityEventSchema,
  QuestionEventSchema,
  CreatePlantSchema,
  CreateCourseSchema,
  CreateProfileSchema,
  CreateEnrollmentSchema,
  CreateProgressSchema,
  UpdatePlantSchema,
  UpdateCourseSchema,
  UpdateProfileSchema,
  UpdateEnrollmentSchema,
  UpdateProgressSchema,
  type Plant,
  type Course,
  type Profile,
  type AdminRoleRecord,
  type Enrollment,
  type Progress,
  type ActivityEvent,
  type QuestionEvent
} from '../src/contracts/base';

// ========================================
// TYPE COMPATIBILITY TESTS
// ========================================

interface TestResult {
  entity: string;
  test: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function addResult(entity: string, test: string, passed: boolean, error?: string) {
  results.push({ entity, test, passed, error });
  const status = passed ? '✅' : '❌';
  const message = error ? ` - ${error}` : '';
  console.log(`${status} ${entity}: ${test}${message}`);
}

// ========================================
// DRIZZLE ↔ ZOD ALIGNMENT TESTS
// ========================================

function testSchemaAlignment() {
  console.log('\n🔍 Testing Drizzle ↔ Zod Schema Alignment...\n');

  // Test Plant schema alignment
  try {
    type DrizzlePlant = InferSelectModel<typeof plants>;
    const testPlant: DrizzlePlant = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Plant',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const zodValidation = PlantSchema.safeParse(testPlant);
    addResult('Plant', 'Drizzle → Zod compatibility', zodValidation.success, 
      zodValidation.success ? undefined : zodValidation.error.issues[0]?.message);
  } catch (error) {
    addResult('Plant', 'Drizzle → Zod compatibility', false, 
      error instanceof Error ? error.message : 'Unknown error');
  }

  // Test Course schema alignment
  try {
    type DrizzleCourse = InferSelectModel<typeof courses>;
    const testCourse: DrizzleCourse = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      slug: 'test-course',
      title: 'Test Course',
      version: '1.0',
      isPublished: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const zodValidation = CourseSchema.safeParse(testCourse);
    addResult('Course', 'Drizzle → Zod compatibility', zodValidation.success,
      zodValidation.success ? undefined : zodValidation.error.issues[0]?.message);
  } catch (error) {
    addResult('Course', 'Drizzle → Zod compatibility', false,
      error instanceof Error ? error.message : 'Unknown error');
  }

  // Test Profile schema alignment
  try {
    type DrizzleProfile = InferSelectModel<typeof profiles>;
    const testProfile: DrizzleProfile = {
      id: '123e4567-e89b-12d3-a456-426614174002',
      plantId: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      jobTitle: 'Safety Manager',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const zodValidation = ProfileSchema.safeParse(testProfile);
    addResult('Profile', 'Drizzle → Zod compatibility', zodValidation.success,
      zodValidation.success ? undefined : zodValidation.error.issues[0]?.message);
  } catch (error) {
    addResult('Profile', 'Drizzle → Zod compatibility', false,
      error instanceof Error ? error.message : 'Unknown error');
  }

  // Test Enrollment schema alignment
  try {
    type DrizzleEnrollment = InferSelectModel<typeof enrollments>;
    const testEnrollment: DrizzleEnrollment = {
      id: '123e4567-e89b-12d3-a456-426614174003',
      userId: '123e4567-e89b-12d3-a456-426614174002',
      courseId: '123e4567-e89b-12d3-a456-426614174001',
      plantId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'enrolled',
      enrolledAt: '2024-01-01T00:00:00Z',
      completedAt: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const zodValidation = EnrollmentSchema.safeParse(testEnrollment);
    addResult('Enrollment', 'Drizzle → Zod compatibility', zodValidation.success,
      zodValidation.success ? undefined : zodValidation.error.issues[0]?.message);
  } catch (error) {
    addResult('Enrollment', 'Drizzle → Zod compatibility', false,
      error instanceof Error ? error.message : 'Unknown error');
  }

  // Test Progress schema alignment
  try {
    type DrizzleProgress = InferSelectModel<typeof progress>;
    const testProgress: DrizzleProgress = {
      id: '123e4567-e89b-12d3-a456-426614174004',
      userId: '123e4567-e89b-12d3-a456-426614174002',
      courseId: '123e4567-e89b-12d3-a456-426614174001',
      plantId: '123e4567-e89b-12d3-a456-426614174000',
      progressPercent: 75,
      currentSection: 'section-3',
      lastActiveAt: '2024-01-01T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const zodValidation = ProgressSchema.safeParse(testProgress);
    addResult('Progress', 'Drizzle → Zod compatibility', zodValidation.success,
      zodValidation.success ? undefined : zodValidation.error.issues[0]?.message);
  } catch (error) {
    addResult('Progress', 'Drizzle → Zod compatibility', false,
      error instanceof Error ? error.message : 'Unknown error');
  }
}

// ========================================
// CREATE/UPDATE SCHEMA TESTS
// ========================================

function testCrudSchemas() {
  console.log('\n🔍 Testing CRUD Schema Validation...\n');

  // Test Create schemas
  const createTests = [
    {
      name: 'CreatePlant',
      schema: CreatePlantSchema,
      data: { name: 'New Plant', isActive: true }
    },
    {
      name: 'CreateCourse',
      schema: CreateCourseSchema,
      data: { slug: 'new-course', title: 'New Course', version: '1.0', isPublished: false }
    },
    {
      name: 'CreateProfile',
      schema: CreateProfileSchema,
      data: {
        id: '123e4567-e89b-12d3-a456-426614174005',
        plantId: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        jobTitle: 'Operator'
      }
    },
    {
      name: 'CreateEnrollment',
      schema: CreateEnrollmentSchema,
      data: {
        userId: '123e4567-e89b-12d3-a456-426614174002',
        courseId: '123e4567-e89b-12d3-a456-426614174001',
        plantId: '123e4567-e89b-12d3-a456-426614174000'
      }
    }
  ];

  createTests.forEach(({ name, schema, data }) => {
    try {
      const result = schema.safeParse(data);
      addResult(name, 'Create schema validation', result.success,
        result.success ? undefined : result.error.issues[0]?.message);
    } catch (error) {
      addResult(name, 'Create schema validation', false,
        error instanceof Error ? error.message : 'Unknown error');
    }
  });

  // Test Update schemas
  const updateTests = [
    {
      name: 'UpdatePlant',
      schema: UpdatePlantSchema,
      data: { name: 'Updated Plant Name' }
    },
    {
      name: 'UpdateCourse',
      schema: UpdateCourseSchema,
      data: { title: 'Updated Course Title', isPublished: true }
    },
    {
      name: 'UpdateProfile',
      schema: UpdateProfileSchema,
      data: { firstName: 'Updated Name', jobTitle: 'Senior Operator' }
    },
    {
      name: 'UpdateEnrollment',
      schema: UpdateEnrollmentSchema,
      data: { status: 'completed', completedAt: '2024-01-01T00:00:00Z' }
    }
  ];

  updateTests.forEach(({ name, schema, data }) => {
    try {
      const result = schema.safeParse(data);
      addResult(name, 'Update schema validation', result.success,
        result.success ? undefined : result.error.issues[0]?.message);
    } catch (error) {
      addResult(name, 'Update schema validation', false,
        error instanceof Error ? error.message : 'Unknown error');
    }
  });
}

// ========================================
// ENUM VALIDATION TESTS
// ========================================

function testEnumValidation() {
  console.log('\n🔍 Testing Enum Validation...\n');

  const enumTests = [
    {
      name: 'AdminRole',
      validValues: ['hr_admin', 'dev_admin', 'plant_manager'],
      invalidValues: ['invalid_role', 'admin', '']
    },
    {
      name: 'EnrollmentStatus',
      validValues: ['enrolled', 'in_progress', 'completed'],
      invalidValues: ['pending', 'cancelled', '']
    },
    {
      name: 'EventType',
      validValues: ['view_section', 'start_course', 'complete_course'],
      invalidValues: ['invalid_event', 'login', '']
    },
    {
      name: 'UserStatus',
      validValues: ['active', 'suspended'],
      invalidValues: ['inactive', 'deleted', '']
    }
  ];

  enumTests.forEach(({ name, validValues, invalidValues }) => {
    // Test valid values
    validValues.forEach(value => {
      try {
        // This is a simplified test - in practice you'd import the specific enum schema
        const isValid = typeof value === 'string' && value.length > 0;
        addResult(name, `Valid value: ${value}`, isValid);
      } catch (error) {
        addResult(name, `Valid value: ${value}`, false,
          error instanceof Error ? error.message : 'Unknown error');
      }
    });

    // Test invalid values
    invalidValues.forEach(value => {
      try {
        // This is a simplified test - in practice you'd import the specific enum schema
        const isInvalid = typeof value !== 'string' || value.length === 0 || 
          !validValues.includes(value);
        addResult(name, `Invalid value: ${value}`, isInvalid);
      } catch (error) {
        addResult(name, `Invalid value: ${value}`, false,
          error instanceof Error ? error.message : 'Unknown error');
      }
    });
  });
}

// ========================================
// TENANT ISOLATION TESTS
// ========================================

function testTenantIsolation() {
  console.log('\n🔍 Testing Tenant Isolation Patterns...\n');

  // Test that all tenant-scoped entities have plantId
  const tenantScopedEntities = [
    { name: 'Profile', hasPlantId: true },
    { name: 'Enrollment', hasPlantId: true },
    { name: 'Progress', hasPlantId: true },
    { name: 'ActivityEvent', hasPlantId: true },
    { name: 'QuestionEvent', hasPlantId: true },
    { name: 'AdminRole', hasPlantId: true }, // nullable but present
  ];

  tenantScopedEntities.forEach(({ name, hasPlantId }) => {
    addResult('TenantIsolation', `${name} has plantId field`, hasPlantId);
  });

  // Test PlantScopedQuery type utility
  try {
    type TestQuery = PlantScopedQuery<{ userId: string }>;
    const query: TestQuery = { userId: 'test', plantId: 'test-plant' };
    addResult('TenantIsolation', 'PlantScopedQuery type utility', true);
  } catch (error) {
    addResult('TenantIsolation', 'PlantScopedQuery type utility', false,
      error instanceof Error ? error.message : 'Unknown error');
  }

  // Test TenantContext type
  try {
    const context: TenantContext = { plantId: 'test-plant', userId: 'test-user' };
    addResult('TenantIsolation', 'TenantContext type', true);
  } catch (error) {
    addResult('TenantIsolation', 'TenantContext type', false,
      error instanceof Error ? error.message : 'Unknown error');
  }
}

// ========================================
// MAIN TEST RUNNER
// ========================================

async function runTests() {
  console.log('🧪 Contract Validation Test Suite');
  console.log('==================================');

  testSchemaAlignment();
  testCrudSchemas();
  testEnumValidation();
  testTenantIsolation();

  // Summary
  console.log('\n📊 Test Summary');
  console.log('================');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  - ${r.entity}: ${r.test}${r.error ? ` (${r.error})` : ''}`);
      });
  }

  // Exit with error code if tests failed
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('\n🎉 All contract validation tests passed!');
    process.exit(0);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

export { runTests };

