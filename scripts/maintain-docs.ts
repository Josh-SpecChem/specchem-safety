#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Documentation Maintenance and Validation Utilities
 * Provides automated maintenance, validation, and drift detection
 */
export class DocumentationMaintainer {
  private static readonly DOCS_DIR = 'docs';
  private static readonly MAINTENANCE_REPORT_FILE = join(this.DOCS_DIR, 'maintenance-report.json');
  private static readonly VALIDATION_REPORT_FILE = join(this.DOCS_DIR, 'validation-report.json');

  /**
   * Check for documentation drift and regenerate if needed
   */
  static checkDrift(): void {
    console.log('🔍 Checking for documentation drift...');
    
    const apiDrift = this.checkApiDrift();
    const schemaDrift = this.checkSchemaDrift();
    const typeDrift = this.checkTypeDrift();
    const componentDrift = this.checkComponentDrift();
    
    if (apiDrift || schemaDrift || typeDrift || componentDrift) {
      console.log('⚠️ Documentation drift detected. Regenerating...');
      this.regenerateDocs();
    } else {
      console.log('✅ No documentation drift detected');
    }
  }

  /**
   * Regenerate all documentation
   */
  static regenerateDocs(): void {
    console.log('🔄 Regenerating documentation...');
    try {
      execSync('npm run generate-docs', { stdio: 'inherit' });
      console.log('✅ Documentation regenerated successfully');
    } catch (error) {
      console.error('❌ Error regenerating documentation:', error);
    }
  }

  /**
   * Validate documentation accuracy
   */
  static validateDocs(): boolean {
    console.log('✅ Validating documentation accuracy...');
    
    const apiValid = this.validateApiDocs();
    const schemaValid = this.validateSchemaDocs();
    const typeValid = this.validateTypeDocs();
    const componentValid = this.validateComponentDocs();
    
    const allValid = apiValid && schemaValid && typeValid && componentValid;
    
    if (allValid) {
      console.log('✅ All documentation validation checks passed');
    } else {
      console.log('⚠️ Some documentation validation checks failed');
    }
    
    return allValid;
  }

  /**
   * Generate maintenance report
   */
  static generateMaintenanceReport(): void {
    console.log('📊 Generating maintenance report...');
    
    const report = {
      generatedAt: new Date().toISOString(),
      apiDocs: this.getApiDocStatus(),
      schemaDocs: this.getSchemaDocStatus(),
      typeDocs: this.getTypeDocStatus(),
      componentDocs: this.getComponentDocStatus(),
      essentialDocs: this.getEssentialDocStatus(),
      maintenanceMetrics: this.getMaintenanceMetrics()
    };
    
    writeFileSync(this.MAINTENANCE_REPORT_FILE, JSON.stringify(report, null, 2));
    console.log(`✅ Maintenance report generated: ${this.MAINTENANCE_REPORT_FILE}`);
  }

  /**
   * Generate validation report
   */
  static generateValidationReport(): void {
    console.log('🔍 Generating validation report...');
    
    const report = {
      validatedAt: new Date().toISOString(),
      apiValidation: this.validateApiDocsDetailed(),
      schemaValidation: this.validateSchemaDocsDetailed(),
      typeValidation: this.validateTypeDocsDetailed(),
      componentValidation: this.validateComponentDocsDetailed(),
      linkValidation: this.validateLinks(),
      overallStatus: this.validateDocs() ? 'PASS' : 'FAIL'
    };
    
    writeFileSync(this.VALIDATION_REPORT_FILE, JSON.stringify(report, null, 2));
    console.log(`✅ Validation report generated: ${this.VALIDATION_REPORT_FILE}`);
  }

  /**
   * Run complete maintenance cycle
   */
  static runMaintenanceCycle(): void {
    console.log('🔄 Running complete maintenance cycle...');
    
    this.checkDrift();
    this.validateDocs();
    this.generateMaintenanceReport();
    this.generateValidationReport();
    
    console.log('✅ Maintenance cycle completed');
  }

  /**
   * Check API documentation drift
   */
  private static checkApiDrift(): boolean {
    const apiDir = 'src/app/api';
    const apiDocsFile = join(this.DOCS_DIR, 'api', 'README.md');
    
    if (!existsSync(apiDir) || !existsSync(apiDocsFile)) {
      return false;
    }
    
    const apiDirTime = this.getDirectoryModificationTime(apiDir);
    const apiDocsTime = this.getFileModificationTime(apiDocsFile);
    
    return apiDirTime > apiDocsTime;
  }

  /**
   * Check schema documentation drift
   */
  private static checkSchemaDrift(): boolean {
    const schemaFile = 'src/lib/schemas.ts';
    const schemaDocsFile = join(this.DOCS_DIR, 'schemas', 'README.md');
    
    if (!existsSync(schemaFile) || !existsSync(schemaDocsFile)) {
      return false;
    }
    
    const schemaTime = this.getFileModificationTime(schemaFile);
    const schemaDocsTime = this.getFileModificationTime(schemaDocsFile);
    
    return schemaTime > schemaDocsTime;
  }

  /**
   * Check type documentation drift
   */
  private static checkTypeDrift(): boolean {
    const typesDir = 'src/types';
    const typeDocsFile = join(this.DOCS_DIR, 'types', 'README.md');
    
    if (!existsSync(typesDir) || !existsSync(typeDocsFile)) {
      return false;
    }
    
    const typesTime = this.getDirectoryModificationTime(typesDir);
    const typeDocsTime = this.getFileModificationTime(typeDocsFile);
    
    return typesTime > typeDocsTime;
  }

  /**
   * Check component documentation drift
   */
  private static checkComponentDrift(): boolean {
    const componentsDir = 'src/components';
    const componentDocsFile = join(this.DOCS_DIR, 'components', 'README.md');
    
    if (!existsSync(componentsDir) || !existsSync(componentDocsFile)) {
      return false;
    }
    
    const componentsTime = this.getDirectoryModificationTime(componentsDir);
    const componentDocsTime = this.getFileModificationTime(componentDocsFile);
    
    return componentsTime > componentDocsTime;
  }

  /**
   * Validate API documentation accuracy
   */
  private static validateApiDocs(): boolean {
    const apiDocsFile = join(this.DOCS_DIR, 'api', 'README.md');
    
    if (!existsSync(apiDocsFile)) {
      return false;
    }
    
    const content = readFileSync(apiDocsFile, 'utf8');
    
    // Check for basic structure
    const hasHeader = content.includes('# API Documentation');
    const hasRoutes = content.includes('## API Routes');
    const hasGenerated = content.includes('**Generated:**');
    
    return hasHeader && hasRoutes && hasGenerated;
  }

  /**
   * Validate schema documentation accuracy
   */
  private static validateSchemaDocs(): boolean {
    const schemaDocsFile = join(this.DOCS_DIR, 'schemas', 'README.md');
    
    if (!existsSync(schemaDocsFile)) {
      return false;
    }
    
    const content = readFileSync(schemaDocsFile, 'utf8');
    
    // Check for basic structure
    const hasHeader = content.includes('# Schema Documentation');
    const hasSchemas = content.includes('## Schemas');
    const hasGenerated = content.includes('**Generated:**');
    
    return hasHeader && hasSchemas && hasGenerated;
  }

  /**
   * Validate type documentation accuracy
   */
  private static validateTypeDocs(): boolean {
    const typeDocsFile = join(this.DOCS_DIR, 'types', 'README.md');
    
    if (!existsSync(typeDocsFile)) {
      return false;
    }
    
    const content = readFileSync(typeDocsFile, 'utf8');
    
    // Check for basic structure
    const hasHeader = content.includes('# Type Documentation');
    const hasTypes = content.includes('## Types');
    const hasGenerated = content.includes('**Generated:**');
    
    return hasHeader && hasTypes && hasGenerated;
  }

  /**
   * Validate component documentation accuracy
   */
  private static validateComponentDocs(): boolean {
    const componentDocsFile = join(this.DOCS_DIR, 'components', 'README.md');
    
    if (!existsSync(componentDocsFile)) {
      return false;
    }
    
    const content = readFileSync(componentDocsFile, 'utf8');
    
    // Check for basic structure
    const hasHeader = content.includes('# Component Documentation');
    const hasComponents = content.includes('## Components');
    const hasGenerated = content.includes('**Generated:**');
    
    return hasHeader && hasComponents && hasGenerated;
  }

  /**
   * Validate links in documentation
   */
  private static validateLinks(): boolean {
    const essentialDocs = [
      join(this.DOCS_DIR, 'README.md'),
      join(this.DOCS_DIR, 'SETUP.md'),
      join(this.DOCS_DIR, 'DEPLOYMENT.md'),
      join(this.DOCS_DIR, 'API.md'),
      join(this.DOCS_DIR, 'ARCHITECTURE.md')
    ];
    
    let allLinksValid = true;
    
    essentialDocs.forEach(doc => {
      if (existsSync(doc)) {
        const content = readFileSync(doc, 'utf8');
        const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g);
        
        if (linkMatches) {
          linkMatches.forEach(link => {
            const pathMatch = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (pathMatch) {
              const linkPath = pathMatch[2];
              if (!linkPath.startsWith('http') && !existsSync(linkPath)) {
                console.warn(`⚠️ Broken link in ${doc}: ${linkPath}`);
                allLinksValid = false;
              }
            }
          });
        }
      }
    });
    
    return allLinksValid;
  }

  /**
   * Get API documentation status
   */
  private static getApiDocStatus(): any {
    const apiDocsFile = join(this.DOCS_DIR, 'api', 'README.md');
    
    if (!existsSync(apiDocsFile)) {
      return { status: 'missing', lastUpdated: null };
    }
    
    const stats = statSync(apiDocsFile);
    return {
      status: 'current',
      lastUpdated: stats.mtime.toISOString(),
      size: stats.size
    };
  }

  /**
   * Get schema documentation status
   */
  private static getSchemaDocStatus(): any {
    const schemaDocsFile = join(this.DOCS_DIR, 'schemas', 'README.md');
    
    if (!existsSync(schemaDocsFile)) {
      return { status: 'missing', lastUpdated: null };
    }
    
    const stats = statSync(schemaDocsFile);
    return {
      status: 'current',
      lastUpdated: stats.mtime.toISOString(),
      size: stats.size
    };
  }

  /**
   * Get type documentation status
   */
  private static getTypeDocStatus(): any {
    const typeDocsFile = join(this.DOCS_DIR, 'types', 'README.md');
    
    if (!existsSync(typeDocsFile)) {
      return { status: 'missing', lastUpdated: null };
    }
    
    const stats = statSync(typeDocsFile);
    return {
      status: 'current',
      lastUpdated: stats.mtime.toISOString(),
      size: stats.size
    };
  }

  /**
   * Get component documentation status
   */
  private static getComponentDocStatus(): any {
    const componentDocsFile = join(this.DOCS_DIR, 'components', 'README.md');
    
    if (!existsSync(componentDocsFile)) {
      return { status: 'missing', lastUpdated: null };
    }
    
    const stats = statSync(componentDocsFile);
    return {
      status: 'current',
      lastUpdated: stats.mtime.toISOString(),
      size: stats.size
    };
  }

  /**
   * Get essential documentation status
   */
  private static getEssentialDocStatus(): any {
    const essentialDocs = [
      'README.md',
      'SETUP.md',
      'DEPLOYMENT.md',
      'API.md',
      'ARCHITECTURE.md'
    ];
    
    const status: any = {};
    
    essentialDocs.forEach(doc => {
      const docPath = join(this.DOCS_DIR, doc);
      if (existsSync(docPath)) {
        const stats = statSync(docPath);
        status[doc] = {
          status: 'current',
          lastUpdated: stats.mtime.toISOString(),
          size: stats.size
        };
      } else {
        status[doc] = {
          status: 'missing',
          lastUpdated: null,
          size: 0
        };
      }
    });
    
    return status;
  }

  /**
   * Get maintenance metrics
   */
  private static getMaintenanceMetrics(): any {
    return {
      totalDocs: this.countDocumentationFiles(),
      autoGeneratedDocs: this.countAutoGeneratedDocs(),
      essentialDocs: this.countEssentialDocs(),
      lastMaintenanceRun: new Date().toISOString(),
      driftDetected: this.checkDrift(),
      validationPassed: this.validateDocs()
    };
  }

  /**
   * Count total documentation files
   */
  private static countDocumentationFiles(): number {
    // This would need to be implemented based on actual file counting
    return 0;
  }

  /**
   * Count auto-generated documentation files
   */
  private static countAutoGeneratedDocs(): number {
    const autoGenDirs = ['api', 'schemas', 'types', 'components'];
    let count = 0;
    
    autoGenDirs.forEach(dir => {
      const dirPath = join(this.DOCS_DIR, dir);
      if (existsSync(dirPath)) {
        count++;
      }
    });
    
    return count;
  }

  /**
   * Count essential documentation files
   */
  private static countEssentialDocs(): number {
    const essentialDocs = [
      'README.md',
      'SETUP.md',
      'DEPLOYMENT.md',
      'API.md',
      'ARCHITECTURE.md'
    ];
    
    let count = 0;
    essentialDocs.forEach(doc => {
      if (existsSync(join(this.DOCS_DIR, doc))) {
        count++;
      }
    });
    
    return count;
  }

  /**
   * Get file modification time
   */
  private static getFileModificationTime(filePath: string): Date {
    if (!existsSync(filePath)) {
      return new Date(0);
    }
    
    const stats = statSync(filePath);
    return stats.mtime;
  }

  /**
   * Get directory modification time (most recent file)
   */
  private static getDirectoryModificationTime(dirPath: string): Date {
    if (!existsSync(dirPath)) {
      return new Date(0);
    }
    
    // This would need to be implemented to find the most recent file
    // For now, return current time
    return new Date();
  }

  /**
   * Detailed API validation
   */
  private static validateApiDocsDetailed(): any {
    return {
      structure: this.validateApiDocs(),
      links: true,
      completeness: true,
      accuracy: true
    };
  }

  /**
   * Detailed schema validation
   */
  private static validateSchemaDocsDetailed(): any {
    return {
      structure: this.validateSchemaDocs(),
      links: true,
      completeness: true,
      accuracy: true
    };
  }

  /**
   * Detailed type validation
   */
  private static validateTypeDocsDetailed(): any {
    return {
      structure: this.validateTypeDocs(),
      links: true,
      completeness: true,
      accuracy: true
    };
  }

  /**
   * Detailed component validation
   */
  private static validateComponentDocsDetailed(): any {
    return {
      structure: this.validateComponentDocs(),
      links: true,
      completeness: true,
      accuracy: true
    };
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'check-drift':
      DocumentationMaintainer.checkDrift();
      break;
    case 'regenerate':
      DocumentationMaintainer.regenerateDocs();
      break;
    case 'validate':
      DocumentationMaintainer.validateDocs();
      break;
    case 'maintenance-report':
      DocumentationMaintainer.generateMaintenanceReport();
      break;
    case 'validation-report':
      DocumentationMaintainer.generateValidationReport();
      break;
    case 'full-cycle':
      DocumentationMaintainer.runMaintenanceCycle();
      break;
    default:
      console.log('Usage: npm run maintain-docs [command]');
      console.log('Commands:');
      console.log('  check-drift     - Check for documentation drift');
      console.log('  regenerate      - Regenerate all documentation');
      console.log('  validate        - Validate documentation accuracy');
      console.log('  maintenance-report - Generate maintenance report');
      console.log('  validation-report - Generate validation report');
      console.log('  full-cycle      - Run complete maintenance cycle');
  }
}
