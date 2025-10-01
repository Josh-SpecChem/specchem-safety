# Type Consolidation Strategy

**Date:** 2025-01-10  
**Purpose:** Documentation  
**Status:** Complete  
**Audience:** All  

# Type Consolidation Strategy

## Current State Analysis
- **Total Types:** 59 type definitions across multiple files
- **Duplicate Types:** 5 types defined in multiple locations
- **Generic Types:** 8 files with `any` and `Record<string, any>` usage
- **Scattered Locations:** Types in `src/types/`, component files, hook files

## Consolidation Plan

### 1. Core Database Types (`src/types/database.ts`)
- All database entity types (Profile, Course, Plant, etc.)
- CRUD operation types (Create, Update, Delete variants)
- Database relationship types

### 2. API Types (`src/types/api.ts`)
- Request/response types for all API endpoints
- Error handling types
- Pagination and filtering types

### 3. UI Component Types (`src/types/ui.ts`)
- Component prop types
- Form types
- Navigation types

### 4. Business Domain Types (`src/types/domain.ts`)
- LMS-specific types (modules, lessons, progress)
- Training-specific types (assessments, certificates)
- Navigator-specific types (roles, paths)

### 5. Utility Types (`src/types/utils.ts`)
- Generic utility types
- Common type helpers
- Type guards and validators

## Migration Priority
1. **High Priority:** Database and API types (used everywhere)
2. **Medium Priority:** Business domain types (LMS, training)
3. **Low Priority:** UI and utility types (component-specific)
