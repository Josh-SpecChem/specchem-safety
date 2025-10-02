#!/usr/bin/env tsx

/**
 * Enhanced TypeScript Type Checking Script
 * 
 * Provides detailed type checking with better error reporting and statistics
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

interface TypeCheckOptions {
  strict?: boolean;
  watch?: boolean;
  ci?: boolean;
  config?: string;
  verbose?: boolean;
}

interface TypeCheckResult {
  success: boolean;
  errorCount: number;
  fileCount: number;
  errors: string[];
  duration: number;
}

class TypeChecker {
  private options: TypeCheckOptions;

  constructor(options: TypeCheckOptions = {}) {
    this.options = options;
  }

  async run(): Promise<TypeCheckResult> {
    const startTime = Date.now();
    
    console.log('🔍 Running TypeScript type checking...\n');
    
    const config = this.getConfigPath();
    const command = this.buildCommand(config);
    
    if (this.options.verbose) {
      console.log(`Command: ${command}\n`);
    }

    try {
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const duration = Date.now() - startTime;
      
      console.log('✅ Type checking completed successfully!');
      console.log(`⏱️  Duration: ${duration}ms\n`);
      
      return {
        success: true,
        errorCount: 0,
        fileCount: this.countTypeScriptFiles(),
        errors: [],
        duration
      };
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const output = error.stdout || error.stderr || error.message;
      
      const result = this.parseTypeScriptOutput(output);
      
      console.log('❌ Type checking failed!');
      console.log(`📊 Found ${result.errorCount} errors in ${result.fileCount} files`);
      console.log(`⏱️  Duration: ${duration}ms\n`);
      
      if (!this.options.ci) {
        console.log('Errors:');
        console.log(output);
      }
      
      return {
        ...result,
        success: false,
        duration
      };
    }
  }

  private getConfigPath(): string {
    if (this.options.config) {
      return this.options.config;
    }
    
    if (this.options.strict && existsSync('tsconfig.strict.json')) {
      return 'tsconfig.strict.json';
    }
    
    return 'tsconfig.json';
  }

  private buildCommand(config: string): string {
    let command = `npx tsc --noEmit --project ${config}`;
    
    if (this.options.watch) {
      command += ' --watch';
    }
    
    if (this.options.ci) {
      command += ' --pretty false';
    }
    
    if (this.options.strict) {
      command += ' --noUnusedLocals --noUnusedParameters';
    }
    
    return command;
  }

  private parseTypeScriptOutput(output: string): Partial<TypeCheckResult> {
    const lines = output.split('\n');
    const errors: string[] = [];
    let errorCount = 0;
    let fileCount = 0;

    // Parse the summary line: "Found X errors in Y files."
    const summaryMatch = output.match(/Found (\d+) errors? in (\d+) files?/);
    if (summaryMatch) {
      errorCount = parseInt(summaryMatch[1], 10);
      fileCount = parseInt(summaryMatch[2], 10);
    }

    // Extract error lines
    for (const line of lines) {
      if (line.includes('error TS')) {
        errors.push(line.trim());
      }
    }

    return {
      errorCount,
      fileCount,
      errors
    };
  }

  private countTypeScriptFiles(): number {
    try {
      const output = execSync('find src -name "*.ts" -o -name "*.tsx" | wc -l', { 
        encoding: 'utf8' 
      });
      return parseInt(output.trim(), 10);
    } catch {
      return 0;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  const options: TypeCheckOptions = {
    strict: args.includes('--strict'),
    watch: args.includes('--watch'),
    ci: args.includes('--ci'),
    verbose: args.includes('--verbose'),
    config: args.find(arg => arg.startsWith('--config='))?.split('=')[1]
  };

  if (args.includes('--help')) {
    console.log(`
TypeScript Type Checker

Usage: tsx scripts/type-check.ts [options]

Options:
  --strict     Use strict type checking configuration
  --watch      Watch for file changes
  --ci         CI-friendly output (no colors, less verbose)
  --verbose    Show detailed information
  --config=X   Use specific TypeScript config file
  --help       Show this help message

Examples:
  tsx scripts/type-check.ts
  tsx scripts/type-check.ts --strict
  tsx scripts/type-check.ts --watch
  tsx scripts/type-check.ts --ci --strict
`);
    process.exit(0);
  }

  const checker = new TypeChecker(options);
  const result = await checker.run();
  
  if (!result.success) {
    process.exit(1);
  }
}

// Check if this module is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { TypeCheckOptions, TypeCheckResult, TypeChecker };

