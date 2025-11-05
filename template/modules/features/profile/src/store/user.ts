import { createSlice } from '@reduxjs/toolkit';
import type { User } from '@modules/core';
import type { UserState } from './user.types';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  user: undefined,
  unreadNotificationsCount: undefined,
  apiToken: undefined,
} as UserState;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    removeUser(state) {
      state.user = undefined;
    },
    setUnreadNotificationsCount(state, action: PayloadAction<number>) {
      state.unreadNotificationsCount = action.payload;
    },
    removeUnreadNotificationsCount(state) {
      state.unreadNotificationsCount = undefined;
    },
    setApiToken(state, action: PayloadAction<string>) {
      state.apiToken = action.payload;
    },
    removeApiToken(state) {
      state.apiToken = undefined;
    },
  },
});

export const {
  setUser,
  removeUser,
  setUnreadNotificationsCount,
  removeUnreadNotificationsCount,
  setApiToken,
  removeApiToken,
} = userSlice.actions;

export default userSlice.reducer;
