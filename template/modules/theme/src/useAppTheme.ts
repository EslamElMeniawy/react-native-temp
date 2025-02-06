import {useColorScheme} from 'react-native';
import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import useAppThemeColors from './useAppThemeColors';
import useAppThemeFonts from './useAppThemeFonts';
import type {MD3Theme} from 'react-native-paper/lib/typescript/types';

/**
 * Custom hook to get the current theme for the app.
 * This hook combines the colors and fonts defined in useAppThemeColors and useAppThemeFonts hooks,
 * and determines the default theme based on the color scheme.
 *
 * @returns The current theme object containing colors and fonts.
 */
const useAppTheme = () => {
  // Define colors.
  const appThemeColors = useAppThemeColors();

  // Define fonts.
  const fonts = useAppThemeFonts();

  // Define theme.
  const isDarkMode = useColorScheme() === 'dark';
  const defaultTheme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return {
    ...defaultTheme,
    colors: appThemeColors,
    fonts: fonts,
  } as MD3Theme;
};

export default useAppTheme;
