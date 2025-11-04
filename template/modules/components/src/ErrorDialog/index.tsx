import { AlertDialog } from '@eslam-elmeniawy/react-native-common-components';
import { TranslationNamespaces } from '@modules/localization';
import { useAppDispatch, useAppSelector, DialogsStore } from '@modules/store';
import { removeUserDataLogout } from '@modules/utils';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export default React.memo(() => {
  const { t: translate } = useTranslation(TranslationNamespaces.COMMON);

  // #region Redux
  const dispatch = useAppDispatch();

  const { errorDialogTitle, errorDialogMessage } = useAppSelector(
    state => state.dialogs,
  );
  // #endregion

  const onDismiss = () => {
    // Check if session expired then:
    // - Remove user.
    // - Remove notifications count.
    // - Navigate to login screen.
    if (errorDialogMessage === translate('sessionExpired')) {
      removeUserDataLogout();
    }

    dispatch(DialogsStore.removeErrorDialog());
  };

  return (
    <AlertDialog
      title={errorDialogTitle}
      message={errorDialogMessage}
      dialogProps={{
        visible: Boolean(errorDialogMessage),
        onDismiss: onDismiss,
      }}
      actions={[
        { action: translate('ok'), actionProps: { onPress: onDismiss } },
      ]}
    />
  );
});
