import {
  getMessaging,
  requestPermission as firebaseRequestPermission,
  AuthorizationStatus,
  hasPermission as firebaseHasPermission,
} from '@react-native-firebase/messaging';
import * as React from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export const useMessagingPermission = () => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## App::useMessagingPermission:: ${message}`;
  // #endregion

  const messaging = getMessaging();

  const checkAndroidPermissions = React.useCallback(async () => {
    if (Platform.OS === 'android') {
      const androidPermissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      console.info(
        getLogMessage('androidPermissionStatus'),
        androidPermissionStatus,
      );
    }
  }, []);

  const requestPermission = React.useCallback(async () => {
    const authStatus = await firebaseRequestPermission(messaging);
    console.info(getLogMessage('authStatus'), authStatus);

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    console.info(getLogMessage('enabled'), enabled);

    if (!enabled) {
      console.warn(getLogMessage('Notifications Disabled'));
    }
  }, [messaging]);

  React.useEffect(() => {
    /**
     * checkMessagingPermission
     *
     * Check if notifications permission is not granted then:
     * - Request notifications permission.
     */
    const checkMessagingPermission = async () => {
      console.info(getLogMessage('checkMessagingPermission'));

      try {
        await checkAndroidPermissions();
        const hasPermission = await firebaseHasPermission(messaging);
        console.info(getLogMessage('hasPermission'), hasPermission);

        if (!hasPermission) {
          requestPermission();
        }
      } catch (error) {
        console.error(getLogMessage('checkMessagingPermission Error'), error);
      }
    };

    checkMessagingPermission();
  }, [checkAndroidPermissions, requestPermission, messaging]);
};
