import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import { Platform } from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    getListProvince(callback, requestApi) {
        if (!requestApi) {
            datacacheProvider.read("", constants.key.storage.DATA_PROVINCE, (s, e) => {
                if (s) {
                    if (callback)
                        callback(s, e);
                    this.getListProvince(null, true);
                }
                else
                    this.getListProvince(callback, true);
            });
        } else {
            client.requestApi("get", constants.api.location.getListProvince, {}, (s, e) => {
                if (s && s.code == 0 && s.data && s.data.provinces) {
                    datacacheProvider.save("", constants.key.storage.DATA_PROVINCE, s.data.provinces);
                    if (callback)
                        callback(s.data.provinces, e);
                }
            });
        }
    },



    // searchPlace(query, callback) {
    //     if (query) {
    //         query = query.trim();
    //         while (query.indexOf(' ') != -1) {
    //             query = query.replace(' ', '+');
    //         }
    //     }
    //     var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + (Platform.OS == "ios" ? "AIzaSyDsCC9o37vgSjnK6GJ_xhpkhCgqco44X4U" : "AIzaSyD5QZaFvWLLC0j5XSDJ8yBVdhs9hZbtpdQ" + "&language=vi");
    //     client.requestApi("get", url, {}, (s, e) => {
    //         try {
    //             if (callback)
    //                 callback(s, e);
    //         } catch (error) {
    //             if (callback)
    //                 callback(null, error);
    //         }
    //     });
    // }

    searchPlace(query, callback) {
        RNGooglePlaces.getAutocompletePredictions(query, {
            country: 'VN'
        })
            .then((place) => {
                console.log(place);
                if (callback)
                    callback(place);
            })
            .catch(error => {
                console.log(error.message);
                if (callback)
                    callback([]);
            });

        // if (query) {
        //     query = query.trim();
        //     while (query.indexOf(' ') != -1) {
        //         query = query.replace(' ', '+');
        //     }
        // }
        // var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + (Platform.OS == "ios" ? "AIzaSyDsCC9o37vgSjnK6GJ_xhpkhCgqco44X4U" : "AIzaSyD5QZaFvWLLC0j5XSDJ8yBVdhs9hZbtpdQ" + "&language=vi");
        // client.requestApi("get", url, {}, (s, e) => {
        //     try {
        //         if (callback)
        //             callback(s, e);
        //     } catch (error) {
        //         if (callback)
        //             callback(null, error);
        //     }
        // });
    },
    getByPlaceId(placeId, callback) {
        RNGooglePlaces.lookUpPlaceByID(placeId)
            .then((results) => {
                console.log(results);
                if (callback)
                    callback(results);
            })
            .catch((error) => {
                console.log(error.message);
                callback(undefined, error);
            });
    },
    pickLocation(latlon, callback) {
        let _latlon = latlon;
        if (!_latlon)
            _latlon = {};
        if (callback)
            RNGooglePlaces.openPlacePickerModal(_latlon)
                .then((place) => {
                    callback(place);
                })
                .catch(error => callback(null, error));  // error is a Javascript Error object
    },
    saveCurrentLocation(latitude, longitude) {
        datacacheProvider.save("", constants.key.storage.CURRENT_LOCATION, { latitude, longitude }, true);
    },
    getCurrentLocationHasSave() {
        return new Promise((resolve, reject) => {
            datacacheProvider.readPromise("", constants.key.storage.CURRENT_LOCATION, true).then(s => {
                resolve(s);
            }).catch(e => {
                reject(e);
            });
        })
    },
    getAllCountry() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", constants.api.location.getAllCountry, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            });
        })
    },

    districtGetByProvince(provinceId) {
        return new Promise ((resolve, reject) => {
            client.requestApi('get', `${constants.api.location.districtGetByProvince}/{${provinceId}}`,{},(s,e)=> {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
    zoneGetByDistrict(districtId){
        return new Promise((resolve,reject) => {
            client.requestApi('get',`${constants.api.location.zoneGetByDistrict}/{${districtId}}`,{},(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
    getAllProvince(){
        return new Promise((resolve,reject) => {
            client.requestApi('get',constants.api.location.getAllProvince,{},(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
}