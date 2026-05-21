import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: ResponsiveDimensions.vs(24),
  },
  text: {
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    // TODO: Add font family relative to app font.
    // fontFamily: 'Cairo-Bold',
  },
  message: {
    marginTop: ResponsiveDimensions.vs(8),
  },
  btn: {
    width: '90%',
    alignSelf: 'center',
    marginTop: ResponsiveDimensions.vs(16),
  },
  btnTxt: {
    // TODO: Add font family relative to app font.
    // fontFamily: 'Cairo-Bold',
  },
});

export default styles;
