import { LoginScreen } from '@modules/features-auth';
import { DebugMenuStack } from '@modules/features-debug-menu';
import { HomeScreen } from '@modules/features-home';
import { NotificationsScreen } from '@modules/features-notifications';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Splash } from '@src/screens';
import * as React from 'react';
import { default as Config } from 'react-native-config';
import type { RootStackParamList } from './RootStack.types';

const stack = createNativeStackNavigator<RootStackParamList, 'RootStack'>();

export default React.memo(() => (
  <stack.Navigator
    id="RootStack"
    initialRouteName="splash"
    screenOptions={{ headerShown: false }}
  >
    {/* Screens */}
    <stack.Screen name="splash" component={Splash} />
    <stack.Screen name="login" component={LoginScreen} />
    <stack.Screen name="home" component={HomeScreen} />
    <stack.Screen name="notifications" component={NotificationsScreen} />

    {/* Navigators */}
    {Config.ENABLE_LOCAL_LOG === 'true' ? (
      <stack.Screen name="debugMenuStack" component={DebugMenuStack} />
    ) : null}

    {/* Modals */}
    <stack.Group screenOptions={{ presentation: 'transparentModal' }}>
      <>{/* TODO: Add modals screens here. */}</>
    </stack.Group>
  </stack.Navigator>
));
