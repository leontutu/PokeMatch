import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import prettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    {
        ...js.configs.recommended,
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },

    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
    },

    ...tseslint.configs.recommended,

    {
        rules: {
            "no-unused-private-class-members": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },

    {
        files: [
            "**/*.test.ts",
            "**/*.test.tsx",
            "**/*.spec.ts",
            "**/*.spec.tsx",
            "test/**/*",
            "**/__tests__/**/*",
        ],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },

    {
        ...pluginReact.configs.flat.recommended,
        ...pluginReact.configs.flat["jsx-runtime"],
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        settings: {
            react: {
                version: "detect",
            },
        },
    },

    json.configs.recommended,
    ...markdown.configs.recommended,
    css.configs.recommended,

    {
        files: ["*.md"],
        rules: {
            "markdown/heading-increment": "off",
        },
    },

    prettier,
]);
