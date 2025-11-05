import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  DebugMenuScreen,
  NetworkLogsScreen,
} from '@modules/features-debug-menu';
import type { DebugMenuStackParamList } from './DebugMenuStack.types';

const stack = createNativeStackNavigator<
  DebugMenuStackParamList,
  'DebugMenuStack'
>();

export default React.memo(() => (
  <stack.Navigator
    id="DebugMenuStack"
    initialRouteName="debugMenu"
    screenOptions={{ headerShown: false }}
  >
    {/* Screens */}
    <stack.Screen name="debugMenu" component={DebugMenuScreen} />
    <stack.Screen name="networkLogs" component={NetworkLogsScreen} />
  </stack.Navigator>
));
