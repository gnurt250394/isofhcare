import codePush from "react-native-code-push";
import { Alert, Linking, Platform } from 'react-native';
import snackbar from "@utils/snackbar-utils";
import constants from '@resources/strings';
import dataCacheProvider from '@data-access/datacache-provider';
function updateFromAppStore() {
    Alert.alert(
        'THÔNG BÁO',
        'Ứng dụng đã có phiên bản mới. Bạn vui lòng cập nhật để có trải nghiệm tốt nhất!',
        [
            {
                text: 'Cập nhật', onPress: () => {
                    let link = Platform.OS == 'android'
                        ? 'market://details?id=com.isofh.isofhcare'
                        : `itms-apps://itunes.apple.com/us/app/id1428148423?mt=8`
                    Linking.canOpenURL(link).then(supported => {
                        supported && Linking.openURL(link);
                    }, (err) => {
                        console.log('err: ', err);

                    })
                }
            },
        ],
        { cancelable: false })
}
module.exports = {
    checkupDate(silent) {
        // updateFromAppStore()
        // return
        codePush.checkForUpdate().then(update => {
            if (update) {
                if (update.isMandatory) {
                    Alert.alert(
                        'THÔNG BÁO',
                        'Ứng dụng đã có phiên bản mới. Bạn vui lòng cập nhật để có trải nghiệm tốt nhất!',
                        [
                            {
                                text: 'Cập nhật', onPress: () => {
                                    snackbar.show("Ứng dụng đang được cập nhật, vui lòng chờ", "success")
                                    codePush.sync({
                                        // updateDialog: true,
                                        installMode: codePush.InstallMode.IMMEDIATE
                                    }).then(s => {
                                        dataCacheProvider.save("", constants.key.storage.KEY_HAS_UPDATE_NEW_VERSION, 1);
                                    });
                                }
                            },
                        ],
                        { cancelable: false },
                    );
                } else {
                    Alert.alert(
                        'THÔNG BÁO',
                        'Ứng dụng đã có phiên bản mới. Bạn vui lòng cập nhật để có trải nghiệm tốt nhất!',
                        [
                            {
                                text: 'Để sau',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            {
                                text: 'Cập nhật', onPress: () => {
                                    snackbar.show("Ứng dụng đang được cập nhật, vui lòng chờ", "success")
                                    codePush.sync({
                                        // updateDialog: true,
                                        installMode: codePush.InstallMode.IMMEDIATE
                                    }).then(s => {
                                        dataCacheProvider.save("", constants.key.storage.KEY_HAS_UPDATE_NEW_VERSION, 1);
                                    });
                                }
                            }
                        ],
                        { cancelable: false },
                    );
                }
            } else {
                if (!silent)
                    snackbar.show("Bạn đang sử dụng phiên bản iSofHcare mới nhất", "success");
            }
        }).catch(e => {
            if (!silent)
                snackbar.show("Bạn đang sử dụng phiên bản iSofHcare mới nhất", "success");
        })
    }
}