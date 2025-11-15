import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginImport from "eslint-plugin-import";
import pluginBoundaries from "eslint-plugin-boundaries";
import pluginTailwind from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname
      }
    }
  })),
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
      import: pluginImport,
      boundaries: pluginBoundaries,
      tailwindcss: pluginTailwind
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"]
        }
      },
      "boundaries/elements": [
        { type: "root", pattern: "src/*.{ts,tsx}" },
        { type: "pages", pattern: "src/pages/**" },
        { type: "features", pattern: "src/features/**" },
        { type: "shared", pattern: "src/shared/**" }
      ]
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index"]
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before"
            }
          ],
          pathGroupsExcludedImportTypes: ["builtin"]
        }
      ],
      "boundaries/element-types": [
        "error",
        {
          default: "allow"
        }
      ],
      "boundaries/no-unknown-files": "error",
      "tailwindcss/no-custom-classname": "off"
    }
  },
  eslintConfigPrettier
);
