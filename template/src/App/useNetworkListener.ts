import {
  addEventListener as netInfoAddEventListener,
  fetch as netInfoFetch,
} from '@react-native-community/netinfo';
import * as React from 'react';
import { AppState, NativeModules, Platform } from 'react-native';
import { useHandleNetworkState } from './useHandleNetworkState';
import type { AppStateStatus } from 'react-native';

export const useNetworkListener = () => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## App::useNetworkListener:: ${message}`;
  // #endregion

  const handleNetworkState = useHandleNetworkState();

  React.useEffect(() => {
    const handleAppState = async (nextAppState: AppStateStatus) => {
      console.info(getLogMessage('App state changed'));
      console.info(getLogMessage('nextAppState'), nextAppState);

      if (Platform.OS === 'ios' && nextAppState === 'active') {
        const newNetInfo =
          await NativeModules.RNCNetInfo.getCurrentState('wifi');

        console.info(getLogMessage('newNetInfo'), newNetInfo);

        netInfoFetch().then(state => {
          console.info(getLogMessage('state'), state);
          handleNetworkState(state);
        });
      }
    };

    const subAppState = AppState.addEventListener('change', nextAppState => {
      handleAppState(nextAppState);
    });

    return () => {
      if (subAppState) {
        subAppState.remove();
      }
    };
  }, [handleNetworkState]);

  React.useEffect(() => {
    const unsubscribeNetState = netInfoAddEventListener(state => {
      console.info(getLogMessage('Network state changed'));
      console.info(getLogMessage('state'), state);
      handleNetworkState(state);
    });

    return () => {
      unsubscribeNetState();
    };
  }, [handleNetworkState]);
};
