import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser"; // Renombrado para mayor claridad
import tsPlugin from "@typescript-eslint/eslint-plugin"; // Renombrado para mayor claridad

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: { js, tsPlugin }, // Usamos el plugin tsPlugin aquí
    rules: {
      "no-unused-vars": ["error"],
      "semi": ["error", "always"],
      "@typescript-eslint/no-unused-vars": ["error"], // Regla de TypeScript
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json", // Asegúrate de que tu tsconfig.json esté en la raíz
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error"],
    },
  },
]);



