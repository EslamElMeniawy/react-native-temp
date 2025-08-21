import { FlatList } from '@eslam-elmeniawy/react-native-common-components';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native-paper';
import {
  NotificationItem,
  NotificationsListSeparator,
} from '@src/screens/Notifications/components';
import { ListEmptyComponent, ListLoadingMore } from '@modules/components';
import { useGetNotificationsApi } from '@modules/core';
import { TranslationNamespaces } from '@modules/localization';
import { useFocusNotifyOnChangeProps } from '@modules/utils';
import styles from './styles';

export default React.memo(() => {
  const { t: translate } = useTranslation(TranslationNamespaces.NOTIFICATIONS);
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  const {
    data: allPages,
    isLoading,
    isFetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    error,
    isLoadingError,
  } = useGetNotificationsApi({ notifyOnChangeProps: notifyOnChangeProps?.() });

  const notificationsList = allPages?.pages
    ?.map(page => page.data ?? [])
    ?.flat();

  return isLoading ? (
    <ActivityIndicator size="large" style={styles.loadingIndicator} />
  ) : (
    <>
      <FlatList
        data={notificationsList}
        renderItem={info => <NotificationItem {...info} />}
        ListEmptyComponent={
          <ListEmptyComponent
            data={translate('notifications')}
            error={error}
            isLoadingError={isLoadingError}
          />
        }
        onRefresh={() => refetch()}
        refreshing={isFetching && !isFetchingNextPage}
        onEndReached={() => fetchNextPage()}
        contentContainerStyle={
          !notificationsList?.length ? styles.emptyList : undefined
        }
        ItemSeparatorComponent={NotificationsListSeparator}
      />
      <ListLoadingMore isFetchingNextPage={isFetchingNextPage} />
    </>
  );
});
