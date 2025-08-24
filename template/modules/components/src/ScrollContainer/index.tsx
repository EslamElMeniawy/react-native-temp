import { ScrollView } from '@eslam-elmeniawy/react-native-common-components';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import styles from './styles';
import type { ScrollViewProps } from '@eslam-elmeniawy/react-native-common-components';

export default React.memo((props: ScrollViewProps) => {
  const { contentContainerStyle, children, ...restProps } = props;

  return (
    <ScrollView
      contentContainerStyle={StyleSheet.compose(
        styles.contentContainer,
        contentContainerStyle,
      )}
      {...restProps}
    >
      {children}
    </ScrollView>
  );
});
