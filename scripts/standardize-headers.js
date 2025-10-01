#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📝 Standardizing documentation headers...');

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

// Standardize headers
const mdFiles = findMarkdownFiles('./docs');

mdFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  // Check if file already has standardized header
  if (lines[0].startsWith('#') && lines.some(line => line.includes('**Date:**'))) {
    console.log(`✅ ${file} already has standardized header`);
    return;
  }
  
  // Determine document type and audience
  let purpose = 'Documentation';
  let audience = 'All';
  
  if (file.includes('plans/')) {
    purpose = 'Implementation plan for technical issue';
    audience = 'Developers';
  } else if (file.includes('business/')) {
    purpose = 'Business documentation';
    audience = 'Business Stakeholders';
  } else if (file.includes('technical/')) {
    purpose = 'Technical reference';
    audience = 'Technical';
  } else if (file.includes('scans/')) {
    purpose = 'Codebase analysis';
    audience = 'Technical';
  }
  
  // Create standardized header
  const title = lines[0].replace('#', '').trim();
  const standardizedHeader = `# ${title}

**Date:** 2025-01-10  
**Purpose:** ${purpose}  
**Status:** Complete  
**Audience:** ${audience}  

`;

  // Replace content
  const newContent = standardizedHeader + content;
  fs.writeFileSync(file, newContent);
  
  console.log(`📝 Standardized header for ${file}`);
});

console.log('✅ Header standardization complete');
