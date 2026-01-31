# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# function in build.gradle.

# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep React Native
-keep class com.facebook.{.**;} # React Native
-keep class com.facebook.react.** {*;} # React Native

# Keep Vision Camera
-keep class org.reactnative.camera.** {*;} # React Native Camera
-keep class com.visioncamera.** {*;} # Vision Camera

# Keep ML Kit Barcode Scanning
-keep class com.google.mlkit.** {*;}

# Keep Kotlin
-keepclassmembers class **$WhenMappings {
    <fields>;
}
-keepclassmembers class kotlin.Metadata {
    public <methods>;
}

# Keep Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}

# Keep AndroidX
-keep class androidx.** {*;}
-keep interface androidx.** {*;}

# Keep R8 compatibility
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes Exceptions

# Crashlytics
-keepattributes SourceFile,LineNumberTable
