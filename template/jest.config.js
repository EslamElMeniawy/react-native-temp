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
  coverageThreshold: {
    global: {
      statements: 70, // Current: 71.83% - TODO: Increase to 80% when completing the app
      branches: 60, // Current: 62.43% - TODO: Increase to 75% when completing the app
      functions: 60, // Current: 64.28% - TODO: Increase to 75% when completing the app
      lines: 70, // Current: 72.33% - TODO: Increase to 75% when completing the app
    },
  },
};
