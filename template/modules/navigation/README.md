# @modules/navigation

App navigation configuration using React Navigation (native stack).

## Public API

- `RootStack` — Main stack navigator with all screens
- `NavigationContainer` — Configured container with linking and theme
- `NavigationUtils` — Programmatic navigation (navigate, push, reset, goBack)
- `NavigationParamsKeys` — Typed parameter key constants
- `RootStackParamList` / `RootStackScreenProps` — TypeScript navigation types

## Dependencies

- `@modules/features-*` (screen imports)
- `@modules/core`, `@modules/store`, `@modules/theme`
- `@src/screens` (Splash screen)

## Constraints

- This is the ONLY module allowed to import screens from features
- Must NOT import from app layer (except Splash which lives in src/)
- Enforced by `eslint-plugin-boundaries` (tier: navigation)
