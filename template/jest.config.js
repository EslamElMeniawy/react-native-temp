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
      statements: 35, // Current: 35.11% - TODO: Increase to 50% when completing the app
      branches: 25, // Current: 25.21% - TODO: Increase to 45% when completing the app
      lines: 35, // Current: 35.14% - TODO: Increase to 50% when completing the app
      functions: 25, // Current: 25.77% - TODO: Increase to 50% when completing the app
    },
  },
};
