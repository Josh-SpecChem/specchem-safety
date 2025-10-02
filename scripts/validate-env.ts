#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates all environment variables and configuration settings
 */

import { config } from 'dotenv';
import { ConfigValidationService } from '../src/lib/config-validation';

// Load environment variables
config({ path: '.env.local' });

function validateEnvironment() {
  console.log('🔍 Validating environment configuration...\n');
  
  try {
    const isValid = ConfigValidationService.validateAllConfigs();
    
    if (isValid) {
      console.log('✅ All environment variables are valid');
      
      const summary = ConfigValidationService.getConfigSummary();
      console.log('\n📊 Configuration Summary:');
      console.log(JSON.stringify(summary, null, 2));
      
      const health = ConfigValidationService.getHealthStatus();
      console.log('\n🏥 Health Status:');
      console.log(`Status: ${health.status.toUpperCase()}`);
      
      if (health.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        health.warnings.forEach(warning => console.log(`  - ${warning}`));
      }
      
      if (health.issues.length > 0) {
        console.log('\n❌ Issues:');
        health.issues.forEach(issue => console.log(`  - ${issue}`));
      }
      
      return true;
    } else {
      console.log('❌ Environment validation failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Environment validation error:', error);
    return false;
  }
}

// Run validation
if (require.main === module) {
  const isValid = validateEnvironment();
  process.exit(isValid ? 0 : 1);
}

export { validateEnvironment };
