import {default as PushNotificationIOS} from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
import {default as Config} from 'react-native-config';
import {default as PushNotification} from 'react-native-push-notification';
import {
  queryNotifications,
  setUnreadNotificationsCount as setLocalStorageUnreadNotificationsCount,
} from '@src/core';
import type {
  MarkNotificationReadResponse,
  ServerError,
  ApiRequest,
  Notification,
} from '@src/core';
import {
  store,
  setUnreadNotificationsCount as setStateUnreadNotificationsCount,
} from '@src/store';
import {openNotificationRelatedScreen, queryClient} from '@src/utils';

const getLogMessage = (message: string) =>
  `## NotificationUtils::Helpers:: ${message}`;

/**
 * Clears the specified notification by canceling the local notification, removing delivered notifications (for iOS), and marking the notification as read through an API call.
 *
 * @param notification - The notification to be cleared.
 */
export const clearNotifications = (notification: Notification) => {
  console.info(getLogMessage('clearNotifications'), notification);

  if (notification.id && typeof notification.id === 'string') {
    PushNotification.cancelLocalNotification(notification.id);

    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeDeliveredNotifications([notification.id]);
    }

    if (Config.ENV_NAME === 'Unit Testing') {
      return;
    }

    // Call mark notification read API.
    // TODO: Change params based on API.
    queryClient
      .getMutationCache()
      .build<
        MarkNotificationReadResponse,
        ServerError,
        ApiRequest<any, string | number>,
        unknown
      >(queryClient, {
        mutationFn: request => queryNotifications.markNotificationRead(request),
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['notifications']});
        },
      })
      .execute({pathVar: notification.id});
  }
};

/**
 * Process a user notification by updating the unread notifications count in the
 * local storage and Redux state and opening the related screen.
 *
 * @param notification The notification object containing information like id, title, and message.
 * @param newNotificationsCount The new count of unread notifications to be set in the Redux state.
 * @param shouldSkipOpenNotificationsScreen Optional. A boolean flag indicating whether to skip opening the notifications screen.
 *
 * @returns void
 */
export const processUserNotification = (
  notification: Notification,
  newNotificationsCount: number,
  shouldSkipOpenNotificationsScreen?: boolean,
) => {
  console.info(
    getLogMessage('processUserNotification'),
    notification,
    newNotificationsCount,
    shouldSkipOpenNotificationsScreen,
  );

  // Set new notifications count to local storage.
  setLocalStorageUnreadNotificationsCount(newNotificationsCount);

  // Set new notifications count to redux state.
  store.dispatch(setStateUnreadNotificationsCount(newNotificationsCount));

  // Open notification related screen.
  openNotificationRelatedScreen(
    notification,
    shouldSkipOpenNotificationsScreen,
  );
};
