# Module Structure

## Creating a New Module

Use the scaffolding script:

```bash
./scripts/create-module.sh <type> <name>
# Examples:
./scripts/create-module.sh feature payments
./scripts/create-module.sh domain order
./scripts/create-module.sh shared analytics
```

After running the script, manually:

1. Add the module to `package.json` dependencies (`"@modules/<name>": "link:./modules/<type>/<name>"`)
2. Add path aliases to `tsconfig.json`
3. Add module path to `jest.config.js` `moduleNameMapper`

## Feature Module Layout

```
modules/features/<name>/
├── package.json             # "@modules/features-<name>"
├── src/
│   ├── index.ts             # Public barrel exports
│   ├── screens/
│   │   ├── <Name>Screen/
│   │   │   └── index.tsx
│   │   └── index.ts
│   ├── api/
│   │   ├── hooks/           # React Query mutation/query hooks
│   │   ├── services/        # Axios request functions
│   │   ├── fakers/          # Mock data for USE_FAKE_API mode
│   │   ├── responses/       # Response type definitions
│   │   └── index.ts
│   ├── storage/             # Feature-local MMKV storage
│   ├── translations/
│   │   ├── en/index.ts
│   │   ├── ar/index.ts
│   │   └── index.ts
│   └── __tests__/
```

## Domain Module Layout

```
modules/domain/<name>/
├── package.json             # "@modules/domain-<name>"
├── src/
│   ├── index.ts
│   ├── api/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── fakers/
│   │   └── index.ts
│   ├── storage/
│   ├── store/
│   │   ├── <name>.ts        # Redux slice
│   │   └── index.ts
│   └── __tests__/
```

## Key Patterns

### API Hooks (React Query)

```typescript
const useLoginApi = (options?: Omit<UseMutationOptions<...>, 'mutationFn'>) =>
  useMutation<LoginResponse, ServerError, ApiRequest<LoginBody>>({
    mutationFn: request =>
      Config.USE_FAKE_API === 'true'
        ? fakerAuth.login(request)
        : queryAuth.login(request),
    ...(options ?? {}),
  });
```

### Dynamic Reducer Injection

```typescript
import { injectReducer } from '@modules/store';
injectReducer('user', userReducer);
```

### Dependency Registration

```typescript
// Define in the consuming module:
interface ServiceDependencies { ... }
let deps: ServiceDependencies | null = null;
export const registerDependencies = (d: ServiceDependencies) => { deps = d; };

// Register at app startup (src/App):
registerDependencies({ authToken: ..., navigation: ... });
```

### Fake API Toggle

The env variable `USE_FAKE_API` switches between real API and faker data. All API hooks must support both paths.
