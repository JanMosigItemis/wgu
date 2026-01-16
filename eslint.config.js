import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    rules: {
      // Error prevention
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off', // CLI apps need console
      'no-await-in-loop': 'warn',
      'no-promise-executor-return': 'error',
      'no-unreachable-loop': 'error',
      'require-atomic-updates': 'error',

      // Best practices
      eqeqeq: ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'warn',
      'no-param-reassign': 'warn',
      'no-return-await': 'error',
      'prefer-promise-reject-errors': 'error',

      // Node.js specific
      'no-process-exit': 'off', // CLI apps need process.exit
      'no-path-concat': 'error', // Use path.join instead of __dirname + '/'

      // Code quality
      curly: ['error', 'all'],
      'default-case-last': 'error',
      'dot-notation': 'error',
      'no-else-return': 'warn',
      'no-lonely-if': 'warn',
      'no-useless-return': 'warn',
      'prefer-template': 'warn',
      yoda: 'error',

      // Stylistic choices
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'array-element-newline': [
        'error',
        {
          ArrayExpression: { minItems: 3 },
          ArrayPattern: { minItems: 3 },
        },
      ],
      'array-bracket-newline': ['error', { minItems: 3 }],
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.config.js'],
  },
];
