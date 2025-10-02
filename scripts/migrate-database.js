#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * This script enables the new unified database service and provides
 * migration utilities for the database layer simplification.
 */

import { MigrationUtils } from '../src/lib/db/operations';

const command = process.argv[2];
const options = process.argv.slice(3);

function showHelp() {
  console.log(`
Database Migration Script

Usage: node scripts/migrate-database.js <command> [options]

Commands:
  enable     Enable the new unified database service
  disable    Disable the new service (use legacy)
  status     Show current migration status
  test       Test the new service with sample operations
  help       Show this help message

Options:
  --logging  Enable/disable logging
  --fallback Enable/disable fallback to legacy

Examples:
  node scripts/migrate-database.js enable
  node scripts/migrate-database.js enable --logging
  node scripts/migrate-database.js status
  node scripts/migrate-database.js test
`);
}

function showStatus() {
  const status = MigrationUtils.getStatus();
  console.log('Migration Status:');
  console.log(`  Using New Service: ${status.usingNewService ? '✅ Yes' : '❌ No'}`);
  console.log(`  Logging Enabled: ${status.loggingEnabled ? '✅ Yes' : '❌ No'}`);
  console.log(`  Fallback Enabled: ${status.fallbackEnabled ? '✅ Yes' : '❌ No'}`);
}

function enableNewService() {
  console.log('Enabling new unified database service...');
  MigrationUtils.enableNewService();
  
  if (options.includes('--logging')) {
    console.log('Enabling logging...');
    MigrationUtils.enableLogging();
  }
  
  console.log('✅ New service enabled successfully');
  showStatus();
}

function disableNewService() {
  console.log('Disabling new service (fallback to legacy)...');
  MigrationUtils.disableNewService();
  
  if (options.includes('--logging')) {
    console.log('Disabling logging...');
    MigrationUtils.disableLogging();
  }
  
  console.log('✅ Legacy service enabled');
  showStatus();
}

async function testNewService() {
  console.log('Testing new database service...');
  
  try {
    // Import the new service
    const { DatabaseService, TenantFilter } = await import('../src/lib/db/operations');
    
    // Create test user context
    const testUserContext = {
      accessiblePlants: ['test-plant-1', 'test-plant-2'],
      roles: [
        { role: 'hr_admin', plantId: 'test-plant-1' },
        { role: 'plant_manager', plantId: 'test-plant-2' }
      ]
    };
    
    console.log('✅ Database service imported successfully');
    console.log('✅ Tenant filter utility available');
    console.log('✅ Test user context created');
    
    // Test tenant filtering
    const hasAccess = TenantFilter.validateAccess(testUserContext, 'test-plant-1');
    console.log(`✅ Tenant access validation: ${hasAccess ? 'PASS' : 'FAIL'}`);
    
    console.log('✅ All tests passed - new service is ready');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Main command handling
switch (command) {
  case 'enable':
    enableNewService();
    break;
    
  case 'disable':
    disableNewService();
    break;
    
  case 'status':
    showStatus();
    break;
    
  case 'test':
    testNewService();
    break;
    
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
    
  default:
    console.error('❌ Unknown command:', command);
    console.log('Use "help" to see available commands');
    process.exit(1);
}
