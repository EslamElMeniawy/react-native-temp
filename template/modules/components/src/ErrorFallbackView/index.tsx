import { Text, Button } from '@eslam-elmeniawy/react-native-common-components';
import { translate } from '@modules/localization';
import { useAppTheme } from '@modules/theme';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { hide as rnBootSplashHide } from 'react-native-bootsplash';
import RNRestart from 'react-native-restart';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Screen } from '@modules/components';
import styles from './styles';

export default React.memo(() => {
  const theme = useAppTheme();

  React.useEffect(() => {
    rnBootSplashHide();
  }, []);

  return (
    <SafeAreaProvider>
      <Screen style={styles.container}>
        <Text
          type="bold"
          size={18}
          style={StyleSheet.flatten([
            { color: theme.colors.onBackground },
            styles.text,
            styles.title,
          ])}
        >
          {translate('errorFallbackTitle')}
        </Text>
        <Text
          style={StyleSheet.flatten([
            { color: theme.colors.onBackground },
            styles.text,
            styles.message,
          ])}
        >
          {translate('errorFallbackMessage')}
        </Text>
        <Button
          text={translate('restartApp')}
          onPress={() => RNRestart.Restart()}
          style={StyleSheet.compose(
            { backgroundColor: theme.colors.primary },
            styles.btn,
          )}
          textProps={{
            style: StyleSheet.compose(
              { color: theme.colors.onPrimary },
              styles.btnTxt,
            ),
          }}
        />
      </Screen>
    </SafeAreaProvider>
  );
});
