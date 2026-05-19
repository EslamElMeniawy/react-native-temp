import * as UserStore from '@modules/domain-user/src/store/user';
import type { UserState } from '@modules/domain-user/src/store/user.types';
import { injectReducer } from '@modules/store';

// Augment the store's DynamicRootState to include user state.
declare module '@modules/store' {
  interface DynamicRootState {
    user: UserState;
  }
}

// Self-register the user reducer into the store.
injectReducer('user', UserStore.default);

export { UserStore };
export type { UserState };
