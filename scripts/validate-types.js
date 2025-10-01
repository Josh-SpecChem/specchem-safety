#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating TypeScript type definitions...');

// Check for remaining generic types
function findGenericTypes(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findGenericTypes(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove comments from content to avoid false positives
      const contentWithoutComments = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Check for generic types
      const anyMatches = contentWithoutComments.match(/: any\b/g);
      const recordMatches = contentWithoutComments.match(/Record<string, any>/g);
      
      if (anyMatches || recordMatches) {
        files.push({
          file: fullPath,
          any: anyMatches?.length || 0,
          record: recordMatches?.length || 0,
        });
      }
    }
  }
  
  return files;
}

// Check for duplicate type definitions
function findDuplicateTypes(dir) {
  const typeMap = new Map();
  const duplicates = [];
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      duplicates.push(...findDuplicateTypes(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const interfaceMatches = content.match(/export\s+interface\s+(\w+)/g);
      if (interfaceMatches) {
        interfaceMatches.forEach(match => {
          const typeName = match.replace(/export\s+interface\s+/, '');
          if (typeMap.has(typeName)) {
            duplicates.push({
              type: typeName,
              files: [typeMap.get(typeName), fullPath],
            });
          } else {
            typeMap.set(typeName, fullPath);
          }
        });
      }
    }
  }
  
  return duplicates;
}

const genericTypes = findGenericTypes('./src');
const duplicateTypes = findDuplicateTypes('./src');

console.log('\n📊 Type Validation Results:');
console.log(`Files with generic types: ${genericTypes.length}`);
console.log(`Duplicate type definitions: ${duplicateTypes.length}`);

if (genericTypes.length > 0) {
  console.log('\n⚠️  Generic Types Found:');
  genericTypes.forEach(({ file, any, record }) => {
    console.log(`  ${file}:`);
    if (any > 0) console.log(`    - ${any} instances of 'any'`);
    if (record > 0) console.log(`    - ${record} instances of 'Record<string, any>'`);
  });
}

if (duplicateTypes.length > 0) {
  console.log('\n🔄 Duplicate Types Found:');
  duplicateTypes.forEach(({ type, files }) => {
    console.log(`  ${type}:`);
    files.forEach(file => console.log(`    - ${file}`));
  });
}

if (genericTypes.length === 0 && duplicateTypes.length === 0) {
  console.log('\n✅ All type definitions are properly consolidated');
} else {
  console.log('\n❌ Type validation failed - please address remaining issues');
  process.exit(1);
}
