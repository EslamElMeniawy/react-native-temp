import { test, expect, jest, afterEach } from '@jest/globals';
import * as NavigationUtils from '@src/navigation/NavigationUtils';
import { openNotificationRelatedScreen } from '@modules/utils/src/NotificationUtils';

const pushMock = jest.spyOn(NavigationUtils, 'push');

afterEach(() => {
  pushMock?.mockReset();
});

test('should open notifications screen when shouldSkipOpenNotificationsScreen is false', () => {
  const notification = {
    id: 1,
    key: '1',
    title: 'Test',
    message: 'Test message',
  };

  const shouldSkipOpenNotificationsScreen = false;

  openNotificationRelatedScreen(
    notification,
    shouldSkipOpenNotificationsScreen,
  );

  expect(pushMock).toHaveBeenCalledWith('notifications');
});

test('should not open notifications screen when shouldSkipOpenNotificationsScreen is true', () => {
  const notification = {
    id: 1,
    key: '1',
    title: 'Test',
    message: 'Test message',
  };

  const shouldSkipOpenNotificationsScreen = true;

  openNotificationRelatedScreen(
    notification,
    shouldSkipOpenNotificationsScreen,
  );

  expect(pushMock).not.toHaveBeenCalled();
});
