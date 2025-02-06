import {MD3LightTheme} from 'react-native-paper';
import AppColors from './AppColors';
import type {MD3Colors} from 'react-native-paper/lib/typescript/types';

/**
 * Returns the colors for the light theme based on the MD3LightTheme and AppColors.
 *
 * @returns MD3Colors - The colors for the light theme.
 */
const useAppThemeColorsLight = () =>
  ({
    ...MD3LightTheme.colors,
    primary: AppColors.themeLight.primary,
    onPrimary: AppColors.themeLight.onPrimary,
    primaryContainer: AppColors.themeLight.primaryContainer,
    onPrimaryContainer: AppColors.themeLight.onPrimaryContainer,
    secondary: AppColors.themeLight.secondary,
    onSecondary: AppColors.themeLight.onSecondary,
    secondaryContainer: AppColors.themeLight.secondaryContainer,
    onSecondaryContainer: AppColors.themeLight.onSecondaryContainer,
    tertiary: AppColors.themeLight.tertiary,
    onTertiary: AppColors.themeLight.onTertiary,
    tertiaryContainer: AppColors.themeLight.tertiaryContainer,
    onTertiaryContainer: AppColors.themeLight.onTertiaryContainer,
    error: AppColors.themeLight.error,
    onError: AppColors.themeLight.onError,
    errorContainer: AppColors.themeLight.errorContainer,
    onErrorContainer: AppColors.themeLight.onErrorContainer,
    background: AppColors.themeLight.background,
    onBackground: AppColors.themeLight.onBackground,
    surface: AppColors.themeLight.surface,
    onSurface: AppColors.themeLight.onSurface,
    surfaceVariant: AppColors.themeLight.surfaceVariant,
    onSurfaceVariant: AppColors.themeLight.onSurfaceVariant,
    outline: AppColors.themeLight.outline,
    outlineVariant: AppColors.themeLight.outlineVariant,
    shadow: AppColors.themeLight.shadow,
    scrim: AppColors.themeLight.scrim,
    inverseSurface: AppColors.themeLight.inverseSurface,
    inverseOnSurface: AppColors.themeLight.inverseOnSurface,
    inversePrimary: AppColors.themeLight.inversePrimary,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: AppColors.themeLight.elevation.level0,
      // Note: Color values with transparency cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue.
      level1: AppColors.themeLight.elevation.level1,
      level2: AppColors.themeLight.elevation.level2,
      level3: AppColors.themeLight.elevation.level3,
      level4: AppColors.themeLight.elevation.level4,
      level5: AppColors.themeLight.elevation.level5,
    },
    surfaceDisabled: AppColors.themeLight.surfaceDisabled,
    onSurfaceDisabled: AppColors.themeLight.onSurfaceDisabled,
    backdrop: AppColors.themeLight.backdrop,
  }) as MD3Colors;

export default useAppThemeColorsLight;
