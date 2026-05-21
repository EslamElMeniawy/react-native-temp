# Testing

## Commands

```bash
yarn test              # Run all tests
yarn validate          # lint + typecheck + test
yarn e2e:ios           # Detox E2E (iOS)
yarn e2e:android       # Detox E2E (Android)
```

## Configuration

- **Preset:** `@react-native/jest-preset`
- **Setup:** `jest.setup.ts` mocks native modules (NetInfo, DeviceInfo, Notifee, Firebase, MMKV, BootSplash, etc.)
- **Module resolution:** tsconfig path aliases mapped in `jest.config.js` `moduleNameMapper`

## Coverage

**Thresholds (enforced):**

| Metric     | Minimum |
| ---------- | ------- |
| Statements | 80%     |
| Branches   | 75%     |
| Functions  | 75%     |
| Lines      | 75%     |

**Collected from:** `src/**/*`, `modules/*/src/**/*`

**Excluded from coverage:**

- `.d.ts` files, `types.ts`
- `index.ts` (barrel re-exports)
- Enums, entities, DTOs, constants
- Translation files

## Test File Location

Place tests in `__tests__/` directories co-located with the source:

```
modules/features/auth/src/__tests__/useLoginApi.test.ts
src/__tests__/App.test.tsx
```

## Mocking Conventions

- External native modules are mocked globally in `jest.setup.ts` and `__mocks__/`
- Module-specific mocks use `jest.mock('@modules/<name>')` in the test file
- API hooks use fakers (same fakers used in `USE_FAKE_API` mode)

## E2E Tests

- **Framework:** Detox
- **Location:** `e2e/`
- **Config:** `e2e/jest.config.js`
