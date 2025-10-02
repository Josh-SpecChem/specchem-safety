# SpecChem Safety Training Platform Documentation

**Date:** 2025-01-10  
**Purpose:** Main documentation index and navigation  
**Status:** Complete  
**Audience:** All

## 📚 Documentation Overview

This directory contains all documentation for the SpecChem Safety Training Platform, organized by purpose and audience.

## 🗂️ Directory Structure

### Core Documentation

- **[README.md](./README.md)** - This file (documentation index)
- **[SETUP.md](./SETUP.md)** - Development environment setup
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[API.md](./API.md)** - API documentation and endpoints
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture overview

### Implementation Plans (`plans/`)

Active technical implementation plans for resolving specific issues:

- [Documentation Maintenance Optimization](./plans/10-documentation-maintenance-optimization.md)

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

### Contract System Documentation

Type-safe data contracts and validation system:

- **[Contract Workflow Implementation](./contracts-workflow-implementation.md)** - Complete implementation guide
- **[Contract Workflow Guide](./contracts-workflow.md)** - Original workflow specification
- **[Types Guide](./types-guide.md)** - Type system documentation

### Archive (`archive/`)

Completed phases and historical documentation:

- **[Implementation History](./IMPLEMENTATION-HISTORY.md)** - Consolidated implementation summaries
- **[Migration History](./MIGRATION-HISTORY.md)** - Consolidated migration guides
- **[Archive Directory](./archive/)** - Historical documentation files

### Auto-Generated Documentation

- **[API Documentation](./api/README.md)** - Auto-generated API documentation
- **[Schema Documentation](./schemas/README.md)** - Auto-generated schema documentation
- **[Type Documentation](./types/README.md)** - Auto-generated type documentation
- **[Component Documentation](./components/README.md)** - Auto-generated component documentation

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
- **Next Review:** 2025-02-10 (Monthly)
- **Maintainer:** Development Team
- **Process:** See [Essential Documentation Framework](./ESSENTIAL-DOCUMENTATION-FRAMEWORK.md)

### Maintenance Commands

```bash
# Generate all documentation
npm run generate-docs

# Check for documentation drift
npm run maintain-docs check-drift

# Validate documentation accuracy
npm run validate-docs

# Run review cycle
npm run review-docs review
```

---

_This documentation is maintained as part of the SpecChem Safety Training Platform project._
