import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard} from 'react-native';
import {useLoginApi} from '@src/core';
import type {FormValues} from '@src/screens/Login/components';
import {useAppDispatch, setErrorDialogMessage} from '@src/store';
import {saveUserDataOpenHome} from '@src/utils';

const useLoginButton = () => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## Login::Form::LoginButton::useLoginButton:: ${message}`;
  // #endregion

  const {t: translate} = useTranslation();

  // #region Redux
  const dispatch = useAppDispatch();
  // #endregion

  // #region API
  const {
    mutate: callLoginApi,
    isPending,
    isSuccess,
    isError,
    data: user,
    error,
  } = useLoginApi();

  const handleSuccess = React.useCallback(() => {
    console.info(getLogMessage('handleSuccess'), user);

    if (user) {
      saveUserDataOpenHome(user);
    } else {
      dispatch(
        setErrorDialogMessage(
          translate('error_while_action', {action: translate('login')}),
        ),
      );
    }
  }, [user, translate, dispatch]);

  const handleError = React.useCallback(() => {
    console.error(getLogMessage('handleError'), error);

    if (error) {
      dispatch(
        setErrorDialogMessage(
          error.errorMessage ??
            translate('error_while_action', {action: translate('login')}),
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
        body: {username: formData.username, password: formData.password},
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

  return {isLoggingIn: isPending, onLoginPress};
};

export default useLoginButton;
