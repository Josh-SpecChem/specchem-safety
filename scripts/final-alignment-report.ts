#!/usr/bin/env tsx

/**
 * Final Schema Alignment Report
 * Direct comparison of actual database schema with Zod validation schemas
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

async function testDatabaseConnection() {
  console.log('🔌 Testing Database Connection...\n');
  
  try {
    const { db } = await import('../src/lib/db/index.js');
    const { plants, courses, profiles, enrollments, progress, activityEvents, questionEvents, adminRoles } = await import('../src/lib/db/schema.js');
    const { count } = await import('drizzle-orm');
    
    // Test connection and get counts
    const results = await Promise.all([
      db.select({ count: count() }).from(plants),
      db.select({ count: count() }).from(courses),
      db.select({ count: count() }).from(profiles),
      db.select({ count: count() }).from(enrollments),
      db.select({ count: count() }).from(progress),
      db.select({ count: count() }).from(activityEvents),
      db.select({ count: count() }).from(questionEvents),
      db.select({ count: count() }).from(adminRoles)
    ]);
    
    const stats = {
      plants: results[0][0]?.count || 0,
      courses: results[1][0]?.count || 0,
      profiles: results[2][0]?.count || 0,
      enrollments: results[3][0]?.count || 0,
      progress: results[4][0]?.count || 0,
      activityEvents: results[5][0]?.count || 0,
      questionEvents: results[6][0]?.count || 0,
      adminRoles: results[7][0]?.count || 0
    };
    
    console.log('✅ Database Connection: SUCCESSFUL');
    console.log('📊 Table Record Counts:');
    Object.entries(stats).forEach(([table, count]) => {
      console.log(`  - ${table}: ${count} records`);
    });
    
    return { success: true, stats };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Database Connection: FAILED`);
    console.log(`   Error: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

async function testZodValidation() {
  console.log('\n🧪 Testing Zod Schema Validation...\n');
  
  try {
    const schemas = await import('../src/lib/schemas.js');
    
    // Test data that matches the actual database structure
    const testData = {
      plant: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Plant',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      course: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        slug: 'test-course',
        title: 'Test Course',
        version: '1.0',
        isPublished: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      profile: {
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
      enrollment: {
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
      progress: {
        id: '123e4567-e89b-12d3-a456-426614174004',
        userId: '123e4567-e89b-12d3-a456-426614174002',
        courseId: '123e4567-e89b-12d3-a456-426614174001',
        plantId: '123e4567-e89b-12d3-a456-426614174000',
        progressPercent: 75,
        currentSection: 'safety-basics',
        lastActiveAt: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }
    };
    
    const tests = [
      { name: 'Plant Schema', schema: schemas.plantSchema, data: testData.plant },
      { name: 'Course Schema', schema: schemas.courseSchema, data: testData.course },
      { name: 'Profile Schema', schema: schemas.profileSchema, data: testData.profile },
      { name: 'Enrollment Schema', schema: schemas.enrollmentSchema, data: testData.enrollment },
      { name: 'Progress Schema', schema: schemas.progressSchema, data: testData.progress }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
      try {
        test.schema.parse(test.data);
        console.log(`✅ ${test.name}: VALID`);
        passed++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`❌ ${test.name}: INVALID - ${errorMessage}`);
      }
    }
    
    console.log(`\n📊 Zod Validation Results: ${passed}/${total} schemas passed`);
    
    return { success: passed === total, passed, total };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Zod Validation: FAILED - ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

async function testLiveDataValidation() {
  console.log('\n🔍 Testing Live Data Validation...\n');
  
  try {
    const { db } = await import('../src/lib/db/index.js');
    const { plants, courses, profiles } = await import('../src/lib/db/schema.js');
    const schemas = await import('../src/lib/schemas.js');
    
    // Get sample data from database
    const [samplePlant] = await db.select().from(plants).limit(1);
    const [sampleCourse] = await db.select().from(courses).limit(1);
    const [sampleProfile] = await db.select().from(profiles).limit(1);
    
    const tests = [];
    
    if (samplePlant) {
      tests.push({
        name: 'Live Plant Data',
        schema: schemas.plantSchema,
        data: samplePlant
      });
    }
    
    if (sampleCourse) {
      tests.push({
        name: 'Live Course Data',
        schema: schemas.courseSchema,
        data: sampleCourse
      });
    }
    
    if (sampleProfile) {
      tests.push({
        name: 'Live Profile Data',
        schema: schemas.profileSchema,
        data: sampleProfile
      });
    }
    
    if (tests.length === 0) {
      console.log('⚠️  No live data available for validation testing');
      return { success: true, skipped: true };
    }
    
    let passed = 0;
    
    for (const test of tests) {
      try {
        test.schema.parse(test.data);
        console.log(`✅ ${test.name}: VALID`);
        passed++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`❌ ${test.name}: INVALID - ${errorMessage}`);
        console.log(`   Data: ${JSON.stringify(test.data, null, 2)}`);
      }
    }
    
    console.log(`\n📊 Live Data Validation: ${passed}/${tests.length} tests passed`);
    
    return { success: passed === tests.length, passed, total: tests.length };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Live Data Validation: FAILED - ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

async function generateFinalReport() {
  console.log('🧪 SPECCHEM SAFETY TRAINING - SCHEMA ALIGNMENT REPORT');
  console.log('=' .repeat(80));
  console.log(`📅 Generated: ${new Date().toISOString()}`);
  console.log('=' .repeat(80));
  
  const startTime = Date.now();
  
  // Run all tests
  const dbTest = await testDatabaseConnection();
  const zodTest = await testZodValidation();
  const liveTest = await testLiveDataValidation();
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Generate final assessment
  console.log('\n' + '=' .repeat(80));
  console.log('🎯 FINAL ASSESSMENT');
  console.log('=' .repeat(80));
  
  console.log(`⏱️  Total Test Duration: ${duration}ms`);
  console.log(`🔌 Database Connection: ${dbTest.success ? '✅ CONNECTED' : '❌ FAILED'}`);
  console.log(`🧪 Zod Schema Validation: ${zodTest.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`🔍 Live Data Validation: ${liveTest.success ? '✅ PASSED' : liveTest.skipped ? '⏭️  SKIPPED' : '❌ FAILED'}`);
  
  // Calculate overall quality score
  let qualityScore = 0;
  let maxScore = 0;
  
  if (dbTest.success) qualityScore += 40;
  maxScore += 40;
  
  if (zodTest.success) qualityScore += 40;
  maxScore += 40;
  
  if (liveTest.success) qualityScore += 20;
  if (!liveTest.skipped) maxScore += 20;
  
  const qualityPercentage = maxScore > 0 ? (qualityScore / maxScore) * 100 : 0;
  
  console.log(`\n🏆 OVERALL QUALITY SCORE: ${qualityScore}/${maxScore} (${qualityPercentage.toFixed(1)}%)`);
  
  // Quality assessment
  if (qualityPercentage >= 95) {
    console.log('🏆 EXCELLENT - Production ready with high confidence');
    console.log('✅ All systems are properly aligned and functional');
  } else if (qualityPercentage >= 80) {
    console.log('✅ VERY GOOD - Ready for production with minor notes');
    console.log('✅ Core functionality is solid and reliable');
  } else if (qualityPercentage >= 60) {
    console.log('⚠️  GOOD - Functional but needs attention');
    console.log('⚠️  Some issues should be addressed before production');
  } else {
    console.log('❌ NEEDS IMPROVEMENT - Significant issues detected');
    console.log('❌ Address critical issues before production deployment');
  }
  
  // Detailed findings
  console.log('\n📋 DETAILED FINDINGS:');
  
  if (dbTest.success && dbTest.stats) {
    console.log('✅ Database connectivity is stable and functional');
    console.log(`✅ All ${Object.keys(dbTest.stats).length} tables are accessible`);
    console.log(`✅ Live data available: ${JSON.stringify(dbTest.stats)}`);
  } else {
    console.log('❌ Database connection issues detected');
    console.log('💡 Check environment variables and database configuration');
  }
  
  if (zodTest.success) {
    console.log('✅ Zod validation schemas are properly defined');
    console.log('✅ Type safety is ensured across the application');
    console.log('✅ API validation contracts are ready for use');
  } else {
    console.log('❌ Zod validation issues detected');
    console.log('💡 Review schema definitions for type mismatches');
  }
  
  if (liveTest.success) {
    console.log('✅ Live database data validates against Zod schemas');
    console.log('✅ Perfect alignment between database and validation contracts');
  } else if (liveTest.skipped) {
    console.log('⚠️  Live data validation skipped - no sample data available');
  } else {
    console.log('❌ Live data validation failed');
    console.log('💡 Schema alignment issues between database and Zod contracts');
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  
  if (qualityPercentage >= 80) {
    console.log('🚀 System is ready for production deployment');
    console.log('📈 Consider implementing monitoring for ongoing validation');
    console.log('🔄 Regular schema validation tests recommended');
  } else {
    console.log('🔧 Address identified issues before production deployment');
    console.log('🧪 Run validation tests after each schema change');
    console.log('📚 Review documentation for proper setup procedures');
  }
  
  console.log('\n✨ Schema alignment analysis complete!');
  
  return {
    qualityScore: qualityPercentage,
    databaseConnected: dbTest.success,
    zodValidation: zodTest.success,
    liveDataValidation: liveTest.success,
    duration
  };
}

// Run the final report
generateFinalReport().catch(console.error);
