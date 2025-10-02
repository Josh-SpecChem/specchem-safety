import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "drizzle/*",
      "dist/",
      "build/",
      "tests-backup/**", // Ignore tests-backup directory
      "**/*.gen.ts",
      "**/*.d.ts",
      "**/*.cjs", // Ignore CommonJS files
    ],
  },
  // Base JavaScript configuration
  js.configs.recommended,

  // Next.js configuration
  ...compat.extends("next/core-web-vitals"),

  // TypeScript configuration for src files (included in tsconfig.json)
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],

      // Disable base ESLint rules that are covered by TypeScript
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },

  // Basic TypeScript configuration for scripts (not in tsconfig.json)
  {
    files: ["scripts/**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // More lenient rules for scripts
      "@typescript-eslint/no-explicit-any": "off", // Allow any in scripts
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Disable base ESLint rules that are covered by TypeScript
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-case-declarations": "off", // Allow declarations in case blocks for scripts
    },
  },

  // JavaScript files configuration
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
