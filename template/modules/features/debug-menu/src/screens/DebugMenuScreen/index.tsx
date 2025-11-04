import { Button, Text } from '@eslam-elmeniawy/react-native-common-components';
import { Screen, ScrollContainer } from '@modules/components';
import { TranslationNamespaces } from '@modules/localization';
import { version } from '@packageJson';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { default as Config } from 'react-native-config';
import type { DebugMenuStackScreenProps } from '@modules/features-debug-menu';
import Header from './Header';
import styles from './styles';

export default React.memo((props: DebugMenuStackScreenProps<'debugMenu'>) => {
  // #region Logger
  const getLogMessage = (message: string) => `## DebugMenu:: ${message}`;
  // #endregion

  const { navigation } = props;
  const { t: translate } = useTranslation(TranslationNamespaces.DEBUG_MENU);

  const onNetworkLogsPressed = React.useCallback(() => {
    console.info(getLogMessage('onNetworkLogsPressed'));
    navigation.navigate('networkLogs');
  }, [navigation]);

  return (
    <Screen>
      <Header />
      <ScrollContainer
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Button
          text={translate('networkLogs')}
          onPress={onNetworkLogsPressed}
        />
        <Text>{`${translate('appVersion')}: ${version}`}</Text>
        <Text>{`${translate('environment')}: ${Config.ENV_NAME}`}</Text>
      </ScrollContainer>
    </Screen>
  );
});
