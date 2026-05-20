# @modules/store

Redux store with dynamic reducer injection.

## Public API

- `store` — Configured Redux store instance
- `injectReducer(key, reducer)` — Register a reducer at runtime (enables module independence)
- `DialogsStore` / `NetworkStateStore` — App-level UI state slices
- Type exports: `RootState`, `AppDispatch`, `DynamicRootState`

## Dependencies

- `@modules/core` (type-only)
- `@modules/domain-user` (type-only for state augmentation)

## Constraints

- Must NOT import from shared, feature, navigation, or app layers
- Enforced by `eslint-plugin-boundaries` (tier: store)
