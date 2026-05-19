const React = require('react');
const { View } = require('react-native');

const GestureHandlerRootView = ({ children, ...props }) =>
  React.createElement(View, props, children);

const GestureDetector = ({ children }) => children;

const Gesture = {
  Tap: () => ({
    onStart: () => Gesture.Tap(),
    onEnd: () => Gesture.Tap(),
    maxDuration: () => Gesture.Tap(),
    numberOfTaps: () => Gesture.Tap(),
    enabled: () => Gesture.Tap(),
  }),
  Pan: () => ({
    onStart: () => Gesture.Pan(),
    onUpdate: () => Gesture.Pan(),
    onEnd: () => Gesture.Pan(),
    enabled: () => Gesture.Pan(),
  }),
  LongPress: () => ({
    onStart: () => Gesture.LongPress(),
    onEnd: () => Gesture.LongPress(),
    minDuration: () => Gesture.LongPress(),
    enabled: () => Gesture.LongPress(),
  }),
  Simultaneous: () => ({
    enabled: () => Gesture.Simultaneous(),
  }),
  Exclusive: () => ({
    enabled: () => Gesture.Exclusive(),
  }),
  Race: () => ({
    enabled: () => Gesture.Race(),
  }),
};

module.exports = {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  Directions: {},
  State: {},
  gestureHandlerRootHOC: (component) => component,
  PanGestureHandler: View,
  TapGestureHandler: View,
  FlingGestureHandler: View,
  LongPressGestureHandler: View,
  ScrollView: View,
  FlatList: View,
};
