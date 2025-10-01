#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Auditing TypeScript type definitions...');

// Find all TypeScript files
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

// Audit type definitions
const tsFiles = findTsFiles('./src');
const typeDefinitions = new Map();
const duplicateTypes = new Map();
const genericTypes = [];

tsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find interface definitions
  const interfaceMatches = content.match(/export\s+interface\s+(\w+)/g);
  if (interfaceMatches) {
    interfaceMatches.forEach(match => {
      const typeName = match.replace(/export\s+interface\s+/, '');
      if (typeDefinitions.has(typeName)) {
        if (!duplicateTypes.has(typeName)) {
          duplicateTypes.set(typeName, [typeDefinitions.get(typeName)]);
        }
        duplicateTypes.get(typeName).push(file);
      } else {
        typeDefinitions.set(typeName, file);
      }
    });
  }
  
  // Find generic type usage
  const anyMatches = content.match(/: any\b/g);
  if (anyMatches) {
    genericTypes.push({ file, count: anyMatches.length, type: 'any' });
  }
  
  const recordMatches = content.match(/Record<string, any>/g);
  if (recordMatches) {
    genericTypes.push({ file, count: recordMatches.length, type: 'Record<string, any>' });
  }
});

console.log('\n📊 Type Definition Audit Results:');
console.log(`Total unique types: ${typeDefinitions.size}`);
console.log(`Duplicate types: ${duplicateTypes.size}`);
console.log(`Files with generic types: ${genericTypes.length}`);

if (duplicateTypes.size > 0) {
  console.log('\n🔄 Duplicate Types Found:');
  duplicateTypes.forEach((files, typeName) => {
    console.log(`  ${typeName}:`);
    files.forEach(file => console.log(`    - ${file}`));
  });
}

if (genericTypes.length > 0) {
  console.log('\n⚠️  Generic Types Found:');
  genericTypes.forEach(({ file, count, type }) => {
    console.log(`  ${file}: ${count} instances of ${type}`);
  });
}

console.log('\n✅ Type audit complete');
