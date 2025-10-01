#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Auditing documentation files...');

// Find all markdown files
function findMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Audit documentation files
const mdFiles = findMarkdownFiles('./');
const documentation = {
  root: [],
  docs: [],
  plans: [],
  scans: [],
  notes: [],
  prompts: [],
  other: []
};

mdFiles.forEach(file => {
  const relativePath = file.replace('./', '');
  
  if (relativePath.startsWith('docs/plans/')) {
    documentation.plans.push(relativePath);
  } else if (relativePath.startsWith('docs/scans/')) {
    documentation.scans.push(relativePath);
  } else if (relativePath.startsWith('docs/notes/')) {
    documentation.notes.push(relativePath);
  } else if (relativePath.startsWith('docs/prompts/')) {
    documentation.prompts.push(relativePath);
  } else if (relativePath.startsWith('docs/')) {
    documentation.docs.push(relativePath);
  } else if (relativePath.includes('/')) {
    documentation.other.push(relativePath);
  } else {
    documentation.root.push(relativePath);
  }
});

console.log('\n📊 Documentation Audit Results:');
console.log(`Total markdown files: ${mdFiles.length}`);
console.log(`Root directory: ${documentation.root.length} files`);
console.log(`docs/ directory: ${documentation.docs.length} files`);
console.log(`docs/plans/: ${documentation.plans.length} files`);
console.log(`docs/scans/: ${documentation.scans.length} files`);
console.log(`docs/notes/: ${documentation.notes.length} files`);
console.log(`docs/prompts/: ${documentation.prompts.length} files`);
console.log(`Other locations: ${documentation.other.length} files`);

// Check for potential duplicates or outdated files
const statusFiles = mdFiles.filter(file => 
  file.includes('COMPLETE') || 
  file.includes('STATUS') || 
  file.includes('PHASE') ||
  file.includes('DEPLOYMENT')
);

if (statusFiles.length > 0) {
  console.log('\n📋 Status/Phase Files Found:');
  statusFiles.forEach(file => {
    const stats = fs.statSync(file);
    const lastModified = stats.mtime.toISOString().split('T')[0];
    console.log(`  ${file} (last modified: ${lastModified})`);
  });
}

// Check for files without proper headers
const filesWithoutHeaders = [];
mdFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.startsWith('#') && !content.startsWith('---')) {
    filesWithoutHeaders.push(file);
  }
});

if (filesWithoutHeaders.length > 0) {
  console.log('\n⚠️  Files without proper headers:');
  filesWithoutHeaders.forEach(file => console.log(`  ${file}`));
}

console.log('\n✅ Documentation audit complete');
