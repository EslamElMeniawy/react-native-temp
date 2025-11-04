import notifee, { EventType } from '@notifee/react-native';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import * as React from 'react';
import { ApiTokenLocalStorage } from '@modules/features-auth';
import { UnreadNotificationsCountLocalStorage } from '@modules/features-notifications';
import { UserStore } from '@modules/features-profile';
import { useAppDispatch } from '@modules/store';
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
      const apiToken = ApiTokenLocalStorage.getApiToken();

      if (apiToken) {
        console.info(getLogMessage('User Available'));

        // Increase notifications count.
        const unreadNotificationsCount =
          (UnreadNotificationsCountLocalStorage.getUnreadNotificationsCount() ??
            0) + 1;

        console.info(
          getLogMessage('unreadNotificationsCount'),
          unreadNotificationsCount,
        );

        // Set unread notifications count to local storage and redux.
        UnreadNotificationsCountLocalStorage.setUnreadNotificationsCount(
          unreadNotificationsCount,
        );

        dispatch(
          UserStore.setUnreadNotificationsCount(unreadNotificationsCount),
        );

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
