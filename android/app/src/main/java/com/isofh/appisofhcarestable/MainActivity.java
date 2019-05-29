package com.isofh.appisofhcarestable;

import com.facebook.react.ReactActivity;
 import android.content.Intent; // <--- import
    import android.content.res.Configuration; // <--- import
    import org.pweitz.reactnative.locationswitch.LocationSwitch;
    import com.tkporter.sendsms.SendSMSPackage;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "APP";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        LocationSwitch.getInstance().onActivityResult(requestCode, resultCode);
        SendSMSPackage.getInstance().onActivityResult(requestCode, resultCode, data);
    }
}
