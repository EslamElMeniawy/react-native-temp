# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Proguard rules for "react-native-device-info".
-keepclassmembers class com.android.installreferrer.api.** {
  *;
}
-keep class com.google.android.gms.common.** {*;}

# Proguard rules for "@d11/react-native-fast-image".
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# Proguard rules for "react-native-config".
-keep class com.tempapp.BuildConfig { *; }
-keepresources string/build_config_package
