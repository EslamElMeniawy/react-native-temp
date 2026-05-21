import { describe, test, expect } from '@jest/globals';
import { renderHookWithProviders } from '@modules/utils/src/__tests__/TestUtils';
import { AppColors } from '@modules/theme';
import useAppThemeColorsDark from '@modules/theme/src/useAppThemeColorsDark';

describe('useAppThemeColorsDark', () => {
  test('should return defined value when invoked', async () => {
    const { result } = await renderHookWithProviders(() =>
      useAppThemeColorsDark(),
    );
    expect(result.current).toBeDefined();
  });

  test('should match dark theme primary color', async () => {
    const { result } = await renderHookWithProviders(() =>
      useAppThemeColorsDark(),
    );
    expect(result.current.primary).toBe(AppColors.themeDark.primary);
  });
});
