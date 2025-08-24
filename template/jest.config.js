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
    'node_modules/(?!(jest-)?(react-native|@react-native|@react-native-community|@react-navigation|react-redux|reactotron-react-native-mmkv|@eslam-elmeniawy/react-native-common-components|toastify-react-native|react-native-gesture-handler)/)',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'modules/*/src/**/*.{ts,tsx}'],
};
