import { test, expect, jest } from '@jest/globals';
import * as LocalStorage from '@modules/core/src/LocalStorage/unreadNotificationsCount';
import {
  store,
  setUnreadNotificationsCount as setStateUnreadNotificationsCount,
} from '@src/store';
import * as NotificationUtils from '@modules/utils/src/NotificationUtils';
import { processUserNotification } from '@modules/utils/src/NotificationUtils/Helpers';

const notification = {
  id: 1,
  key: '1',
  title: 'Test',
  message: 'Test message',
};

const newNotificationsCount = 5;
const shouldSkipOpenNotificationsScreen = false;

test('should update unread notifications count in local storage when invoked', () => {
  jest.spyOn(LocalStorage, 'setUnreadNotificationsCount');

  processUserNotification(
    notification,
    newNotificationsCount,
    shouldSkipOpenNotificationsScreen,
  );

  expect(LocalStorage.setUnreadNotificationsCount).toHaveBeenCalledWith(
    newNotificationsCount,
  );
});

test('should update unread notifications count in redux state when invoked', () => {
  jest.spyOn(store, 'dispatch');

  processUserNotification(
    notification,
    newNotificationsCount,
    shouldSkipOpenNotificationsScreen,
  );

  expect(store.dispatch).toHaveBeenCalledWith(
    setStateUnreadNotificationsCount(newNotificationsCount),
  );
});

test('should open the related screen for the notification when invoked', () => {
  jest.spyOn(NotificationUtils, 'openNotificationRelatedScreen');

  processUserNotification(
    notification,
    newNotificationsCount,
    shouldSkipOpenNotificationsScreen,
  );

  expect(NotificationUtils.openNotificationRelatedScreen).toHaveBeenCalledWith(
    notification,
    shouldSkipOpenNotificationsScreen,
  );
});

test('should log the process of handling the notification', () => {
  jest.spyOn(console, 'info');

  processUserNotification(
    notification,
    newNotificationsCount,
    shouldSkipOpenNotificationsScreen,
  );

  expect(console.info).toHaveBeenCalledWith(
    '## NotificationUtils::Helpers:: processUserNotification',
    notification,
    newNotificationsCount,
    shouldSkipOpenNotificationsScreen,
  );
});
