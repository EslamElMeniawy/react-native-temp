import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useSplashUserLoader } from '@src/screens/Splash/useSplashUserLoader';
import { ApiTokenLocalStorage } from '@modules/features-auth';
import { useGetUserDetailsApi, UserStore } from '@modules/features-profile';
import { useAppDispatch } from '@modules/store';
import { saveUserData } from '@modules/utils';

const mockDispatch = jest.fn();

jest.mock('@modules/features-auth', () => ({
  ['ApiTokenLocalStorage']: {
    getApiToken: jest.fn(),
  },
}));

jest.mock('@modules/features-profile', () => ({
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

    const { result } = renderHook(() => useSplashUserLoader(true));

    await waitFor(() => expect(result.current).toBe(true));
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('dispatches token and saves user when present', async () => {
    const apiUser = { id: 'user-1' };
    (ApiTokenLocalStorage.getApiToken as jest.Mock).mockReturnValue('token');
    (useGetUserDetailsApi as jest.Mock).mockReturnValue({
      data: apiUser,
      isError: false,
      isSuccess: true,
    });

    const { result } = renderHook(() => useSplashUserLoader(true));

    await waitFor(() => expect(result.current).toBe(true));

    expect(UserStore.setApiToken).toHaveBeenCalledWith('token');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'setApiToken',
      payload: 'token',
    });
    expect(saveUserData).toHaveBeenCalledWith(apiUser);
  });
});
