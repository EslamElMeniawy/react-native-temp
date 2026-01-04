import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { useNetworkListener } from '@src/App/useNetworkListener';
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

jest.mock('react-native', () => ({
  ['Platform']: {
    ['OS']: 'ios',
    select: jest.fn(
      (options: Record<string, unknown>) => options.ios || options.default,
    ),
  },
  ['NativeModules']: {
    ['RNCNetInfo']: {
      getCurrentState: (jest.fn() as any).mockResolvedValue({}),
    },
  },
  ['AppState']: {
    addEventListener: jest.fn(
      (_event: string, handler: (status: AppStateStatus) => void) => {
        appStateListener = handler;
        return { remove: mockAppStateRemove };
      },
    ),
  },
}));

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
  });

  const flushPromises = () => new Promise(resolve => setImmediate(resolve));

  it('handles app resume on iOS and fetches latest state', async () => {
    const { unmount } = renderHook(() => useNetworkListener());

    await act(async () => {
      appStateListener?.('active');
      await flushPromises();
    });

    expect(mockNetInfoFetch).toHaveBeenCalled();
    expect(mockHandleNetworkState).toHaveBeenCalledWith({
      isConnected: true,
      isInternetReachable: true,
    });

    unmount();
    expect(mockAppStateRemove).toHaveBeenCalled();
  });

  it('subscribes to network changes', () => {
    const { unmount } = renderHook(() => useNetworkListener());

    const netInfoState = { isConnected: false, isInternetReachable: false };
    act(() => {
      netStateListener?.(netInfoState);
    });

    expect(mockHandleNetworkState).toHaveBeenCalledWith(netInfoState);

    unmount();
    expect(mockNetInfoUnsubscribe).toHaveBeenCalled();
  });
});
