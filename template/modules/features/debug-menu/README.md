# @modules/features-debug-menu

Debug menu feature (network logs, environment info) — development only.

## Public API

- `DebugMenuStack` — Nested stack navigator for debug screens
- `DebugMenuScreen` — Environment info, Reactotron toggle, network logs access
- `NetworkLogsScreen` — HTTP request/response log viewer
- `debugMenuTranslations` — i18n translations (en/ar)

## Dependencies

- `@modules/core`, `@modules/store`
- `@modules/components`, `@modules/localization`, `@modules/theme`
- `@modules/navigation` (screen prop types)

## Constraints

- Must NOT import from other feature modules
- Must NOT import from app layer
- Should be conditionally included (dev builds only)
- Enforced by `eslint-plugin-boundaries` (tier: feature)
