import type { ApiRequest, PagingResponse, Notification } from '@modules/core';
import type {
  MarkNotificationReadResponse,
  NotificationsResponse,
  UpdateFcmTokenBody,
  UpdateFcmTokenResponse,
} from '@modules/features-notifications';
import type { AxiosInstance } from 'axios';

const queryNotifications = {
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  getNotifications: (
    httpClient: AxiosInstance,
    request: ApiRequest,
  ): Promise<PagingResponse<Notification>> =>
    httpClient
      .get<NotificationsResponse>('/notifications', { params: request.params })
      .then(response => ({
        currentPage: response.data.meta?.currentPage,
        lastPage: response.data.meta?.totalPages,
        data: response.data.data?.map(notification => ({
          ...notification,
          key: `notification_${notification.id ?? 0}`,
        })),
      }))
      .catch(error =>
        Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        ),
      ),
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  updateFcmToken: (
    httpClient: AxiosInstance,
    request: ApiRequest<UpdateFcmTokenBody>,
  ) =>
    httpClient
      .post<UpdateFcmTokenResponse>('/update-fcm-token', request.body)
      .then(response => response.data)
      .catch(error =>
        Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        ),
      ),
  // TODO: Change params, endpoint, method, and response mapping based on API requirements.
  markNotificationRead: (
    httpClient: AxiosInstance,
    request: ApiRequest<any, string | number>,
  ) =>
    httpClient
      .post<MarkNotificationReadResponse>(
        `/mark-notification-read/${request.pathVar}`,
      )
      .then(response => response.data)
      .catch(error =>
        Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        ),
      ),
};

export default queryNotifications;
