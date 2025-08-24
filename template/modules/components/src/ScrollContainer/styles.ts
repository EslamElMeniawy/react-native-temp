import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  contentContainer: {
    width: ResponsiveDimensions.percentWidth(100),
    paddingHorizontal: ResponsiveDimensions.percentWidth(5),
  },
});

export default styles;
