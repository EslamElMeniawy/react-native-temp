import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { act } from '@testing-library/react-native';
import { AppState, NativeModules } from 'react-native';
import { useNetworkListener } from '@src/App/useNetworkListener';
import {
  renderHook,
  renderHookWithProviders,
} from '@modules/utils/src/__tests__/TestUtils';
import type { AppStateStatus } from 'react-native';

let appStateListener: ((status: AppStateStatus) => void) | undefined;
const mockAppStateRemove = jest.fn();
let netStateListener: ((state: unknown) => void) | undefined;
const mockNetInfoUnsubscribe = jest.fn();
const mockNetInfoFetch = jest.fn();
const mockHandleNetworkState = jest.fn();

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(callback => {
    netStateListener = callback as any;
    return mockNetInfoUnsubscribe;
  }),
  fetch: jest.fn(() => mockNetInfoFetch() as any),
}));

jest.spyOn(AppState, 'addEventListener').mockImplementation(
  (_event: string, handler: (state: AppStateStatus) => void) => {
    appStateListener = handler;
    return { remove: mockAppStateRemove } as any;
  },
);

jest.mock('../useHandleNetworkState', () => ({
  useHandleNetworkState: () => mockHandleNetworkState,
}));

describe('useNetworkListener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockNetInfoFetch.mockResolvedValue as any)({
      isConnected: true,
      isInternetReachable: true,
    });
    NativeModules.RNCNetInfo = {
      getCurrentState: jest.fn<() => Promise<unknown>>().mockResolvedValue({
        isConnected: true,
        isInternetReachable: true,
      }),
    };
    jest.spyOn(AppState, 'addEventListener').mockImplementation(
      (_event: string, handler: (state: AppStateStatus) => void) => {
        appStateListener = handler;
        return { remove: mockAppStateRemove } as any;
      },
    );
    const netInfo = require('@react-native-community/netinfo');
    (netInfo.addEventListener as jest.Mock).mockImplementation(
      (callback: any) => {
        netStateListener = callback;
        return mockNetInfoUnsubscribe;
      },
    );
    (netInfo.fetch as jest.Mock).mockImplementation(() => mockNetInfoFetch());
  });

  const flushPromises = () => new Promise(resolve => setImmediate(resolve));

  it('handles app resume on iOS and fetches latest state', async () => {
    const { unmount } = await renderHookWithProviders(() =>
      useNetworkListener(),
    );

    await act(async () => {
      appStateListener?.('active');
      await flushPromises();
    });

    expect(mockNetInfoFetch).toHaveBeenCalled();
    expect(mockHandleNetworkState).toHaveBeenCalledWith({
      isConnected: true,
      isInternetReachable: true,
    });

    await unmount();
    expect(mockAppStateRemove).toHaveBeenCalled();
  });

  it('subscribes to network changes', async () => {
    const { unmount } = await renderHook(() => useNetworkListener());

    const netInfoState = { isConnected: false, isInternetReachable: false };
    await act(() => {
      netStateListener?.(netInfoState);
    });

    expect(mockHandleNetworkState).toHaveBeenCalledWith(netInfoState);

    await unmount();
    expect(mockNetInfoUnsubscribe).toHaveBeenCalled();
  });
});
