import {StyleSheet} from 'react-native';
import {vs} from 'react-native-size-matters';

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: vs(8),
  },
  scrollViewContent: {
    paddingVertical: vs(32),
    gap: vs(8),
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default styles;
