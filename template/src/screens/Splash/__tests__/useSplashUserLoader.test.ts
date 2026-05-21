import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { waitFor } from '@testing-library/react-native';
import { useSplashUserLoader } from '@src/screens/Splash/useSplashUserLoader';
import { useGetUserDetailsApi, UserStore } from '@modules/domain-user';
import { ApiTokenLocalStorage } from '@modules/features-auth';
import { useAppDispatch } from '@modules/store';
import { saveUserData } from '@modules/utils';
import {
  renderHook,
  renderHookWithProviders,
} from '@modules/utils/src/__tests__/TestUtils';

const mockDispatch = jest.fn();

jest.mock('@modules/features-auth', () => ({
  ['ApiTokenLocalStorage']: {
    getApiToken: jest.fn(),
  },
}));

jest.mock('@modules/domain-user', () => ({
  useGetUserDetailsApi: jest.fn(),
  ['UserStore']: {
    setApiToken: jest.fn(token => ({ type: 'setApiToken', payload: token })),
  },
}));

jest.mock('@modules/store', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('@modules/utils', () => ({
  saveUserData: jest.fn(),
}));

describe('useSplashUserLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('marks user as loaded when no token exists', async () => {
    (ApiTokenLocalStorage.getApiToken as jest.Mock).mockReturnValue(null);
    (useGetUserDetailsApi as jest.Mock).mockReturnValue({
      data: undefined,
      isError: false,
      isSuccess: false,
    });

    const { result } = await renderHookWithProviders(() =>
      useSplashUserLoader(true),
    );

    await waitFor(() => expect(result.current).toBe(true));
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('dispatches token and saves user when present', async () => {
    const apiUser = { id: 'user-1' } as any;
    (ApiTokenLocalStorage.getApiToken as jest.Mock).mockReturnValue('token');
    (useGetUserDetailsApi as jest.Mock).mockReturnValue({
      data: apiUser,
      isError: false,
      isSuccess: true,
    });

    const { result } = await renderHook(() => useSplashUserLoader(true));

    await waitFor(() => expect(result.current).toBe(true));

    expect(UserStore.setApiToken).toHaveBeenCalledWith('token');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'setApiToken',
      payload: 'token',
    });
    expect(saveUserData).toHaveBeenCalledWith(apiUser);
  });
});
