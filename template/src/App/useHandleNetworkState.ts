import * as React from 'react';
import { Toast } from 'toastify-react-native';
import { translate } from '@modules/localization';
import { useAppDispatch, NetworkStateStore } from '@modules/store';
import type { NetInfoState } from '@react-native-community/netinfo';

export const useHandleNetworkState = () => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## App::useHandleNetworkState:: ${message}`;
  // #endregion

  // #region Redux
  const dispatch = useAppDispatch();
  // #endregion

  const checkInternetAvailableState = React.useCallback(
    (state: NetInfoState) => {
      console.info(getLogMessage('checkInternetAvailableState'));
      console.info(getLogMessage('state'), state);

      const isInternetAvailable =
        state.isConnected && state.isInternetReachable;

      console.info(getLogMessage('isInternetAvailable'), isInternetAvailable);

      dispatch(
        NetworkStateStore.setIsInternetAvailable(isInternetAvailable ?? true),
      );
      return isInternetAvailable;
    },
    [dispatch],
  );

  const checkConnectionExpensiveState = React.useCallback(
    (state: NetInfoState) => {
      console.info(getLogMessage('checkConnectionExpensiveState'));
      console.info(getLogMessage('state'), state);
      const isConnectionExpensive = state.details?.isConnectionExpensive;

      console.info(
        getLogMessage('isConnectionExpensive'),
        isConnectionExpensive,
      );

      if (isConnectionExpensive === undefined) {
        dispatch(NetworkStateStore.removeIsConnectionExpensive());
      } else {
        dispatch(
          NetworkStateStore.setIsConnectionExpensive(isConnectionExpensive),
        );
      }
    },
    [dispatch],
  );

  const handleInternetLostToast = React.useCallback(
    (isInternetAvailable: boolean | null) => {
      console.info(getLogMessage('handleInternetLostToast'));

      if (isInternetAvailable === false) {
        Toast.show({ type: 'error', text2: translate('internetLost') });
      } else {
        Toast.hide();
      }
    },
    [],
  );

  /**
   * handleNetworkState
   *
   * Save network state to redux store.
   * Check if not internet then show connection lost toast.
   *
   * @param state The new network state to handle.
   */
  const handleNetworkState = React.useCallback(
    (state: NetInfoState) => {
      console.info(getLogMessage('handleNetworkState'));
      console.info(getLogMessage('state'), state);

      // Check Internet available state.
      const isInternetAvailable = checkInternetAvailableState(state);

      // Check connection expensive state.
      checkConnectionExpensiveState(state);

      // Show internet lost toast if no Internet connection available.
      handleInternetLostToast(isInternetAvailable);
    },
    [
      checkConnectionExpensiveState,
      checkInternetAvailableState,
      handleInternetLostToast,
    ],
  );

  return handleNetworkState;
};
