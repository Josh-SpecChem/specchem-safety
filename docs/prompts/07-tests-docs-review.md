# Gate 7: Tests & Docs Review

**Order**: 7 (Execute After Gate 6)  
**Purpose**: Verify that testing and documentation provide adequate guardrails for system stability  
**Why Last**: Without guardrails, fixes won't stick

## Context

This application uses:

- Vitest for unit testing
- Playwright for E2E testing
- Comprehensive test coverage across all layers
- Extensive documentation system
- CI/CD integration with testing

## Task

Verify that testing and documentation provide adequate guardrails for system stability.

## Focus Areas

1. **Test coverage and quality across all gates**
2. **CI/CD integration and automated testing**
3. **Documentation accuracy and completeness**
4. **Linting and code quality rules**
5. **Test maintenance and reliability**
6. **Documentation maintenance processes**

## Success Criteria

- Comprehensive smoke tests for Gates 1-5
- CI rules prevent legacy patterns
- Documentation matches implementation reality
- Test suite is reliable and maintainable
- Code quality rules are enforced
- Documentation is kept up-to-date

## Required Files to Review

### Testing System

- `tests/` - All test files
- `vitest.config.ts` - Vitest configuration
- `tests/setup.ts` - Test setup
- Test files for API, components, database, etc.

### Documentation

- `docs/` - All documentation files
- `README.md` - Main documentation
- Architecture and implementation docs

### CI/CD

- GitHub Actions or CI configuration
- Linting and formatting rules
- Build and deployment scripts

### Code Quality

- `eslint.config.mjs` - ESLint configuration
- Prettier configuration
- TypeScript configuration

## What to Verify

- Smoke tests for Gates 1–5 exist and run in CI
- Lint/CI rules forbid legacy imports/paths
- Docs (Schema Guide, RLS Playbook, Query Cookbook, ADRs) updated to match reality

## Expected Outcome

The system stays aligned; drift is caught early.

## Instructions

Please provide a detailed analysis with specific test examples and documentation quality recommendations. Focus on identifying gaps in test coverage, outdated documentation, and missing CI/CD guardrails that could allow regressions to slip through.
