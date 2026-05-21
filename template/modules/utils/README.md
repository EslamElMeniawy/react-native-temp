# @modules/utils

Shared utility functions and orchestration services.

## Public API

- `UserUtils` — User data orchestration (save/remove user, logout) via DI
- `NotificationUtils` — Push notification handling, display, and navigation
- `LinkingUtils` — Deep link parsing and handling
- `queryClient` / `clientPersister` — React Query client and MMKV persister
- `RandomUtils` — Random color generation, ID generation
- `useFocusNotifyOnChangeProps` / `useRefreshOnFocus` — React Query + Navigation hooks
- `registerUserServiceDependencies` / `getUserServiceDependencies` — DI registration

## Dependencies

- `@modules/core`, `@modules/store`, `@modules/theme`
- `@modules/navigation`, `@modules/domain-user`, `@modules/features-notifications`

## Constraints

- Must NOT import from `app` layer
- Enforced by `eslint-plugin-boundaries` (tier: shared)
