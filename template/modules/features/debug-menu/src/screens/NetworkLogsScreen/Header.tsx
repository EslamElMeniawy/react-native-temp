import { TranslationNamespaces } from '@modules/localization';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Appbar } from 'react-native-paper';
import type { DebugMenuStackScreenProps } from '@modules/features-debug-menu';

export default React.memo(() => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## NetworkLogs::Header:: ${message}`;
  // #endregion

  const { t: translate } = useTranslation(TranslationNamespaces.DEBUG_MENU);

  const navigation =
    useNavigation<DebugMenuStackScreenProps<'networkLogs'>['navigation']>();

  const onBackPress = React.useCallback(() => {
    console.info(getLogMessage('onBackPress'));
    navigation.goBack();
  }, [navigation]);

  return (
    <Appbar.Header statusBarHeight={0} mode="center-aligned">
      <Appbar.BackAction onPress={onBackPress} />
      <Appbar.Content title={translate('networkLogs')} />
    </Appbar.Header>
  );
});
