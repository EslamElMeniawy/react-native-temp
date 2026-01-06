# Project Documentation

This project is a React Native application built with a modular architecture.

## Folder Structure

The project follows a modular architecture to ensure scalability and maintainability.

### `modules/`

This directory contains the core building blocks of the application. Each package is linked locally (see `package.json` dependencies).

- **`assets/`**: Images, fonts, and other static assets.
- **`components/`**: Reusable UI components.
- **`core/`**: Core utilities and base configurations.
- **`features/`**: Feature modules (e.g., `auth`, `home`, `profile`, `debug-menu`, `notifications`).
- **`localization/`**: Internationalization setup.
- **`navigation/`**: Navigation configuration and navigators.
- **`store/`**: State management setup.
- **`theme/`**: Theming and styling constants.
- **`utils/`**: Shared utilities.

### `src/`

This directory contains application-specific code that ties the modules together.

- **`App/`**: Application bootstrap and providers.
- **`screens/`**: Screen components composing features.
- **`__tests__/`**: App-level tests.
- **`AppEntry.tsx`**: Entry file consumed by native platforms.

### Native & tooling

- **`android/`** and **`ios/`**: Native projects and build artifacts.
- **`fastlane/`**: iOS and Android lanes for build/distribution.

## Scripts

All commands are in `package.json`. Common groups:

- **Dev servers**: `yarn start`, `yarn start-reset`, `yarn reverse` (ADB reverse for Metro/Reactotron).
- **Assets & pods**: `yarn link-assets`, `yarn pods` (macOS) with fallback notice, `yarn postinstall` runs pods → link-assets → android-clean.
- **Android run/clean**: `yarn android:dev|staging|prod`, `*-release` variants, `yarn android-clean` (gradle clean), `yarn reverse`.
- **Android builds**: `yarn apk:dev|staging|prod`, `yarn bundle:dev|staging|prod`.
- **iOS run/clean**: `yarn ios:dev|staging|prod` plus device-size variants (`-large`, `-small`, `-ipad`), release configs (`ios:* -release`), `yarn ios-clean` (macOS only).
- **Quality**: `yarn lint`, `yarn typecheck`, `yarn test`, `yarn validate` (runs all).
- **Versioning**: `yarn ver` (sets version and resets build), `yarn ver:test` (prerelease without build bump).
- **Dependencies**: `yarn check-dependencies`, `yarn fix-dependencies` (rnx-align-deps).
- **Utilities**: `yarn svg` (vector image generation), `yarn reset` (clean project), `yarn fresh-install`/`yarn fresh-start`, `yarn prepare` (hooks + Bundler), `yarn fastlane` (run lanes).

## Linting & Formatting

The project uses **ESLint** and **Prettier** to enforce code quality and consistent formatting.

### Key Rules

- **Imports**: Enforced order with `@src/**` and `@modules/**` before siblings; `../` is blocked.
- **Naming**: camelCase by default; PascalCase for types/components; UPPER_CASE for enums/constants.
- **Size/complexity guards**: Warnings for high complexity, nesting, params, lines per file/function, and combined conditions in components.
- **Type imports**: Prefer `import type`.
- **Prettier**: single quotes, trailing commas, avoid parens on single-arg arrows.

### Configuration Files

- `.eslintrc.js`: Main ESLint configuration.
- `.prettierrc.js`: Prettier configuration.
- `tsconfig.json`: TypeScript configuration.

## Hooks & commits

- **Lefthook**: Pre-commit runs Prettier (src), ESLint --fix, and `tsc --noEmit` on staged files. Commit-msg runs commitlint.
- **Commitlint**: Conventional commits enforced.

## Testing

- **Jest**: React Native preset with `jest.setup.ts` mocks (NetInfo, DeviceInfo, localization, bootsplash, keyboard controller, Notifee, Firebase, MMKV, etc.).
- **Coverage**: Enabled for `src/**/*` and `modules/*/src/**/*` with thresholds (statements 80, branches 75, functions 75, lines 75).
- **Testing Library**: Applied to test files via ESLint override.

## Tooling & environment

- **TypeScript paths**: `@src/*`, `@packageJson`, `@appJson` via `tsconfig.json`.
- **Yarn**: Yarn 4.10.2 (classic linker, `node_modules`), `yarnPath` under `.yarn/releases`.
- **Fastlane**: iOS and Android lanes for badge, build, beta/release, and Firebase distribution.
