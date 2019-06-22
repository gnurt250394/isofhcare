package com.isofh.appisofhcaredev;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.github.douglasjunior.reactNativeGetLocation.ReactNativeGetLocationPackage;
import com.microsoft.codepush.react.CodePush;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.tkporter.sendsms.SendSMSPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.mainam.payoo.PayooPackage;
import org.pweitz.reactnative.locationswitch.LocationSwitchPackage;
import com.github.reactnativecommunity.location.RNLocationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import io.underscope.react.fbak.RNAccountKitPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import io.realm.react.RealmReactPackage;
import org.reactnative.camera.RNCameraPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import cl.json.RNSharePackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import cl.json.ShareApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // <-- Add this line
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import java.util.Arrays;
import java.util.List;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.BV.LinearGradient.LinearGradientPackage;

public class MainApplication extends MultiDexApplication implements ReactApplication, ShareApplication{
private static CallbackManager mCallbackManager = CallbackManager.Factory.create();


  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
            new ReactNativeGetLocationPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this),
            SendSMSPackage.getInstance(),
            new ExtraDimensionsPackage(),
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
        new RNExitAppPackage(),
        new RNFirebasePackage(),
        new RNFirebaseMessagingPackage(),
        new RNFirebaseNotificationsPackage(),
        new RNSharePackage(),
        new RNHTMLtoPDFPackage(),
        new RNDeviceInfo(),
        new RNGoogleSigninPackage(),
        new FBSDKPackage(mCallbackManager),
              new LinearGradientPackage()

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
         return "com.isofh.appisofhcaredev.provider";
  }

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(base);
  }
}
