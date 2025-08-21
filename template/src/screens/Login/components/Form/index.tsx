import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  UserNameInput,
  PasswordInput,
  LoginButton,
} from '@src/screens/Login/components';
import type { FormValues } from './types';

export default React.memo(() => {
  // #region Form
  const formMethods = useForm<FormValues>({
    defaultValues: { username: '', password: '' },
  });
  // #endregion

  // #region UI
  return (
    <FormProvider {...formMethods}>
      <UserNameInput />
      <PasswordInput />
      <LoginButton />
    </FormProvider>
  );
  // #endregion
});
