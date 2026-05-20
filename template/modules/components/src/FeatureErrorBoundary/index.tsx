import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import FallbackComponent from './FallbackComponent';

import type { ErrorInfo, PropsWithChildren } from 'react';

interface FeatureErrorBoundaryProps {
  featureName: string;
  onError?: (error: unknown, featureName: string) => void;
}

const FeatureErrorBoundary = ({
  featureName,
  onError: onErrorProp,
  children,
}: PropsWithChildren<FeatureErrorBoundaryProps>) => {
  const onError = (error: unknown, info: ErrorInfo) => {
    console.error(`FeatureErrorBoundary::${featureName}`, error, info);
    onErrorProp?.(error, featureName);
  };

  const fallbackRender = ({
    resetErrorBoundary,
  }: {
    resetErrorBoundary: () => void;
  }) => (
    <FallbackComponent
      featureName={featureName}
      resetErrorBoundary={resetErrorBoundary}
    />
  );

  return (
    <ErrorBoundary fallbackRender={fallbackRender} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};

export default React.memo(FeatureErrorBoundary);
