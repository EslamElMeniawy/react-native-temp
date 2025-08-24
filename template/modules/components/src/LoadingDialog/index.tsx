import { LoadingDialog } from '@eslam-elmeniawy/react-native-common-components';
import { useAppSelector } from '@src/store';
import * as React from 'react';

export default React.memo(() => {
  // #region Redux
  const { showLoadingDialog } = useAppSelector(state => state.dialogs);
  // #endregion

  return <LoadingDialog visible={showLoadingDialog} />;
});
