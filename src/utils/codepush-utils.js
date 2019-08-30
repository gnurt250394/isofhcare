import codePush from "react-native-code-push";
import { Alert } from 'react-native';
import snackbar from "@utils/snackbar-utils";
import constants from '@resources/strings';
import dataCacheProvider from '@data-access/datacache-provider';
module.exports = {
    checkupDate(silent) {
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
                    snackbar.show("Bạn đang sử dụng phiên bản iSofHCare mới nhất", "success");
            }
        }).catch(e => {
            if (!silent)
                snackbar.show("Bạn đang sử dụng phiên bản iSofHCare mới nhất", "success");
        })
    }
}