package com.isofh.appisofhcare;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.google.gson.Gson;
import com.mainam.payoo.PayooModule;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.tkporter.sendsms.SendSMSPackage;

import org.pweitz.reactnative.locationswitch.LocationSwitch;

import vn.payoo.paymentsdk.OnPayooPaymentCompleteListener;
import vn.payoo.paymentsdk.data.model.response.ResponseObject;
import vn.payoo.paymentsdk.data.model.type.GroupType;

public class MainActivity extends ReactActivity implements OnPayooPaymentCompleteListener {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "APP";
    }


    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        LocationSwitch.getInstance().onActivityResult(requestCode, resultCode);
        SendSMSPackage.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onPayooPaymentComplete(int groupType, @NonNull ResponseObject responseObject) {
        if (groupType == GroupType.SUCCESS) {
            PayooModule.promise.resolve(new Gson().toJson(responseObject.getData()));
        } else {
            PayooModule.promise.reject(groupType + "", responseObject.toString());
        }
    }
}
