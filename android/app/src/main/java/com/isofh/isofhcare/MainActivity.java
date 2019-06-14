package com.isofh.isofhcare;

import com.facebook.react.ReactActivity;
 import android.content.Intent; // <--- import
    import android.content.res.Configuration; // <--- import
    import org.pweitz.reactnative.locationswitch.LocationSwitch;
    import com.tkporter.sendsms.SendSMSPackage;
import com.google.gson.Gson;
import com.mainam.payoo.PayooModule;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.annotation.NonNull;

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
            PayooModule.promise.reject(groupType+"",responseObject.toString());
        }
    }
}
