import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { default as Config } from 'react-native-config';
import { default as logger } from 'redux-logger';
import type { UserState } from '@modules/domain-user';
import * as DialogsStore from './dialogs';
import * as NetworkStateStore from './networkState';
import type { Reducer, EnhancedStore } from '@reduxjs/toolkit';

const staticReducers = {
  dialogs: DialogsStore.default,
  networkState: NetworkStateStore.default,
};

const dynamicReducers: Record<string, Reducer> = {};

const createRootReducer = () =>
  combineReducers({
    ...staticReducers,
    ...dynamicReducers,
  });

const internalStore = configureStore({
  reducer: createRootReducer(),
  middleware: getDefaultMiddleware =>
    Config.ENABLE_LOCAL_LOG === 'true'
      ? getDefaultMiddleware().concat(
          logger as unknown as ReturnType<typeof getDefaultMiddleware>,
        )
      : getDefaultMiddleware(),
});

export const injectReducer = (key: string, reducer: Reducer) => {
  if (dynamicReducers[key]) {
    return;
  }

  dynamicReducers[key] = reducer;
  internalStore.replaceReducer(createRootReducer());
};

// Types exports.
export type RootState = ReturnType<typeof internalStore.getState> & {
  user: UserState;
};

export const store = internalStore as unknown as EnhancedStore<RootState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;

// Hooks export.
export * from './hooks';

// Reducers exports.
export { DialogsStore };
export { NetworkStateStore };
