#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating configuration files...');

// Check for duplicate files
const duplicateFiles = [
  'next.config.js',
  'tailwind.config.js', 
  'vercel.json.backup'
];

let hasDuplicates = false;

duplicateFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`❌ Found duplicate file: ${file}`);
    hasDuplicates = true;
  }
});

// Check for required files
const requiredFiles = [
  'next.config.ts',
  'tailwind.config.ts',
  'vercel.json'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ Found required file: ${file}`);
  } else {
    console.log(`❌ Missing required file: ${file}`);
    hasDuplicates = true;
  }
});

// Validate TypeScript configs by checking file syntax
try {
  const nextConfigContent = fs.readFileSync('./next.config.ts', 'utf8');
  if (nextConfigContent.includes('NextConfig') && nextConfigContent.includes('export default')) {
    console.log('✅ next.config.ts syntax appears valid');
  } else {
    console.log('❌ next.config.ts syntax appears invalid');
    hasDuplicates = true;
  }
} catch (error) {
  console.log('❌ next.config.ts has errors:', error.message);
  hasDuplicates = true;
}

try {
  const tailwindConfigContent = fs.readFileSync('./tailwind.config.ts', 'utf8');
  if (tailwindConfigContent.includes('Config') && tailwindConfigContent.includes('export default')) {
    console.log('✅ tailwind.config.ts syntax appears valid');
  } else {
    console.log('❌ tailwind.config.ts syntax appears invalid');
    hasDuplicates = true;
  }
} catch (error) {
  console.log('❌ tailwind.config.ts has errors:', error.message);
  hasDuplicates = true;
}

if (hasDuplicates) {
  console.log('\n❌ Configuration validation failed');
  process.exit(1);
} else {
  console.log('\n✅ All configuration files are valid');
  process.exit(0);
}
