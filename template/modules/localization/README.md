# @modules/localization

i18n configuration and translation management.

## Public API

- `I18n` — Configured i18next instance
- `translate(key)` — Translation function
- `AppLanguages` enum — Supported languages (EN, AR)
- `TranslationNamespaces` enum — Namespace keys for each feature
- `allTranslations` — Aggregated translations from all features

## Dependencies

- `@modules/core`, `@modules/store`
- Feature modules (for translation aggregation — deliberate upward dependency)

## Constraints

- Must NOT import from app layer
- Translation aggregation from features is an intentional architectural choice
- Enforced by `eslint-plugin-boundaries` (tier: shared)
