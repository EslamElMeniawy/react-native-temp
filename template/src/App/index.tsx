import {
  getCrashlytics,
  recordError,
} from '@react-native-firebase/crashlytics';
import * as React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { default as Config } from 'react-native-config';
import { ErrorFallbackView } from '@modules/components';
import App from './App';

export default withErrorBoundary(App, {
  fallback: <ErrorFallbackView />,
  onError(error, info) {
    console.error('ErrorBoundary::onError', error, info);

    // Log error to Firebase.
    if (Config.ENABLE_FIREBASE_LOG) {
      recordError(
        getCrashlytics(),
        new Error(
          `## ERROR ## Message: ErrorBoundary::onError ## Data: ${JSON.stringify(
            { error, info },
          )}`,
        ),
      );
    }
  },
});
