module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:eslint-comments/recommended',
    'plugin:@tanstack/query/recommended',
  ],
  ignorePatterns: [
    '.eslintrc.js',
    '.prettierrc.js',
    '.detoxrc.js',
    'babel.config.js',
    'commitlint.config.js',
    'jest.config.js',
    'jest.setup.ts',
    'metro.config.js',
    'react-native.config.js',
    '/@types/*',
    '__mocks__',
    '/coverage/*',
    '/e2e/*',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['autofix', 'import', 'react-func', '@tanstack/query', 'boundaries'],
  rules: {
    'boundaries/element-types': [
      'error',
      {
        default: 'allow',
        rules: [
          {
            from: ['core'],
            disallow: ['store', 'domain', 'feature', 'navigation', 'app'],
            message:
              'Core must not import from {{target.type}}. Core is the foundation layer.',
          },
          {
            from: ['store'],
            disallow: ['shared', 'feature', 'navigation', 'app'],
            message:
              'Store must not import from {{target.type}}. Only core and domain types are allowed.',
          },
          {
            from: ['shared'],
            disallow: ['app'],
            message: 'Shared modules must not import from {{target.type}}.',
          },
          {
            from: ['domain'],
            disallow: ['feature', 'navigation', 'app'],
            message:
              'Domain must not import from {{target.type}}. Domain is below features.',
          },
          {
            from: ['feature'],
            disallow: ['feature', 'app'],
            message:
              'Features must not import from other features or app layer. Use shared/domain modules for cross-feature communication.',
          },
        ],
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'default', format: ['camelCase'] },
      { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
      {
        selector: 'variable',
        types: ['function'],
        format: ['PascalCase', 'camelCase'],
      },
      { selector: 'function', format: ['PascalCase', 'camelCase'] },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      { selector: 'enumMember', format: ['UPPER_CASE'] },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      { selector: 'typeLike', format: ['PascalCase'] },
      { selector: 'import', format: ['PascalCase', 'camelCase'] },
      {
        selector: [
          'classProperty',
          'objectLiteralProperty',
          'typeProperty',
          'classMethod',
          'objectLiteralMethod',
          'typeMethod',
          'accessor',
          'enumMember',
        ],
        format: null,
        modifiers: ['requiresQuotes'],
      },
      {
        selector: ['objectLiteralProperty'],
        format: null,
        filter: { regex: '(firebase)', match: true },
      },
    ],
    'arrow-body-style': ['error', 'as-needed'],
    'react/self-closing-comp': ['error', { component: true, html: true }],
    'autofix/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
    'import/no-unresolved': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          { pattern: '@src/**/**', group: 'parent', position: 'before' },
          { pattern: '@modules/**/**', group: 'parent', position: 'before' },
        ],
        alphabetize: { order: 'asc' },
      },
    ],
    'no-restricted-imports': ['error', { patterns: ['../'] }],
    'react/no-array-index-key': ['error'],
    eqeqeq: [1, 'allow-null'],
    complexity: ['warn', 20],
    'max-depth': ['warn', 5],
    'max-nested-callbacks': ['warn', 10],
    'max-params': ['warn', 4],
    'max-lines': ['warn', 300],
    'max-statements': ['warn', 10, { ignoreTopLevelFunctions: true }],
    'react-func/max-lines-per-function': ['warn', 50],
    'react-func/max-combined-conditions': ['error', 1],
    'eslint-comments/no-use': ['error', { allow: [] }],
    'react-hooks/exhaustive-deps': 1,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
  },
  settings: {
    'boundaries/elements': [
      { type: 'core', pattern: 'modules/core', mode: 'folder' },
      { type: 'store', pattern: 'modules/store', mode: 'folder' },
      {
        type: 'shared',
        pattern: [
          'modules/utils',
          'modules/components',
          'modules/theme',
          'modules/localization',
          'modules/assets',
        ],
        mode: 'folder',
      },
      {
        type: 'domain',
        pattern: 'modules/domain/*',
        mode: 'folder',
        capture: ['domainName'],
      },
      {
        type: 'feature',
        pattern: 'modules/features/*',
        mode: 'folder',
        capture: ['featureName'],
      },
      { type: 'navigation', pattern: 'modules/navigation', mode: 'folder' },
      { type: 'app', pattern: 'src/**', mode: 'full' },
    ],
    'boundaries/ignore': ['**/__tests__/**', '**/*.test.*', '**/*.spec.*'],
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': { typescript: true, node: true },
  },
  overrides: [
    {
      // Test files only
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
      rules: {
        // fireEvent is async in @testing-library/react-native v14+
        'testing-library/no-await-sync-events': 'off',
        // Integration tests are naturally longer
        'max-lines': 'off',
        'max-statements': 'off',
        'react-func/max-lines-per-function': 'off',
      },
    },
  ],
};
