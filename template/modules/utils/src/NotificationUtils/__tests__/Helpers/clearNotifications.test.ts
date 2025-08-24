import { test, expect, jest, afterEach } from '@jest/globals';
import notifee from '@notifee/react-native';
import { clearNotifications } from '@modules/utils/src/NotificationUtils/Helpers';

const mockCancelLocalNotification = jest.spyOn(notifee, 'cancelNotification');

afterEach(() => {
  mockCancelLocalNotification?.mockClear();
});

test('should clear local notification when notification ID is a string', () => {
  const notification = {
    id: '123',
    key: '123',
    title: 'Test',
    message: 'Test message',
  };

  clearNotifications(notification);
  expect(mockCancelLocalNotification).toHaveBeenCalledWith('123');
});

test('should not clear local notification when notification ID is undefined or null', () => {
  const notification = {
    id: undefined,
    key: '',
    title: 'Test',
    message: 'Test message',
  };

  clearNotifications(notification);
  expect(mockCancelLocalNotification).not.toHaveBeenCalled();
});

test('should not clear notification when ID is not a string', () => {
  const notification = {
    id: 123,
    key: '123',
    title: 'Test',
    message: 'Test message',
  };

  clearNotifications(notification);
  expect(mockCancelLocalNotification).not.toHaveBeenCalled();
});

test('should not clear iOS notification when platform is not iOS', () => {
  const notification = {
    id: '123',
    key: '123',
    title: 'Test',
    message: 'Test message',
  };

  clearNotifications(notification);
  expect(mockCancelLocalNotification).toHaveBeenCalledWith('123');
});
