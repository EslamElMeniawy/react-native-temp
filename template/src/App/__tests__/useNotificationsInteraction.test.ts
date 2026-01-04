import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { useNotificationsInteraction } from '@src/App/useNotificationsInteraction';
import { processNotification } from '@modules/utils';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

const mockOnNotificationOpenedApp = jest.fn();
const mockGetInitialNotification = jest.fn();
let openedCallback:
  | ((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => void)
  | undefined;

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({ messaging: true })),
  onNotificationOpenedApp: jest.fn((messaging, callback) => {
    openedCallback = callback as any;
    return mockOnNotificationOpenedApp(messaging, callback) as jest.Mock;
  }),
  getInitialNotification: jest.fn(() => mockGetInitialNotification() as any),
}));

jest.mock('@modules/utils', () => ({
  processNotification: jest.fn(),
}));

const createRemoteMessage = (
  overrides: Partial<FirebaseMessagingTypes.RemoteMessage> = {},
): FirebaseMessagingTypes.RemoteMessage =>
  ({
    messageId: '123',
    data: {},
    notification: { title: 'Title', body: 'Body' },
    ...overrides,
  }) as any;

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

describe('useNotificationsInteraction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockGetInitialNotification.mockResolvedValue as any)(
      createRemoteMessage(),
    );
  });

  it('processes the initial notification if present', async () => {
    renderHook(() => useNotificationsInteraction());

    await act(async () => {
      await flushPromises();
    });

    expect(processNotification).toHaveBeenCalledWith({
      id: '123',
      key: '123',
      title: 'Title',
      message: 'Body',
    });
  });

  it('handles notification opened events', () => {
    (mockGetInitialNotification.mockResolvedValue as any)(null);
    renderHook(() => useNotificationsInteraction());

    const dataMessage = createRemoteMessage({
      messageId: '456',
      notification: undefined,
      data: { title: 'DataTitle', body: 'DataBody' },
    });

    act(() => {
      openedCallback?.(dataMessage);
    });

    expect(processNotification).toHaveBeenCalledWith({
      id: '456',
      key: '456',
      title: 'DataTitle',
      message: 'DataBody',
    });
  });
});
