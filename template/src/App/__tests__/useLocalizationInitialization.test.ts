import { describe, expect, it, jest } from '@jest/globals';

jest.mock('@modules/localization', () => ({
  setI18nConfig: jest.fn(() => Promise.resolve()),
  translate: jest.fn((key: string) => key),
}));

import { waitFor } from '@testing-library/react-native';
import { useLocalizationInitialization } from '@src/App/useLocalizationInitialization';
import { setI18nConfig } from '@modules/localization';
import { renderHookWithProviders } from '@modules/utils/src/__tests__/TestUtils';

describe('useLocalizationInitialization', () => {
  it('marks language as loaded after initialization', async () => {
    const { result } = await renderHookWithProviders(() =>
      useLocalizationInitialization(),
    );

    await waitFor(() => expect(result.current).toBe(true));
    expect(setI18nConfig).toHaveBeenCalled();
  });
});
