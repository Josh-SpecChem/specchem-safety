#!/usr/bin/env node

/**
 * Database Layer Cleanup Script
 *
 * This script removes legacy database operation classes, builder patterns,
 * and wrapper layers after successful migration to the unified service.
 */

import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");

// Files and directories to remove
const legacyFiles = [
  "src/lib/db/operations/users.ts",
  "src/lib/db/operations/courses.ts",
  "src/lib/db/operations/enrollments.ts",
  "src/lib/db/operations/analytics.ts",
  "src/lib/db/builders/query-builder.ts",
  "src/lib/db/builders/filter-builder.ts",
  "src/lib/db/builders/pagination-builder.ts",
  "src/lib/db/wrappers/operation-wrapper.ts",
  "src/lib/db/wrappers/error-handler.ts",
  "src/lib/db/operations.ts",
  "src/lib/db/tenant-operations.ts",
];

// Directories to remove
const legacyDirectories = ["src/lib/db/builders", "src/lib/db/wrappers"];

// Files to update (remove legacy imports)
const filesToUpdate = [
  "src/lib/db/operations/index.ts",
  "src/app/api/admin/users/route.ts",
  "src/app/api/admin/enrollments/route.ts",
  "src/app/api/admin/courses/route.ts",
];

function showHelp() {
  console.log(`
Database Layer Cleanup Script

Usage: node scripts/cleanup-database.js <command>

Commands:
  dry-run    Show what would be removed without actually removing
  cleanup    Remove legacy files and update imports
  restore    Restore from backup (if available)
  help       Show this help message

Examples:
  node scripts/cleanup-database.js dry-run
  node scripts/cleanup-database.js cleanup
`);
}

function checkMigrationStatus() {
  try {
    const { MigrationUtils } = require("../src/lib/db/operations");
    const status = MigrationUtils.getStatus();

    if (!status.usingNewService) {
      console.error("❌ New service is not enabled. Please enable it first:");
      console.error("   node scripts/migrate-database.js enable");
      process.exit(1);
    }

    console.log("✅ Migration status verified - new service is enabled");
    return true;
  } catch (error) {
    console.error("❌ Could not verify migration status:", error.message);
    process.exit(1);
  }
}

function createBackup() {
  const backupDir = path.join(projectRoot, "backups", "database-cleanup");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `legacy-files-${timestamp}`);

  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  // Copy legacy files to backup
  legacyFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const relativePath = path.relative(srcDir, file);
      const backupFile = path.join(backupPath, relativePath);
      const backupDir = path.dirname(backupFile);

      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      fs.copyFileSync(file, backupFile);
      console.log(`📁 Backed up: ${file}`);
    }
  });

  console.log(`✅ Backup created at: ${backupPath}`);
  return backupPath;
}

function dryRun() {
  console.log("🔍 Dry run - showing what would be removed:\n");

  console.log("Files to remove:");
  legacyFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} (not found)`);
    }
  });

  console.log("\nDirectories to remove:");
  legacyDirectories.forEach((dir) => {
    if (fs.existsSync(dir)) {
      console.log(`  ✅ ${dir}`);
    } else {
      console.log(`  ❌ ${dir} (not found)`);
    }
  });

  console.log("\nFiles to update:");
  filesToUpdate.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} (not found)`);
    }
  });
}

function cleanup() {
  console.log("🧹 Starting database layer cleanup...\n");

  // Check migration status
  checkMigrationStatus();

  // Create backup
  console.log("📁 Creating backup...");
  const backupPath = createBackup();

  // Remove legacy files
  console.log("\n🗑️  Removing legacy files...");
  legacyFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`  ✅ Removed: ${file}`);
    } else {
      console.log(`  ⚠️  Not found: ${file}`);
    }
  });

  // Remove legacy directories
  console.log("\n🗑️  Removing legacy directories...");
  legacyDirectories.forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`  ✅ Removed: ${dir}`);
    } else {
      console.log(`  ⚠️  Not found: ${dir}`);
    }
  });

  // Update files to remove legacy imports
  console.log("\n📝 Updating files to remove legacy imports...");
  filesToUpdate.forEach((file) => {
    if (fs.existsSync(file)) {
      updateFileImports(file);
      console.log(`  ✅ Updated: ${file}`);
    } else {
      console.log(`  ⚠️  Not found: ${file}`);
    }
  });

  console.log("\n✅ Cleanup completed successfully!");
  console.log(`📁 Backup available at: ${backupPath}`);
  console.log("\nNext steps:");
  console.log("1. Run tests to ensure everything works correctly");
  console.log("2. Update documentation");
  console.log("3. Deploy to production");
}

function updateFileImports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Remove legacy imports
  const legacyImportPatterns = [
    /import.*from.*['"]\.\.\/builders\/query-builder['"];?\s*\n/g,
    /import.*from.*['"]\.\.\/builders\/filter-builder['"];?\s*\n/g,
    /import.*from.*['"]\.\.\/builders\/pagination-builder['"];?\s*\n/g,
    /import.*from.*['"]\.\.\/wrappers\/operation-wrapper['"];?\s*\n/g,
    /import.*from.*['"]\.\.\/wrappers\/error-handler['"];?\s*\n/g,
    /import.*from.*['"]\.\.\/operations\.ts['"];?\s*\n/g,
    /import.*from.*['"]\.\.\/tenant-operations['"];?\s*\n/g,
  ];

  legacyImportPatterns.forEach((pattern) => {
    content = content.replace(pattern, "");
  });

  // Update operation imports to use compatibility layer
  content = content.replace(
    /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/lib\/db\/operations['"];?/g,
    (match, imports) => {
      // Keep compatibility layer imports, remove legacy class imports
      const keepImports = imports
        .split(",")
        .map((imp) => imp.trim())
        .filter(
          (imp) =>
            imp.includes("Compat") ||
            imp.includes("DatabaseService") ||
            imp.includes("TenantFilter") ||
            imp.includes("Migration"),
        );

      if (keepImports.length > 0) {
        return `import { ${keepImports.join(", ")} } from '@/lib/db/operations';`;
      }
      return "";
    },
  );

  fs.writeFileSync(filePath, content);
}

function restore() {
  console.log("🔄 Restore functionality not implemented yet");
  console.log("Please manually restore from backup if needed");
}

// Main command handling
const command = process.argv[2];

switch (command) {
  case "dry-run":
    dryRun();
    break;

  case "cleanup":
    cleanup();
    break;

  case "restore":
    restore();
    break;

  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;

  default:
    console.error("❌ Unknown command:", command);
    console.log('Use "help" to see available commands');
    process.exit(1);
}
