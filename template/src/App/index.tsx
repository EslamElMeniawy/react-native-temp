import {
  getCrashlytics,
  recordError,
} from '@react-native-firebase/crashlytics';
import * as React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { default as Config } from 'react-native-config';
import { ErrorFallbackView } from '@modules/components';
import { isAppError, isOperationalError } from '@modules/core';
import App from './App';
import 'react-native-get-random-values';

export default withErrorBoundary(App, {
  fallback: <ErrorFallbackView />,
  onError(error, info) {
    if (isAppError(error)) {
      console.error(
        `ErrorBoundary::onError [${error.code}] operational=${isOperationalError(error)}`,
        error,
        info,
      );
    } else {
      console.error('ErrorBoundary::onError', error, info);
    }

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
