# Coding Conventions

## Import Rules

- **No relative imports** — `../` is disallowed. Use path aliases (`@src/*`, `@modules/*`).
- **Import order** (enforced by ESLint):
  1. Builtin → External → `@src/**` / `@modules/**` → Parent → Sibling → Index → Types
- **Prefer `import type`** for type-only imports.

## Naming Conventions

| Context                                | Style                |
| -------------------------------------- | -------------------- |
| Default (variables, functions, params) | `camelCase`          |
| Types, interfaces, React components    | `PascalCase`         |
| Enum members, constants                | `UPPER_CASE`         |
| Private class members                  | `_leadingUnderscore` |

## Code Quality Guards

| Rule                            | Threshold |
| ------------------------------- | --------- |
| Max complexity                  | 20        |
| Max function lines              | 50        |
| Max file lines                  | 300       |
| Max combined conditions (React) | 1         |
| Max params                      | warn      |

## Style Rules

- Arrow functions: `as-needed` body style
- Self-closing components required
- No array index as React key
- Prettier: single quotes, trailing commas, no parens on single-arg arrows

## Architectural Boundaries (ESLint-enforced)

```
Core       → cannot import from: store, domain, feature, navigation, app
Store      → cannot import from: shared, feature, navigation, app
Domain     → cannot import from: feature, navigation, app
Feature    → cannot import from: other features, app
Shared     → cannot import from: app
```

These boundaries are enforced via ESLint `no-restricted-imports` and will fail CI.
