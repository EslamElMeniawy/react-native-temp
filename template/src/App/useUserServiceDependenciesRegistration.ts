import { getMessaging, deleteToken } from '@react-native-firebase/messaging';
import * as React from 'react';
import { UserLocalStorage, UserStore } from '@modules/domain-user';
import { ApiTokenLocalStorage } from '@modules/features-auth';
import {
  UnreadNotificationsCountLocalStorage,
  FcmTokenLocalStorage,
} from '@modules/features-notifications';
import { reset } from '@modules/navigation';
import { store } from '@modules/store';
import { registerUserServiceDependencies, queryClient } from '@modules/utils';

export const useUserServiceDependenciesRegistration = () => {
  React.useEffect(() => {
    registerUserServiceDependencies({
      setUser: user => UserLocalStorage.setUser(user),
      removeUser: () => UserLocalStorage.removeUser(),
      setApiToken: token => ApiTokenLocalStorage.setApiToken(token),
      removeApiToken: () => ApiTokenLocalStorage.removeApiToken(),
      removeUnreadNotificationsCount: () =>
        UnreadNotificationsCountLocalStorage.removeUnreadNotificationsCount(),
      removeFcmToken: () => FcmTokenLocalStorage.removeFcmToken(),
      dispatchSetUser: user => store.dispatch(UserStore.setUser(user)),
      dispatchSetApiToken: token =>
        store.dispatch(UserStore.setApiToken(token)),
      dispatchRemoveUser: () => store.dispatch(UserStore.removeUser()),
      dispatchRemoveApiToken: () =>
        store.dispatch(UserStore.removeApiToken()),
      dispatchRemoveUnreadNotificationsCount: () =>
        store.dispatch(UserStore.removeUnreadNotificationsCount()),
      resetNavigation: routeName =>
        reset(routeName as Parameters<typeof reset>[0]),
      deleteMessagingToken: () => deleteToken(getMessaging()),
      cancelQueries: () => queryClient.cancelQueries(),
      clearQueryCache: () => queryClient.clear(),
    });
  }, []);
};
