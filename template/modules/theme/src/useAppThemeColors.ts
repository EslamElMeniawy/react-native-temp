import {useColorScheme} from 'react-native';
import useAppThemeColorsDark from './useAppThemeColorsDark';
import useAppThemeColorsLight from './useAppThemeColorsLight';
import type {MD3Colors} from 'react-native-paper/lib/typescript/types';

/**
 * Returns the appropriate theme colors based on the current color scheme.
 *
 * @returns {MD3Colors} The theme colors object based on the current color scheme.
 */
const useAppThemeColors = (): MD3Colors => {
  const isDarkMode = useColorScheme() === 'dark';

  const useThemeColors = isDarkMode
    ? useAppThemeColorsDark
    : useAppThemeColorsLight;

  const appThemeColors = useThemeColors();
  return appThemeColors;
};

export default useAppThemeColors;
