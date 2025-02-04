import * as React from 'react';
import Orientation from 'react-native-orientation-locker';

export const useOrientationLocker = () => {
  React.useEffect(() => {
    Orientation.lockToPortrait();
  }, []);
};
