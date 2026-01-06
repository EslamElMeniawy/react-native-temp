module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '@src/(.*)$': '<rootDir>/src/$1',
    '@packageJson': '<rootDir>/package.json',
    '@appJson': '<rootDir>/app.json',
    '\\.(ttf)$': '<rootDir>/__mocks__/file-mock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  modulePaths: ['<rootDir>'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  setupFiles: [
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?(react-native|@react-native|@react-native-community|@react-navigation|react-redux|@reduxjs/toolkit|immer|reactotron-react-native-mmkv|@eslam-elmeniawy/react-native-common-components|toastify-react-native|react-native-gesture-handler|@faker-js/faker)/)',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'modules/*/src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    // Test files and test helpers
    '__tests__/',
    '.*\\.test\\.[jt]sx?$',
    '.*\\.spec\\.[jt]sx?$',
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
      statements: 80, // Current: 94.02%
      branches: 75, // Current: 78.96%
      functions: 75, // Current: 91.34%
      lines: 75, // Current: 94.56%
    },
  },
};
