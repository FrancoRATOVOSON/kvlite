import { FlatCompat } from '@eslint/eslintrc'
import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPretttierRecommended from 'eslint-plugin-prettier/recommended'
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat()

export default [
  eslint.configs.recommended,
  tseslint.configs.recommended,
  ...compat.extends('eslint-config-standard'),
  eslintPluginPretttierRecommended,
  {
    rules: {
      'prettier/prettier': 'warn',
      'space-before-function-paren': 'off'
    }
  },
  {
    ignores: ['**/dist']
  },
  {
    plugins: {
      perfectionist
    },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          customGroups: {
            type: {
              react: ['^react$', '^react-.+'],
              node: ['node:*']
            },
            value: {
              react: ['^react$', '^react-.+'],
              node: ['node:*']
            }
          },
          environment: 'node',
          groups: [
            'node',
            'react',
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown'
          ],
          ignoreCase: true,
          internalPattern: ['@me.org/.+'],
          maxLineLength: undefined,
          newlinesBetween: 'always',
          order: 'asc',
          partitionByComment: false,
          partitionByNewLine: false,
          specialCharacters: 'keep',
          type: 'alphabetical'
        }
      ]
    }
  }
]