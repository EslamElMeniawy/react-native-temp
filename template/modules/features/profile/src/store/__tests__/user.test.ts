import { describe, expect, it } from '@jest/globals';

import { userSlice } from '@modules/features-profile/src/store/user';

describe('User Store Slice', () => {
  it('has setUser action', () => {
    expect(userSlice.actions.setUser).toBeDefined();
  });

  it('has removeUser action', () => {
    expect(userSlice.actions.removeUser).toBeDefined();
  });

  it('has setUnreadNotificationsCount action', () => {
    expect(userSlice.actions.setUnreadNotificationsCount).toBeDefined();
  });

  it('has removeUnreadNotificationsCount action', () => {
    expect(userSlice.actions.removeUnreadNotificationsCount).toBeDefined();
  });

  it('has setApiToken action', () => {
    expect(userSlice.actions.setApiToken).toBeDefined();
  });

  it('has removeApiToken action', () => {
    expect(userSlice.actions.removeApiToken).toBeDefined();
  });
});

describe('User Store Slice Reducer', () => {
  it('has initial state', () => {
    expect(userSlice.reducer(undefined, { type: '' })).toEqual({
      user: undefined,
      unreadNotificationsCount: undefined,
      apiToken: undefined,
    });
  });

  it('setUser updates user', () => {
    const state = {
      user: undefined,
      unreadNotificationsCount: undefined,
      apiToken: undefined,
    };
    const newUser = { id: 1, phone: '+1234567890' };
    const newState = userSlice.reducer(
      state,
      userSlice.actions.setUser(newUser as any),
    );

    expect(newState.user).toEqual(newUser);
  });

  it('removeUser clears user', () => {
    const state = {
      user: { id: 1, phone: '+1234567890' },
      unreadNotificationsCount: undefined,
      apiToken: undefined,
    };
    const newState = userSlice.reducer(state, userSlice.actions.removeUser());

    expect(newState.user).toBeUndefined();
  });
});
