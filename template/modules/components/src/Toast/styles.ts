import {ResponsiveDimensions} from '@eslam-elmeniawy/react-native-common-components';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderRadius: ResponsiveDimensions.ms(8),
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    borderStartWidth: ResponsiveDimensions.ms(8),
  },
  text: {margin: ResponsiveDimensions.ms(8)},
});

export default styles;
