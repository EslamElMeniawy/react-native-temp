import {configureFonts} from 'react-native-paper';

/**
 * Custom hook to configure fonts for the app theme.
 *
 * This hook allows customization of base font variants and individual variants like title, label, etc.
 *
 * @returns Configured fonts for the app theme.
 */
const useAppThemeFonts = () => {
  // TODO: Replace font names with required custom font then enable commented font lines.
  const baseFont = {
    // fontFamily: 'Cairo-Regular',
  } as const;

  const baseVariants = configureFonts({config: baseFont});

  const customVariants = {
    // Customize individual base variants.
    titleSmall: {
      ...baseVariants.titleSmall,
      // fontFamily: 'Cairo-Bold',
    },
    titleMedium: {
      ...baseVariants.titleMedium,
      // fontFamily: 'Cairo-Bold',
    },
    labelSmall: {
      ...baseVariants.labelSmall,
      // fontFamily: 'Cairo-Bold',
    },
    labelMedium: {
      ...baseVariants.labelMedium,
      // fontFamily: 'Cairo-Bold',
    },
    labelLarge: {
      ...baseVariants.labelLarge,
      // fontFamily: 'Cairo-Bold',
    },
  } as const;

  return configureFonts({
    config: {
      ...baseVariants,
      ...customVariants,
    },
  });
};

export default useAppThemeFonts;
