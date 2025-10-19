package com.tempapp

import androidx.multidex.MultiDexApplication
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

// Added for "react-native-orientation-locker".
import org.wonday.orientation.OrientationActivityLifecycle

// Workaround to disable autolinking for android for `react-native-config`
// to fix of build issue.
import com.lugg.RNCConfig.RNCConfigPackage

class MainApplication : MultiDexApplication(), ReactApplication {
    override val reactHost: ReactHost by lazy {
      getDefaultReactHost(
        context = applicationContext,
        packageList =
          PackageList(this).packages.apply {
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // add(MyReactNativePackage())

            // Workaround to disable autolinking for android for `react-native-config`
            // to fix of build issue.
            add(RNCConfigPackage())
          },
      )
    }

    override fun onCreate() {
        super.onCreate()

        // Added for "react-native-orientation-locker".
        registerActivityLifecycleCallbacks(OrientationActivityLifecycle.getInstance())

        loadReactNative(this)
    }
}
