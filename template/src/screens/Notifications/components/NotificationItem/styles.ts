import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  notificationItem: {
    width: '90%',
    marginHorizontal: '5%',
    marginVertical: ResponsiveDimensions.vs(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationItemContent: { flex: 1, marginStart: ResponsiveDimensions.s(8) },
});

export default styles;
