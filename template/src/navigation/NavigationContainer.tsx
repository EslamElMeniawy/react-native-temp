import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { View } from 'react-native';
import { default as Config } from 'react-native-config';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { navigationRef, RootStack, push } from '@src/navigation';
import styles from './styles';

export default React.memo(() => {
  const routeNameRef = React.useRef<string | undefined>(undefined);

  const twoFingerPress = Gesture.Tap()
    .minPointers(2)
    .runOnJS(true)
    .onEnd((_e, success) => {
      if (success && routeNameRef.current !== 'networkLogs') {
        push('networkLogs');
      }
    });

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          await logEvent(getAnalytics(), 'screen_view', {
            firebase_screen: currentRouteName,
            firebase_screen_class: currentRouteName,
          });
        }

        // Save the current route name for later comparison.
        routeNameRef.current = currentRouteName;
      }}
    >
      {Config.ENABLE_LOCAL_LOG === 'true' ? (
        <GestureDetector gesture={twoFingerPress}>
          <View style={styles.container}>
            <RootStack />
          </View>
        </GestureDetector>
      ) : (
        <RootStack />
      )}
    </NavigationContainer>
  );
});
