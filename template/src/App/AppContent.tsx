import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import * as React from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider as PaperProvider } from 'react-native-paper';
import { ToastManager, ErrorDialog, LoadingDialog } from '@modules/components';
import { httpClient, localStorage, ServiceProvider } from '@modules/core';
import { NavigationContainer } from '@modules/navigation';
import { useAppTheme } from '@modules/theme';
import { clientPersister, queryClient } from '@modules/utils';
import { useInitialization } from './initialization';

export default React.memo(() => {
  const { isReady } = useInitialization();
  const theme = useAppTheme();

  // #region UI
  return isReady ? (
    <ServiceProvider httpClient={httpClient} localStorage={localStorage}>
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
    </ServiceProvider>
  ) : null;
  // #endregion
});
