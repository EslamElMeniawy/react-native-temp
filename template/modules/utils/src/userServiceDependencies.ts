import type { User } from '@modules/core';

/**
 * Abstraction layer for UserUtils external dependencies.
 * This breaks the coupling between utils module and feature modules.
 * Concrete implementations are registered at app startup.
 */
export interface UserServiceDependencies {
  // Storage operations
  setUser: (user: User) => void;
  removeUser: () => void;
  setApiToken: (token: string) => void;
  removeApiToken: () => void;
  removeUnreadNotificationsCount: () => void;
  removeFcmToken: () => void;

  // Store dispatch operations
  dispatchSetUser: (user: User) => void;
  dispatchSetApiToken: (token: string) => void;
  dispatchRemoveUser: () => void;
  dispatchRemoveApiToken: () => void;
  dispatchRemoveUnreadNotificationsCount: () => void;

  // Navigation
  resetNavigation: (routeName: string) => void;

  // Firebase messaging
  deleteMessagingToken: () => Promise<void>;

  // Query client
  cancelQueries: () => Promise<void>;
  clearQueryCache: () => void;
}

let dependencies: UserServiceDependencies | null = null;

export const registerUserServiceDependencies = (
  deps: UserServiceDependencies,
) => {
  dependencies = deps;
};

export const getUserServiceDependencies = (): UserServiceDependencies => {
  if (!dependencies) {
    throw new Error(
      'UserService dependencies not registered. Call registerUserServiceDependencies() at app startup.',
    );
  }

  return dependencies;
};
