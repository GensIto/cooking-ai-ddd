import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        Env: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // Domain層が依存してはいけない領域
            {
              from: "./src/usecase/**/*",
              target: "./src/domain/**/!(*.spec.ts|*.test.ts)",
              message: "Domain層でUsecase層をimportしてはいけません。",
            },
            {
              from: "./src/controllers/**/*",
              target: "./src/domain/**/!(*.spec.ts|*.test.ts)",
              message: "Domain層でController層をimportしてはいけません。",
            },
            {
              from: "./src/infrastructure/**/*!(test).ts",
              target: "./src/domain/**/!(*.spec.ts|*.test.ts)",
              message: "Domain層でInfrastructure層をimportしてはいけません。",
            },
            // Usecase層が依存してはいけない領域
            {
              from: "./src/controllers/**/*",
              target: "./src/usecase/**/!(*.spec.ts|*.test.ts)",
              message: "Usecase層でController層をimportしてはいけません。",
            },
            {
              from: "./src/infrastructure/**/*",
              target: "./src/usecase/**/!(*.spec.ts|*.test.ts)",
              message: "Usecase層でInfrastructure層をimportしてはいけません。",
            },
          ],
        },
      ],
    },
  },
];