# @modules/features-home

Home screen feature module.

## Public API

- `HomeScreen` — Main home screen with user info and navigation
- `homeTranslations` — i18n translations (en/ar)

## Dependencies

- `@modules/core`, `@modules/store`, `@modules/domain-user`
- `@modules/components`, `@modules/localization`, `@modules/theme`, `@modules/utils`
- `@modules/navigation` (screen prop types)

## Constraints

- Must NOT import from other feature modules
- Must NOT import from app layer
- Enforced by `eslint-plugin-boundaries` (tier: feature)
