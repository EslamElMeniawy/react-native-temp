import { describe, test, expect, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import AppColors from '@modules/theme/src/AppColors';
import useAppThemeColors from '@modules/theme/src/useAppThemeColors';

describe('useAppThemeColors HAPPY PATH', () => {
  test('should return defined theme colors object when invoked', () => {
    const { result } = renderHook(() => useAppThemeColors());
    expect(result.current).toBeDefined();
  });

  test('should return dark theme colors when color scheme is dark', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('dark');

    const { result } = renderHook(() => useAppThemeColors());
    expect(result.current.primary).toEqual(AppColors.themeDark.primary);
    expect(result.current.onPrimary).toEqual(AppColors.themeDark.onPrimary);
  });

  test('should return light theme colors when color scheme is light', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('light');

    const { result } = renderHook(() => useAppThemeColors());
    expect(result.current.primary).toEqual(AppColors.themeLight.primary);
    expect(result.current.onPrimary).toEqual(AppColors.themeLight.onPrimary);
  });
});

describe('useAppThemeColors EDGE CASES', () => {
  test('should handle undefined color scheme gracefully when invoked', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue(undefined);

    const { result } = renderHook(() => useAppThemeColors());
    expect(result.current).toBeDefined();
  });

  test('should handle unexpected color scheme values gracefully', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('invalid');

    const { result } = renderHook(() => useAppThemeColors());
    expect(result.current).toBeDefined();
  });
});
