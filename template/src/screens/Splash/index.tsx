import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';
import type { RootStackScreenProps } from '@src/navigation';
import { AppImages } from '@modules/assets';
import { Screen } from '@modules/components';
import { useAppTheme } from '@modules/theme';
import styles from './styles';
import { useSplash } from './useSplash';

export default React.memo((props: RootStackScreenProps<'splash'>) => {
  // #region Variables
  const { navigation } = props;
  const opacity = React.useRef(new Animated.Value(1));
  const translateY = React.useRef(new Animated.Value(0));
  // #endregion

  // #region State
  const [isBootSplashLogoLoaded, setBootSplashLogoLoaded] =
    React.useState<boolean>(false);
  // #endregion

  const isBootSplashVisible = useSplash({
    navigation,
    opacity,
    translateY,
    isBootSplashLogoLoaded,
  });

  const theme = useAppTheme();

  // #region UI
  return (
    <Screen>
      {isBootSplashVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.bootSplash,
            { opacity: opacity.current },
          ]}
        >
          <Animated.Image
            source={AppImages.bootSplashImage}
            fadeDuration={0}
            resizeMode="contain"
            tintColor={theme.colors.primary}
            onLoadEnd={() => setBootSplashLogoLoaded(true)}
            style={StyleSheet.flatten([
              styles.logo,
              {
                tintColor: theme.colors.primary,
                transform: [{ translateY: translateY.current }],
              },
            ])}
          />
        </Animated.View>
      )}
    </Screen>
    // #endregion
  );
});
