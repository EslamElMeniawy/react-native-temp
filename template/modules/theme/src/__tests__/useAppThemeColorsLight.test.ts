import { describe, test, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import { AppColors } from '@modules/theme';
import useAppThemeColorsLight from '@modules/theme/src/useAppThemeColorsLight';

describe('useAppThemeColorsLight', () => {
  test('should return defined value when invoked', () => {
    const { result } = renderHook(() => useAppThemeColorsLight());
    expect(result.current).toBeDefined();
  });

  test('should match light theme primary color', () => {
    const { result } = renderHook(() => useAppThemeColorsLight());
    expect(result.current.primary).toBe(AppColors.themeLight.primary);
  });
});
