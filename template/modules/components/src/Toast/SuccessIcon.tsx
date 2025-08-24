import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { useAppTheme } from '@modules/theme';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import * as React from 'react';

export default React.memo(() => {
  const theme = useAppTheme();

  return (
    <MaterialDesignIcons
      name="check-circle"
      color={theme.colors.primary}
      size={ResponsiveDimensions.ms(28)}
    />
  );
});
