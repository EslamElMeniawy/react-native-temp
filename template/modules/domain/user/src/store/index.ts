import { injectReducer } from '@modules/store';
import * as UserStore from './user';
import type { UserState } from './user.types';

// Self-register the user reducer into the store.
injectReducer('user', UserStore.default);

export { UserStore };
export type { UserState };
