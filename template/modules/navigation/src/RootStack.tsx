import { FeatureErrorBoundary } from '@modules/components';
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

const WrappedLoginScreen = React.memo(() => (
  <FeatureErrorBoundary featureName="auth">
    <LoginScreen />
  </FeatureErrorBoundary>
));

const WrappedHomeScreen = React.memo(() => (
  <FeatureErrorBoundary featureName="home">
    <HomeScreen />
  </FeatureErrorBoundary>
));

const WrappedNotificationsScreen = React.memo(() => (
  <FeatureErrorBoundary featureName="notifications">
    <NotificationsScreen />
  </FeatureErrorBoundary>
));

const WrappedDebugMenuStack = React.memo(() => (
  <FeatureErrorBoundary featureName="debug-menu">
    <DebugMenuStack />
  </FeatureErrorBoundary>
));

export default React.memo(() => (
  <stack.Navigator
    id="RootStack"
    initialRouteName="splash"
    screenOptions={{ headerShown: false }}
  >
    {/* Screens */}
    <stack.Screen name="splash" component={Splash} />
    <stack.Screen name="login" component={WrappedLoginScreen} />
    <stack.Screen name="home" component={WrappedHomeScreen} />
    <stack.Screen name="notifications" component={WrappedNotificationsScreen} />

    {/* Navigators */}
    {Config.ENABLE_LOCAL_LOG === 'true' ? (
      <stack.Screen name="debugMenuStack" component={WrappedDebugMenuStack} />
    ) : null}

    {/* Modals */}
    <stack.Group screenOptions={{ presentation: 'transparentModal' }}>
      <>{/* TODO: Add modals screens here. */}</>
    </stack.Group>
  </stack.Navigator>
));
