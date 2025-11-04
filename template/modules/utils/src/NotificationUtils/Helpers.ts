import {
  fakerNotifications,
  queryNotifications,
  UnreadNotificationsCountLocalStorage,
} from '@modules/features-notifications';
import { UserStore } from '@modules/features-profile';
import { store } from '@modules/store';
import notifee from '@notifee/react-native';
import { default as Config } from 'react-native-config';
import type { ServerError, ApiRequest, Notification } from '@modules/core';
import type { MarkNotificationReadResponse } from '@modules/features-notifications';
import { openNotificationRelatedScreen, queryClient } from '@modules/utils';

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
    notifee.cancelNotification(notification.id);

    if (Config.ENV_NAME === 'Unit Testing') {
      return;
    }

    // Call mark notification read API.
    // TODO: Change params based on API.
    queryClient
      .getMutationCache()
      .build<MarkNotificationReadResponse, ServerError, ApiRequest, unknown>(
        queryClient,
        {
          mutationFn: request =>
            Config.USE_FAKE_API === 'true'
              ? fakerNotifications.markNotificationRead(request)
              : queryNotifications.markNotificationRead(request),
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          },
        },
      )
      .execute({ pathVar: notification.id });
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
  UnreadNotificationsCountLocalStorage.setUnreadNotificationsCount(
    newNotificationsCount,
  );

  // Set new notifications count to redux state.
  store.dispatch(UserStore.setUnreadNotificationsCount(newNotificationsCount));

  // Open notification related screen.
  openNotificationRelatedScreen(
    notification,
    shouldSkipOpenNotificationsScreen,
  );
};
