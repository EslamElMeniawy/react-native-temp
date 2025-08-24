import type * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SystemBarsProps } from 'react-native-edge-to-edge';
import type { Edge } from 'react-native-safe-area-context';

export interface Props {
  edges?: Edge[];
  statusBarProps?: SystemBarsProps;
  statusBarColor?: string;
  navigationBarProps?: SystemBarsProps;
  navigationBarColor?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
