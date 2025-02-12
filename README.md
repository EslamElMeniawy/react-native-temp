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

> React Native template with initial setup.

## Features

- Full project setup is available.
- Using `multi-module` structure.
- `Redux` added and configured using [`Redux Toolkit`](https://redux-toolkit.js.org).
- [`TanStack Query (FKA React Query)`](https://tanstack.com/query/latest/) is used for `API` alongside [`axios`](https://axios-http.com).
- `Navigation` added and configured using [`React Navigation`](https://reactnavigation.org).
- `Firebase` (`Analytics`, `Cloud Messaging` and `Crashlytics`) added and configured.
- Most of libraries added in each project is added and configured.
- `fastlane` scripts available.

## Usage

```sh
npx @react-native-community/cli@latest init MyApp --template @eslam-elmeniawy/react-native-template --pm yarn
```

### Additional Setup

After project creation please follow the following steps before running the project for project to run successfully:

- Change `Android` package name.
- Change `iOS` bundle.
- Create `Firebase` app and register your package and bundle.
- Add `google-services.json` to location `/android/app/google-services.json`.
- Add `GoogleService-Info.plist` to location `/ios/GoogleService-Info.plist`.
- Edit `app_name` key value in each translation file in location `/modules/localization/src/translations/`.
- Add your app native icons.
- Follow the [setup](https://github.com/zoontek/react-native-bootsplash#setup) for [`react-native-bootsplash`](https://github.com/zoontek/react-native-bootsplash) to add native splash screen.
- Change values in `.env.development`, `.env.staging` and `.env.production` to values related to your project.

### `TODO` Comments

The project code has some `TODO` comments for guidance, check the instructions added in these comments and follow them.

## License

This project is [MIT](LICENSE) licensed.
