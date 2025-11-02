import { useMutation } from '@tanstack/react-query';
import { default as Config } from 'react-native-config';
import type { ServerError, ApiRequest } from '@modules/core';
import type {
  UpdateFcmTokenResponse,
  UpdateFcmTokenBody,
} from '@modules/features-notifications';
import {
  fakerNotifications,
  queryNotifications,
} from '@modules/features-notifications';
import type { UseMutationOptions } from '@tanstack/react-query';

const useUpdateFcmTokenApi = (
  options?: Omit<
    UseMutationOptions<
      UpdateFcmTokenResponse,
      ServerError,
      ApiRequest<UpdateFcmTokenBody>
    >,
    'mutationFn'
  >,
) =>
  useMutation<
    UpdateFcmTokenResponse,
    ServerError,
    ApiRequest<UpdateFcmTokenBody>
  >({
    mutationFn: request =>
      Config.USE_FAKE_API === 'true'
        ? fakerNotifications.updateFcmToken(request)
        : queryNotifications.updateFcmToken(request),
    ...(options ?? {}),
  });

export default useUpdateFcmTokenApi;
