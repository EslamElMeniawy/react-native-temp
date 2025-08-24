import { AppColors } from '@modules/theme';
import notifee from '@notifee/react-native';
import { push } from '@src/navigation';
import { store } from '@src/store';
import { getBundleId } from 'react-native-device-info';
import type { Notification } from '@modules/core';
import { clearNotifications, processUserNotification } from './Helpers';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

const getLogMessage = (message: string) => `## NotificationUtils:: ${message}`;

const packageName: string = getBundleId();
export const defaultChannelId: string = `${packageName}.default_notification_channel`;
export const localChannelId: string = `${packageName}.local_notification_channel`;

/**
 * Process a notification by clearing it, updating the application badge number, and handling user notification.
 *
 * @param notification - The notification to be processed.
 * @param shouldSkipOpenNotificationsScreen - Optional flag to skip opening the notifications screen after processing the notification.
 */
export const processNotification = (
  notification: Notification,
  shouldSkipOpenNotificationsScreen?: boolean,
) => {
  console.info(
    getLogMessage('processNotification'),
    notification,
    shouldSkipOpenNotificationsScreen,
  );

  // Clear notification.
  clearNotifications(notification);

  // Set new badge.
  const { unreadNotificationsCount: stateUnreadNotificationsCount, apiToken } =
    store.getState().user;

  console.info(
    getLogMessage('stateUnreadNotificationsCount'),
    stateUnreadNotificationsCount,
  );

  const newNotificationsCount =
    (stateUnreadNotificationsCount && stateUnreadNotificationsCount > 0
      ? stateUnreadNotificationsCount
      : 1) - 1;

  notifee.setBadgeCount(newNotificationsCount);

  if (apiToken) {
    processUserNotification(
      notification,
      newNotificationsCount,
      shouldSkipOpenNotificationsScreen,
    );
  }
};

/**
 * Opens the notification related screen based on the provided notification and optional flag.
 *
 * @param notification - The notification object containing information like id, title, and message.
 * @param shouldSkipOpenNotificationsScreen - Optional flag to determine whether to skip opening the notifications screen.
 *
 * @returns void
 */
export const openNotificationRelatedScreen = (
  notification: Notification,
  shouldSkipOpenNotificationsScreen?: boolean,
) => {
  console.info(
    getLogMessage('openNotificationRelatedScreen'),
    notification,
    shouldSkipOpenNotificationsScreen,
  );

  // TODO: Determine screen to open and navigate to it.
  if (!shouldSkipOpenNotificationsScreen) {
    push('notifications');
  }
};

/**
 * Display a local notification based on the provided remote message.
 *
 * @param remoteMessage - The remote message containing notification data.
 */
export const displayLocalNotification = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  console.info(getLogMessage('displayLocalNotification'), remoteMessage);

  const dataTitle =
    typeof remoteMessage.data?.title === 'object'
      ? undefined
      : remoteMessage.data?.title;

  const title = remoteMessage.notification?.title
    ? remoteMessage.notification?.title
    : dataTitle;

  console.info(getLogMessage('title'), title);

  const dataBody =
    typeof remoteMessage.data?.body === 'object'
      ? undefined
      : remoteMessage.data?.body;

  const body = remoteMessage.notification?.body
    ? remoteMessage.notification?.body
    : dataBody;

  console.info(getLogMessage('body'), body);

  // If notification body available show local notification.
  if (body) {
    notifee.displayNotification({
      id: remoteMessage.messageId,
      title: title,
      body: body,
      data: remoteMessage.data,
      android: {
        channelId: localChannelId,
        color: AppColors.seed,
        sound: 'default',
        // TODO: Add notifications icon first
        // smallIcon: 'ic_notification',
      },
      ios: { sound: 'default' },
    });
  }
};
