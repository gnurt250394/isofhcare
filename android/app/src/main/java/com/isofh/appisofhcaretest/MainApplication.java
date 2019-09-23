package com.isofh.appisofhcaretest;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.christopherdro.RNPrint.RNPrintPackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.github.douglasjunior.reactNativeGetLocation.ReactNativeGetLocationPackage;
import com.github.reactnativecommunity.location.RNLocationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.mainam.payoo.PayooPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.tkporter.sendsms.SendSMSPackage;
import com.wheelpicker.WheelPickerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import org.pweitz.reactnative.locationswitch.LocationSwitchPackage;
import org.reactnative.camera.RNCameraPackage;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.realm.react.RealmReactPackage;
import io.underscope.react.fbak.RNAccountKitPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

// public class MainApplication extends MultiDexApplication implements ReactApplication, ShareApplication {
  public class MainApplication extends Application implements ReactApplication, ShareApplication {
    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

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
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new SvgPackage(),
			  new RNCWebViewPackage(),
            new NetInfoPackage(),
              new RNPrintPackage(),
              new WheelPickerPackage(),
              new ReactNativeGetLocationPackage(),
              new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
              new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
              new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
              new AppCenterReactNativePackage(MainApplication.this),
              SendSMSPackage.getInstance(),
              new PayooPackage(),
              new LocationSwitchPackage(),
              new RNLocationPackage(),
              new VectorIconsPackage(),
              new RNAccountKitPackage(),
              new PhotoViewPackage(),
              new RNGooglePlacesPackage(),
              new RealmReactPackage(),
              new RNFetchBlobPackage(),
              new RNCameraPackage(),
              new MapsPackage(),
              new PickerPackage(),
              new RNFirebasePackage(),
              new RNFirebaseMessagingPackage(),
              new RNFirebaseNotificationsPackage(),
              new RNSharePackage(),
              new RNHTMLtoPDFPackage(),
              new RNDeviceInfo(),
              new RNGoogleSigninPackage(),
              new FBSDKPackage(),
              new LinearGradientPackage(),
              new AsyncStoragePackage(),
              new RNGestureHandlerPackage()

      );
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
         return "com.isofh.appisofhcaretest.provider";
  }

  // @Override
  // protected void attachBaseContext(Context base) {
  //   super.attachBaseContext(base);
  //   MultiDex.install(base);
  // }
}
