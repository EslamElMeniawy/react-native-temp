import {
  LoadingDialog,
  getStatusBarHeight,
} from '@eslam-elmeniawy/react-native-common-components';
import {QueryClientProvider} from '@tanstack/react-query';
import * as React from 'react';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {Provider as PaperProvider} from 'react-native-paper';
import {ToastProvider} from 'react-native-toast-notifications';
import {NavigationContainer} from '@src/navigation';
import {ErrorDialog, Toast} from '@modules/components';
import {useAppTheme} from '@modules/theme';
import {queryClient} from '@modules/utils';
import {useFirebaseMessagingInitialization} from './useFirebaseMessagingInitialization';
import {useForegroundMessagesListener} from './useForegroundMessagesListener';
import {useLocalizationInitialization} from './useLocalizationInitialization';
import {useLogInitialization} from './useLogInitialization';
import {useNetworkListener} from './useNetworkListener';
import {useNotificationsInteraction} from './useNotificationsInteraction';
import {useOrientationLocker} from './useOrientationLocker';
import {useReactQueryFocusManager} from './useReactQueryFocusManager';
import {useReactQueryOnlineManager} from './useReactQueryOnlineManager';

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
        <ToastProvider
          placement="top"
          offset={getStatusBarHeight()}
          renderToast={toastOptions => <Toast {...toastOptions} />}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer />
            <ErrorDialog />
            <LoadingDialog />
          </QueryClientProvider>
        </ToastProvider>
      </PaperProvider>
    </KeyboardProvider>
  ) : null;
  // #endregion
});
