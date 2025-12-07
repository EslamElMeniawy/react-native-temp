import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@modules/store';
import { useAppTheme } from '@modules/theme';
import AppContent from './AppContent';
import styles from './styles';
import { useLocalStorageInitialization } from './useLocalStorageInitiation';

export default React.memo(() => {
  const theme = useAppTheme();
  const storageInitialized = useLocalStorageInitialization();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View
        style={StyleSheet.compose(styles.container, {
          backgroundColor: theme.colors.background,
        })}
      >
        <ReduxProvider store={store}>
          {storageInitialized && <AppContent />}
        </ReduxProvider>
      </View>
    </GestureHandlerRootView>
  );
});
