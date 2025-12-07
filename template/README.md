# Project Documentation

This project is a React Native application built with a modular architecture.

## Folder Structure

The project follows a modular architecture to ensure scalability and maintainability.

### `modules/`

This directory contains the core building blocks of the application. Each module is self-contained and focuses on a specific domain or functionality.

- **`assets/`**: Static assets like images and fonts.
- **`components/`**: Reusable UI components.
- **`core/`**: Core utilities and base configurations.
- **`features/`**: Feature-specific modules (e.g., `auth`, `home`, `profile`).
- **`localization/`**: Internationalization and localization files.
- **`navigation/`**: Navigation configuration and navigators.
- **`store/`**: State management configuration (Redux/Zustand).
- **`theme/`**: Theming and styling constants.
- **`utils/`**: General utility functions.

### `src/`

This directory contains application-specific code that ties the modules together.

- **`App/`**: Main application entry point and setup.
- **`screens/`**: Screen components that compose features.
- **`utils/`**: App-specific utilities.

## Scripts

The `package.json` file includes various scripts for development, testing, and building.

### Development

- **`yarn start`**: Start the Metro bundler.
- **`yarn start-reset`**: Start the Metro bundler with cache reset.
- **`yarn android:dev`**: Run the Android app in development mode (Debug).
- **`yarn ios:dev`**: Run the iOS app in development mode (Debug).

### Staging & Production

- **`yarn android:staging`**: Run the Android app in staging mode.
- **`yarn android:prod`**: Run the Android app in production mode.
- **`yarn ios:staging`**: Run the iOS app in staging mode.
- **`yarn ios:prod`**: Run the iOS app in production mode.

### Release Builds

Scripts ending in `-release` (e.g., `android:dev-release`, `ios:prod-release`) run the app in release mode for the specified environment.

### Utility

- **`yarn lint`**: Run ESLint to check for code quality issues.
- **`yarn typecheck`**: Run TypeScript compiler to check for type errors.
- **`yarn test`**: Run Jest tests.
- **`yarn fresh-install`**: completely clean and reinstall dependencies (node_modules, pods, etc.).
- **`yarn pods`**: Install iOS pods (macOS only).

## Linting & Formatting

The project uses **ESLint** and **Prettier** to enforce code quality and consistent formatting.

### Key Rules

- **Naming Conventions**:
  - Variables and functions: `camelCase`
  - Components, Classes, and Types: `PascalCase`
  - Constants and Enum Members: `UPPER_CASE`
- **Import Ordering**: Imports are automatically sorted and grouped:
  1. Built-in modules
  2. External dependencies
  3. Parent directories (`@src`, `@modules`)
  4. Sibling directories
  5. Index files
  6. Object imports
  7. Type imports
- **No Parent Imports**: Importing from parent directories using `../` is strictly forbidden to maintain modularity. Use absolute aliases (e.g., `@modules/...`) instead.
- **Type Imports**: Prefer `import type` for type-only imports.

### Configuration Files

- `.eslintrc.js`: Main ESLint configuration.
- `.prettierrc.js`: Prettier configuration.
- `tsconfig.json`: TypeScript configuration.
