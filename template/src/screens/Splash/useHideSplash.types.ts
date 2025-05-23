import type {RootStackParamList} from '@src/navigation';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type * as React from 'react';
import type {Animated} from 'react-native';

export interface UseHideSplashProps {
  opacity: React.RefObject<Animated.Value>;
  translateY: React.RefObject<Animated.Value>;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'splash',
    'RootStack'
  >;
  isLanguageLoaded: boolean;
  isUserLoaded: boolean;
}
