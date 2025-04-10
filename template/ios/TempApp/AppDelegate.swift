import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

// Added for "react-native-orientation-locker".
import react_native_orientation_locker

// Added for "react-native-bootsplash".
import RNBootSplash

// Added for "react-native-firebase".
import Firebase
import RNFBMessaging

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Added for "react-native-firebase".
    FirebaseApp.configure()
    
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()
    
    reactNativeDelegate = delegate
    reactNativeFactory = factory
    
    window = UIWindow(frame: UIScreen.main.bounds)
    
    factory.startReactNative(
      withModuleName: "TempApp",
      in: window,
      // Added for injecting "isHeadless" prop into app for "react-native-firebase".
      initialProperties: RNFBMessagingModule.addCustomProps(toUserProps: nil, withLaunchOptions: launchOptions),
      launchOptions: launchOptions
    )
    
    return true
  }
  
  // Added for "react-native-orientation-locker".
  func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
    return Orientation.getOrientation()
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }
  
  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
  
  // Added for "react-native-bootsplash".
  override func customize(_ rootView: RCTRootView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }
}
