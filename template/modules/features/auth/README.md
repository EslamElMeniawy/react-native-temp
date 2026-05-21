# @modules/features-auth

Authentication feature module (login screen, auth API, token storage).

## Public API

- `LoginScreen` — Login form with username/password
- `useLoginApi` / `useLogoutApi` — React Query mutation hooks
- `AuthLocalStorage` — Token and session persistence
- `authTranslations` — i18n translations (en/ar)
- `fakerAuth` — Test data factories

## Dependencies

- `@modules/core`, `@modules/store`, `@modules/domain-user`
- `@modules/components`, `@modules/localization`, `@modules/theme`
- `@modules/navigation` (screen prop types)

## Constraints

- Must NOT import from other feature modules
- Must NOT import from app layer
- Enforced by `eslint-plugin-boundaries` (tier: feature)
