import { describe, expect, it, jest } from '@jest/globals';

jest.mock('@modules/localization', () => ({
  setI18nConfig: jest.fn(() => Promise.resolve()),
}));

import { renderHook, waitFor } from '@testing-library/react-native';
import { useLocalizationInitialization } from '@src/App/useLocalizationInitialization';
import { setI18nConfig } from '@modules/localization';

describe('useLocalizationInitialization', () => {
  it('marks language as loaded after initialization', async () => {
    const { result } = renderHook(() => useLocalizationInitialization());

    await waitFor(() => expect(result.current).toBe(true));
    expect(setI18nConfig).toHaveBeenCalled();
  });
});
