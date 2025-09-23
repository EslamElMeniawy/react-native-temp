module.exports = {
  // Workaround to disable autolinking for android for `react-native-config`
  // to fix of build issue.
  dependencies: {
    'react-native-config': { platforms: { android: null } },
  },
  // TODO: Enable this if you have custom fonts after adding them.
  // assets: ['./modules/assets/src/fonts/'],
};
