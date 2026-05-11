import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock all dependency hooks BEFORE importing anything else
jest.mock('@src/screens/Splash/useHideSplash', () => ({
  useHideSplash: jest.fn(),
}));
jest.mock('@src/screens/Splash/useSplashLanguageLoader', () => ({
  useSplashLanguageLoader: jest.fn(),
}));
jest.mock('@src/screens/Splash/useSplashUserLoader', () => ({
  useSplashUserLoader: jest.fn(),
}));

import { useHideSplash } from '@src/screens/Splash/useHideSplash';
import { useSplash } from '@src/screens/Splash/useSplash';
import { useSplashLanguageLoader } from '@src/screens/Splash/useSplashLanguageLoader';
import { useSplashUserLoader } from '@src/screens/Splash/useSplashUserLoader';
import { renderHookWithProviders } from '@modules/utils/src/__tests__/TestUtils';

describe('useSplash', () => {
  const mockProps = {
    navigation: {} as any,
    opacity: { value: 1 } as any,
    translateY: { value: 0 } as any,
    isBootSplashLogoLoaded: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSplashLanguageLoader as jest.Mock).mockReturnValue(true);
    (useSplashUserLoader as jest.Mock).mockReturnValue(true);
    (useHideSplash as jest.Mock).mockReturnValue(false);
  });

  test('should call all splash hooks with correct arguments', async () => {
    await renderHookWithProviders(() => useSplash(mockProps));

    expect(useSplashLanguageLoader).toHaveBeenCalledWith(true);
    expect(useSplashUserLoader).toHaveBeenCalledWith(true);
    expect(useHideSplash).toHaveBeenCalledWith({
      navigation: mockProps.navigation,
      opacity: mockProps.opacity,
      translateY: mockProps.translateY,
      isLanguageLoaded: true,
      isUserLoaded: true,
    });
  });

  test('should return value from useHideSplash', async () => {
    (useHideSplash as jest.Mock).mockReturnValue(true);

    const { result } = await renderHookWithProviders(() =>
      useSplash(mockProps),
    );

    expect(result.current).toBe(true);
  });

  test('should pass isBootSplashLogoLoaded to loader hooks', async () => {
    const propsWithLogoNotLoaded = {
      ...mockProps,
      isBootSplashLogoLoaded: false,
    };

    await renderHookWithProviders(() => useSplash(propsWithLogoNotLoaded));

    expect(useSplashLanguageLoader).toHaveBeenCalledWith(false);
    expect(useSplashUserLoader).toHaveBeenCalledWith(false);
  });
});
