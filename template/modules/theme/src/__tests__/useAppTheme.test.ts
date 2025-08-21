import { describe, test, expect, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import useAppTheme from '@modules/theme/src/useAppTheme';

describe('useAppTheme HAPPY PATH', () => {
  test('should return a defined theme object when invoked', () => {
    const { result } = renderHook(() => useAppTheme());
    expect(result.current).toBeDefined();
  });

  test('should contain defined colors in the theme object', () => {
    const { result } = renderHook(() => useAppTheme());
    expect(result.current.colors).toBeDefined();
  });

  test('should contain defined fonts in the theme object', () => {
    const { result } = renderHook(() => useAppTheme());
    expect(result.current.fonts).toBeDefined();
  });

  test('should return light theme when color scheme is light', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('light');

    const { result } = renderHook(() => useAppTheme());
    expect(result.current).toHaveProperty('colors');
    expect(result.current).toHaveProperty('fonts');
    expect(result.current).toHaveProperty('dark', false);
  });

  test('should return dark theme when color scheme is dark', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('dark');

    const { result } = renderHook(() => useAppTheme());
    expect(result.current).toHaveProperty('colors');
    expect(result.current).toHaveProperty('fonts');
    expect(result.current).toHaveProperty('dark', true);
  });
});

describe('useAppTheme EDGE CASES', () => {
  test('should handle undefined color scheme gracefully', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue(undefined);

    const { result } = renderHook(() => useAppTheme());
    expect(result.current).toBeDefined();
  });

  test('should handle invalid color scheme values gracefully', () => {
    jest
      .spyOn(require('react-native'), 'useColorScheme')
      .mockReturnValue('invalid');

    const { result } = renderHook(() => useAppTheme());
    expect(result.current).toBeDefined();
  });
});
