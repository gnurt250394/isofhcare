
package com.isofh.appisofhcaretest;

import android.app.Activity;
import android.annotation.SuppressLint;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.view.WindowManager;
import android.app.KeyguardManager.KeyguardLock;
import android.view.Window;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.UiThreadUtil;
import static android.content.Context.POWER_SERVICE;

public class LaunchApplicationModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public LaunchApplicationModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "LaunchApplication";
  }

  @ReactMethod
  public void unlock() {
    Log.d("TAG----------------->", "manualTurnScreenOn()");
    UiThreadUtil.runOnUiThread(new Runnable() {
      public void run() {
        Activity mCurrentActivity = getCurrentActivity();
        if (mCurrentActivity == null) {
          Log.d("TAG==============>", "ReactContext doesn't hava any Activity attached.");
          return;
        }
        KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(Context.KEYGUARD_SERVICE);
        KeyguardLock keyguardLock = keyguardManager.newKeyguardLock(Context.KEYGUARD_SERVICE);
        keyguardLock.disableKeyguard();

        PowerManager powerManager = (PowerManager) reactContext.getSystemService(Context.POWER_SERVICE);
        @SuppressLint("InvalidWakeLockTag") PowerManager.WakeLock wakeLock = powerManager.newWakeLock(
                PowerManager.FULL_WAKE_LOCK
                        | PowerManager.ACQUIRE_CAUSES_WAKEUP
                        | PowerManager.SCREEN_BRIGHT_WAKE_LOCK
                        | PowerManager.ON_AFTER_RELEASE, "RNUnlockDeviceModule");

        wakeLock.acquire();

        Window window = mCurrentActivity.getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
      }
    });
  }
  @SuppressLint("WrongConstant")
  @ReactMethod
  public void open(String PackageName) {
  //  Intent dialogIntent = new Intent(getReactApplicationContext(), MainActivity.class);
    Intent dialogIntent = getReactApplicationContext().getPackageManager().getLaunchIntentForPackage(PackageName);

    dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    dialogIntent.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED +
            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD +
            //      WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON +
            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
    getReactApplicationContext().startActivity(dialogIntent);
  }
}