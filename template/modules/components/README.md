# @modules/components

Reusable UI components built on react-native-paper (Material Design 3).

## Public API

- `Screen` — Base screen wrapper with safe area and theme
- `ErrorDialog` / `LoadingDialog` — Modal dialogs for global state
- `ErrorFallbackView` — Fallback UI for error boundaries
- `FeatureErrorBoundary` — Per-feature crash isolation boundary
- `HookFormTextInput` — react-hook-form integrated text input
- `ListEmptyComponent` / `ListLoadingMore` — FlatList utilities
- `ScrollContainer` — Themed scrollable container
- `SystemBars` — Status bar + navigation bar configuration

## Dependencies

- `@modules/core`, `@modules/store`, `@modules/theme`, `@modules/localization`

## Constraints

- Must NOT import from domain, feature, navigation, or app layers
- Enforced by `eslint-plugin-boundaries` (tier: shared)
