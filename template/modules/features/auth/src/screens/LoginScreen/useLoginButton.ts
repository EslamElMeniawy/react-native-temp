import { TranslationNamespaces } from '@modules/localization';
import { useAppDispatch, DialogsStore } from '@modules/store';
import { saveUserDataOpenHome } from '@modules/utils';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { useLoginApi } from '@modules/features-auth';
import type { FormValues } from './types';

const useLoginButton = () => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## Login::Form::LoginButton::useLoginButton:: ${message}`;
  // #endregion

  const { t: translate } = useTranslation([
    TranslationNamespaces.COMMON,
    TranslationNamespaces.AUTH,
  ]);

  // #region Redux
  const dispatch = useAppDispatch();
  // #endregion

  // #region API
  const {
    mutate: callLoginApi,
    isPending,
    isSuccess,
    isError,
    data: loginResponse,
    error,
  } = useLoginApi();

  const handleSuccess = React.useCallback(() => {
    console.info(getLogMessage('handleSuccess'), loginResponse);

    if (loginResponse?.user && loginResponse?.token) {
      saveUserDataOpenHome(loginResponse.user, loginResponse.token);
    } else {
      dispatch(
        DialogsStore.setErrorDialogMessage(
          translate(`${TranslationNamespaces.COMMON}:errorWhileAction`, {
            action: translate(`${TranslationNamespaces.AUTH}:login`),
          }),
        ),
      );
    }
  }, [loginResponse, translate, dispatch]);

  const handleError = React.useCallback(() => {
    console.error(getLogMessage('handleError'), error);

    if (error) {
      dispatch(
        DialogsStore.setErrorDialogMessage(
          error.errorMessage ??
            translate(`${TranslationNamespaces.COMMON}:errorWhileAction`, {
              action: translate(`${TranslationNamespaces.AUTH}:login`),
            }),
        ),
      );
    }
  }, [error, dispatch, translate]);
  // #endregion

  // #region Press events
  const onLoginPress = React.useCallback(
    (formData: FormValues) => {
      console.info(getLogMessage('onLoginPress'), formData);
      Keyboard.dismiss();

      callLoginApi({
        body: { username: formData.username, password: formData.password },
      });
    },
    [callLoginApi],
  );
  // #endregion

  // #region Setup
  React.useEffect(() => {
    if (isSuccess) {
      handleSuccess();
    }

    if (isError) {
      handleError();
    }
  }, [isSuccess, isError, handleSuccess, handleError]);
  // #endregion

  return { isLoggingIn: isPending, onLoginPress };
};

export default useLoginButton;
