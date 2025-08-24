import { getStatusBarHeight } from '@eslam-elmeniawy/react-native-common-components';
import { useAppTheme } from '@modules/theme';
import * as React from 'react';
import { I18nManager, StyleSheet } from 'react-native';
import ToastManager from 'toastify-react-native';
import CloseIcon from './CloseIcon';
import ErrorIcon from './ErrorIcon';
import ErrorToast from './ErrorToast';
import InfoIcon from './InfoIcon';
import InfoToast from './InfoToast';
import SuccessIcon from './SuccessIcon';
import SuccessToast from './SuccessToast';
import WarnIcon from './WarnIcon';
import WarnToast from './WarnToast';
import styles from './styles';
import type { ToastConfigParams } from 'toastify-react-native/utils/interfaces';

export default React.memo(() => {
  const theme = useAppTheme();

  const renderSuccessToast = (props: ToastConfigParams) => (
    <SuccessToast {...props} />
  );

  const renderErrorToast = (props: ToastConfigParams) => (
    <ErrorToast {...props} />
  );

  const renderInfoToast = (props: ToastConfigParams) => (
    <InfoToast {...props} />
  );

  const renderWarnToast = (props: ToastConfigParams) => (
    <WarnToast {...props} />
  );

  return (
    <ToastManager
      theme={theme.dark ? 'dark' : 'light'}
      style={StyleSheet.compose(styles.container, {
        backgroundColor: theme.colors.surface,
      })}
      topOffset={getStatusBarHeight()}
      textColor={theme.colors.onSurface}
      closeIcon={<CloseIcon />}
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        info: <InfoIcon />,
        warn: <WarnIcon />,
        default: <InfoIcon />,
      }}
      isRTL={I18nManager.isRTL}
      config={{
        success: renderSuccessToast,
        error: renderErrorToast,
        info: renderInfoToast,
        warn: renderWarnToast,
        default: renderInfoToast,
      }}
    />
  );
});
