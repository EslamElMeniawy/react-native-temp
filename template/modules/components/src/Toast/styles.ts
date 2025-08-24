import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: ResponsiveDimensions.ms(8),
    padding: ResponsiveDimensions.ms(8),
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: ResponsiveDimensions.vs(2) },
    shadowRadius: 3.84,
    elevation: 5,
    gap: ResponsiveDimensions.ms(8),
  },
  textContainer: {
    flex: 1,
  },
});

export default styles;
