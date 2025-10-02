#!/usr/bin/env node

/**
 * Legacy Form Cleanup Script
 * 
 * This script removes legacy form patterns and utilities after migration
 * to the unified form system is complete.
 */

import fs from 'fs'
import path from 'path'

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components')
const HOOKS_DIR = path.join(process.cwd(), 'src/hooks')
const BACKUP_DIR = path.join(process.cwd(), 'legacy-backup')

interface CleanupReport {
  removedFiles: string[]
  removedCode: Array<{
    file: string
    pattern: string
    lines: number[]
  }>
  warnings: string[]
  errors: string[]
}

async function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }
  
  console.log('📦 Creating backup of legacy files...')
  
  // Backup useAdminForm hook
  const adminFormPath = path.join(COMPONENTS_DIR, 'admin/shared/hooks/useAdminForm.ts')
  if (fs.existsSync(adminFormPath)) {
    const backupPath = path.join(BACKUP_DIR, 'useAdminForm.ts.backup')
    fs.copyFileSync(adminFormPath, backupPath)
    console.log(`   Backed up: ${adminFormPath}`)
  }
}

async function removeLegacyFiles(): Promise<string[]> {
  const removedFiles: string[] = []
  
  console.log('🗑️  Removing legacy files...')
  
  // Files to remove
  const filesToRemove = [
    'src/components/admin/shared/hooks/useAdminForm.ts',
    'src/components/admin/shared/utils/validation-utils.ts'
  ]
  
  for (const filePath of filesToRemove) {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      removedFiles.push(filePath)
      console.log(`   Removed: ${filePath}`)
    }
  }
  
  return removedFiles
}

async function removeLegacyCode(): Promise<Array<{ file: string; pattern: string; lines: number[] }>> {
  const removedCode: Array<{ file: string; pattern: string; lines: number[] }> = []
  
  console.log('🧹 Removing legacy code patterns...')
  
  // Patterns to remove
  const patterns = [
    {
      pattern: /import.*useAdminForm.*from.*admin.*hooks.*useAdminForm/g,
      description: 'useAdminForm imports'
    },
    {
      pattern: /const.*=.*useAdminForm\(/g,
      description: 'useAdminForm usage'
    },
    {
      pattern: /formState\.data/g,
      description: 'formState.data references'
    },
    {
      pattern: /formState\.errors/g,
      description: 'formState.errors references'
    },
    {
      pattern: /formState\.isSubmitting/g,
      description: 'formState.isSubmitting references'
    }
  ]
  
  // Scan all TypeScript files
  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        scanDirectory(fullPath)
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        processFile(fullPath)
      }
    }
  }
  
  function processFile(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')
      let modified = false
      const modifiedLines: number[] = []
      
      for (const pattern of patterns) {
        const matches = content.match(pattern.pattern)
        if (matches) {
          console.log(`   Found ${pattern.description} in ${filePath}`)
          
          // Remove matching lines
          const newLines = lines.filter((line, index) => {
            if (pattern.pattern.test(line)) {
              modifiedLines.push(index + 1)
              return false
            }
            return true
          })
          
          if (newLines.length !== lines.length) {
            fs.writeFileSync(filePath, newLines.join('\n'))
            modified = true
            removedCode.push({
              file: filePath,
              pattern: pattern.description,
              lines: modifiedLines
            })
          }
        }
      }
      
      if (modified) {
        console.log(`   Cleaned: ${filePath}`)
      }
    } catch (error) {
      console.error(`   Error processing ${filePath}:`, error)
    }
  }
  
  scanDirectory(COMPONENTS_DIR)
  scanDirectory(HOOKS_DIR)
  
  return removedCode
}

async function updateImports(): Promise<string[]> {
  const updatedFiles: string[] = []
  
  console.log('🔄 Updating imports...')
  
  // Update import statements
  function updateFileImports(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf-8')
      let modified = false
      
      // Replace old imports with new ones
      const replacements = [
        {
          from: /import.*useAdminForm.*from.*admin.*hooks.*useAdminForm/g,
          to: "import { useUnifiedForm } from '@/hooks/useUnifiedForm'"
        },
        {
          from: /import.*FormField.*from.*admin.*components/g,
          to: "import { FormField } from '@/components/ui/unified-form'"
        },
        {
          from: /import.*validation.*from.*admin.*utils/g,
          to: "import { adminCreateUserFormSchema } from '@/lib/schemas/unified-form-schemas'"
        }
      ]
      
      for (const replacement of replacements) {
        if (replacement.from.test(content)) {
          content = content.replace(replacement.from, replacement.to)
          modified = true
        }
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content)
        updatedFiles.push(filePath)
        console.log(`   Updated imports: ${filePath}`)
      }
    } catch (error) {
      console.error(`   Error updating ${filePath}:`, error)
    }
  }
  
  // Scan all TypeScript files
  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        scanDirectory(fullPath)
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        updateFileImports(fullPath)
      }
    }
  }
  
  scanDirectory(COMPONENTS_DIR)
  scanDirectory(HOOKS_DIR)
  
  return updatedFiles
}

async function generateCleanupReport(): Promise<CleanupReport> {
  console.log('🧹 Starting Legacy Form Cleanup...\n')
  
  const report: CleanupReport = {
    removedFiles: [],
    removedCode: [],
    warnings: [],
    errors: []
  }
  
  try {
    // Create backup first
    await createBackup()
    
    // Remove legacy files
    report.removedFiles = await removeLegacyFiles()
    
    // Remove legacy code patterns
    report.removedCode = await removeLegacyCode()
    
    // Update imports
    const updatedFiles = await updateImports()
    
    console.log(`\n✅ Cleanup Complete!`)
    console.log(`   Removed Files: ${report.removedFiles.length}`)
    console.log(`   Cleaned Code Patterns: ${report.removedCode.length}`)
    console.log(`   Updated Files: ${updatedFiles.length}`)
    
    // Generate warnings
    if (report.removedFiles.length > 0) {
      report.warnings.push('Legacy files have been removed. Make sure all references are updated.')
    }
    
    if (report.removedCode.length > 0) {
      report.warnings.push('Legacy code patterns have been removed. Review changes carefully.')
    }
    
    return report
    
  } catch (error) {
    report.errors.push(error instanceof Error ? error.message : 'Unknown error')
    console.error('❌ Cleanup failed:', error)
    return report
  }
}

function generateCleanupMarkdown(report: CleanupReport): string {
  let markdown = `# Legacy Form Cleanup Report\n\n`
  markdown += `Generated on: ${new Date().toISOString()}\n\n`
  
  markdown += `## Summary\n\n`
  markdown += `- **Removed Files**: ${report.removedFiles.length}\n`
  markdown += `- **Cleaned Code Patterns**: ${report.removedCode.length}\n`
  markdown += `- **Warnings**: ${report.warnings.length}\n`
  markdown += `- **Errors**: ${report.errors.length}\n\n`
  
  if (report.removedFiles.length > 0) {
    markdown += `## Removed Files\n\n`
    for (const file of report.removedFiles) {
      markdown += `- \`${file}\`\n`
    }
    markdown += `\n`
  }
  
  if (report.removedCode.length > 0) {
    markdown += `## Cleaned Code Patterns\n\n`
    for (const code of report.removedCode) {
      markdown += `### ${code.file}\n\n`
      markdown += `**Pattern**: ${code.pattern}\n\n`
      markdown += `**Lines**: ${code.lines.join(', ')}\n\n`
    }
  }
  
  if (report.warnings.length > 0) {
    markdown += `## Warnings\n\n`
    for (const warning of report.warnings) {
      markdown += `- ⚠️ ${warning}\n`
    }
    markdown += `\n`
  }
  
  if (report.errors.length > 0) {
    markdown += `## Errors\n\n`
    for (const error of report.errors) {
      markdown += `- ❌ ${error}\n`
    }
    markdown += `\n`
  }
  
  markdown += `## Next Steps\n\n`
  markdown += `1. Review all changes carefully\n`
  markdown += `2. Run tests to ensure nothing is broken\n`
  markdown += `3. Update any remaining references\n`
  markdown += `4. Remove backup files when confident\n`
  markdown += `5. Update documentation\n\n`
  
  return markdown
}

async function main() {
  try {
    const report = await generateCleanupReport()
    
    // Generate cleanup report
    const markdownReport = generateCleanupMarkdown(report)
    const reportPath = path.join(BACKUP_DIR, 'cleanup-report.md')
    fs.writeFileSync(reportPath, markdownReport)
    
    console.log(`\n📁 Cleanup Report: ${reportPath}`)
    console.log(`📦 Backup Directory: ${BACKUP_DIR}`)
    
    if (report.warnings.length > 0) {
      console.log(`\n⚠️  Warnings:`)
      report.warnings.forEach(warning => {
        console.log(`   ${warning}`)
      })
    }
    
    if (report.errors.length > 0) {
      console.log(`\n❌ Errors:`)
      report.errors.forEach(error => {
        console.log(`   ${error}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

export { generateCleanupReport, generateCleanupMarkdown }
