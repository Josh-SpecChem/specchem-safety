"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  Database,
  Download,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import React, { useState } from "react";

export default function ContentManagementPage() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);
    setImportResult(null);

    try {
      const fileContent = await file.text();
      const importData = JSON.parse(fileContent);

      const response = await fetch("/api/admin/content/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(importData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Import failed");
      }

      const result = await response.json();
      setImportResult(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);

    try {
      const courseId = "hazmat-function-specific"; // This would be dynamic in a real app
      const language = "en";

      const response = await fetch(
        `/api/admin/content/export?courseId=${courseId}&language=${language}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Export failed");
      }

      // Create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `course-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const runMigration = async () => {
    setImporting(true);
    setError(null);
    setImportResult(null);

    try {
      // This would trigger the migration script
      const response = await fetch("/api/admin/content/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Migration failed");
      }

      const result = await response.json();
      setImportResult(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Migration failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Management
          </h1>
          <p className="text-gray-600">
            Manage ebook content, import/export data, and run migrations.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Import/Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Content Import/Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Import */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Import Content
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload a JSON file containing structured course content to
                    import into the database.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      disabled={importing}
                      className="hidden"
                      id="import-file"
                    />
                    <label htmlFor="import-file">
                      <Button
                        variant="outline"
                        disabled={importing}
                        className="cursor-pointer"
                        asChild
                      >
                        <span className="flex items-center gap-2">
                          {importing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {importing ? "Importing..." : "Import JSON"}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Export */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Export Content
                  </h3>
                  <p className="text-sm text-gray-600">
                    Download the current course content as a JSON file for
                    backup or migration.
                  </p>
                  <Button
                    onClick={handleExport}
                    disabled={exporting}
                    className="flex items-center gap-2"
                  >
                    {exporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {exporting ? "Exporting..." : "Export JSON"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Migration Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Migration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Run the automated migration to extract content from the existing
                ebook pages and populate the database with structured content.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Warning</span>
                </div>
                <p className="text-amber-700 text-sm">
                  This will overwrite existing content in the database. Make
                  sure to export current content first if you need to preserve
                  it.
                </p>
              </div>
              <Button
                onClick={runMigration}
                disabled={importing}
                variant="outline"
                className="flex items-center gap-2"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                {importing ? "Running Migration..." : "Run Migration"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {(importResult || error) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {error ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {error ? "Error" : "Operation Results"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {importResult && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Import Successful
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Sections:
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {importResult.sectionsCreated}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Content Blocks:
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {importResult.contentBlocksCreated}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Quiz Questions:
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {importResult.quizQuestionsCreated}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Errors:
                          </span>
                          <Badge
                            variant={
                              importResult.errors.length > 0
                                ? "destructive"
                                : "outline"
                            }
                            className="ml-2"
                          >
                            {importResult.errors.length}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {importResult.errors && importResult.errors.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">
                          Warnings/Errors
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {importResult.errors.map(
                            (error: string, index: number) => (
                              <li key={index}>• {error}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Import Process:</h4>
                <ol className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>
                    1. Prepare a JSON file with the correct content structure
                  </li>
                  <li>2. Click &quot;Import JSON&quot; and select your file</li>
                  <li>3. Review the import results and any errors</li>
                  <li>4. Test the content in the ebook interface</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Export Process:</h4>
                <ol className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>
                    1. Click &quot;Export JSON&quot; to download current content
                  </li>
                  <li>2. The file will be saved to your downloads folder</li>
                  <li>
                    3. Use this file for backup or migration to other
                    environments
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  Migration Process:
                </h4>
                <ol className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>
                    1. Export current content first (if needed for backup)
                  </li>
                  <li>
                    2. Click &quot;Run Migration&quot; to extract content from
                    existing pages
                  </li>
                  <li>3. Review the migration results</li>
                  <li>4. Test the migrated content thoroughly</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
