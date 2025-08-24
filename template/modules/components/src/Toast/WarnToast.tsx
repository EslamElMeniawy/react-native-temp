import { useAppTheme } from '@modules/theme';
import * as React from 'react';
import BaseToast from './BaseToast';
import CloseIcon from './CloseIcon';
import type { ToastConfigParams } from 'toastify-react-native/utils/interfaces';

export default React.memo((props: ToastConfigParams) => {
  const theme = useAppTheme();

  const toastProps: ToastConfigParams = {
    ...props,
    iconColor: theme.colors.tertiary,
    progressBarColor: theme.colors.tertiary,
    closeIcon: <CloseIcon color={theme.colors.onTertiaryContainer} />,
  };

  return <BaseToast {...toastProps} />;
});
