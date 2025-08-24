import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginHorizontal: '5%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsiveDimensions.vs(16),
  },
  message: { marginTop: ResponsiveDimensions.vs(8), textAlign: 'center' },
});

export default styles;
