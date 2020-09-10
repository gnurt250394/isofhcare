package com.isofh.appisofhcaredev;

import cl.json.ShareApplication;
import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import de.innfactory.apiai.RNApiAiPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
// import io.invertase.firebase.auth.RNFirebaseAuthPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.isofh.appisofhcaretest.LaunchApplicationPackage;
import com.microsoft.codepush.react.ReactInstanceHolder;
import com.microsoft.codepush.react.CodePush;
// public class MainApplication extends MultiDexApplication implements ReactApplication, ShareApplication {
  public class MainApplication extends Application implements ReactApplication, ShareApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      if (!BuildConfig.DEBUG) {
        return CodePush.getJSBundleFile();
      }else{
        return super.getJSBundleFile();
      }
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for
      // example:
      // packages.add(new RNCViewPagerPackage());
      packages.add(new RNFingerprintChangePackage());
      packages.add(new RNFirebaseNotificationsPackage());
      packages.add(new RNFirebaseMessagingPackage());
      packages.add(new LaunchApplicationPackage());
      // packages.add(new RNFirebaseAuthPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

 @Override
     public String getFileProviderAuthority() {
            return "com.isofh.appisofhcaredev.provider";
     }
  // @Override
  // protected void attachBaseContext(Context base) {
  //   super.attachBaseContext(base);
  //   MultiDex.install(base);
  // }
}
