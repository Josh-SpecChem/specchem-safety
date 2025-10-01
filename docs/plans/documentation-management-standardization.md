# Documentation File Management Standardization Plan

**Date:** October 1, 2025  
**Issue:** #8 - Documentation File Management (Low Complexity)  
**Source:** `docs/scans/10-1-25-baseline.md`  
**Status:** Planning Phase  

## Problem Summary

The codebase currently has **scattered and inconsistent documentation management** that creates developer confusion and maintenance overhead:

### Current Issues Identified

1. **Outdated Status Files**
   - Several phase completion files may be outdated or redundant
   - Status files scattered across root directory and `docs/` folder
   - No clear versioning system for documentation updates

2. **Scattered Documentation**
   - Documentation spread across multiple locations (root, `docs/`, `docs/notes/`, `docs/prompts/`)
   - No clear organization strategy or navigation structure
   - Mixed purposes and audiences in same directories

3. **Temporary Files**
   - 17+ temporary documentation files in git status (deleted but not cleaned up)
   - Backup files and outdated guides cluttering the repository
   - No systematic cleanup process

4. **Version Control Issues**
   - No clear versioning system for documentation
   - No timestamps or last-updated information
   - No systematic process for keeping docs current

## Current State Analysis

### ✅ **Well-Organized Documentation**
**Directory:** `docs/plans/` (newly created)
- Clear purpose: Implementation plans for technical issues
- Consistent naming: `*-standardization.md` pattern
- Current and relevant: All plans created recently

**Directory:** `docs/scans/`
- Comprehensive baseline analysis
- Clear naming with dates
- Valuable reference material

### ❌ **Scattered Status Files**
**Root Directory:**
- `PHASE_1_COMPLETE.md` - Phase completion status
- `SUPABASE_AUTH_COMPLETION_GUIDE.md` - Implementation guide
- `ZOD_CONTRACTS_COMPLETE.md` - Completion status

**Mixed Locations:**
- Some status files in root, others in `docs/`
- No clear organization strategy
- Potential duplication and confusion

### ❌ **Temporary Files (Git Status)**
**Deleted Files (17+):**
- `DATABASE_STATUS_REPORT.md`
- `DEPLOYMENT_COMPLETE.md`
- `DEPLOYMENT_STRATEGY.md`
- `DRIZZLE_ZOD_VERIFICATION.md`
- `PRODUCTION_DEPLOYMENT_CHECKLIST.md`
- `PRODUCTION_UPDATE.md`
- `SUPABASE_AUTH_SETUP_GUIDE.md`
- `TESTING_INSTRUCTIONS.md`
- `VERCEL_DEPLOYMENT_GUIDE.md`
- `VERCEL_ENV_SETUP.md`
- `deployment-check.sh`
- `docs/API_INTEGRATION_COMPLETE.md`
- `docs/AUTH_ADMIN_CHECKLIST.md`
- `docs/PHASE2A_COMPLETE.md`
- `docs/PHASE4_COMPLETE.md`
- `docs/database-implementation-status.md`
- `docs/database-setup-guide.md`
- `docs/phase3-summary.md`

### ⚠️ **Mixed Documentation Types**
**Current Structure:**
```
docs/
├── plans/           # Implementation plans (good)
├── scans/           # Analysis documents (good)
├── notes/           # Mixed content
├── prompts/         # Feature specifications
├── DB_SCHEMA.md     # Technical reference
├── specchem_handbook.md  # Business documentation
└── supabase-auth-guide.md  # Technical guide
```

## Solution Strategy

### **Primary Goal**
Create a **centralized, well-organized documentation system** with:
- Clear directory structure and purpose
- Systematic cleanup of temporary files
- Version control and maintenance processes
- Single source of truth for each document type

### **Secondary Goals**
- Establish documentation standards and templates
- Create maintenance processes for keeping docs current
- Improve developer experience with better navigation
- Reduce maintenance overhead

## Implementation Plan

### **Phase 1: Documentation Audit and Organization Strategy (Week 1)**

#### **1.1 Create Documentation Audit Script**
**File:** `scripts/audit-documentation.js` (new)

```javascript
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
```

#### **1.2 Design Documentation Organization Strategy**
**File:** `docs/documentation-strategy.md` (new)

```markdown
# Documentation Organization Strategy

## Current State Analysis
- **Total Files:** 20+ markdown files across multiple locations
- **Temporary Files:** 17+ deleted files in git status
- **Status Files:** 6+ phase completion files
- **Mixed Purposes:** Technical, business, and implementation docs mixed

## Target Organization Structure

### 1. Core Documentation (`docs/`)
- **README.md** - Main project documentation
- **SETUP.md** - Development setup guide
- **DEPLOYMENT.md** - Production deployment guide
- **API.md** - API documentation
- **ARCHITECTURE.md** - System architecture overview

### 2. Implementation Plans (`docs/plans/`)
- **Purpose:** Technical implementation plans for specific issues
- **Naming:** `[issue-name]-[action].md` (e.g., `database-operations-standardization.md`)
- **Status:** Active planning documents

### 3. Analysis & Scans (`docs/scans/`)
- **Purpose:** Codebase analysis and baseline reports
- **Naming:** `[date]-[purpose].md` (e.g., `10-1-25-baseline.md`)
- **Status:** Historical reference documents

### 4. Business Documentation (`docs/business/`)
- **Purpose:** Company policies, handbooks, and business requirements
- **Files:** `specchem_handbook.md`, `design-language.md`
- **Status:** Company-specific documentation

### 5. Technical References (`docs/technical/`)
- **Purpose:** Technical specifications and guides
- **Files:** `DB_SCHEMA.md`, `supabase-auth-guide.md`
- **Status:** Technical reference materials

### 6. Archive (`docs/archive/`)
- **Purpose:** Completed phases and outdated documentation
- **Files:** Phase completion files, outdated guides
- **Status:** Historical reference only

## Migration Plan
1. **Audit:** Identify all documentation files and their purposes
2. **Categorize:** Group files by type and audience
3. **Reorganize:** Move files to appropriate directories
4. **Cleanup:** Remove temporary and duplicate files
5. **Standardize:** Apply consistent formatting and headers
6. **Document:** Create navigation and index files
```

#### **1.3 Create Documentation Standards**
**File:** `docs/documentation-standards.md` (new)

```markdown
# Documentation Standards

## File Naming Conventions
- **Implementation Plans:** `[issue-name]-[action].md`
- **Analysis Reports:** `[date]-[purpose].md`
- **Technical Guides:** `[system]-[topic]-guide.md`
- **Business Docs:** `[company]-[document-type].md`

## Required Headers
All documentation files must include:
```markdown
# Document Title

**Date:** YYYY-MM-DD  
**Purpose:** Brief description  
**Status:** Planning Phase | In Progress | Complete | Archived  
**Audience:** Developers | Business | Technical | All  
```

## Content Standards
- **Clear Structure:** Use consistent heading hierarchy
- **Actionable Content:** Include specific steps and examples
- **Current Information:** Include last updated dates
- **Cross-References:** Link to related documents
- **Code Examples:** Include working code snippets

## Maintenance Requirements
- **Quarterly Review:** Review all docs for currency
- **Version Control:** Track changes and updates
- **Archive Process:** Move outdated docs to archive
- **Index Updates:** Keep navigation current
```

### **Phase 2: Documentation Reorganization (Week 1)**

#### **2.1 Create New Directory Structure**
**Directories to Create:**
```bash
mkdir -p docs/business
mkdir -p docs/technical
mkdir -p docs/archive
mkdir -p docs/templates
```

#### **2.2 Reorganize Existing Documentation**

**Move Business Documentation:**
```bash
# Move company-specific documentation
mv docs/specchem_handbook.md docs/business/
mv docs/notes/prompts/specchem_design_language.md docs/business/design-language.md
mv docs/notes/ideas.md docs/business/feature-ideas.md
```

**Move Technical Documentation:**
```bash
# Move technical references
mv docs/DB_SCHEMA.md docs/technical/
mv docs/supabase-auth-guide.md docs/technical/
mv docs/SCHEMA_COMPLETION_SUMMARY.md docs/technical/
```

**Move Feature Specifications:**
```bash
# Move feature planning documents
mv docs/prompts/smart_job_role_navigator.md docs/business/smart-job-role-navigator.md
mv docs/prompts/phase2_dynamic_content.md docs/business/phase2-dynamic-content.md
mv docs/notes/schema-narrative.md docs/technical/schema-narrative.md
```

**Archive Completed Phases:**
```bash
# Move phase completion files to archive
mv PHASE_1_COMPLETE.md docs/archive/
mv SUPABASE_AUTH_COMPLETION_GUIDE.md docs/archive/
mv ZOD_CONTRACTS_COMPLETE.md docs/archive/
```

#### **2.3 Create Documentation Index**
**File:** `docs/README.md` (new)

```markdown
# SpecChem Safety Training Platform Documentation

## 📚 Documentation Overview

This directory contains all documentation for the SpecChem Safety Training Platform, organized by purpose and audience.

## 🗂️ Directory Structure

### Core Documentation
- **[README.md](./README.md)** - This file (documentation index)
- **[SETUP.md](./SETUP.md)** - Development environment setup
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[API.md](./API.md)** - API documentation and endpoints

### Implementation Plans (`plans/`)
Active technical implementation plans for resolving specific issues:
- [Database Operations Standardization](./plans/database-operations-standardization.md)
- [Custom Hook Patterns Standardization](./plans/custom-hook-patterns-standardization.md)
- [Configuration Duplication Resolution](./plans/configuration-duplication-resolution.md)
- [TypeScript Types Standardization](./plans/typescript-types-standardization.md)

### Analysis & Scans (`scans/`)
Codebase analysis and baseline reports:
- [10-1-25 Baseline Analysis](./scans/10-1-25-baseline.md)

### Business Documentation (`business/`)
Company policies, handbooks, and business requirements:
- [SpecChem Team Handbook](./business/specchem_handbook.md)
- [Design Language Guide](./business/design-language.md)
- [Feature Ideas](./business/feature-ideas.md)
- [Smart Job Role Navigator](./business/smart-job-role-navigator.md)
- [Phase 2 Dynamic Content](./business/phase2-dynamic-content.md)

### Technical References (`technical/`)
Technical specifications and implementation guides:
- [Database Schema Reference](./technical/DB_SCHEMA.md)
- [Supabase Authentication Guide](./technical/supabase-auth-guide.md)
- [Schema Completion Summary](./technical/SCHEMA_COMPLETION_SUMMARY.md)
- [Schema Narrative](./technical/schema-narrative.md)

### Archive (`archive/`)
Completed phases and historical documentation:
- [Phase 1 Complete](./archive/PHASE_1_COMPLETE.md)
- [Supabase Auth Completion Guide](./archive/SUPABASE_AUTH_COMPLETION_GUIDE.md)
- [Zod Contracts Complete](./archive/ZOD_CONTRACTS_COMPLETE.md)

## 🎯 Quick Navigation

### For Developers
- [Development Setup](./SETUP.md)
- [API Documentation](./API.md)
- [Database Schema](./technical/DB_SCHEMA.md)
- [Implementation Plans](./plans/)

### For Business Stakeholders
- [Company Handbook](./business/specchem_handbook.md)
- [Feature Specifications](./business/)
- [Design Guidelines](./business/design-language.md)

### For Technical Leads
- [Architecture Overview](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Technical References](./technical/)

## 📋 Documentation Standards

All documentation follows our [Documentation Standards](./documentation-standards.md):
- Consistent naming conventions
- Required headers with metadata
- Clear structure and actionable content
- Regular maintenance and updates

## 🔄 Maintenance

- **Last Updated:** 2025-01-10
- **Next Review:** 2025-04-10 (Quarterly)
- **Maintainer:** Development Team
- **Process:** See [Documentation Strategy](./documentation-strategy.md)

---

*This documentation is maintained as part of the SpecChem Safety Training Platform project.*
```

#### **2.4 Create Missing Core Documentation**
**File:** `docs/SETUP.md` (new)

```markdown
# Development Setup Guide

**Date:** 2025-01-10  
**Purpose:** Complete development environment setup  
**Status:** Complete  
**Audience:** Developers  

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Supabase account
- PostgreSQL (or use Supabase)

## Environment Setup

### 1. Clone Repository
```bash
git clone [repository-url]
cd specchem-safety
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in your values:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database Configuration
DATABASE_URL=your_database_url
```

### 4. Database Setup
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Verify setup
npm run db:verify
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Verification

Run the integration tests to verify everything is working:
```bash
npm run test:integrations
```

## Troubleshooting

See [Technical References](./technical/) for detailed guides on specific systems.
```

**File:** `docs/DEPLOYMENT.md` (new)

```markdown
# Production Deployment Guide

**Date:** 2025-01-10  
**Purpose:** Production deployment instructions  
**Status:** Complete  
**Audience:** DevOps, Technical Leads  

## Deployment Overview

The SpecChem Safety Training Platform is deployed on Vercel with Supabase as the backend.

## Prerequisites

- Vercel account
- Supabase project
- Domain name (optional)

## Deployment Steps

### 1. Vercel Configuration
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2. Environment Variables
Set these in Vercel dashboard:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
DATABASE_URL=your_production_database_url
```

### 3. Supabase Configuration
1. Update Site URL in Supabase Auth settings
2. Add production domain to allowed origins
3. Configure email templates for production

### 4. Database Migration
```bash
# Run production migrations
npm run db:migrate
```

### 5. Verification
1. Test authentication flows
2. Verify database connections
3. Check all API endpoints
4. Test admin functionality

## Monitoring

- Vercel Analytics for performance
- Supabase Dashboard for database metrics
- Application logs for error tracking

## Rollback Procedure

1. Revert to previous deployment in Vercel
2. Restore database backup if needed
3. Verify functionality

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Database RLS policies active
- [ ] Admin access properly configured
- [ ] Error handling in place
```

### **Phase 3: Cleanup and Standardization (Week 1)**

#### **3.1 Clean Up Temporary Files**
**File:** `scripts/cleanup-temporary-files.sh` (new)

```bash
#!/bin/bash

echo "🧹 Cleaning up temporary documentation files..."

# Remove temporary files from git status
echo "Removing temporary files from git status..."

# These files are already deleted but still in git status
# We'll clean up the git status by committing the deletions

echo "✅ Temporary files cleanup complete"
echo "Run 'git add -A && git commit -m \"Clean up temporary documentation files\"' to finalize"
```

#### **3.2 Standardize Documentation Headers**
**File:** `scripts/standardize-headers.js` (new)

```javascript
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
```

#### **3.3 Create Documentation Templates**
**File:** `docs/templates/implementation-plan-template.md` (new)

```markdown
# [Issue Name] [Action] Plan

**Date:** YYYY-MM-DD  
**Purpose:** Implementation plan for [specific issue]  
**Status:** Planning Phase  
**Audience:** Developers  

## Problem Summary

Brief description of the issue being addressed.

### Current Issues Identified
1. **Issue 1:** Description
2. **Issue 2:** Description
3. **Issue 3:** Description

## Current State Analysis

### ✅ **Well-Implemented**
Description of what's working well.

### ❌ **Problematic**
Description of what needs improvement.

## Solution Strategy

### **Primary Goal**
Main goal of the implementation.

### **Secondary Goals**
Additional goals and benefits.

## Implementation Plan

### **Phase 1: [Phase Name] (Week X)**
Description of phase 1.

### **Phase 2: [Phase Name] (Week X)**
Description of phase 2.

## Migration Checklist

### **Phase 1: [Phase Name]**
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### **Phase 2: [Phase Name]**
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Success Metrics

### **Technical Metrics**
- Metric 1
- Metric 2

### **Quality Metrics**
- Metric 1
- Metric 2

## Risk Mitigation

### **Potential Risks**
1. Risk 1
2. Risk 2

### **Mitigation Strategies**
1. Strategy 1
2. Strategy 2

## Timeline

- **Week 1:** Phase 1
- **Week 2:** Phase 2
- **Total Time:** X weeks

## Dependencies

- Dependency 1
- Dependency 2

## Next Steps

1. Step 1
2. Step 2
```

**File:** `docs/templates/technical-guide-template.md` (new)

```markdown
# [System] [Topic] Guide

**Date:** YYYY-MM-DD  
**Purpose:** Technical guide for [specific system/topic]  
**Status:** Complete  
**Audience:** Technical  

## Overview

Brief overview of the system or topic.

## Prerequisites

- Prerequisite 1
- Prerequisite 2

## Setup Instructions

### Step 1: [Step Name]
Description and commands.

### Step 2: [Step Name]
Description and commands.

## Configuration

### Configuration Option 1
Description and examples.

### Configuration Option 2
Description and examples.

## Usage Examples

### Example 1
```typescript
// Code example
```

### Example 2
```typescript
// Code example
```

## Troubleshooting

### Common Issues
1. **Issue:** Description
   **Solution:** Steps to resolve

2. **Issue:** Description
   **Solution:** Steps to resolve

## Best Practices

- Practice 1
- Practice 2

## References

- [Link 1](url)
- [Link 2](url)
```

### **Phase 4: Maintenance Process Setup (Week 1)**

#### **4.1 Create Documentation Maintenance Script**
**File:** `scripts/maintain-documentation.js` (new)

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Maintaining documentation...');

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
```

#### **4.2 Add Documentation Maintenance to Package.json**
**File:** `package.json` (add scripts)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint",
    "docs:audit": "node scripts/audit-documentation.js",
    "docs:standardize": "node scripts/standardize-headers.js",
    "docs:maintain": "node scripts/maintain-documentation.js",
    "docs:cleanup": "bash scripts/cleanup-temporary-files.sh",
    "db:seed": "node scripts/seed-database.js",
    "db:verify": "node scripts/verify-database.js",
    "db:migrate": "drizzle-kit push",
    "test:integrations": "node scripts/test-integrations.js"
  }
}
```

#### **4.3 Create Documentation Maintenance Schedule**
**File:** `docs/maintenance-schedule.md` (new)

```markdown
# Documentation Maintenance Schedule

**Date:** 2025-01-10  
**Purpose:** Documentation maintenance procedures and schedule  
**Status:** Complete  
**Audience:** Technical Leads  

## Maintenance Schedule

### Daily
- **Automated Checks:** Run `npm run docs:maintain` to check for issues
- **New Documentation:** Ensure new docs follow standards

### Weekly
- **Review New Docs:** Check all new documentation for compliance
- **Update Index:** Update navigation and cross-references

### Monthly
- **Content Review:** Review documentation for accuracy and currency
- **Link Checking:** Verify all internal and external links work

### Quarterly
- **Comprehensive Audit:** Run full documentation audit
- **Archive Outdated:** Move outdated docs to archive
- **Update Standards:** Review and update documentation standards

## Maintenance Tasks

### Automated Tasks
```bash
# Check documentation health
npm run docs:maintain

# Audit documentation structure
npm run docs:audit

# Standardize headers
npm run docs:standardize
```

### Manual Tasks
1. **Review Content:** Ensure accuracy and currency
2. **Update Cross-References:** Keep links current
3. **Archive Completed:** Move completed phases to archive
4. **Update Index:** Maintain navigation structure

## Quality Standards

### Content Standards
- **Accuracy:** All information must be current and correct
- **Clarity:** Clear, actionable instructions and explanations
- **Completeness:** All necessary information included
- **Consistency:** Follow established patterns and standards

### Format Standards
- **Headers:** All docs must have standardized headers
- **Structure:** Consistent heading hierarchy and organization
- **Links:** All internal links must work
- **Code:** All code examples must be tested and working

## Responsibilities

### Development Team
- Create documentation for new features
- Update technical documentation
- Follow documentation standards

### Technical Leads
- Review documentation quality
- Maintain documentation standards
- Oversee maintenance schedule

### Business Stakeholders
- Provide business requirements
- Review business documentation
- Approve content changes

## Tools and Resources

### Scripts
- `docs:audit` - Comprehensive documentation audit
- `docs:maintain` - Regular maintenance checks
- `docs:standardize` - Header standardization
- `docs:cleanup` - Temporary file cleanup

### Templates
- [Implementation Plan Template](./templates/implementation-plan-template.md)
- [Technical Guide Template](./templates/technical-guide-template.md)

### Standards
- [Documentation Standards](./documentation-standards.md)
- [Documentation Strategy](./documentation-strategy.md)
```

### **Phase 5: Final Cleanup and Verification (Week 1)**

#### **5.1 Execute Cleanup Scripts**
**Run cleanup commands:**
```bash
# Clean up temporary files
npm run docs:cleanup

# Standardize headers
npm run docs:standardize

# Audit documentation
npm run docs:audit

# Check maintenance status
npm run docs:maintain
```

#### **5.2 Update Root README**
**File:** `README.md` (update)

```markdown
# SpecChem Safety Training Platform

A comprehensive Learning Management System (LMS) for industrial chemical manufacturing safety training.

## 🚀 Quick Start

```bash
# Clone repository
git clone [repository-url]
cd specchem-safety

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your values

# Set up database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[Setup Guide](./docs/SETUP.md)** - Complete development setup
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment
- **[API Documentation](./docs/API.md)** - API endpoints and usage
- **[Architecture Overview](./docs/ARCHITECTURE.md)** - System architecture

### Implementation Plans
Active technical implementation plans:
- [Database Operations Standardization](./docs/plans/database-operations-standardization.md)
- [Custom Hook Patterns Standardization](./docs/plans/custom-hook-patterns-standardization.md)
- [Configuration Duplication Resolution](./docs/plans/configuration-duplication-resolution.md)
- [TypeScript Types Standardization](./docs/plans/typescript-types-standardization.md)

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run docs:audit   # Audit documentation
npm run docs:maintain # Check documentation health
```

### Database Operations
```bash
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:verify    # Verify database setup
```

## 🏗️ Architecture

- **Frontend:** Next.js 15 with React 19
- **Backend:** Supabase (PostgreSQL + Auth)
- **ORM:** Drizzle ORM
- **Validation:** Zod schemas
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## 📋 Features

- **Multi-tenant Architecture:** Plant-based tenant isolation
- **Role-based Access Control:** HR Admin, Dev Admin, Plant Manager, Employee
- **Learning Management:** Course enrollment, progress tracking, certifications
- **Analytics:** Comprehensive reporting and analytics
- **Multi-language Support:** English and Spanish

## 🔒 Security

- **Row-Level Security:** Database-level tenant isolation
- **Authentication:** Supabase Auth with JWT tokens
- **Authorization:** Multi-level role-based access control
- **Data Validation:** Runtime validation with Zod schemas

## 📞 Support

For technical support or questions:
- **Documentation:** See [`docs/`](./docs/) directory
- **Issues:** Create GitHub issues for bugs or feature requests
- **Development:** Follow implementation plans in [`docs/plans/`](./docs/plans/)

---

*Built for SpecChem - Industrial Chemical Manufacturing Safety Training*
```

## Migration Checklist

### **Phase 1: Documentation Audit and Organization Strategy**
- [ ] Create documentation audit script
- [ ] Design organization strategy
- [ ] Create documentation standards
- [ ] Create maintenance schedule

### **Phase 2: Documentation Reorganization**
- [ ] Create new directory structure
- [ ] Move business documentation to `docs/business/`
- [ ] Move technical documentation to `docs/technical/`
- [ ] Move phase completion files to `docs/archive/`
- [ ] Create documentation index (`docs/README.md`)
- [ ] Create missing core documentation (`SETUP.md`, `DEPLOYMENT.md`)

### **Phase 3: Cleanup and Standardization**
- [ ] Clean up temporary files from git status
- [ ] Standardize documentation headers
- [ ] Create documentation templates
- [ ] Apply consistent formatting

### **Phase 4: Maintenance Process Setup**
- [ ] Create documentation maintenance script
- [ ] Add maintenance scripts to package.json
- [ ] Create maintenance schedule and procedures
- [ ] Establish maintenance responsibilities

### **Phase 5: Final Cleanup and Verification**
- [ ] Execute all cleanup scripts
- [ ] Update root README with new structure
- [ ] Verify all documentation links work
- [ ] Test maintenance scripts

## Success Metrics

### **Technical Metrics**
- **File Organization:** 100% of docs in appropriate directories
- **Temporary Files:** 100% cleanup of temporary files
- **Header Standardization:** 100% of docs have standardized headers
- **Link Integrity:** 100% of internal links work

### **Quality Metrics**
- **Navigation:** Clear navigation structure with index
- **Consistency:** Consistent formatting and standards
- **Maintenance:** Automated maintenance processes
- **Documentation:** Complete core documentation

### **Business Metrics**
- **Developer Experience:** Easier to find and use documentation
- **Maintenance Efficiency:** Reduced overhead for doc maintenance
- **Onboarding:** Faster onboarding with clear setup guides
- **Knowledge Management:** Better organization of project knowledge

## Risk Mitigation

### **Potential Risks**
1. **Breaking Links:** Moving files might break existing links
2. **Lost Information:** Important information might be lost during reorganization
3. **Maintenance Overhead:** New processes might create additional overhead
4. **Team Adoption:** Team might not follow new documentation standards

### **Mitigation Strategies**
1. **Link Validation:** Automated checking for broken links
2. **Backup Strategy:** Keep backups before major reorganization
3. **Automated Processes:** Use scripts to reduce manual maintenance
4. **Clear Standards:** Provide templates and clear guidelines

## Timeline

- **Week 1:** Complete all phases (low complexity issue)
- **Total Time:** 1 week
- **Effort Level:** Low complexity
- **Priority:** Low (affects maintainability but not functionality)

## Dependencies

- **Git:** Must be available for cleanup operations
- **Node.js:** Required for maintenance scripts
- **File System:** Standard file operations

## Next Steps

1. **Review and approve this plan**
2. **Begin Phase 1 implementation**
3. **Execute cleanup scripts**
4. **Test maintenance processes**
5. **Establish regular maintenance schedule**

This plan will resolve Issue #8 by creating a centralized, well-organized documentation system with clear structure, automated maintenance processes, and systematic cleanup of temporary files, significantly improving developer experience and reducing maintenance overhead.
