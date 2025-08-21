import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollView: { marginVertical: ResponsiveDimensions.vs(8) },
  scrollViewContent: {
    paddingVertical: ResponsiveDimensions.vs(8),
    gap: ResponsiveDimensions.vs(8),
  },
});

export default styles;
