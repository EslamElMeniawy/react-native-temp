import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

jest.mock('@modules/store', () => ({
  useAppDispatch: jest.fn(),
  ['NetworkStateStore']: {
    setIsInternetAvailable: jest.fn(payload => ({
      type: 'setIsInternetAvailable',
      payload,
    })),
    setIsConnectionExpensive: jest.fn(payload => ({
      type: 'setIsConnectionExpensive',
      payload,
    })),
    removeIsConnectionExpensive: jest.fn(() => ({
      type: 'removeIsConnectionExpensive',
    })),
  },
}));

jest.mock('toastify-react-native', () => ({
  ['Toast']: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));

jest.mock('@modules/localization', () => ({
  translate: jest.fn(),
}));

import { Toast } from 'toastify-react-native';
import { useHandleNetworkState } from '@src/App/useHandleNetworkState';
import { translate } from '@modules/localization';
import { NetworkStateStore, useAppDispatch } from '@modules/store';
import type { NetInfoState } from '@react-native-community/netinfo';

const testOnlineState = (): NetInfoState =>
  ({
    type: 'wifi',
    isConnected: true,
    isInternetReachable: true,
    isWifiEnabled: true,
    details: undefined,
  }) as any as NetInfoState;

const testOfflineState = (): NetInfoState =>
  ({
    type: 'wifi',
    isConnected: true,
    isInternetReachable: false,
    isWifiEnabled: true,
    details: { isConnectionExpensive: true },
  }) as any as NetInfoState;

const verifyOnlineStateDispatch = (mockDispatch: jest.Mock): void => {
  expect(NetworkStateStore.setIsInternetAvailable).toHaveBeenCalledWith(true);
  expect(NetworkStateStore.removeIsConnectionExpensive).toHaveBeenCalled();
  expect(mockDispatch).toHaveBeenCalledTimes(2);
  expect(Toast.hide).toHaveBeenCalled();
};

const verifyOfflineStateDispatch = (): void => {
  expect(NetworkStateStore.setIsInternetAvailable).toHaveBeenCalledWith(false);
  expect(NetworkStateStore.setIsConnectionExpensive).toHaveBeenCalledWith(true);
  expect(Toast.show).toHaveBeenCalledWith({
    type: 'error',
    text2: 'internetLost',
  });
};

describe('useHandleNetworkState', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (translate as any as jest.Mock).mockReturnValue('internetLost');
  });

  it('stores connectivity and hides toast when online', () => {
    const { result } = renderHook(() => useHandleNetworkState());
    const state = testOnlineState();
    result.current(state);
    verifyOnlineStateDispatch(mockDispatch);
  });

  it('stores expensive flag and shows toast when offline', () => {
    const { result } = renderHook(() => useHandleNetworkState());
    const state = testOfflineState();
    result.current(state);
    verifyOfflineStateDispatch();
  });
});
