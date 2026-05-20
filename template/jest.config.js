module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '@src/(.*)$': '<rootDir>/src/$1',
    '@packageJson': '<rootDir>/package.json',
    '@appJson': '<rootDir>/app.json',
    '\\.(ttf)$': '<rootDir>/__mocks__/file-mock.js',
    '^axios$': '<rootDir>/__mocks__/axios.js',
    '^@react-navigation/native$':
      '<rootDir>/__mocks__/@react-navigation/native.js',
    '^@react-navigation/native-stack$':
      '<rootDir>/__mocks__/@react-navigation/native-stack.js',
    '^@eslam-elmeniawy/react-native-common-components$':
      '<rootDir>/__mocks__/@eslam-elmeniawy/react-native-common-components.js',
    '^react-native-gesture-handler$':
      '<rootDir>/__mocks__/react-native-gesture-handler.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  modulePaths: ['<rootDir>'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  setupFiles: [],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?(react-native(-[^/]*)?|@react-native|@react-native-community|@react-navigation|react-redux|@reduxjs/toolkit|immer|reactotron-react-native-mmkv|@eslam-elmeniawy/react-native-common-components|toastify-react-native|@faker-js/faker)/)',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'modules/*/src/**/*.{ts,tsx}'],
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  coveragePathIgnorePatterns: [
    // Test files and test helpers
    '__tests__/',
    '.*\\.test\\.[jt]sx?$',
    '.*\\.spec\\.[jt]sx?$',
    '__tests__/.*\\.helpers\\.[jt]sx?$',
    'testWrapper\\.[jt]sx?$',
    '/tests/',
    // Type definitions, enums, and constants that don't need coverage
    '.*\\.?types\\.ts$',
    '.*\\.d\\.ts$',
    '/enums?/',
    '.*Enum\\.ts$',
    // Index files (re-exports only)
    '/index\\.tsx?$',
    // Entity, model, DTO, and response files (pure data structures)
    '/entities?/',
    '/models?/',
    '/dto/',
    '/responses?/',
    // Translation and configuration files
    '/translations?/',
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'json-summary'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 75,
      lines: 75,
    },
  },
};
