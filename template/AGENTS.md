# AGENTS.md

React Native modular app (TypeScript, Redux Toolkit, React Query, React Navigation).

## Quick Reference

```bash
yarn start             # Metro dev server
yarn validate          # lint + typecheck + test (run before committing)
yarn android:dev       # Run on Android (dev)
yarn ios:dev           # Run on iOS (dev)
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for module tiers, dependency rules, and key patterns.

## Conventions

- **No `../` imports** — use `@src/*` or `@modules/*` path aliases
- **Conventional commits** enforced by commitlint (`feat(scope): message`)
- **ESLint boundary enforcement** — modules cannot import from higher tiers
- **New modules:** use `./scripts/create-module.sh <type> <name>`

Details: [docs/CODING_CONVENTIONS.md](docs/CODING_CONVENTIONS.md)

## Module Structure

Feature, domain, and shared modules follow a standardized layout with barrel exports, API hooks (React Query), fakers, and co-located tests.

Details: [docs/MODULE_STRUCTURE.md](docs/MODULE_STRUCTURE.md)

## Testing

Jest with `@react-native/jest-preset`. Coverage thresholds enforced (80/75/75/75). Detox for E2E.

Details: [docs/TESTING.md](docs/TESTING.md)

## Key Gotchas

- `USE_FAKE_API` env flag toggles between real API and fakers — all API hooks must support both
- Reducers are injected dynamically via `injectReducer()` — never add them to the root reducer directly
- Dependencies are registered at app startup (not imported directly) to avoid circular deps
- Pre-commit hooks run Prettier, ESLint, and `tsc` — fix issues before committing
