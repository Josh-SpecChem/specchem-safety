#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Maintaining documentation...');

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

// Check for outdated documentation
function checkOutdatedDocs() {
  const mdFiles = findMarkdownFiles('./docs');
  const outdatedFiles = [];
  
  mdFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    // Look for date in header
    const dateLine = lines.find(line => line.includes('**Date:**'));
    if (dateLine) {
      const dateMatch = dateLine.match(/\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        const docDate = new Date(dateMatch[1]);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        if (docDate < sixMonthsAgo) {
          outdatedFiles.push({
            file,
            date: dateMatch[1],
            daysOld: Math.floor((new Date() - docDate) / (1000 * 60 * 60 * 24))
          });
        }
      }
    }
  });
  
  return outdatedFiles;
}

// Check for missing documentation
function checkMissingDocs() {
  const requiredDocs = [
    'docs/README.md',
    'docs/SETUP.md',
    'docs/DEPLOYMENT.md',
    'docs/API.md',
    'docs/ARCHITECTURE.md'
  ];
  
  const missingDocs = requiredDocs.filter(doc => !fs.existsSync(doc));
  return missingDocs;
}

// Check for broken links
function checkBrokenLinks() {
  const mdFiles = findMarkdownFiles('./docs');
  const brokenLinks = [];
  
  mdFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g);
    
    if (linkMatches) {
      linkMatches.forEach(link => {
        const urlMatch = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (urlMatch) {
          const url = urlMatch[2];
          
          // Check if it's a relative link to another markdown file
          if (url.endsWith('.md') && !url.startsWith('http')) {
            const targetPath = path.resolve(path.dirname(file), url);
            if (!fs.existsSync(targetPath)) {
              brokenLinks.push({
                file,
                link: url,
                text: urlMatch[1]
              });
            }
          }
        }
      });
    }
  });
  
  return brokenLinks;
}

// Run maintenance checks
const outdatedDocs = checkOutdatedDocs();
const missingDocs = checkMissingDocs();
const brokenLinks = checkBrokenLinks();

console.log('\n📊 Documentation Maintenance Report:');
console.log(`Outdated documents (>6 months): ${outdatedDocs.length}`);
console.log(`Missing required documents: ${missingDocs.length}`);
console.log(`Broken internal links: ${brokenLinks.length}`);

if (outdatedDocs.length > 0) {
  console.log('\n📅 Outdated Documents:');
  outdatedDocs.forEach(({ file, date, daysOld }) => {
    console.log(`  ${file} (${date}, ${daysOld} days old)`);
  });
}

if (missingDocs.length > 0) {
  console.log('\n❌ Missing Required Documents:');
  missingDocs.forEach(doc => console.log(`  ${doc}`));
}

if (brokenLinks.length > 0) {
  console.log('\n🔗 Broken Links:');
  brokenLinks.forEach(({ file, link, text }) => {
    console.log(`  ${file}: [${text}](${link})`);
  });
}

if (outdatedDocs.length === 0 && missingDocs.length === 0 && brokenLinks.length === 0) {
  console.log('\n✅ All documentation is up to date');
} else {
  console.log('\n⚠️  Documentation maintenance needed');
}
