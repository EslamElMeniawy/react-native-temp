module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: { production: { plugins: ['react-native-paper/babel'] } },
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@src': './src',
          '@packageJson': './package.json',
          '@appJson': './app.json',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
