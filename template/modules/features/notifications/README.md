# @modules/features-notifications

Notifications feature module (list screen, FCM token, mark-read API).

## Public API

- `NotificationsScreen` — Notification list with mark-read functionality
- `useGetNotificationsApi` / `useMarkNotificationReadApi` / `useUpdateFcmTokenApi` — React Query hooks
- `UnreadNotificationsCountLocalStorage` — Badge count persistence
- `notificationsTranslations` — i18n translations (en/ar)
- `fakerNotifications` / `queryNotifications` — Test factories and API services

## Dependencies

- `@modules/core`, `@modules/store`, `@modules/domain-user`
- `@modules/components`, `@modules/localization`, `@modules/theme`
- `@modules/navigation` (screen prop types)

## Constraints

- Must NOT import from other feature modules
- Must NOT import from app layer
- Enforced by `eslint-plugin-boundaries` (tier: feature)
