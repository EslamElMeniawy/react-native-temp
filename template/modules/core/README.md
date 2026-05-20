# @modules/core

Foundation layer providing HTTP client, storage, and shared entity types.

## Public API

- `httpClient` — Configured axios instance with auth, logging, and error interceptors
- `localStorage` / `initializeLocalStorage` — MMKV-backed encrypted key-value storage
- `LocalStorageKeys` — Typed storage key constants
- Entity types: `ServerError`, `ApiRequest`, `ApiResponse`, `Notification`, `User`, etc.

## Dependencies

External packages only (axios, react-native-mmkv, etc.)

## Constraints

- Must NOT import from any other `@modules/*` package
- Enforced by `eslint-plugin-boundaries` (tier: core)
