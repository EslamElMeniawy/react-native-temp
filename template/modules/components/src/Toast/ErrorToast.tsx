import { useAppTheme } from '@modules/theme';
import * as React from 'react';
import BaseToast from './BaseToast';
import CloseIcon from './CloseIcon';
import type { ToastConfigParams } from 'toastify-react-native/utils/interfaces';

export default React.memo((props: ToastConfigParams) => {
  const theme = useAppTheme();

  const toastProps: ToastConfigParams = {
    ...props,
    iconColor: theme.colors.error,
    progressBarColor: theme.colors.error,
    closeIcon: <CloseIcon color={theme.colors.onErrorContainer} />,
  };

  return <BaseToast {...toastProps} />;
});
