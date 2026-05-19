# Architecture

This document describes the multi-module architecture, dependency rules, and key patterns used in this React Native template.

## Module Tiers

```
┌─────────────────────────────────────────────────────────────┐
│                        src/ (App Layer)                       │
│  AppContent, screens, initialization hooks                   │
├─────────────────────────────────────────────────────────────┤
│                  modules/navigation/                          │
│  RootStack, NavigationContainer, NavigationUtils             │
├─────────────────────────────────────────────────────────────┤
│              modules/features/ (Feature Layer)                │
│  auth, home, notifications, debug-menu                       │
├─────────────────────────────────────────────────────────────┤
│              modules/domain/ (Domain Layer)                   │
│  user (API, store, local storage, fakers)                    │
├─────────────────────────────────────────────────────────────┤
│           modules/components/ modules/utils/                 │
│           modules/theme/ modules/localization/               │
│                    (Shared Layer)                             │
├─────────────────────────────────────────────────────────────┤
│              modules/core/ (Foundation Layer)                 │
│  httpClient, interceptors, entities, storage, localStorage   │
├─────────────────────────────────────────────────────────────┤
│              modules/store/ (Infrastructure)                  │
│  Redux store with dynamic reducer injection                  │
└─────────────────────────────────────────────────────────────┘
```

## Dependency Rules

1. **Core** depends on nothing (only external packages)
2. **Store** depends on core (type-only for state shape)
3. **Shared modules** (utils, components, theme, localization) depend on core and store
4. **Domain modules** depend on core and store
5. **Feature modules** depend on domain, shared, core, and store — never on other features
6. **Navigation** imports screens from features (the only cross-feature import point)
7. **App layer** wires everything together via providers and registration hooks

## Key Patterns

### Dependency Injection via Registration

External dependencies are injected at app startup rather than imported directly. This breaks circular dependency chains and enables isolated unit testing.

**Pattern:**
```typescript
// 1. Define interface in the module that needs deps
interface ServiceDependencies { ... }

// 2. Registration function
let deps: ServiceDependencies | null = null;
export const registerDependencies = (d: ServiceDependencies) => { deps = d; };
export const getDependencies = () => { if (!deps) throw ...; return deps; };

// 3. Register concrete implementations at app startup (useEffect hook)
registerDependencies({ ... });
```

**Applied in:**
- `modules/core/src/api/httpClientDependencies.ts` — auth token, locale, session expiry
- `modules/utils/src/userServiceDependencies.ts` — storage, store dispatch, navigation, firebase

### Dynamic Reducer Injection

Feature modules register their Redux reducers at import time using `injectReducer()`. The store doesn't statically import any feature module.

```typescript
// In modules/domain/user/src/index.ts
import { injectReducer } from '@modules/store';
injectReducer('user', userReducer);
```

### Per-Feature Error Boundaries

`FeatureErrorBoundary` wraps feature screens to prevent one feature's crash from taking down the entire app. Error reporting is injectable via `onError` prop.

### Interceptor Extraction (SRP)

HTTP client interceptors are separated into single-responsibility modules:
- `authInterceptor` — Bearer token + locale headers
- `loggingInterceptor` — color-coded request/response logging
- `errorInterceptor` — 401 handling + error message extraction

## Module Structure Convention

Each module follows this structure:
```
modules/<name>/
├── package.json          # Name: @modules/<name>
├── src/
│   ├── index.ts          # Public barrel exports
│   ├── api/              # API clients, requests, fakers
│   ├── screens/          # Feature screens (features only)
│   ├── storage/          # Local storage utilities
│   ├── store/            # Redux slice (if applicable)
│   └── __tests__/        # Unit tests
```

## Path Aliases

All modules are linked as local packages (`link:./modules/<path>`) and have TypeScript path aliases in `tsconfig.json`:
- `@src/*` → `./src/*`
- `@modules/<name>` → `./modules/<path>/src`
- `@modules/<name>/*` → `./modules/<path>/src/*`

## Testing Strategy

- **Unit tests**: Jest with mocked dependencies (119 suites, 624 tests)
- **Integration tests**: Real providers with minimal mocking (`src/__tests__/integration/`)
- **Upgrade validation**: `scripts/validate-upgrade.sh` runs tsc, lint, tests, and Metro bundle
