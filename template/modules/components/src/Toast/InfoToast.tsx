import { useAppTheme } from '@modules/theme';
import * as React from 'react';
import BaseToast from './BaseToast';
import type { ToastConfigParams } from 'toastify-react-native/utils/interfaces';

export default React.memo((props: ToastConfigParams) => {
  const theme = useAppTheme();

  const toastProps: ToastConfigParams = {
    ...props,
    iconColor: theme.colors.onSurface,
    progressBarColor: theme.colors.onSurface,
  };

  return <BaseToast {...toastProps} />;
});
