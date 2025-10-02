module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json", // enable type-aware rules in CI; ok to omit locally for speed
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint",
    "import",
    "react",
    "react-hooks",
    "unused-imports",
  ],
  extends: [
    "next/core-web-vitals", // Next.js baseline (includes React hooks rules)
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
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
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "drizzle/*",
    "dist/",
    "build/",
    "**/*.gen.ts",
    "**/*.d.ts",
  ],
};
