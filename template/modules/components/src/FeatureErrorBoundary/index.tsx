import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

import type { ErrorInfo, PropsWithChildren } from 'react';

interface FeatureErrorBoundaryProps {
  featureName: string;
  onError?: (error: unknown, featureName: string) => void;
}

const FallbackComponent = ({
  featureName,
  resetErrorBoundary,
}: {
  featureName: string;
  resetErrorBoundary: () => void;
}) => (
  <View style={styles.container}>
    <Text variant="titleMedium" style={styles.title}>
      Something went wrong
    </Text>
    <Text variant="bodyMedium" style={styles.message}>
      {`The ${featureName} feature encountered an error.`}
    </Text>
    <Button mode="contained" onPress={resetErrorBoundary} style={styles.button}>
      Try Again
    </Button>
  </View>
);

const FeatureErrorBoundary = ({
  featureName,
  onError: onErrorProp,
  children,
}: PropsWithChildren<FeatureErrorBoundaryProps>) => {
  const onError = (error: unknown, info: ErrorInfo) => {
    console.error(`FeatureErrorBoundary::${featureName}`, error, info);
    onErrorProp?.(error, featureName);
  };

  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <FallbackComponent
          featureName={featureName}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
});

export default React.memo(FeatureErrorBoundary);
