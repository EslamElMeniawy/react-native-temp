import { MD3DarkTheme } from 'react-native-paper';
import AppColors from './AppColors';
import type { MD3Colors } from 'react-native-paper/lib/typescript/types';

/**
 * Returns the colors for the dark theme based on the MD3DarkTheme and AppColors.
 *
 * @returns MD3Colors - The colors for the dark theme.
 */
const useAppThemeColorsDark = () =>
  ({
    ...MD3DarkTheme.colors,
    primary: AppColors.themeDark.primary,
    onPrimary: AppColors.themeDark.onPrimary,
    primaryContainer: AppColors.themeDark.primaryContainer,
    onPrimaryContainer: AppColors.themeDark.onPrimaryContainer,
    secondary: AppColors.themeDark.secondary,
    onSecondary: AppColors.themeDark.onSecondary,
    secondaryContainer: AppColors.themeDark.secondaryContainer,
    onSecondaryContainer: AppColors.themeDark.onSecondaryContainer,
    tertiary: AppColors.themeDark.tertiary,
    onTertiary: AppColors.themeDark.onTertiary,
    tertiaryContainer: AppColors.themeDark.tertiaryContainer,
    onTertiaryContainer: AppColors.themeDark.onTertiaryContainer,
    error: AppColors.themeDark.error,
    onError: AppColors.themeDark.onError,
    errorContainer: AppColors.themeDark.errorContainer,
    onErrorContainer: AppColors.themeDark.onErrorContainer,
    background: AppColors.themeDark.background,
    onBackground: AppColors.themeDark.onBackground,
    surface: AppColors.themeDark.surface,
    onSurface: AppColors.themeDark.onSurface,
    surfaceVariant: AppColors.themeDark.surfaceVariant,
    onSurfaceVariant: AppColors.themeDark.onSurfaceVariant,
    outline: AppColors.themeDark.outline,
    outlineVariant: AppColors.themeDark.outlineVariant,
    shadow: AppColors.themeDark.shadow,
    scrim: AppColors.themeDark.scrim,
    inverseSurface: AppColors.themeDark.inverseSurface,
    inverseOnSurface: AppColors.themeDark.inverseOnSurface,
    inversePrimary: AppColors.themeDark.inversePrimary,
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: AppColors.themeDark.elevation.level0,
      // Note: Color values with transparency cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue.
      level1: AppColors.themeDark.elevation.level1,
      level2: AppColors.themeDark.elevation.level2,
      level3: AppColors.themeDark.elevation.level3,
      level4: AppColors.themeDark.elevation.level4,
      level5: AppColors.themeDark.elevation.level5,
    },
    surfaceDisabled: AppColors.themeDark.surfaceDisabled,
    onSurfaceDisabled: AppColors.themeDark.onSurfaceDisabled,
    backdrop: AppColors.themeDark.backdrop,
  }) as MD3Colors;

export default useAppThemeColorsDark;
