import { describe, expect, it, jest, beforeEach } from '@jest/globals';

const mockDispatch = jest.fn();
let onMessageCallback: ((message: any) => void) | undefined;
let onForegroundEventCallback: ((params: any) => void) | undefined;
const mockOnMessageUnsubscribe = jest.fn();
const mockNotifeeUnsubscribe = jest.fn();

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({ messaging: true })),
  onMessage: jest.fn((_messaging, callback) => {
    onMessageCallback = callback as any;
    return mockOnMessageUnsubscribe;
  }),
}));

jest.mock('@notifee/react-native', () => ({
  ['EventType']: { ['PRESS']: 'PRESS' },
  default: {},
  onForegroundEvent: jest.fn(callback => {
    onForegroundEventCallback = callback as any;
    return mockNotifeeUnsubscribe;
  }),
}));

jest.mock('@modules/features-auth', () => ({
  ['ApiTokenLocalStorage']: {
    getApiToken: jest.fn(),
  },
}));

jest.mock('@modules/features-notifications', () => ({
  ['UnreadNotificationsCountLocalStorage']: {
    getUnreadNotificationsCount: jest.fn(),
    setUnreadNotificationsCount: jest.fn(),
  },
}));

jest.mock('@modules/features-profile', () => ({
  ['UserStore']: {
    setUnreadNotificationsCount: jest.fn(count => ({
      type: 'setUnreadNotificationsCount',
      payload: count,
    })),
  },
}));

jest.mock('@modules/store', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('@modules/utils', () => ({
  displayLocalNotification: jest.fn(),
  processNotification: jest.fn(),
}));

import { EventType } from '@notifee/react-native';
import { act, renderHook } from '@testing-library/react-native';
import { useForegroundMessagesListener } from '@src/App/useForegroundMessagesListener';
import { ApiTokenLocalStorage } from '@modules/features-auth';
import { UnreadNotificationsCountLocalStorage } from '@modules/features-notifications';
import { useAppDispatch } from '@modules/store';
import { displayLocalNotification, processNotification } from '@modules/utils';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

describe('useForegroundMessagesListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (ApiTokenLocalStorage.getApiToken as jest.Mock).mockReturnValue('token');
    (
      UnreadNotificationsCountLocalStorage.getUnreadNotificationsCount as jest.Mock
    ).mockReturnValue(1);
  });

  it('increments unread count and shows notification when message arrives with token', () => {
    renderHook(() => useForegroundMessagesListener());

    const message = {
      messageId: 'm1',
      notification: { title: 'T', body: 'B' },
    } as FirebaseMessagingTypes.RemoteMessage;

    act(() => {
      onMessageCallback?.(message);
    });

    expect(
      UnreadNotificationsCountLocalStorage.setUnreadNotificationsCount,
    ).toHaveBeenCalledWith(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'setUnreadNotificationsCount',
      payload: 2,
    });
    expect(displayLocalNotification).toHaveBeenCalledWith(message);
  });

  it('processes foreground press events', () => {
    renderHook(() => useForegroundMessagesListener());

    act(() => {
      onForegroundEventCallback?.({
        type: EventType.PRESS,
        detail: { notification: { id: 'n1', title: 'Hello', body: 'World' } },
      });
    });

    expect(processNotification).toHaveBeenCalledWith({
      id: 'n1',
      key: 'n1',
      title: 'Hello',
      message: 'World',
    });
  });
});
