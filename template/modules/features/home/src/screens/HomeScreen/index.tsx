import { Text } from '@eslam-elmeniawy/react-native-common-components';
import { Screen, ScrollContainer } from '@modules/components';
import { useGetUserDetailsApi } from '@modules/features-profile';
import { useFocusNotifyOnChangeProps, useRefreshOnFocus } from '@modules/utils';
import * as React from 'react';
import Header from './Header';
import styles from './styles';

export default React.memo(() => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  const {
    data: userData,
    dataUpdatedAt,
    refetch,
  } = useGetUserDetailsApi({ notifyOnChangeProps: notifyOnChangeProps?.() });

  useRefreshOnFocus(refetch);

  return (
    <Screen>
      <Header />
      <ScrollContainer
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text>{`UserData: ${JSON.stringify(
          userData,
        )}\n\nDataUpdatedAt: ${new Date(dataUpdatedAt)}`}</Text>
      </ScrollContainer>
    </Screen>
  );
});
