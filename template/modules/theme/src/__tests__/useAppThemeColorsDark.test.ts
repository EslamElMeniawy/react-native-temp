import { describe, test, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import { AppColors } from '@modules/theme';
import useAppThemeColorsDark from '@modules/theme/src/useAppThemeColorsDark';

describe('useAppThemeColorsDark', () => {
  test('should return defined value when invoked', () => {
    const { result } = renderHook(() => useAppThemeColorsDark());
    expect(result.current).toBeDefined();
  });

  test('should match dark theme primary color', () => {
    const { result } = renderHook(() => useAppThemeColorsDark());
    expect(result.current.primary).toBe(AppColors.themeDark.primary);
  });
});
