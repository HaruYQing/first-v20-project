import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import prettier from 'eslint-config-prettier';

export default [
  // 1️⃣ 全域忽略設定 (選填，建議加上)
  { ignores: ['dist/', 'node_modules/'] },

  // 2️⃣ TypeScript 設定 & JS 規則
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@angular-eslint': angular,
    },
    rules: {
      ...angular.configs.recommended.rules,

      // ✅ Angular 建議命名規則
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
    },
  },

  // 3️⃣ Angular HTML template
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
    },
  },

  // 4️⃣ Inline template 支援
  {
    files: ['**/*.ts'],
    processor: angularTemplate.processors['extract-inline-html'],
  },

  // 5️⃣ 關閉與 Prettier 衝突規則（一定放最後）
  prettier,
];
