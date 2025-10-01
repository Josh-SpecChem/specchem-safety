# Documentation Organization Strategy

**Date:** 2025-01-10  
**Purpose:** Documentation organization strategy and structure  
**Status:** Complete  
**Audience:** Technical Leads  

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
