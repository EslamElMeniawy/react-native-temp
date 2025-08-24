import { useAppTheme } from '@modules/theme';
import * as React from 'react';
import { SystemBars } from 'react-native-edge-to-edge';
import tinyColor from 'tinycolor2';
import type { Props } from './types';

export default React.memo((props: Props) => {
  const theme = useAppTheme();

  const {
    statusBarProps,
    statusBarColor,
    navigationBarProps,
    navigationBarColor,
  } = props;

  const statusBarStyle =
    typeof statusBarProps?.style === 'string'
      ? statusBarProps?.style
      : statusBarProps?.style?.statusBar;

  const defaultStatusBarStyle = tinyColor(
    statusBarColor ?? theme.colors.background,
  ).isLight()
    ? 'dark'
    : 'light';

  const statusBarHidden =
    typeof statusBarProps?.hidden === 'boolean'
      ? statusBarProps?.hidden
      : statusBarProps?.hidden?.statusBar;

  const navigationBarStyle =
    typeof navigationBarProps?.style === 'string'
      ? navigationBarProps?.style
      : navigationBarProps?.style?.navigationBar;

  const defaultNavigationBarStyle = tinyColor(
    navigationBarColor ?? theme.colors.background,
  ).isLight()
    ? 'dark'
    : 'light';

  const navigationBarHidden =
    typeof navigationBarProps?.hidden === 'boolean'
      ? navigationBarProps?.hidden
      : navigationBarProps?.hidden?.navigationBar;

  return (
    <SystemBars
      style={{
        statusBar: statusBarStyle ?? defaultStatusBarStyle,
        navigationBar: navigationBarStyle ?? defaultNavigationBarStyle,
      }}
      hidden={{
        statusBar: statusBarHidden,
        navigationBar: navigationBarHidden,
      }}
    />
  );
});
