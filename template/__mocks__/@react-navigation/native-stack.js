const React = require('react');

const createNativeStackNavigator = jest.fn(() => ({
  Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
  Screen: () => null,
  Group: ({ children }) => React.createElement(React.Fragment, null, children),
}));

module.exports = { createNativeStackNavigator };
