import messaging from '@react-native-firebase/messaging';
import * as React from 'react';
import {
  getApiToken,
  getUnreadNotificationsCount,
  setUnreadNotificationsCount as setLocalStorageUnreadNotificationsCount,
} from '@src/core';
import {
  useAppDispatch,
  setUnreadNotificationsCount as setStateUnreadNotificationsCount,
} from '@src/store';
import {displayLocalNotification} from '@src/utils';

export const useForegroundMessagesListener = () => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## App::useForegroundMessagesListener:: ${message}`;
  // #endregion

  // #region Redux
  const dispatch = useAppDispatch();
  // #endregion

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
      console.info(getLogMessage('onMessage'), remoteMessage);
      const apiToken = getApiToken();

      if (apiToken) {
        console.info(getLogMessage('User Available'));

        // Increase notifications count.
        const unreadNotificationsCount =
          (getUnreadNotificationsCount() ?? 0) + 1;

        console.info(
          getLogMessage('unreadNotificationsCount'),
          unreadNotificationsCount,
        );

        // Set unread notifications count to local storage and redux.
        setLocalStorageUnreadNotificationsCount(unreadNotificationsCount);
        dispatch(setStateUnreadNotificationsCount(unreadNotificationsCount));

        // Show local notification.
        displayLocalNotification(remoteMessage);
      }
    });

    return unsubscribe;
  }, [dispatch]);
};
