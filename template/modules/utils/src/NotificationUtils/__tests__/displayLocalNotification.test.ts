import { test, expect, jest, afterEach } from '@jest/globals';
import { AppColors } from '@modules/theme';
import notifee from '@notifee/react-native';
import {
  displayLocalNotification,
  localChannelId,
} from '@modules/utils/src/NotificationUtils';

const mockLocalNotification = jest.spyOn(notifee, 'displayNotification');

afterEach(() => {
  mockLocalNotification?.mockRestore();
});

test('should display notification when body is available', () => {
  const remoteMessage = {
    notification: { title: 'Test Title', body: 'Test Body' },
    data: {},
    messageId: '12345',
    fcmOptions: {},
  };

  displayLocalNotification(remoteMessage);

  expect(mockLocalNotification).toHaveBeenCalledWith({
    id: '12345',
    title: 'Test Title',
    body: 'Test Body',
    data: {},
    android: {
      channelId: localChannelId,
      color: AppColors.seed,
      sound: 'default',
      // TODO: Add notifications icon first
      // smallIcon: 'ic_notification',
    },
    ios: { sound: 'default' },
  });
});

test('should handle missing title and body gracefully', () => {
  const remoteMessage = {
    notification: {},
    data: {},
    messageId: '12345',
    fcmOptions: {},
  };

  displayLocalNotification(remoteMessage);
  expect(mockLocalNotification).not.toHaveBeenCalled();
});

test('should use title from remoteMessage.data when notification title is not available', () => {
  const remoteMessage = {
    notification: { body: 'Test Body' },
    data: { title: 'Test Title from data' },
    messageId: '12345',
    fcmOptions: {},
  };

  displayLocalNotification(remoteMessage);

  expect(mockLocalNotification).toHaveBeenCalledWith({
    id: '12345',
    title: 'Test Title from data',
    body: 'Test Body',
    data: { title: 'Test Title from data' },
    android: {
      channelId: localChannelId,
      color: AppColors.seed,
      sound: 'default',
      // TODO: Add notifications icon first
      // smallIcon: 'ic_notification',
    },
    ios: { sound: 'default' },
  });
});

test('should use body from remoteMessage.data when notification body is not available', () => {
  const remoteMessage = {
    notification: {},
    data: { body: 'Test Body from data' },
    messageId: '12345',
    fcmOptions: {},
  };

  displayLocalNotification(remoteMessage);

  expect(mockLocalNotification).toHaveBeenCalledWith({
    id: '12345',
    title: undefined,
    body: 'Test Body from data',
    data: { body: 'Test Body from data' },
    android: {
      channelId: localChannelId,
      color: AppColors.seed,
      sound: 'default',
      // TODO: Add notifications icon first
      // smallIcon: 'ic_notification',
    },
    ios: { sound: 'default' },
  });
});

test('should handle title and body as objects in remoteMessage.data gracefully', () => {
  const remoteMessage = {
    notification: {},
    data: { title: { value: 'Test Title' }, body: { value: 'Test Body' } },
    messageId: '12345',
    fcmOptions: {},
  };

  displayLocalNotification(remoteMessage);
  expect(mockLocalNotification).not.toHaveBeenCalled();
});
