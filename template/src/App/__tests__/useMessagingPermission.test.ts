import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterAll,
} from '@jest/globals';
import {
  AuthorizationStatus,
  getMessaging,
} from '@react-native-firebase/messaging';
import { act } from '@testing-library/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import { useMessagingPermission } from '@src/App/useMessagingPermission';
import { renderHookWithProviders } from '@modules/utils/src/__tests__/TestUtils';

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

describe('useMessagingPermission', () => {
  const flushPromises = () => new Promise(resolve => setImmediate(resolve));
  const originalOS = Platform.OS;
  const originalRequest = PermissionsAndroid.request;

  beforeEach(() => {
    jest.clearAllMocks();
    (Platform as any).OS = 'android';
    (PermissionsAndroid as any).request = jest.fn(() =>
      mockPermissionsAndroidRequest(),
    );
  });

  afterAll(() => {
    (Platform as any).OS = originalOS;
    PermissionsAndroid.request = originalRequest;
  });

  it('does not request permission when already granted', async () => {
    (mockHasPermission.mockResolvedValue as any)(
      AuthorizationStatus.AUTHORIZED,
    );

    await renderHookWithProviders(() => useMessagingPermission());

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

    await renderHookWithProviders(() => useMessagingPermission());

    await act(async () => {
      await flushPromises();
    });

    expect(mockPermissionsAndroidRequest).toHaveBeenCalled();
    expect(mockRequestPermission).toHaveBeenCalledWith(getMessaging());
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
