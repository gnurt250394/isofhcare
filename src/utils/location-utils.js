import { Platform, Alert } from 'react-native';
import constants from '@resources/strings'
import locationProvider from '@data-access/location-provider';
import LocationSwitch from 'mainam-react-native-location-switch';
import GetLocation from 'react-native-get-location'
import RNLocation from 'react-native-location';

const getCurrentLocation = (callAgain) => {
    return RNLocation.getLatestLocation().then(region => {
        locationProvider.saveCurrentLocation(region.latitude, region.longitude);
        return region
    }).catch(() => {
        locationProvider.getCurrentLocationHasSave().then(s => {
            if (s && s.latitude && s.longitude) {
                s.latitudeDelta = 0.1;
                s.longitudeDelta = 0.1;
                return s
            }
        }).catch(e => {
            if (!callAgain) {
                getCurrentLocation(true);
            }
        });
    });
}
const openGps = () => {
    Alert.alert(
        'THÔNG BÁO',
        'Bật vị trí để có thể sử dụng chức năng này',
        [
            {
                text: "Cài đặt", onPress: () => {
                    GetLocation.openGpsSettings().then(r => {

                    })
                },

            },
            {
                text:'Huỷ',onPress:()=>{}
            }
        ],
        { cancelable: true },
    );
}
const getLocation = (callAgain) => {
    return new Promise((resolve, reject) => {
        let getLocation = () => {
            RNLocation.requestPermission({
                ios: 'whenInUse', // or 'always'
                android: {
                    detail: 'coarse', // or 'fine'
                    rationale: {
                        title: constants.booking.location_premmission,
                        message: constants.booking.location_premission_content,
                        buttonPositive: constants.actionSheet.accept,
                        buttonNegative: constants.actionSheet.cancel
                    }
                }
            }).then(granted => {
                if (granted) {
                    RNLocation.getLatestLocation().then(region => {
                        locationProvider.saveCurrentLocation(region.latitude, region.longitude);
                        resolve(region)
                    }).catch((e) => {
                        locationProvider.getCurrentLocationHasSave().then(s => {
                            if (s && s.latitude && s.longitude) {
                                s.latitudeDelta = 0.1;
                                s.longitudeDelta = 0.1;
                                resolve(s)
                            }
                        }).catch(async (e) => {

                            if (!callAgain) {
                                console.log("callAgain");
                                let s = await getCurrentLocation(true);
                                resolve(s)
                            }
                        });
                    });
                }
            });
        }

        if (Platform.OS == 'android') {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
            })
                .then(region => {
                    locationProvider.saveCurrentLocation(region.latitude, region.longitude);
                    resolve(region)

                })
                .catch((error) => {
                    const { code, message } = error
                    if (code == 'UNAVAILABLE') {
                        openGps()
                        reject()
                    } else {
                    }
                });
        } else {
            try {
                LocationSwitch.isLocationEnabled(() => {
                    getLocation();
                }, () => reject());
            } catch (error) {
            }
        }
    })


}
const requestPermission = () => {
    return new Promise((resolve, reject) => {
        LocationSwitch.enableLocationService(1000, true, () => {
            resolve()
        }, () => {
            reject()
        });
    })
}

export default {
    getLocation,
    requestPermission
}