#!/usr/bin/env tsx

/**
 * Comprehensive Schema Alignment Analysis
 * Compares Drizzle schema definitions with Zod validation schemas
 * Identifies mismatches and provides detailed alignment report
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

// Import all schemas
import * as drizzleSchema from '../drizzle/schema.js';
import * as zodSchemas from '../src/lib/schemas.js';

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  hasDefault: boolean;
}

interface TableAnalysis {
  tableName: string;
  drizzleColumns: ColumnInfo[];
  zodFields: string[];
  missingInZod: string[];
  missingInDrizzle: string[];
  typeMatches: boolean;
  aligned: boolean;
}

function analyzeDrizzleTable(table: any): ColumnInfo[] {
  const columns: ColumnInfo[] = [];
  
  if (table && typeof table === 'object' && table[Symbol.for('drizzle:Table')]) {
    // This is a Drizzle table
    const tableConfig = table[Symbol.for('drizzle:Table')];
    
    if (tableConfig && tableConfig.columns) {
      for (const [columnName, column] of Object.entries(tableConfig.columns)) {
        const col = column as any;
        columns.push({
          name: columnName,
          type: col.columnType || 'unknown',
          nullable: !col.notNull,
          hasDefault: !!col.default || !!col.defaultFn
        });
      }
    }
  }
  
  return columns;
}

function getZodSchemaFields(schema: any): string[] {
  if (!schema || typeof schema.shape !== 'object') {
    return [];
  }
  
  return Object.keys(schema.shape);
}

async function analyzeSchemaAlignment(): Promise<TableAnalysis[]> {
  const analyses: TableAnalysis[] = [];
  
  // Define table mappings
  const tableMappings = [
    { drizzle: 'plants', zod: 'plantSchema' },
    { drizzle: 'courses', zod: 'courseSchema' },
    { drizzle: 'profiles', zod: 'profileSchema' },
    { drizzle: 'enrollments', zod: 'enrollmentSchema' },
    { drizzle: 'progress', zod: 'progressSchema' },
    { drizzle: 'activityEvents', zod: 'activityEventSchema' },
    { drizzle: 'questionEvents', zod: 'questionEventSchema' },
    { drizzle: 'adminRoles', zod: 'adminRoleRecordSchema' }
  ];
  
  for (const mapping of tableMappings) {
    const drizzleTable = (drizzleSchema as any)[mapping.drizzle];
    const zodSchema = (zodSchemas as any)[mapping.zod];
    
    if (!drizzleTable) {
      console.log(`⚠️  Drizzle table '${mapping.drizzle}' not found`);
      continue;
    }
    
    if (!zodSchema) {
      console.log(`⚠️  Zod schema '${mapping.zod}' not found`);
      continue;
    }
    
    const drizzleColumns = analyzeDrizzleTable(drizzleTable);
    const zodFields = getZodSchemaFields(zodSchema);
    
    // Convert drizzle column names to camelCase for comparison
    const drizzleFieldNames = drizzleColumns.map(col => {
      // Convert snake_case to camelCase
      return col.name.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    });
    
    const missingInZod = drizzleFieldNames.filter(field => !zodFields.includes(field));
    const missingInDrizzle = zodFields.filter(field => !drizzleFieldNames.includes(field));
    
    const analysis: TableAnalysis = {
      tableName: mapping.drizzle,
      drizzleColumns,
      zodFields,
      missingInZod,
      missingInDrizzle,
      typeMatches: true, // We'll implement detailed type checking later
      aligned: missingInZod.length === 0 && missingInDrizzle.length === 0
    };
    
    analyses.push(analysis);
  }
  
  return analyses;
}

async function testDatabaseSchemaLive() {
  console.log('🔍 Testing Live Database Schema...\n');
  
  try {
    const { db } = await import('../src/lib/db/index.js');
    const { sql } = await import('drizzle-orm');
    
    // Query actual database schema
    const schemaQuery = sql`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;
    
    const result = await db.execute(schemaQuery);
    
    // Group by table
    const tableSchemas: Record<string, any[]> = {};
    for (const row of result.rows) {
      const tableName = row.table_name as string;
      if (!tableSchemas[tableName]) {
        tableSchemas[tableName] = [];
      }
      tableSchemas[tableName].push(row);
    }
    
    console.log('📊 Live Database Tables:');
    for (const [tableName, columns] of Object.entries(tableSchemas)) {
      console.log(`  📋 ${tableName}: ${columns.length} columns`);
      for (const col of columns) {
        const nullable = col.is_nullable === 'YES' ? '?' : '';
        const hasDefault = col.column_default ? ' (default)' : '';
        console.log(`    - ${col.column_name}${nullable}: ${col.data_type}${hasDefault}`);
      }
    }
    
    return { success: true, tables: tableSchemas };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Live schema query failed: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

async function runComprehensiveAlignment() {
  console.log('🧪 Starting Comprehensive Schema Alignment Analysis\n');
  console.log('=' .repeat(80));
  
  // Test 1: Static Schema Analysis
  console.log('\n📋 STATIC SCHEMA ANALYSIS');
  console.log('-' .repeat(40));
  
  const analyses = await analyzeSchemaAlignment();
  let totalAligned = 0;
  
  for (const analysis of analyses) {
    console.log(`\n🔍 ${analysis.tableName.toUpperCase()}`);
    console.log(`  Drizzle columns: ${analysis.drizzleColumns.length}`);
    console.log(`  Zod fields: ${analysis.zodFields.length}`);
    
    if (analysis.missingInZod.length > 0) {
      console.log(`  ❌ Missing in Zod: ${analysis.missingInZod.join(', ')}`);
    }
    
    if (analysis.missingInDrizzle.length > 0) {
      console.log(`  ❌ Missing in Drizzle: ${analysis.missingInDrizzle.join(', ')}`);
    }
    
    if (analysis.aligned) {
      console.log(`  ✅ Perfect alignment`);
      totalAligned++;
    } else {
      console.log(`  ⚠️  Alignment issues detected`);
    }
  }
  
  // Test 2: Live Database Schema
  console.log('\n📊 LIVE DATABASE SCHEMA');
  console.log('-' .repeat(40));
  
  const liveResult = await testDatabaseSchemaLive();
  
  // Test 3: Zod Validation Test
  console.log('\n🧪 ZOD VALIDATION TEST');
  console.log('-' .repeat(40));
  
  const zodTestResults = await testZodValidation();
  
  // Generate Final Report
  console.log('\n' + '=' .repeat(80));
  console.log('🎯 COMPREHENSIVE ALIGNMENT REPORT');
  console.log('=' .repeat(80));
  
  const alignmentPercentage = (totalAligned / analyses.length) * 100;
  
  console.log(`📊 Schema Alignment: ${totalAligned}/${analyses.length} tables (${alignmentPercentage.toFixed(1)}%)`);
  console.log(`📊 Database Connection: ${liveResult.success ? '✅ CONNECTED' : '❌ FAILED'}`);
  console.log(`📊 Zod Validation: ${zodTestResults.success ? '✅ PASSED' : '❌ FAILED'}`);
  
  // Quality Assessment
  console.log('\n🏆 QUALITY ASSESSMENT:');
  
  if (alignmentPercentage === 100) {
    console.log('🏆 PERFECT - All schemas are perfectly aligned');
  } else if (alignmentPercentage >= 80) {
    console.log('✅ EXCELLENT - Minor alignment issues that need attention');
  } else if (alignmentPercentage >= 60) {
    console.log('⚠️  GOOD - Several alignment issues need resolution');
  } else {
    console.log('❌ POOR - Major alignment issues require immediate attention');
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  
  for (const analysis of analyses) {
    if (!analysis.aligned) {
      console.log(`\n🔧 ${analysis.tableName}:`);
      
      if (analysis.missingInZod.length > 0) {
        console.log(`  - Add to Zod schema: ${analysis.missingInZod.join(', ')}`);
      }
      
      if (analysis.missingInDrizzle.length > 0) {
        console.log(`  - Add to Drizzle schema: ${analysis.missingInDrizzle.join(', ')}`);
      }
    }
  }
  
  if (liveResult.success) {
    console.log('\n✅ Database is accessible and schema can be queried');
    console.log('✅ Ready for production data operations');
  } else {
    console.log('\n⚠️  Database connection issues - check environment configuration');
  }
  
  console.log('\n✨ Analysis complete!');
  
  return {
    alignmentPercentage,
    totalTables: analyses.length,
    alignedTables: totalAligned,
    databaseConnected: liveResult.success,
    zodValidation: zodTestResults.success,
    analyses
  };
}

async function testZodValidation() {
  try {
    // Test a few key schemas
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
      }
    };
    
    zodSchemas.plantSchema.parse(testData.plant);
    zodSchemas.courseSchema.parse(testData.course);
    
    console.log('✅ Zod validation tests passed');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Zod validation failed: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

// Run the comprehensive alignment test
runComprehensiveAlignment().catch(console.error);
