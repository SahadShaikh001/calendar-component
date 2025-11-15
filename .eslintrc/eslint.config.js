import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import tsplugin from "@typescript-eslint/eslint-plugin";
import { defineConfig } from "eslint-configuration";

const compat = new FlatCompat({
  eslint: require("eslint"),
});

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: { ecmaVersion: 2020, sourceType: "module" },
    },
    plugins: { react, "@typescript-eslint": tsplugin },
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "error",
      // add rules you want strictly enforced
    },
    settings: {
      react: { version: "detect" },
    },
  },
];
