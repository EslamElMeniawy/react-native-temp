import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { onlineManager } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-native';
import { useReactQueryOnlineManager } from '@src/App/useReactQueryOnlineManager';

let netInfoHandler:
  | ((state: { isConnected?: boolean; isInternetReachable?: boolean }) => void)
  | undefined;
const mockUnsubscribe = jest.fn();

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(callback => {
    netInfoHandler = callback as any;
    return mockUnsubscribe;
  }),
}));

jest.mock('react-native', () => ({
  ['Platform']: {
    ['OS']: 'ios',
    select: jest.fn(
      (options: Record<string, unknown>) => options.ios || options.default,
    ),
  },
}));

describe('useReactQueryOnlineManager', () => {
  const setOnlineSpy = jest.spyOn(onlineManager, 'setOnline');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('subscribes to netinfo and updates online state', () => {
    const { unmount } = renderHook(() => useReactQueryOnlineManager());

    act(() => {
      netInfoHandler?.({ isConnected: true, isInternetReachable: true });
    });
    expect(setOnlineSpy).toHaveBeenCalledWith(true);

    act(() => {
      netInfoHandler?.({ isConnected: true, isInternetReachable: false });
    });
    expect(setOnlineSpy).toHaveBeenCalledWith(false);

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
