import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends("next/core-web-vitals", "next/typescript"),
    rules: {
      semi: [2, "always"],
      "@typescript-eslint/no-unused-vars": "error",
      "react-hooks/exhaustive-deps": "off",
    },
    files: ["src/**/*.tsx", "src/**/*.ts"],
  },
]);
