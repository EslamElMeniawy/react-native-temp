import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useSplashLanguageLoader } from '@src/screens/Splash/useSplashLanguageLoader';
import { LanguageLocalStorage } from '@modules/core';
import { updateLanguage } from '@modules/localization';

jest.mock('@modules/core', () => ({
  ['LanguageLocalStorage']: {
    getLanguage: jest.fn(() => 'en'),
  },
}));

jest.mock('@modules/localization', () => ({
  updateLanguage: jest.fn(() => Promise.resolve()),
}));

describe('useSplashLanguageLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not load language until splash logo is ready', () => {
    const { result } = renderHook(() => useSplashLanguageLoader(false));

    expect(result.current).toBe(false);
    expect(updateLanguage).not.toHaveBeenCalled();
  });

  it('loads language when splash logo is ready', async () => {
    const { result } = renderHook(() => useSplashLanguageLoader(true));

    await waitFor(() => expect(result.current).toBe(true));
    expect(LanguageLocalStorage.getLanguage).toHaveBeenCalled();
    expect(updateLanguage).toHaveBeenCalledWith('en');
  });
});
