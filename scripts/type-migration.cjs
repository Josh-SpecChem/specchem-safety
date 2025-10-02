#!/usr/bin/env node

/**
 * Type Migration Utility
 * Automates the migration of scattered type definitions to centralized locations
 */

const fs = require('fs');
const path = require('path');

// Type mapping for migration
const TYPE_MIGRATIONS = {
  // Admin types
  'AdminUser': 'AdminUser',
  'AdminCourse': 'AdminCourse', 
  'AdminEnrollment': 'AdminEnrollment',
  'AdminModule': 'AdminModule',
  'AdminSection': 'AdminSection',
  'AdminStats': 'AdminStats',
  'AdminFilterOptions': 'AdminFilterOptions',
  'AdminTableColumn': 'AdminTableColumn',
  'AdminFormField': 'AdminFormField',
  'AdminFormData': 'AdminFormData',
  'AdminError': 'AdminError',
  'AdminApiResponse': 'AdminApiResponse',
  'AdminBulkAction': 'AdminBulkAction',
  
  // API route types
  'StandardApiResponse': 'StandardApiResponse',
  'PaginationParams': 'PaginationParams',
  'SearchParams': 'SearchParams',
  'UserFilters': 'UserFilters',
  'CourseFilters': 'CourseFilters',
  'EnrollmentFilters': 'EnrollmentFilters',
  'AnalyticsFilters': 'AnalyticsFilters',
  'RouteContext': 'RouteContext',
  'AuthContext': 'AuthContext',
  'CrudOperations': 'CrudOperations',
  'ListOperations': 'ListOperations',
  'AnalyticsOperations': 'AnalyticsOperations',
  'RouteHandler': 'RouteHandler',
  'AuthRouteHandler': 'AuthRouteHandler',
  'ValidationErrorDetails': 'ValidationErrorDetails',
  
  // Form hook types
  'FormConfig': 'FormConfig',
  'FormState': 'FormState',
  'FormActions': 'FormActions',
  
  // API hook types
  'BaseHookOptions': 'BaseHookOptions',
  'ApiHookOptions': 'ApiHookOptions',
  'MutationHookOptions': 'MutationHookOptions',
};

// Files to migrate
const MIGRATION_TARGETS = [
  'src/components/admin/shared/types/admin-types.ts',
  'src/app/api/shared/types/api-types.ts',
  'src/hooks/useUnifiedForm.ts',
  'src/hooks/useUnifiedApi.ts',
  'src/hooks/useStandardizedApi.ts',
];

// Import patterns to update
const IMPORT_PATTERNS = [
  {
    from: "from '@/components/admin/shared/types/admin-types'",
    to: "from '@/types'",
    types: ['AdminUser', 'AdminCourse', 'AdminEnrollment', 'AdminModule', 'AdminSection', 'AdminStats', 'AdminFilterOptions', 'AdminTableColumn', 'AdminFormField', 'AdminFormData', 'AdminError', 'AdminApiResponse', 'AdminBulkAction']
  },
  {
    from: "from '@/app/api/shared/types/api-types'",
    to: "from '@/types'",
    types: ['StandardApiResponse', 'PaginationParams', 'SearchParams', 'UserFilters', 'CourseFilters', 'EnrollmentFilters', 'AnalyticsFilters', 'RouteContext', 'AuthContext', 'CrudOperations', 'ListOperations', 'AnalyticsOperations', 'RouteHandler', 'AuthRouteHandler', 'ValidationErrorDetails']
  },
  {
    from: "from '@/hooks/useUnifiedForm'",
    to: "from '@/types'",
    types: ['FormConfig', 'FormState', 'FormActions']
  },
  {
    from: "from '@/hooks/useUnifiedApi'",
    to: "from '@/types'",
    types: ['BaseHookOptions', 'ApiHookOptions', 'MutationHookOptions']
  }
];

function findTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findTsFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const pattern of IMPORT_PATTERNS) {
    const regex = new RegExp(`import\\s*{[^}]*}\\s*${pattern.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      for (const match of matches) {
        // Extract imported types
        const typeMatch = match.match(/import\s*{([^}]*)}/);
        if (typeMatch) {
          const importedTypes = typeMatch[1].split(',').map(t => t.trim());
          const validTypes = importedTypes.filter(type => pattern.types.includes(type));
          
          if (validTypes.length > 0) {
            const newImport = `import type { ${validTypes.join(', ')} } ${pattern.to};`;
            content = content.replace(match, newImport);
            modified = true;
            console.log(`✅ Updated imports in ${filePath}: ${validTypes.join(', ')}`);
          }
        }
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

function migrateTypes() {
  console.log('🚀 Starting Type Migration...\n');
  
  // Step 1: Update imports across all TypeScript files
  console.log('📝 Step 1: Updating type imports...');
  const tsFiles = findTsFiles('./src');
  let updatedFiles = 0;
  
  for (const file of tsFiles) {
    if (updateImports(file)) {
      updatedFiles++;
    }
  }
  
  console.log(`\n✅ Updated imports in ${updatedFiles} files\n`);
  
  // Step 2: Remove migrated type files
  console.log('🗑️  Step 2: Removing migrated type files...');
  for (const target of MIGRATION_TARGETS) {
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
      console.log(`✅ Removed ${target}`);
    }
  }
  
  console.log('\n🎉 Type migration completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`- Updated imports in ${updatedFiles} files`);
  console.log(`- Removed ${MIGRATION_TARGETS.length} scattered type files`);
  console.log('- All types now centralized in src/types/');
}

function validateMigration() {
  console.log('🔍 Validating migration...\n');
  
  const tsFiles = findTsFiles('./src');
  let issues = 0;
  
  for (const file of tsFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for old import patterns
    for (const pattern of IMPORT_PATTERNS) {
      if (content.includes(pattern.from)) {
        console.log(`⚠️  Found old import in ${file}: ${pattern.from}`);
        issues++;
      }
    }
    
    // Check for scattered type definitions
    const interfaceMatches = content.match(/export\s+interface\s+(\w+)/g);
    if (interfaceMatches && !file.includes('src/types/')) {
      const typeNames = interfaceMatches.map(match => match.replace(/export\s+interface\s+/, ''));
      const migratedTypes = typeNames.filter(name => TYPE_MIGRATIONS[name]);
      
      if (migratedTypes.length > 0) {
        console.log(`⚠️  Found migrated interfaces in ${file}: ${migratedTypes.join(', ')}`);
        issues++;
      }
    }
  }
  
  if (issues === 0) {
    console.log('✅ Migration validation passed - no issues found!');
  } else {
    console.log(`⚠️  Found ${issues} issues that need manual attention`);
  }
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'migrate':
      migrateTypes();
      break;
    case 'validate':
      validateMigration();
      break;
    case 'help':
      console.log('Type Migration Utility');
      console.log('Usage: node type-migration.js [command]');
      console.log('');
      console.log('Commands:');
      console.log('  migrate  - Perform the type migration');
      console.log('  validate - Validate the migration results');
      console.log('  help     - Show this help message');
      break;
    default:
      console.log('Usage: node type-migration.js [migrate|validate|help]');
      process.exit(1);
  }
}

module.exports = {
  migrateTypes,
  validateMigration,
  TYPE_MIGRATIONS,
  IMPORT_PATTERNS
};
