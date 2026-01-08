# React Native Template

<p>
  <a href="https://www.npmjs.com/package/@eslam-elmeniawy/react-native-template">
    <img alt="npm Version" src="https://img.shields.io/npm/v/@eslam-elmeniawy/react-native-template.svg" />
  </a>
  <a href="https://github.com/EslamElMeniawy/react-native-temp#readme">
    <img alt="Documentation" src="https://img.shields.io/badge/Documented%3F-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/EslamElMeniawy/react-native-temp/graphs/commit-activity">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/EslamElMeniawy/react-native-temp/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

React Native template with a multi-module architecture, pre-wired state/query stacks, Firebase, and developer tooling.

## Features

- Multi-module structure with shared packages under `modules/*` (navigation, store, features, theme, localization, utils, components, assets).
- State: Redux Toolkit + middleware, persisted local storage with MMKV gate before rendering the app shell.
- Data: TanStack Query with axios, async-storage persister using MMKV, background handlers, and query-aware Reactotron logging.
- UI/UX: React Native Paper theming, gesture/safe-area ready shell, toast/error/loading dialogs, orientation handling, and network status hooks.
- Navigation: React Navigation stacks/tabs with debug menu, network logs screen, and shake-to-open debug menu when local logging is enabled.
- Firebase: Analytics, Cloud Messaging (foreground/background handlers), Crashlytics (wired through ErrorBoundary), optional Firebase logging flags.
- Tooling: Reactotron with MMKV + React Query plugins, network logger, Lefthook + commitlint, Jest + Testing Library with coverage thresholds, Fastlane lanes for iOS/Android.
- Dev convenience: ADB reverse, asset linking, pods install helper, dependency alignment, versioning, fresh-install/start scripts.

## Quick Start

**Prerequisites**
- Node >= 20 (see `engines.node` in [template/package.json](template/package.json)).
- Yarn 4.10.2 (see `packageManager` in [template/package.json](template/package.json)).

**Create a new app**

```sh
npx @react-native-community/cli@latest init MyApp --template @eslam-elmeniawy/react-native-template --pm yarn
```

**Key scripts** (see [template/package.json](template/package.json))
- Dev servers: `yarn start`, `yarn start-reset`, `yarn reverse` (ADB reverse for Metro/Reactotron).
- Run apps: `yarn android:dev|staging|prod`, `yarn ios:dev|staging|prod` (device-size variants available), release variants per platform.
- Quality: `yarn lint`, `yarn typecheck`, `yarn test`, `yarn validate` (all).
- Utilities: `yarn link-assets`, `yarn pods` (macOS), `yarn android-clean`, `yarn reset`, `yarn fresh-install`, `yarn fresh-start`, `yarn svg`, `yarn fastlane`.

**Minimal checklist** (links jump to detailed sections below)
- Set up [Environments & Config](#environments--config).
- Configure [Firebase](#firebase).
- Update [Assets & Branding](#assets--branding).
- Review [Debug & Dev Tooling](#debug--dev-tooling).
- Check [Navigation & Data TODOs](#navigation--data-todos).

## Detailed Setup (linked checklists)

### Environments & Config
- Copy/update flavor files: [template/.env.development](template/.env.development), [template/.env.staging](template/.env.staging), [template/.env.production](template/.env.production).
- Important keys: `ENV_NAME`, `BASE_URL`, `API_URL`, `ENABLE_LOCAL_LOG` (enables Reactotron + network logger + shake menu), `ENABLE_FIREBASE_LOG` (Crashlytics log levels), `USE_FAKE_API`.
- Ensure TypeScript path aliases stay in sync with `tsconfig.json` and Metro/Babel configs (already wired in template).

### Firebase
- Create Firebase apps per flavor and replace `google-services.json` under `android/app` and `GoogleService-Info.plist` under `ios`.
- Update Android applicationId and flavor IDs in [template/android/app/build.gradle](template/android/app/build.gradle) to your package names.
- Update iOS bundle identifiers/schemes in Xcode/`ios` to match your Firebase app IDs and update any flavor-specific build settings.
- FCM: background handler is registered in [template/src/AppEntry.tsx](template/src/AppEntry.tsx); ensure notification permissions/handling align with your app policy.

### Runtime Stack
- Entry sets responsive base dimensions (replace defaults with your Figma base) in [template/src/AppEntry.tsx](template/src/AppEntry.tsx).
- App shell in [template/src/App/App.tsx](template/src/App/App.tsx) wraps GestureHandler, theme background, Redux provider, and waits for local storage initialization before rendering content.
- Error handling uses ErrorBoundary + Crashlytics; keep `ENABLE_FIREBASE_LOG` aligned with your telemetry policy.
- Global UX layers (toast/error/loading), network status, and orientation handling are provided via modules; keep them mounted unless you replace with your own.

### Debug & Dev Tooling
- Logging is initialized via Reactotron with plugins for React Query and MMKV, and optional Firebase log levels; see [template/src/App/useLogInitialization.ts](template/src/App/useLogInitialization.ts).
- `ENABLE_LOCAL_LOG=true` also enables `react-native-network-logger` and a shake listener (`react-native-shake`) to open the debug menu unless already on debug/network log screens.
- `ENABLE_FIREBASE_LOG=true` pushes logs to Crashlytics; use per-environment.

### Assets & Branding
- Fonts: when you add custom fonts, enable the assets array in [template/react-native.config.js](template/react-native.config.js) and run `yarn link-assets`.
- Splash/icons: follow `react-native-bootsplash` setup and replace placeholder icons/splash assets in `modules/assets` and native projects.
- Theme: replace placeholder palette/typography in `modules/theme` and ensure components reference your design tokens.

### Navigation & Data TODOs
- Replace placeholder navigation params/types and ensure modal/screen keys match your routes in `modules/navigation`.
- Update API endpoints, DTOs, and fake API flags in `modules/features/*` to match your backend; server error mapping defaults live in `modules/core`.
- Notifications: replace placeholder icons, channels, and endpoint mappings in `modules/features/notifications`.

### Scripts & Automation
- Commit hooks: Lefthook runs Prettier/ESLint/tsc on staged files; commitlint enforces conventional commits.
- Validation: `yarn validate` runs lint + typecheck + tests; coverage thresholds enforced for `src/**/*` and `modules/*/src/**/*`.
- Dependency alignment: `yarn check-dependencies` / `yarn fix-dependencies` keep RN ecosystem versions in sync.
- Fastlane: lanes for badge/build/beta/release and Firebase distribution live under `fastlane` (requires Bundler).

## TODO Comments

The codebase includes `TODO` comments to highlight spots needing project-specific values (e.g., responsive base dimensions, navigation params, assets, notification endpoints). Search for `TODO:` and address them during setup.

## License

This project is [MIT](LICENSE) licensed.
