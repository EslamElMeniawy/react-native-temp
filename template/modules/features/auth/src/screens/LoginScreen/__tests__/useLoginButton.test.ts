import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { DialogsStore, useAppDispatch } from '@modules/store';
import { renderHookWithProviders, saveUserDataOpenHome } from '@modules/utils';
import { act, waitFor } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { useLoginApi } from '@modules/features-auth';
import useLoginButton from '@modules/features-auth/src/screens/LoginScreen/useLoginButton';

const mockTranslation = jest.fn();
const mockDispatch = jest.fn();

jest.mock('@modules/utils', () => {
  const { renderHook } = require('@testing-library/react-native');
  return {
    renderHookWithProviders: renderHook,
    saveUserDataOpenHome: jest.fn(),
  };
});

jest.mock('@modules/features-auth', () => ({
  useLoginApi: jest.fn(),
}));

jest.mock('@modules/store', () => ({
  ['DialogsStore']: {
    setErrorDialogMessage: jest.fn((message?: string) => ({
      type: 'setErrorDialogMessage',
      payload: message,
    })),
  },
  useAppDispatch: jest.fn(),
}));

jest.mock('@modules/localization', () => ({
  ['TranslationNamespaces']: {
    ['COMMON']: 'common',
    ['AUTH']: 'auth',
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('react-native', () => ({
  ['Keyboard']: { dismiss: jest.fn() },
}));

const typedSetErrorDialogMessage =
  DialogsStore.setErrorDialogMessage as unknown as jest.Mock;
const typedUseAppDispatch = useAppDispatch as jest.Mock;
const typedSaveUserDataOpenHome = saveUserDataOpenHome as unknown as jest.Mock;
const typedUseLoginApi = useLoginApi as jest.Mock;
const typedUseTranslation = useTranslation as jest.Mock;

let keyboardDismissSpy: ReturnType<typeof jest.spyOn>;
let mockUseLoginApiReturn: any;

beforeEach(() => {
  jest.clearAllMocks();

  keyboardDismissSpy = jest
    .spyOn(Keyboard, 'dismiss')
    .mockImplementation(jest.fn());

  mockUseLoginApiReturn = {
    mutate: jest.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    data: undefined,
    error: undefined,
  };

  typedUseLoginApi.mockReturnValue(mockUseLoginApiReturn);
  typedUseAppDispatch.mockReturnValue(mockDispatch);
  mockTranslation.mockImplementation((...args: any[]) => {
    const key = args[0];
    const options = args[1];
    return options?.action ? `${key}-${options.action}` : key;
  });
  typedUseTranslation.mockReturnValue({ t: mockTranslation });
});

afterEach(() => {
  keyboardDismissSpy.mockRestore();
});

describe('useLoginButton loading state', () => {
  it('exposes pending flag from login api', () => {
    mockUseLoginApiReturn.isPending = true;

    const { result } = renderHookWithProviders(() => useLoginButton());

    expect(result.current.isLoggingIn).toBe(true);
  });
});

describe('useLoginButton press handler', () => {
  it('dismisses keyboard and triggers login with form data', () => {
    const formData = { username: 'john', password: 'secret' } as const;

    const { result } = renderHookWithProviders(() => useLoginButton());

    act(() => result.current.onLoginPress(formData));

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    expect(mockUseLoginApiReturn.mutate).toHaveBeenCalledWith({
      body: { username: 'john', password: 'secret' },
    });
  });
});

describe('useLoginButton success handling', () => {
  it('saves user data and navigates home when response is complete', async () => {
    const user = { id: '1' };
    const token = 'token-123';

    mockUseLoginApiReturn = {
      ...mockUseLoginApiReturn,
      isSuccess: true,
      data: { user, token },
    };
    typedUseLoginApi.mockReturnValue(mockUseLoginApiReturn);

    renderHookWithProviders(() => useLoginButton());

    await waitFor(() =>
      expect(typedSaveUserDataOpenHome).toHaveBeenCalledWith(user, token),
    );
  });

  it('shows error dialog when response lacks user or token', async () => {
    mockUseLoginApiReturn = {
      ...mockUseLoginApiReturn,
      isSuccess: true,
      data: { user: { id: 'missing-token' } },
    };
    typedUseLoginApi.mockReturnValue(mockUseLoginApiReturn);

    renderHookWithProviders(() => useLoginButton());

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'setErrorDialogMessage',
      payload: 'common:errorWhileAction-auth:login',
    });
    expect(typedSetErrorDialogMessage).toHaveBeenCalledWith(
      'common:errorWhileAction-auth:login',
    );
  });
});

describe('useLoginButton error handling', () => {
  it('dispatches server error message when login fails', async () => {
    mockUseLoginApiReturn = {
      ...mockUseLoginApiReturn,
      isError: true,
      error: { errorMessage: 'Server failed' },
    };
    typedUseLoginApi.mockReturnValue(mockUseLoginApiReturn);

    renderHookWithProviders(() => useLoginButton());

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'setErrorDialogMessage',
      payload: 'Server failed',
    });
  });

  it('falls back to translated message when error message is missing', async () => {
    mockUseLoginApiReturn = {
      ...mockUseLoginApiReturn,
      isError: true,
      error: {},
    };
    typedUseLoginApi.mockReturnValue(mockUseLoginApiReturn);

    renderHookWithProviders(() => useLoginButton());

    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(1));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'setErrorDialogMessage',
      payload: 'common:errorWhileAction-auth:login',
    });
  });
});
