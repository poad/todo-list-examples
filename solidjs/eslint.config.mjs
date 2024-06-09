// @ts-check

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import stylisticJsx from '@stylistic/eslint-plugin-jsx';
import solid from 'eslint-plugin-solid';

// @ts-ignore
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/*.d.ts',
      '*.{js,jsx,cjs,mjs}',
      '**/*.css',
      'node_modules/**/*',
      '.next',
      'out',
      '.storybook',
      'cdk',
      '../nextjs',
      '../nextjs/cdk',
      'dist',
    ],
  },
  {
    files: ['src/**/*.{jsx,ts,tsx}'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      // @ts-ignore
      tseslint,
      solid,
    },
    languageOptions: {
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      },
      parser: tseslint.parser,
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    }
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/ts': stylisticTs,
      '@stylistic/jsx': stylisticJsx,
    },
    rules: {
      '@stylistic/semi': 'error',
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/jsx/jsx-indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'always'],
      'quotes': ['error', 'single'],
    },
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
);
