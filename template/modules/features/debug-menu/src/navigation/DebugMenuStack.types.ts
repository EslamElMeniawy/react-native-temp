import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type DebugMenuStackParamList = {
  debugMenu: undefined;
  networkLogs: undefined;
};

type DebugMenuStackScreenProps<T extends keyof DebugMenuStackParamList> =
  NativeStackScreenProps<DebugMenuStackParamList, T>;

export type { DebugMenuStackParamList, DebugMenuStackScreenProps };
