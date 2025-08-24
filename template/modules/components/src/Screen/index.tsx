import { useAppTheme } from '@modules/theme';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { SystemBars } from '@modules/components';
import styles from './styles';
import type { Props } from './types';

export default React.memo((props: Props) => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const {
    edges,
    statusBarProps,
    statusBarColor,
    navigationBarProps,
    navigationBarColor,
    children,
    style,
  } = props;

  const contentStyle = {
    backgroundColor: theme.colors.background,
    paddingRight: !edges || edges?.includes('right') ? insets.right : 0,
    paddingLeft: !edges || edges?.includes('left') ? insets.left : 0,
  };

  const statusBarContainerStyle = {
    height: !edges || edges?.includes('top') ? insets.top : 0,
    backgroundColor: statusBarColor ?? theme.colors.background,
  };

  const navigationBarContainerStyle = {
    height: !edges || edges?.includes('bottom') ? insets.bottom : 0,
    backgroundColor: navigationBarColor ?? theme.colors.background,
  };

  return (
    <SafeAreaProvider>
      <View style={statusBarContainerStyle} />
      <SystemBars
        statusBarProps={statusBarProps}
        statusBarColor={statusBarColor}
        navigationBarProps={navigationBarProps}
        navigationBarColor={navigationBarColor}
      />
      <View style={StyleSheet.flatten([styles.content, contentStyle, style])}>
        {children}
      </View>
      <View style={navigationBarContainerStyle} />
    </SafeAreaProvider>
  );
});
