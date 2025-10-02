#!/usr/bin/env node

/**
 * Form Migration Script
 * 
 * This script helps migrate existing forms to the unified form system.
 * It analyzes existing form components and provides migration recommendations.
 */

import fs from 'fs'
import path from 'path'
import { analyzeFormComponent, generateUnifiedFormCode, validateMigration, batchMigrateComponents } from '../src/lib/utils/form-migration-utils'

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components')
const OUTPUT_DIR = path.join(process.cwd(), 'migration-output')

interface MigrationReport {
  totalComponents: number
  migratedComponents: number
  failedMigrations: number
  recommendations: string[]
  components: Array<{
    name: string
    path: string
    analysis: any
    migrated: boolean
    errors?: string[]
  }>
}

async function findFormComponents(dir: string): Promise<Array<{ name: string; path: string; code: string }>> {
  const components: Array<{ name: string; path: string; code: string }> = []
  
  function scanDirectory(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        
        // Check if this looks like a form component
        if (content.includes('useState') && 
            (content.includes('onSubmit') || content.includes('handleSubmit') || content.includes('FormEvent'))) {
          const componentName = entry.name.replace('.tsx', '')
          components.push({
            name: componentName,
            path: fullPath,
            code: content
          })
        }
      }
    }
  }
  
  scanDirectory(dir)
  return components
}

async function generateMigrationReport(): Promise<MigrationReport> {
  console.log('🔍 Scanning for form components...')
  
  const components = await findFormComponents(COMPONENTS_DIR)
  console.log(`Found ${components.length} potential form components`)
  
  const report: MigrationReport = {
    totalComponents: components.length,
    migratedComponents: 0,
    failedMigrations: 0,
    recommendations: [],
    components: []
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
  
  for (const component of components) {
    console.log(`📋 Analyzing ${component.name}...`)
    
    try {
      const analysis = analyzeFormComponent(component.code, component.name)
      
      if (analysis.migrationDifficulty === 'easy') {
        console.log(`✅ ${component.name} - Easy migration`)
        
        // Generate migrated code
        const migratedCode = generateUnifiedFormCode(analysis)
        
        // Validate migration
        const validation = validateMigration(component.code, migratedCode, analysis)
        
        if (validation.isValid) {
          // Write migrated component
          const outputPath = path.join(OUTPUT_DIR, `${component.name}.migrated.tsx`)
          fs.writeFileSync(outputPath, migratedCode)
          
          report.migratedComponents++
          report.components.push({
            name: component.name,
            path: component.path,
            analysis,
            migrated: true
          })
        } else {
          report.failedMigrations++
          report.components.push({
            name: component.name,
            path: component.path,
            analysis,
            migrated: false,
            errors: validation.errors
          })
        }
      } else if (analysis.migrationDifficulty === 'medium') {
        console.log(`⚠️  ${component.name} - Medium difficulty migration`)
        report.failedMigrations++
        report.components.push({
          name: component.name,
          path: component.path,
          analysis,
          migrated: false,
          errors: ['Manual migration required - medium difficulty']
        })
      } else {
        console.log(`❌ ${component.name} - Hard migration`)
        report.failedMigrations++
        report.components.push({
          name: component.name,
          path: component.path,
          analysis,
          migrated: false,
          errors: ['Manual migration required - high complexity']
        })
      }
      
      // Add recommendations
      report.recommendations.push(...analysis.recommendations)
      
    } catch (error) {
      console.error(`❌ Error analyzing ${component.name}:`, error)
      report.failedMigrations++
      report.components.push({
        name: component.name,
        path: component.path,
        analysis: null,
        migrated: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    }
  }
  
  // Remove duplicate recommendations
  report.recommendations = [...new Set(report.recommendations)]
  
  return report
}

function generateMarkdownReport(report: MigrationReport): string {
  let markdown = `# Form Migration Report\n\n`
  markdown += `Generated on: ${new Date().toISOString()}\n\n`
  
  markdown += `## Summary\n\n`
  markdown += `- **Total Components**: ${report.totalComponents}\n`
  markdown += `- **Successfully Migrated**: ${report.migratedComponents}\n`
  markdown += `- **Failed Migrations**: ${report.failedMigrations}\n`
  markdown += `- **Success Rate**: ${Math.round((report.migratedComponents / report.totalComponents) * 100)}%\n\n`
  
  markdown += `## Recommendations\n\n`
  for (const recommendation of report.recommendations) {
    markdown += `- ${recommendation}\n`
  }
  markdown += `\n`
  
  markdown += `## Component Analysis\n\n`
  
  for (const component of report.components) {
    markdown += `### ${component.name}\n\n`
    markdown += `**Path**: \`${component.path}\`\n\n`
    
    if (component.analysis) {
      markdown += `**Migration Difficulty**: ${component.analysis.migrationDifficulty}\n\n`
      markdown += `**Complexity**: ${component.analysis.complexity}\n\n`
      markdown += `**State Management**: ${component.analysis.stateManagement}\n\n`
      markdown += `**Validation Pattern**: ${component.analysis.validationPattern}\n\n`
      markdown += `**Error Handling**: ${component.analysis.errorHandling}\n\n`
      
      if (component.analysis.formFields.length > 0) {
        markdown += `**Form Fields**:\n`
        for (const field of component.analysis.formFields) {
          markdown += `- ${field.name} (${field.type}) ${field.required ? 'required' : 'optional'}\n`
        }
        markdown += `\n`
      }
      
      if (component.analysis.recommendations.length > 0) {
        markdown += `**Recommendations**:\n`
        for (const rec of component.analysis.recommendations) {
          markdown += `- ${rec}\n`
        }
        markdown += `\n`
      }
    }
    
    if (component.errors && component.errors.length > 0) {
      markdown += `**Errors**:\n`
      for (const error of component.errors) {
        markdown += `- ${error}\n`
      }
      markdown += `\n`
    }
    
    markdown += `**Status**: ${component.migrated ? '✅ Migrated' : '❌ Failed'}\n\n`
    markdown += `---\n\n`
  }
  
  return markdown
}

async function main() {
  console.log('🚀 Starting Form Migration Analysis...\n')
  
  try {
    const report = await generateMigrationReport()
    
    // Generate markdown report
    const markdownReport = generateMarkdownReport(report)
    const reportPath = path.join(OUTPUT_DIR, 'migration-report.md')
    fs.writeFileSync(reportPath, markdownReport)
    
    // Generate JSON report
    const jsonReportPath = path.join(OUTPUT_DIR, 'migration-report.json')
    fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2))
    
    console.log('\n📊 Migration Analysis Complete!')
    console.log(`\n📈 Summary:`)
    console.log(`   Total Components: ${report.totalComponents}`)
    console.log(`   Migrated: ${report.migratedComponents}`)
    console.log(`   Failed: ${report.failedMigrations}`)
    console.log(`   Success Rate: ${Math.round((report.migratedComponents / report.totalComponents) * 100)}%`)
    
    console.log(`\n📁 Output Files:`)
    console.log(`   Migration Report: ${reportPath}`)
    console.log(`   JSON Report: ${jsonReportPath}`)
    console.log(`   Migrated Components: ${OUTPUT_DIR}/`)
    
    if (report.recommendations.length > 0) {
      console.log(`\n💡 Top Recommendations:`)
      report.recommendations.slice(0, 5).forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`)
      })
    }
    
    console.log(`\n✨ Next Steps:`)
    console.log(`   1. Review the migration report`)
    console.log(`   2. Test migrated components`)
    console.log(`   3. Manually migrate complex components`)
    console.log(`   4. Remove legacy form code`)
    console.log(`   5. Update tests and documentation`)
    
  } catch (error) {
    console.error('❌ Migration analysis failed:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

export { generateMigrationReport, generateMarkdownReport }
