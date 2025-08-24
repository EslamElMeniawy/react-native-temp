import notifee from '@notifee/react-native';
import * as React from 'react';
import { translate } from '@modules/localization';
import { defaultChannelId, localChannelId } from '@modules/utils';

export const useNotificationsChannels = () => {
  // #region Logger
  const getLogMessage = (message: string) =>
    `## App::useNotificationsChannels:: ${message}`;
  // #endregion

  React.useEffect(() => {
    /**
     * createNotificationsChannel
     *
     * Call "createChannel" from "PushNotification"
     * to handle creating the notifications channel.
     *
     * @param channelId The notifications channel Id to be created.
     */
    const createNotificationsChannel = (channelId: string) => {
      console.info(getLogMessage('createNotificationsChannel'), channelId);

      notifee
        .createChannel({
          id: channelId,
          name: translate('appName') ?? '',
          sound: 'default',
        })
        .then(createdChannelId => {
          console.info(getLogMessage('createdChannelId'), createdChannelId);
        });
    };

    /**
     * createNotificationsChannels
     *
     * Create default and local notifications channels
     * for delivering notifications through on Android 8+.
     */
    const createNotificationsChannels = () => {
      console.info(getLogMessage('createNotificationsChannels'));
      createNotificationsChannel(defaultChannelId);
      createNotificationsChannel(localChannelId);
    };

    createNotificationsChannels();
  }, []);
};
