import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "drizzle/*",
      "dist/",
      "build/",
      "**/*.gen.ts",
      "**/*.d.ts",
    ],
  },
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ),
  {
    languageOptions: {
      parser: compat.config({
        parser: "@typescript-eslint/parser",
        parserOptions: {
          project: "./tsconfig.json",
          tsconfigRootDir: __dirname,
        },
      })[0].languageOptions.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      ...compat.config({
        plugins: [
          "@typescript-eslint",
          "import",
          "react",
          "react-hooks",
          "unused-imports",
        ],
      })[0].plugins,
    },
    rules: {
      // Type-safety footguns
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],

      // Imports & dead code
      "unused-imports/no-unused-imports": "warn",
      "import/order": [
        "warn",
        { "newlines-between": "always", alphabetize: { order: "asc" } },
      ],

      // Pragmatic strictness
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": [
        "warn",
        { "ts-ignore": "allow-with-description" },
      ],

      // React specifics
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
