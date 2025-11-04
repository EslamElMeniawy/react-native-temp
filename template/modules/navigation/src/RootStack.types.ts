import type { DebugMenuStackParamList } from '@modules/features-debug-menu';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  splash: undefined;
  debugMenuStack: undefined | NavigatorScreenParams<DebugMenuStackParamList>;
  login: undefined;
  home: undefined;
  notifications: undefined;
};

type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type { RootStackParamList, RootStackScreenProps };
