import type { User } from '@modules/core';
import { getUserServiceDependencies } from './userServiceDependencies';

const getLogMessage = (message: string) => `## UserUtils:: ${message}`;

/**
 * Save user data to local storage and store state.
 *
 * @param user - The user object to be saved.
 */
export const saveUserData = (user: User) => {
  console.info(getLogMessage('saveUserData'), user);
  const deps = getUserServiceDependencies();
  deps.setUser(user);
  deps.dispatchSetUser(user);
};

/**
 * Save api token to local storage and store state.
 *
 * @param apiToken - The api token to be saved.
 */
export const saveApiToken = (apiToken: string) => {
  console.info(getLogMessage('saveApiToken'), apiToken);
  const deps = getUserServiceDependencies();
  deps.setApiToken(apiToken);
  deps.dispatchSetApiToken(apiToken);
};

/**
 * Save user data and navigate to the home screen.
 *
 * @param user - The user object containing user data.
 * @param apiToken - The api token.
 * @returns void
 */
export const saveUserDataOpenHome = (user: User, apiToken: string) => {
  console.info(getLogMessage('saveUserDataOpenHome'), user, apiToken);
  saveUserData(user);
  saveApiToken(apiToken);
  const deps = getUserServiceDependencies();
  deps.resetNavigation('home');
};

/**
 * Removes user data from local storage by deleting user,
 * unread notifications count, API token, and FCM token.
 */
export const removeLocalStorageUserData = () => {
  console.info(getLogMessage('removeLocalStorageUserData'));
  const deps = getUserServiceDependencies();
  deps.removeUser();
  deps.removeUnreadNotificationsCount();
  deps.removeApiToken();
  deps.removeFcmToken();
};

/**
 * Removes user data from the Redux store by dispatching actions to remove user,
 * unread notifications count, and API token.
 */
export const removeReduxUserData = () => {
  console.info(getLogMessage('removeReduxUserData'));
  const deps = getUserServiceDependencies();
  deps.dispatchRemoveUser();
  deps.dispatchRemoveUnreadNotificationsCount();
  deps.dispatchRemoveApiToken();
};

/**
 * Asynchronously removes user data by performing the following steps:
 * 1. Logs a message indicating the start of the process.
 * 2. Removes user data from local storage by calling 'removeLocalStorageUserData' function.
 * 3. Deletes the messaging token by calling `deleteMessagingToken` function.
 * 4. Removes user data from Redux store by calling `removeReduxUserData` function.
 * 5. Calls the optional 'onFinish' callback function if provided.
 *
 * @param onFinish Optional callback function to be executed after the user data removal process is completed.
 * @returns A Promise that resolves once the user data removal process is finished.
 */
export const removeUserData = async (onFinish?: () => void): Promise<void> => {
  console.info(getLogMessage('removeUserData'));
  removeLocalStorageUserData();
  removeReduxUserData();

  try {
    const deps = getUserServiceDependencies();
    await deps.deleteMessagingToken();
  } catch (error) {
    console.error(getLogMessage('removeUserData::deleteToken Error'), error);
  } finally {
    onFinish?.();
  }
};

/**
 * Asynchronously removes user data during logout process.
 * This function logs a message, removes user data from local storage, deletes FCM token,
 * removes user data from Redux store, resets navigation to the login screen, and resets query client queries.
 *
 * @returns A Promise that resolves once all user data is successfully removed.
 */
export const removeUserDataLogout = async (): Promise<void> => {
  console.info(getLogMessage('removeUserDataLogout'));

  await removeUserData(async () => {
    const deps = getUserServiceDependencies();

    try {
      await deps.cancelQueries();
    } catch (error) {
      console.error(
        getLogMessage('removeUserDataLogout::cancelQueries Error'),
        error,
      );
    } finally {
      deps.clearQueryCache();
      deps.resetNavigation('login');
    }
  });
};
