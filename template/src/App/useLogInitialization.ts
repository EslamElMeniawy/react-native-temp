import {configureLog} from '@eslam-elmeniawy/react-native-common-components';
import * as React from 'react';
import {default as Config} from 'react-native-config';
import {getApplicationName} from 'react-native-device-info';
import {startNetworkLogging} from 'react-native-network-logger';
import Shake from 'react-native-shake';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import {QueryClientManager, reactotronReactQuery} from 'reactotron-react-query';
import {getCurrentRouteName, push} from '@src/navigation';
import {localStorage} from '@modules/core';
import {queryClient} from '@modules/utils';
import type {ReactotronReactNative} from 'reactotron-react-native';

export const useLogInitialization = () => {
  React.useEffect(() => {
    const appName = getApplicationName();
    const isLocalLogEnable = Config.ENABLE_LOCAL_LOG === 'true';

    const queryClientManager = new QueryClientManager({queryClient});

    configureLog?.({
      appName: appName,
      firebaseLogLevels:
        Config.ENABLE_FIREBASE_LOG === 'true'
          ? ['LOG', 'WARN', 'ERROR']
          : undefined,
      isLocalLogEnable: isLocalLogEnable,
      pluginCreators: [
        mmkvPlugin<ReactotronReactNative>({storage: localStorage}),
        reactotronReactQuery(queryClientManager),
      ],
      clientOptions: {
        onDisconnect: () => {
          queryClientManager.unsubscribe();
        },
      },
    });

    if (isLocalLogEnable) {
      startNetworkLogging({ignoredPatterns: [/^HEAD /]});
    }

    const shakeSubscription = isLocalLogEnable
      ? Shake.addListener(() => {
          if (getCurrentRouteName() !== 'networkLogs') {
            push('networkLogs');
          }
        })
      : undefined;

    return () => {
      shakeSubscription?.remove();
    };
  }, []);
};
