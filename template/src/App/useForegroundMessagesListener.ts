import notifee, { EventType } from '@notifee/react-native';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import * as React from 'react';
import {
  useAppDispatch,
  setUnreadNotificationsCount as setStateUnreadNotificationsCount,
} from '@src/store';
import {
  getApiToken,
  getUnreadNotificationsCount,
  setUnreadNotificationsCount as setLocalStorageUnreadNotificationsCount,
} from '@modules/core';
import { displayLocalNotification, processNotification } from '@modules/utils';

export const useForegroundMessagesListener = () => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## App::useForegroundMessagesListener:: ${message}`;
  // #endregion

  // #region Redux
  const dispatch = useAppDispatch();
  // #endregion

  React.useEffect(() => {
    const unsubscribe = onMessage(getMessaging(), remoteMessage => {
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

  React.useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      console.info(getLogMessage('onForegroundEvent'), type, detail);

      if (type === EventType.PRESS) {
        processNotification({
          id: detail?.notification?.id,
          key: detail?.notification?.id ?? '',
          title: detail?.notification?.title,
          message: detail?.notification?.body,
        });
      }
    });

    return unsubscribe;
  }, []);
};
