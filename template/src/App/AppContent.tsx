import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import * as React from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@src/navigation';
import { ToastManager, ErrorDialog, LoadingDialog } from '@modules/components';
import { useAppTheme } from '@modules/theme';
import { clientPersister, queryClient } from '@modules/utils';
import { useFirebaseMessagingInitialization } from './useFirebaseMessagingInitialization';
import { useForegroundMessagesListener } from './useForegroundMessagesListener';
import { useLocalizationInitialization } from './useLocalizationInitialization';
import { useLogInitialization } from './useLogInitialization';
import { useNetworkListener } from './useNetworkListener';
import { useNotificationsInteraction } from './useNotificationsInteraction';
import { useOrientationLocker } from './useOrientationLocker';
import { useReactQueryFocusManager } from './useReactQueryFocusManager';
import { useReactQueryOnlineManager } from './useReactQueryOnlineManager';

export default React.memo(() => {
  useLogInitialization();
  const languageLoaded = useLocalizationInitialization();
  useOrientationLocker();
  useNetworkListener();
  useReactQueryFocusManager();
  useReactQueryOnlineManager();
  useFirebaseMessagingInitialization();
  useForegroundMessagesListener();
  useNotificationsInteraction();
  const theme = useAppTheme();

  // #region UI
  return languageLoaded ? (
    <KeyboardProvider>
      <PaperProvider theme={theme}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: clientPersister }}
        >
          <NavigationContainer />
          <ErrorDialog />
          <LoadingDialog />
        </PersistQueryClientProvider>
        <ToastManager />
      </PaperProvider>
    </KeyboardProvider>
  ) : null;
  // #endregion
});
