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
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    // Added for "react-native-firebase".
    FirebaseApp.configure()
    
    self.moduleName = "TempApp"
    self.dependencyProvider = RCTAppDependencyProvider()
    
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    // Changed for injecting "isHeadless" prop into app for "react-native-firebase".
    self.initialProps = RNFBMessagingModule.addCustomProps(toUserProps: nil, withLaunchOptions: launchOptions)
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
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
  
  // Added for "react-native-orientation-locker".
  override func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
    return Orientation.getOrientation()
  }
  
  // Added for "react-native-bootsplash".
  override func customize(_ rootView: RCTRootView!) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }
}
