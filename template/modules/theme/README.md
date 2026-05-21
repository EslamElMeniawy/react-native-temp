# @modules/theme

App theme configuration using react-native-paper Material Design 3.

## Public API

- `AppColors` — Color palette constants (light/dark variants)
- `useAppTheme()` — Hook returning the current MD3 theme object

## Dependencies

- External packages only (react-native-paper)

## Constraints

- Must NOT import from domain, feature, navigation, or app layers
- Enforced by `eslint-plugin-boundaries` (tier: shared)
