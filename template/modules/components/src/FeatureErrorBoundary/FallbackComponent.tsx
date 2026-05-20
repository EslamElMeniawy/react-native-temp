import { Text, Button } from '@eslam-elmeniawy/react-native-common-components';
import { useAppTheme } from '@modules/theme';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import styles from './styles';
import type { FallbackComponentProps } from './types';

const FallbackComponent = ({
  featureName,
  resetErrorBoundary,
}: FallbackComponentProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Text
        type="bold"
        size={18}
        style={StyleSheet.flatten([
          { color: theme.colors.onBackground },
          styles.text,
          styles.title,
        ])}
      >
        Something went wrong
      </Text>
      <Text
        style={StyleSheet.flatten([
          { color: theme.colors.onBackground },
          styles.text,
          styles.message,
        ])}
      >
        {`The ${featureName} feature encountered an error.`}
      </Text>
      <Button
        text="Try Again"
        onPress={resetErrorBoundary}
        style={StyleSheet.compose(
          { backgroundColor: theme.colors.primary },
          styles.btn,
        )}
        textProps={{
          style: StyleSheet.compose(
            { color: theme.colors.onPrimary },
            styles.btnTxt,
          ),
        }}
      />
    </View>
  );
};

export default React.memo(FallbackComponent);
