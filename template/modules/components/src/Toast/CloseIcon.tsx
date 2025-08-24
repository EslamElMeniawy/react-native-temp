import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { useAppTheme } from '@modules/theme';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import * as React from 'react';

export default React.memo(({ color }: { color?: string }) => {
  const theme = useAppTheme();

  return (
    <MaterialDesignIcons
      name="close"
      color={color ?? theme.colors.onSurface}
      size={ResponsiveDimensions.ms(24)}
    />
  );
});
