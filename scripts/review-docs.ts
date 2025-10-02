#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Documentation Review Cycle Automation
 * Manages regular review cycles and maintenance schedules
 */
export class DocumentationReviewer {
  private static readonly DOCS_DIR = 'docs';
  private static readonly REVIEW_REPORT_FILE = join(this.DOCS_DIR, 'review-report.json');
  private static readonly REVIEW_SCHEDULE_FILE = join(this.DOCS_DIR, 'review-schedule.json');

  /**
   * Run documentation review cycle
   */
  static runReviewCycle(): void {
    console.log('🔄 Starting documentation review cycle...');
    
    // Check for outdated documentation
    const outdatedDocs = this.checkOutdatedDocs();
    
    if (outdatedDocs.length > 0) {
      console.log('⚠️ Outdated documentation found:', outdatedDocs);
      this.updateOutdatedDocs(outdatedDocs);
    } else {
      console.log('✅ No outdated documentation found');
    }
    
    // Generate review report
    this.generateReviewReport();
    
    // Update review schedule
    this.updateReviewSchedule();
    
    console.log('✅ Documentation review cycle completed');
  }

  /**
   * Check for outdated documentation
   */
  private static checkOutdatedDocs(): string[] {
    const outdatedDocs: string[] = [];
    
    // Check implementation summaries
    const implSummaries = this.checkImplementationSummaries();
    outdatedDocs.push(...implSummaries);
    
    // Check migration guides
    const migrationGuides = this.checkMigrationGuides();
    outdatedDocs.push(...migrationGuides);
    
    // Check process documentation
    const processDocs = this.checkProcessDocumentation();
    outdatedDocs.push(...processDocs);
    
    // Check essential documentation
    const essentialDocs = this.checkEssentialDocumentation();
    outdatedDocs.push(...essentialDocs);
    
    return outdatedDocs;
  }

  /**
   * Update outdated documentation
   */
  private static updateOutdatedDocs(outdatedDocs: string[]): void {
    outdatedDocs.forEach(doc => {
      console.log(`📝 Updating ${doc}...`);
      
      // Determine update strategy based on document type
      if (doc.includes('implementation-summary')) {
        this.updateImplementationSummary(doc);
      } else if (doc.includes('migration-guide')) {
        this.updateMigrationGuide(doc);
      } else if (doc.includes('process')) {
        this.updateProcessDocumentation(doc);
      } else {
        this.updateEssentialDocumentation(doc);
      }
    });
  }

  /**
   * Generate review report
   */
  private static generateReviewReport(): void {
    const report = {
      reviewDate: new Date().toISOString(),
      outdatedDocs: this.checkOutdatedDocs(),
      recommendations: this.generateRecommendations(),
      reviewMetrics: this.getReviewMetrics(),
      nextReviewDate: this.getNextReviewDate()
    };
    
    writeFileSync(this.REVIEW_REPORT_FILE, JSON.stringify(report, null, 2));
    console.log(`📊 Review report generated: ${this.REVIEW_REPORT_FILE}`);
  }

  /**
   * Update review schedule
   */
  private static updateReviewSchedule(): void {
    const schedule = {
      lastReview: new Date().toISOString(),
      nextReview: this.getNextReviewDate(),
      reviewFrequency: {
        essential: 'monthly',
        process: 'quarterly',
        business: 'semi-annual',
        historical: 'annual'
      },
      reviewHistory: this.getReviewHistory()
    };
    
    writeFileSync(this.REVIEW_SCHEDULE_FILE, JSON.stringify(schedule, null, 2));
    console.log(`📅 Review schedule updated: ${this.REVIEW_SCHEDULE_FILE}`);
  }

  /**
   * Check implementation summaries for outdated content
   */
  private static checkImplementationSummaries(): string[] {
    const implSummaryFiles = [
      'api-route-standardization-implementation-summary.md',
      'authentication-pattern-consolidation-implementation-summary.md',
      'component-state-management-standardization-implementation-summary.md',
      'configuration-management-standardization-implementation-summary.md',
      'configuration-validation-consolidation-implementation-summary.md',
      'database-layer-simplification-implementation-summary.md',
      'hook-pattern-migration-implementation-summary.md',
      'middleware-orchestration-simplification-implementation-summary.md',
      'testing-infrastructure-implementation-summary.md',
      'type-system-consolidation-implementation-summary.md',
      'type-consolidation-implementation-summary.md'
    ];
    
    const outdatedDocs: string[] = [];
    
    implSummaryFiles.forEach(file => {
      const filePath = join(this.DOCS_DIR, file);
      if (existsSync(filePath)) {
        const stats = statSync(filePath);
        const daysSinceUpdate = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        // Consider outdated if not updated in 30 days
        if (daysSinceUpdate > 30) {
          outdatedDocs.push(file);
        }
      }
    });
    
    return outdatedDocs;
  }

  /**
   * Check migration guides for outdated content
   */
  private static checkMigrationGuides(): string[] {
    const migrationFiles = [
      'api-route-migration-guide.md',
      'database-migration-guide.md',
      'hook-migration-guide.md',
      'testing-infrastructure-migration-guide.md'
    ];
    
    const outdatedDocs: string[] = [];
    
    migrationFiles.forEach(file => {
      const filePath = join(this.DOCS_DIR, file);
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf8');
        
        // Check if migration is marked as completed
        if (content.includes('Status: Complete') || content.includes('Status: Completed')) {
          // Check if it's been more than 90 days since completion
          const stats = statSync(filePath);
          const daysSinceUpdate = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysSinceUpdate > 90) {
            outdatedDocs.push(file);
          }
        }
      }
    });
    
    return outdatedDocs;
  }

  /**
   * Check process documentation for outdated content
   */
  private static checkProcessDocumentation(): string[] {
    const processFiles = [
      'documentation-standards.md',
      'documentation-strategy.md',
      'maintenance-schedule.md'
    ];
    
    const outdatedDocs: string[] = [];
    
    processFiles.forEach(file => {
      const filePath = join(this.DOCS_DIR, file);
      if (existsSync(filePath)) {
        const stats = statSync(filePath);
        const daysSinceUpdate = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        // Consider outdated if not updated in 90 days
        if (daysSinceUpdate > 90) {
          outdatedDocs.push(file);
        }
      }
    });
    
    return outdatedDocs;
  }

  /**
   * Check essential documentation for outdated content
   */
  private static checkEssentialDocumentation(): string[] {
    const essentialFiles = [
      'README.md',
      'SETUP.md',
      'DEPLOYMENT.md',
      'API.md',
      'ARCHITECTURE.md'
    ];
    
    const outdatedDocs: string[] = [];
    
    essentialFiles.forEach(file => {
      const filePath = join(this.DOCS_DIR, file);
      if (existsSync(filePath)) {
        const stats = statSync(filePath);
        const daysSinceUpdate = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        // Consider outdated if not updated in 30 days
        if (daysSinceUpdate > 30) {
          outdatedDocs.push(file);
        }
      }
    });
    
    return outdatedDocs;
  }

  /**
   * Update implementation summary
   */
  private static updateImplementationSummary(filePath: string): void {
    console.log(`📝 Updating implementation summary: ${filePath}`);
    
    // Add update timestamp
    const fullPath = join(this.DOCS_DIR, filePath);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8');
      const updatedContent = content.replace(
        /(\*\*Last Updated:\*\*.*)/,
        `**Last Updated:** ${new Date().toISOString().split('T')[0]}`
      );
      
      writeFileSync(fullPath, updatedContent);
    }
  }

  /**
   * Update migration guide
   */
  private static updateMigrationGuide(filePath: string): void {
    console.log(`📝 Updating migration guide: ${filePath}`);
    
    // Mark as archived if completed
    const fullPath = join(this.DOCS_DIR, filePath);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8');
      const updatedContent = content.replace(
        /(\*\*Status:\*\*.*)/,
        `**Status:** Archived (Completed)`
      );
      
      writeFileSync(fullPath, updatedContent);
    }
  }

  /**
   * Update process documentation
   */
  private static updateProcessDocumentation(filePath: string): void {
    console.log(`📝 Updating process documentation: ${filePath}`);
    
    // Add review timestamp
    const fullPath = join(this.DOCS_DIR, filePath);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8');
      const updatedContent = content.replace(
        /(\*\*Last Reviewed:\*\*.*)/,
        `**Last Reviewed:** ${new Date().toISOString().split('T')[0]}`
      );
      
      writeFileSync(fullPath, updatedContent);
    }
  }

  /**
   * Update essential documentation
   */
  private static updateEssentialDocumentation(filePath: string): void {
    console.log(`📝 Updating essential documentation: ${filePath}`);
    
    // Add update timestamp
    const fullPath = join(this.DOCS_DIR, filePath);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8');
      const updatedContent = content.replace(
        /(\*\*Last Updated:\*\*.*)/,
        `**Last Updated:** ${new Date().toISOString().split('T')[0]}`
      );
      
      writeFileSync(fullPath, updatedContent);
    }
  }

  /**
   * Generate recommendations
   */
  private static generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Check for implementation summaries that should be archived
    const implSummaries = this.checkImplementationSummaries();
    if (implSummaries.length > 0) {
      recommendations.push('Consider archiving outdated implementation summaries');
    }
    
    // Check for migration guides that should be archived
    const migrationGuides = this.checkMigrationGuides();
    if (migrationGuides.length > 0) {
      recommendations.push('Archive completed migration guides');
    }
    
    // Check for process documentation that needs updates
    const processDocs = this.checkProcessDocumentation();
    if (processDocs.length > 0) {
      recommendations.push('Update process documentation for accuracy');
    }
    
    // Check for essential documentation that needs updates
    const essentialDocs = this.checkEssentialDocumentation();
    if (essentialDocs.length > 0) {
      recommendations.push('Review essential documentation for accuracy');
    }
    
    // General recommendations
    recommendations.push('Consider implementing automated documentation generation');
    recommendations.push('Set up regular review cycles for all documentation');
    recommendations.push('Create documentation maintenance procedures');
    
    return recommendations;
  }

  /**
   * Get review metrics
   */
  private static getReviewMetrics(): any {
    return {
      totalDocs: this.countTotalDocs(),
      outdatedDocs: this.checkOutdatedDocs().length,
      essentialDocs: this.countEssentialDocs(),
      processDocs: this.countProcessDocs(),
      implementationSummaries: this.countImplementationSummaries(),
      migrationGuides: this.countMigrationGuides(),
      reviewDate: new Date().toISOString()
    };
  }

  /**
   * Get next review date
   */
  private static getNextReviewDate(): string {
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 30); // Next review in 30 days
    return nextReview.toISOString();
  }

  /**
   * Get review history
   */
  private static getReviewHistory(): any[] {
    // This would need to be implemented to track review history
    return [
      {
        date: new Date().toISOString(),
        outdatedDocs: this.checkOutdatedDocs().length,
        recommendations: this.generateRecommendations().length
      }
    ];
  }

  /**
   * Count total documentation files
   */
  private static countTotalDocs(): number {
    // This would need to be implemented based on actual file counting
    return 0;
  }

  /**
   * Count essential documentation files
   */
  private static countEssentialDocs(): number {
    const essentialFiles = [
      'README.md',
      'SETUP.md',
      'DEPLOYMENT.md',
      'API.md',
      'ARCHITECTURE.md'
    ];
    
    let count = 0;
    essentialFiles.forEach(file => {
      if (existsSync(join(this.DOCS_DIR, file))) {
        count++;
      }
    });
    
    return count;
  }

  /**
   * Count process documentation files
   */
  private static countProcessDocs(): number {
    const processFiles = [
      'documentation-standards.md',
      'documentation-strategy.md',
      'maintenance-schedule.md'
    ];
    
    let count = 0;
    processFiles.forEach(file => {
      if (existsSync(join(this.DOCS_DIR, file))) {
        count++;
      }
    });
    
    return count;
  }

  /**
   * Count implementation summary files
   */
  private static countImplementationSummaries(): number {
    const implSummaryFiles = [
      'api-route-standardization-implementation-summary.md',
      'authentication-pattern-consolidation-implementation-summary.md',
      'component-state-management-standardization-implementation-summary.md',
      'configuration-management-standardization-implementation-summary.md',
      'configuration-validation-consolidation-implementation-summary.md',
      'database-layer-simplification-implementation-summary.md',
      'hook-pattern-migration-implementation-summary.md',
      'middleware-orchestration-simplification-implementation-summary.md',
      'testing-infrastructure-implementation-summary.md',
      'type-system-consolidation-implementation-summary.md',
      'type-consolidation-implementation-summary.md'
    ];
    
    let count = 0;
    implSummaryFiles.forEach(file => {
      if (existsSync(join(this.DOCS_DIR, file))) {
        count++;
      }
    });
    
    return count;
  }

  /**
   * Count migration guide files
   */
  private static countMigrationGuides(): number {
    const migrationFiles = [
      'api-route-migration-guide.md',
      'database-migration-guide.md',
      'hook-migration-guide.md',
      'testing-infrastructure-migration-guide.md'
    ];
    
    let count = 0;
    migrationFiles.forEach(file => {
      if (existsSync(join(this.DOCS_DIR, file))) {
        count++;
      }
    });
    
    return count;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'review':
      DocumentationReviewer.runReviewCycle();
      break;
    case 'check-outdated':
      const outdatedDocs = DocumentationReviewer['checkOutdatedDocs']();
      console.log('Outdated documentation:', outdatedDocs);
      break;
    case 'generate-report':
      DocumentationReviewer['generateReviewReport']();
      break;
    case 'update-schedule':
      DocumentationReviewer['updateReviewSchedule']();
      break;
    default:
      console.log('Usage: npm run review-docs [command]');
      console.log('Commands:');
      console.log('  review          - Run complete review cycle');
      console.log('  check-outdated  - Check for outdated documentation');
      console.log('  generate-report - Generate review report');
      console.log('  update-schedule - Update review schedule');
  }
}
