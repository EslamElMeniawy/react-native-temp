# @modules/domain-user

User domain module providing data layer (API, storage, store) for user entities.

## Public API

- `UserStore` — Redux slice for user state (login data, profile)
- `UserState` type — TypeScript type for the user store slice
- `UserLocalStorage` — MMKV persistence for user data
- `useGetUserDetailsApi` — React Query hook for user profile
- `queryUser` — API service functions
- `fakerUser` — Test data factories

## Dependencies

- `@modules/core`, `@modules/store`

## Constraints

- Must NOT import from feature, navigation, or app layers
- Other features access user data through this module (not directly)
- Enforced by `eslint-plugin-boundaries` (tier: domain)
