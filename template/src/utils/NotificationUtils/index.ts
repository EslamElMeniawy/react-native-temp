import {getBundleId} from 'react-native-device-info';
import {default as PushNotification} from 'react-native-push-notification';
import type {Notification} from '@src/core';
import {push} from '@src/navigation';
import {store} from '@src/store';
import {AppColors} from '@src/utils';
import {clearNotifications, processUserNotification} from './Helpers';
import type {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

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
  const {unreadNotificationsCount: stateUnreadNotificationsCount, apiToken} =
    store.getState().user;

  console.info(
    getLogMessage('stateUnreadNotificationsCount'),
    stateUnreadNotificationsCount,
  );

  const newNotificationsCount = (stateUnreadNotificationsCount ?? 1) - 1;
  PushNotification.setApplicationIconBadgeNumber(newNotificationsCount);

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
    PushNotification.localNotification({
      title: title,
      message: body,
      bigText: body,
      color: AppColors.seed,
      channelId: localChannelId,
      soundName: 'default',
      messageId: remoteMessage.messageId,
      userInfo: remoteMessage.data,
    });
  }
};
