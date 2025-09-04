import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {languageOptions: {globals: globals.browser}},
  {files: ["**/*.{js,mjs,cjs,ts,tsx,vue}"]},
  {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}},
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn"
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    }
  }
];
