import { Text } from '@eslam-elmeniawy/react-native-common-components';
import { TranslationNamespaces } from '@modules/localization';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Icon } from 'react-native-paper';
import styles from './styles';
import type { Props } from './types';

export default React.memo((props: Props) => {
  const { isLoadingError, error, data } = props;
  const { t: translate } = useTranslation(TranslationNamespaces.COMMON);

  return (
    <View style={styles.container}>
      <Icon
        size={64}
        source={
          isLoadingError ? 'alert-circle-outline' : 'database-remove-outline'
        }
      />
      <Text variant="bodyLarge" style={styles.message}>
        {isLoadingError
          ? (error?.errorMessage ?? translate('errorLoadData', { data: data }))
          : translate('noDataAvailable', { data: data })}
      </Text>
    </View>
  );
});
