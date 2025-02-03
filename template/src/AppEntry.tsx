import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import * as React from 'react';
import {enableScreens} from 'react-native-screens';

enableScreens();

function getLogMessage(message: string) {
  return `## AppEntry:: ${message}`;
}

// Register background handler for firebase messages.
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.info(getLogMessage('BackgroundMessageHandler'), remoteMessage);
});

function AppEntry({isHeadless}: Readonly<{isHeadless?: boolean}>) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore.
    return null;
  }

  const App = React.lazy(() => import('@src/App'));

  return (
    <React.Suspense>
      <App />
    </React.Suspense>
  );
}

export default AppEntry;
