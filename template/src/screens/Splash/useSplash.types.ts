import type { RootStackParamList } from '@modules/navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type * as React from 'react';
import type { Animated } from 'react-native';

export interface UseSplashProps {
  opacity: React.RefObject<Animated.Value>;
  translateY: React.RefObject<Animated.Value>;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'splash',
    'RootStack'
  >;
  isBootSplashLogoLoaded: boolean;
}
