import { describe, test, expect } from '@jest/globals';
import { renderHookWithProviders } from '@modules/utils/src/__tests__/TestUtils';
import { AppColors } from '@modules/theme';
import useAppThemeColorsLight from '@modules/theme/src/useAppThemeColorsLight';

describe('useAppThemeColorsLight', () => {
  test('should return defined value when invoked', async () => {
    const { result } = await renderHookWithProviders(() =>
      useAppThemeColorsLight(),
    );
    expect(result.current).toBeDefined();
  });

  test('should match light theme primary color', async () => {
    const { result } = await renderHookWithProviders(() =>
      useAppThemeColorsLight(),
    );
    expect(result.current.primary).toBe(AppColors.themeLight.primary);
  });
});
