import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {default as Config} from 'react-native-config';
import type {RootStackParamList} from '@src/navigation';
import {Splash, NetworkLogs, Login, Home, Notifications} from '@src/screens';

const stack = createNativeStackNavigator<RootStackParamList, 'RootStack'>();

export default React.memo(() => (
  <stack.Navigator
    id="RootStack"
    initialRouteName="splash"
    screenOptions={{headerShown: false}}>
    {/* Screens */}
    <stack.Screen name="splash" component={Splash} />
    {Config.ENABLE_LOCAL_LOG === 'true' ? (
      <stack.Screen name="networkLogs" component={NetworkLogs} />
    ) : null}
    <stack.Screen name="login" component={Login} />
    <stack.Screen name="home" component={Home} />
    <stack.Screen name="notifications" component={Notifications} />

    {/* Navigators */}
    {/* TODO: Add nested navigators here. */}

    {/* Modals */}
    <stack.Group
      screenOptions={{
        presentation: 'transparentModal',
      }}>
      <>{/* TODO: Add modals screens here. */}</>
    </stack.Group>
  </stack.Navigator>
));
