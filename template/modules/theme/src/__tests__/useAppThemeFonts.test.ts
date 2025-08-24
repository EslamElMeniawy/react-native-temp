import { describe, test, expect } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import useAppThemeFonts from '@modules/theme/src/useAppThemeFonts';

describe('useAppThemeFonts', () => {
  test('should return configured fonts object when invoked', () => {
    const { result } = renderHook(() => useAppThemeFonts());
    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('titleSmall');
    expect(result.current).toHaveProperty('titleMedium');
    expect(result.current).toHaveProperty('labelSmall');
    expect(result.current).toHaveProperty('labelMedium');
    expect(result.current).toHaveProperty('labelLarge');
  });
});
