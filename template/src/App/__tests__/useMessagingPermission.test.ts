import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import {
  AuthorizationStatus,
  getMessaging,
} from '@react-native-firebase/messaging';
import { act, renderHook } from '@testing-library/react-native';
import { useMessagingPermission } from '@src/App/useMessagingPermission';

const mockRequestPermission = jest.fn();
const mockHasPermission = jest.fn();
const mockPermissionsAndroidRequest = jest.fn();

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({ messaging: true })),
  requestPermission: jest.fn(
    (messaging: unknown) => mockRequestPermission(messaging) as any,
  ),
  hasPermission: jest.fn(() => mockHasPermission() as any),
  ['AuthorizationStatus']: {
    ['AUTHORIZED']: 1,
    ['PROVISIONAL']: 2,
    ['EPHEMERAL']: 3,
    ['DENIED']: 4,
  },
}));

jest.mock('react-native', () => ({
  ['Platform']: {
    ['OS']: 'android',
    select: jest.fn(
      (options: Record<string, unknown>) => options.android || options.default,
    ),
  },
  ['PermissionsAndroid']: {
    ['PERMISSIONS']: {
      ['POST_NOTIFICATIONS']: 'android.permission.POST_NOTIFICATIONS',
    },
    request: jest.fn(() => mockPermissionsAndroidRequest()),
  },
}));

describe('useMessagingPermission', () => {
  const flushPromises = () => new Promise(resolve => setImmediate(resolve));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not request permission when already granted', async () => {
    (mockHasPermission.mockResolvedValue as any)(
      AuthorizationStatus.AUTHORIZED,
    );

    renderHook(() => useMessagingPermission());

    await act(async () => {
      await flushPromises();
    });

    expect(mockPermissionsAndroidRequest).toHaveBeenCalled();
    expect(mockRequestPermission).not.toHaveBeenCalled();
  });

  it('requests permission and warns when not enabled', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (mockHasPermission.mockResolvedValue as any)(AuthorizationStatus.DENIED);
    (mockRequestPermission.mockResolvedValue as any)(
      AuthorizationStatus.DENIED,
    );

    renderHook(() => useMessagingPermission());

    await act(async () => {
      await flushPromises();
    });

    expect(mockPermissionsAndroidRequest).toHaveBeenCalled();
    expect(mockRequestPermission).toHaveBeenCalledWith(getMessaging());
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
