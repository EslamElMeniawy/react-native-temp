import { ResponsiveDimensions } from '@eslam-elmeniawy/react-native-common-components';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: ResponsiveDimensions.vs(16),
  },
  text: { textAlign: 'center', width: '90%', alignSelf: 'center' },
  title: {
    // TODO: Add font family relative to app font.
    // fontFamily: 'Cairo-Bold',
  },
  message: {
    // TODO: Add font family relative to app font.
    // fontFamily: 'Cairo-Regular',
  },
  btn: {
    width: '90%',
    alignSelf: 'center',
    marginTop: ResponsiveDimensions.vs(32),
  },
  btnTxt: {
    // TODO: Add font family relative to app font.
    // fontFamily: 'Cairo-Bold',
  },
});

export default styles;
