#!/usr/bin/env node

import { runDatabaseSeeding, getSeedingSummary } from '../src/lib/db/seed.js';

/**
 * Database seeding script for SpecChem Safety Training
 * Run with: node scripts/seed-database.js
 */

async function main() {
  try {
    console.log('🚀 Starting SpecChem Safety Training database seeding...\n');
    
    // Run the seeding process
    const result = await runDatabaseSeeding();
    
    console.log('\n📊 Seeding Summary:');
    console.log(`   Plants: ${result.plants.length} locations`);
    console.log(`   Courses: ${result.courses.length} primary courses`);
    
    // Get current database state
    const summary = await getSeedingSummary();
    console.log('\n📈 Database State:');
    console.log(`   Total Plants: ${summary.plants}`);
    console.log(`   Total Courses: ${summary.courses}`);
    console.log(`   Total Profiles: ${summary.profiles}`);
    
    console.log('\n🎯 Primary Courses Available:');
    summary.primaryCourses.forEach(course => {
      console.log(`   • ${course.title} (${course.slug})`);
    });
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('🔗 Your ebook/ and ebook-spanish/ courses are now ready for use.');
    
  } catch (error) {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  }
}

main();