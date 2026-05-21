import { configureLog } from '@eslam-elmeniawy/react-native-common-components';
import * as React from 'react';
import { default as Config } from 'react-native-config';
import { getApplicationName } from 'react-native-device-info';
import { startNetworkLogging } from 'react-native-network-logger';
import Shake from 'react-native-shake';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import {
  QueryClientManager,
  reactotronReactQuery,
} from 'reactotron-react-query';
import { localStorage } from '@modules/core';
import { getCurrentRouteName, push } from '@modules/navigation';
import { queryClient } from '@modules/utils';
import type { ReactotronReactNative } from 'reactotron-react-native';

const createPlugins = (queryClientManager: QueryClientManager) => {
  const pluginCreators = [reactotronReactQuery(queryClientManager)];

  if (localStorage) {
    pluginCreators.push(
      mmkvPlugin<ReactotronReactNative>({ storage: localStorage }),
    );
  }

  return pluginCreators;
};

const setupShakeListener = () =>
  Shake.addListener(() => {
    if (
      getCurrentRouteName() !== 'debugMenu' &&
      getCurrentRouteName() !== 'networkLogs'
    ) {
      push('debugMenuStack', { screen: 'debugMenu' });
    }
  });

const filterReactotronNetworking = (
  reactotron: ReactotronReactNative | null | undefined,
) => {
  if (!reactotron) {
    return;
  }

  const originalApiResponse = reactotron.apiResponse?.bind(reactotron);

  if (originalApiResponse) {
    reactotron.apiResponse = (request, response, duration) => {
      if (/generate_204/.test(request?.url ?? '')) {
        return;
      }

      originalApiResponse(request, response, duration);
    };
  }
};

export const useLogInitialization = () => {
  React.useEffect(() => {
    const appName = getApplicationName();
    const isLocalLogEnable = Config.ENABLE_LOCAL_LOG === 'true';
    const queryClientManager = new QueryClientManager({ queryClient });
    const pluginCreators = createPlugins(queryClientManager);

    const reactotron = configureLog?.({
      appName: appName,
      firebaseLogLevels:
        Config.ENABLE_FIREBASE_LOG === 'true'
          ? ['LOG', 'WARN', 'ERROR']
          : undefined,
      isLocalLogEnable: isLocalLogEnable,
      pluginCreators,
      clientOptions: {
        onDisconnect: () => {
          queryClientManager.unsubscribe();
        },
      },
    });

    if (isLocalLogEnable) {
      filterReactotronNetworking(reactotron);

      startNetworkLogging({
        ignoredPatterns: [/^HEAD /, /generate_204/],
      });
    }

    const shakeSubscription = isLocalLogEnable
      ? setupShakeListener()
      : undefined;

    return () => {
      shakeSubscription?.remove();
    };
  }, []);
};
