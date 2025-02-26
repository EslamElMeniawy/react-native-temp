import {
  getMessaging,
  isAutoInitEnabled,
  setAutoInitEnabled,
} from '@react-native-firebase/messaging';
import * as React from 'react';

export const useMessagingAutoInitialize = () => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## App::useMessagingAutoInitialize:: ${message}`;
  // #endregion

  React.useEffect(() => {
    /**
     * checkMessagingAutoInitialize
     *
     * Check if auto initialize not enabled then enable it.
     */
    const checkMessagingAutoInitialize = () => {
      console.info(getLogMessage('checkMessagingAutoInitialize'));
      const messaging = getMessaging();

      if (!isAutoInitEnabled(messaging)) {
        setAutoInitEnabled(messaging, true);
      }
    };

    checkMessagingAutoInitialize();
  }, []);
};
