/**
 * Integration test: Redux Store with dynamic reducer injection.
 *
 * Tests that the full store works with all reducers registered,
 * verifying the dynamic injection pattern works end-to-end.
 * This test uses real Redux Toolkit (no mocks) to catch upgrade regressions.
 */
import { describe, expect, it, beforeEach } from '@jest/globals';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import type { UserState } from '@modules/domain-user';

import { userSlice } from '@modules/domain-user/src/store/user';
import * as DialogsStore from '@modules/store/src/dialogs';
import * as NetworkStateStore from '@modules/store/src/networkState';
import type { Reducer } from '@reduxjs/toolkit';

describe('Store Integration - Dynamic Reducer Injection', () => {
  let store: ReturnType<typeof configureStore>;
  const dynamicReducers: Record<string, Reducer> = {};

  const staticReducers = {
    dialogs: DialogsStore.default,
    networkState: NetworkStateStore.default,
  };

  const createRootReducer = (): Reducer =>
    combineReducers({
      ...staticReducers,
      ...dynamicReducers,
    }) as Reducer;

  beforeEach(() => {
    // Clear dynamic reducers
    Object.keys(dynamicReducers).forEach(key => delete dynamicReducers[key]);

    store = configureStore({
      reducer: createRootReducer(),
    });
  });

  it('starts with only static reducers', () => {
    const state = store.getState() as any;
    expect(state.dialogs).toBeDefined();
    expect(state.networkState).toBeDefined();
    expect(state.user).toBeUndefined();
  });

  it('can inject user reducer dynamically', () => {
    dynamicReducers.user = userSlice.reducer;
    store.replaceReducer(createRootReducer());

    const state = store.getState() as { user: UserState };
    expect(state.user).toBeDefined();
    expect(state.user.user).toBeUndefined();
    expect(state.user.apiToken).toBeUndefined();
  });

  it('dispatches user actions after injection', () => {
    dynamicReducers.user = userSlice.reducer;
    store.replaceReducer(createRootReducer());

    const mockUser = { id: 1, name: 'Test User', email: 'test@test.com' };
    store.dispatch(userSlice.actions.setUser(mockUser));

    const state = store.getState() as { user: UserState };
    expect(state.user.user).toEqual(mockUser);
  });

  it('handles full login/logout flow with state transitions', () => {
    dynamicReducers.user = userSlice.reducer;
    store.replaceReducer(createRootReducer());

    // Login: set token + user
    store.dispatch(userSlice.actions.setApiToken('jwt-token-123'));
    store.dispatch(
      userSlice.actions.setUser({ id: 1, name: 'User', email: 'u@x.com' }),
    );
    store.dispatch(userSlice.actions.setUnreadNotificationsCount(5));

    let state = store.getState() as { user: UserState };
    expect(state.user.apiToken).toBe('jwt-token-123');
    expect(state.user.user?.name).toBe('User');
    expect(state.user.unreadNotificationsCount).toBe(5);

    // Logout: clear everything
    store.dispatch(userSlice.actions.removeUser());
    store.dispatch(userSlice.actions.removeApiToken());
    store.dispatch(userSlice.actions.removeUnreadNotificationsCount());

    state = store.getState() as { user: UserState };
    expect(state.user.user).toBeUndefined();
    expect(state.user.apiToken).toBeUndefined();
    expect(state.user.unreadNotificationsCount).toBeUndefined();
  });

  it('dialogs and network state work alongside user state', () => {
    dynamicReducers.user = userSlice.reducer;
    store.replaceReducer(createRootReducer());

    // Set dialog state
    store.dispatch(DialogsStore.setErrorDialogMessage('Session expired'));

    // Set network state
    store.dispatch(NetworkStateStore.setIsInternetAvailable(true));

    // Set user state
    store.dispatch(userSlice.actions.setApiToken('token'));

    const state = store.getState() as any;
    expect(state.dialogs.errorDialogMessage).toBe('Session expired');
    expect(state.networkState.isInternetAvailable).toBe(true);
    expect(state.user.apiToken).toBe('token');
  });
});
