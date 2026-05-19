import * as React from 'react';
import { registerHttpClientDependencies } from '@modules/core';
// Ensure user reducer is registered before accessing store state.
import '@modules/domain-user';
import { translate, getCurrentLocale } from '@modules/localization';
import { store, DialogsStore } from '@modules/store';

export const useHttpClientDependenciesRegistration = () => {
  React.useEffect(() => {
    registerHttpClientDependencies({
      getApiToken: () => store.getState().user?.apiToken,
      getCurrentLocale,
      translate: (key: string) => (translate as (k: string) => string)(key),
      onSessionExpired: (message: string) => {
        store.dispatch(DialogsStore.setErrorDialogMessage(message));
      },
    });
  }, []);
};
