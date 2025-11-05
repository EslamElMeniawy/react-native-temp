import * as React from 'react';
import { ApiTokenLocalStorage } from '@modules/features-auth';
import { useGetUserDetailsApi, UserStore } from '@modules/features-profile';
import { useAppDispatch } from '@modules/store';
import { saveUserData } from '@modules/utils';

export const useSplashUserLoader = (isBootSplashLogoLoaded: boolean) => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## SplashScreen::useSplashUserLoader:: ${message}`;
  // #endregion

  // #region Redux
  const dispatch = useAppDispatch();
  // #endregion

  // #region State
  const [shouldStartUserLoading, setShouldStartUserLoading] =
    React.useState<boolean>(false);

  const [isUserLoaded, setUserLoaded] = React.useState<boolean>(false);
  // #endregion

  // #region API
  const {
    data: apiUser,
    isError: isErrorApi,
    isSuccess: isSuccessApi,
  } = useGetUserDetailsApi({ enabled: shouldStartUserLoading });
  // #endregion

  const getSavedUserToken = React.useCallback(() => {
    console.info(getLogMessage('getSavedUserToken'));
    const apiToken = ApiTokenLocalStorage.getApiToken();
    console.info(getLogMessage('apiToken'), apiToken);

    if (apiToken) {
      dispatch(UserStore.setApiToken(apiToken));
      setShouldStartUserLoading(true);
    } else {
      setUserLoaded(true);
    }
  }, [dispatch]);

  const saveApiUserData = React.useCallback(() => {
    if (apiUser) {
      saveUserData(apiUser);
    }

    setUserLoaded(true);
  }, [apiUser]);

  // #region Setup
  React.useEffect(() => {
    if (isBootSplashLogoLoaded) {
      getSavedUserToken();
    }
  }, [isBootSplashLogoLoaded, getSavedUserToken]);

  React.useEffect(() => {
    if (isSuccessApi) {
      saveApiUserData();
    }

    if (isErrorApi) {
      setUserLoaded(true);
    }
  }, [isSuccessApi, isErrorApi, saveApiUserData]);
  // #endregion

  return isUserLoaded;
};
