import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { onlineManager } from '@tanstack/react-query';
import { act } from '@testing-library/react-native';
import { useReactQueryOnlineManager } from '@src/App/useReactQueryOnlineManager';
import { renderHookWithProviders } from '@modules/utils/src/__tests__/TestUtils';

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

describe('useReactQueryOnlineManager', () => {
  const setOnlineSpy = jest.spyOn(onlineManager, 'setOnline');

  beforeEach(() => {
    jest.resetAllMocks();
    netInfoHandler = undefined;
    const netInfo = require('@react-native-community/netinfo');
    (netInfo.addEventListener as jest.Mock).mockImplementation(
      (callback: any) => {
        netInfoHandler = callback;
        return mockUnsubscribe;
      },
    );
  });

  it('subscribes to netinfo and updates online state', async () => {
    const { unmount } = await renderHookWithProviders(() =>
      useReactQueryOnlineManager(),
    );

    await act(() => {
      netInfoHandler?.({ isConnected: true, isInternetReachable: true });
    });
    expect(setOnlineSpy).toHaveBeenCalledWith(true);

    await act(() => {
      netInfoHandler?.({ isConnected: true, isInternetReachable: false });
    });
    expect(setOnlineSpy).toHaveBeenCalledWith(false);

    await unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
