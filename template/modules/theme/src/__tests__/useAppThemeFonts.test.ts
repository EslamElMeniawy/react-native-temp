import { describe, test, expect } from '@jest/globals';
import { renderHookWithProviders } from '@modules/utils/src/__tests__/TestUtils';
import useAppThemeFonts from '@modules/theme/src/useAppThemeFonts';

describe('useAppThemeFonts', () => {
  test('should return configured fonts object when invoked', async () => {
    const { result } = await renderHookWithProviders(() => useAppThemeFonts());
    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('titleSmall');
    expect(result.current).toHaveProperty('titleMedium');
    expect(result.current).toHaveProperty('labelSmall');
    expect(result.current).toHaveProperty('labelMedium');
    expect(result.current).toHaveProperty('labelLarge');
  });
});
