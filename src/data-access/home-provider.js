import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
// import imagesUtils from 'mainam-react-native-image-utils'
const urlDoctor = 'http://10.0.0.98:8080/'
module.exports = {
    getListTopRateHospital() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.home.get_list_hospital_top_rate}`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
    // getNews(requestApi) {
    //     return new Promise((resolve, reject) => {
    //         if (!requestApi) {
    //             datacacheProvider.readPromise("", constants.key.storage.DATA_TOP_NEWS).then(s => {
    //                 this.getNews(true);
    //                 resolve(s);
    //             }).catch(e => {
    //                 this.getNews(true).then(s => {
    //                     resolve(s);
    //                 }).catch(e => {
    //                     reject([]);
    //                 })
    //             });
    //         }
    //         else {
    //             client.requestApi("get", constants.api.home.get_list_news, {}, (s, e) => {
    //                 if (s && s.code == 0 && s.data && s.data.news) {
    //                     datacacheProvider.save("", constants.key.storage.DATA_TOP_NEWS, s.data.news);
    //                     resolve(s.data.news);
    //                 }
    //                 reject([]);
    //             });
    //         }
    //     });
    // },
    listDoctor() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", urlDoctor + constants.api.home.get_list_doctor, {}, (s, e) => {
                if (s) {
                    // imagesUtils.cachingImage(url, 500, 500, 'PNG', 100,0,'rotation, outputPath').then(s => {
                    //     
                    // })
                    resolve(s);
                } else {
                    reject(e)
                }
            });
        });
    },
    getListDoctor(callback, requestApi) {
        if (!requestApi) {
            datacacheProvider.readPromise("", constants.key.storage.DATA_TOP_DOCTOR).then(s => {
                if (callback)
                    callback(s);
                this.getListDoctor(null, true);
            }).catch(e => {
                this.getListDoctor(callback, true);
            });
        }
        else {
            this.listDoctor().then(s => {
                if (s) {
                    datacacheProvider.save("", constants.key.storage.DATA_TOP_DOCTOR, s);
                    if (callback) {
                        callback(s, e);
                    }
                }
            }).catch(e => {
                if (callback)
                    callback(undefined, e);
            });
        }
    },

    listHospital() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", constants.api.hospital.get_top_hospital, {}, (s, e) => {
                if (s) {
                    // imagesUtils.cachingImage(url, 500, 500, 'PNG', 100,0,'rotation, outputPath').then(s => {
                    //     
                    // })
                    resolve(s);
                } else {
                    reject(e)
                }
            });
        });
    },
    listNewsCovid() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", constants.api.home.news_covid + '?keywords=covid&type=MEDICAL&isHighlight=true&page=0&size=50', {}, (s, e) => {
                if (s) {
                    // imagesUtils.cachingImage(url, 500, 500, 'PNG', 100,0,'rotation, outputPath').then(s => {
                    //     
                    // })
                    resolve(s);
                } else {
                    reject(e)
                }
            });
        });
    },
    getListHospital(callback, requestApi) {
        if (!requestApi) {
            datacacheProvider.readPromise("", constants.key.storage.DATA_TOP_HOSPITAL).then(s => {
                if (callback)
                    callback(s);
                this.getListHospital(null, true);
            }).catch(e => {
                this.getListHospital(callback, true);
            });
        }
        else {
            this.listHospital().then(s => {
                if (s) {
                    datacacheProvider.save("", constants.key.storage.DATA_TOP_HOSPITAL, s);
                    if (callback) {
                        callback(s, e);
                    }
                }
            }).catch(e => {
                if (callback)
                    callback(undefined, e);
            });
        }
    },
}