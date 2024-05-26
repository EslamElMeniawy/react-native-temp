import {jest} from '@jest/globals';

jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  unregister: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  requestPermissions: jest.fn(() => Promise.resolve()),
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
  presentLocalNotification: jest.fn(),
  scheduleLocalNotification: jest.fn(),
  cancelLocalNotifications: jest.fn(),
  cancelLocalNotification: jest.fn(),
  clearLocalNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  popInitialNotification: jest.fn(),
  abandonPermissions: jest.fn(),
  checkPermissions: jest.fn(),
  clearAllNotifications: jest.fn(),
  removeAllDeliveredNotifications: jest.fn(),
  getDeliveredNotifications: jest.fn(),
  getScheduledLocalNotifications: jest.fn(),
  removeDeliveredNotifications: jest.fn(),
  invokeApp: jest.fn(),
  getChannels: jest.fn(),
  channelExists: jest.fn(),
  createChannel: jest.fn(),
  channelBlocked: jest.fn(),
  deleteChannel: jest.fn(),
}));
