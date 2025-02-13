fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Build and upload iOS app to TestFlight

### ios release

```sh
[bundle exec] fastlane ios release
```

Build and upload iOS release to App Store

### ios firebase

```sh
[bundle exec] fastlane ios firebase
```

Deploy to Firebase App Distribution (for internal testing)

----


## Android

### android beta

```sh
[bundle exec] fastlane android beta
```

Build and upload Android app to Google Play (Beta)

### android release

```sh
[bundle exec] fastlane android release
```

Build and upload Android release to Google Play Store

### android firebase

```sh
[bundle exec] fastlane android firebase
```

Deploy to Firebase App Distribution (for internal testing)

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
