import { test, expect, jest, afterEach } from '@jest/globals';
import notifee from '@notifee/react-native';
import { store } from '@src/store';
import { processNotification } from '@modules/utils/src/NotificationUtils';
import * as Helpers from '@modules/utils/src/NotificationUtils/Helpers';

const clearNotificationsMock = jest
  .spyOn(Helpers, 'clearNotifications')
  .mockImplementation(() => {});

const setApplicationIconBadgeNumberMock = jest
  .spyOn(notifee, 'setBadgeCount')
  .mockImplementation(() => Promise.resolve());

const processUserNotificationMock = jest
  .spyOn(Helpers, 'processUserNotification')
  .mockImplementation(() => {});

afterEach(() => {
  clearNotificationsMock?.mockRestore();
  setApplicationIconBadgeNumberMock?.mockRestore();
  processUserNotificationMock?.mockRestore();
});

const notification = {
  id: '123',
  key: '123',
  title: 'Test',
  message: 'This is a test',
};

const shouldSkipOpenNotificationsScreen = false;

test('should clear the notification successfully when notification is provided', () => {
  const storeMock = jest.spyOn(store, 'getState').mockReturnValue({
    user: { unreadNotificationsCount: 5, apiToken: 'token' },
    dialogs: {},
    networkState: {},
  });

  processNotification(notification, shouldSkipOpenNotificationsScreen);
  expect(clearNotificationsMock).toHaveBeenCalledWith(notification);
  expect(setApplicationIconBadgeNumberMock).toHaveBeenCalledWith(4);
  expect(processUserNotificationMock).toHaveBeenCalled();
  storeMock?.mockRestore();
});

test('should log appropriate messages for debugging', () => {
  jest.spyOn(console, 'info').mockImplementation(() => {});
  processNotification(notification, shouldSkipOpenNotificationsScreen);

  expect(console.info).toHaveBeenCalledWith(
    '## NotificationUtils:: processNotification',
    notification,
    shouldSkipOpenNotificationsScreen,
  );

  expect(console.info).toHaveBeenCalledWith(
    '## NotificationUtils:: stateUnreadNotificationsCount',
    undefined,
  );
});
