import { Text } from '@eslam-elmeniawy/react-native-common-components';
import { useAppTheme } from '@modules/theme';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import tinycolor from 'tinycolor2';
import styles from './styles';
import type { ToastConfigParams } from 'toastify-react-native/utils/interfaces';

export default React.memo((props: ToastConfigParams) => {
  const { iconColor, icon, closeIcon, text1, text2, type } = props;
  const theme = useAppTheme();
  const borderColor = tinycolor(iconColor ?? theme.colors.onSurface);
  borderColor.setAlpha(0.25);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.primaryContainer;
      case 'error':
        return theme.colors.errorContainer;
      case 'warn':
        return theme.colors.tertiaryContainer;
      default:
        return theme.colors.surface;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.onPrimaryContainer;
      case 'error':
        return theme.colors.onErrorContainer;
      case 'warn':
        return theme.colors.onTertiaryContainer;
      default:
        return theme.colors.onSurface;
    }
  };

  return (
    <View
      style={StyleSheet.compose(styles.container, {
        backgroundColor: getBackgroundColor(),
        borderColor: borderColor.toHex8String(),
        shadowColor: theme.colors.elevation.level3,
      })}
    >
      {Boolean(icon) && icon}
      <View style={styles.textContainer}>
        {Boolean(text1) && (
          <Text type="bold" style={{ color: getTextColor() }}>
            {text1}
          </Text>
        )}
        {Boolean(text2) && (
          <Text style={{ color: getTextColor() }}>{text2}</Text>
        )}
      </View>
      {Boolean(closeIcon) && closeIcon}
    </View>
  );
});
