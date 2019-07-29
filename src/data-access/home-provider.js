import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

module.exports = {
    getListTopRateHospital(){
        return new Promise((resolve, reject) => {
            client.requestApi("get", `${constants.api.home.get_list_hospital_top_rate}`, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        });
    },
    getNews(requestApi) {
        return new Promise((resolve, reject) => {
            if (!requestApi) {
                datacacheProvider.readPromise("", constants.key.storage.DATA_TOP_NEWS).then(s => {
                    this.getNews(true);
                    resolve(s);
                }).catch(e => {
                    this.getNews(true).then(s => {
                        resolve(s);
                    }).catch(e => {
                        reject([]);
                    })
                });
            }
            else {
                client.requestApi("get", constants.api.home.get_list_news, {}, (s, e) => {
                    if (s && s.code == 0 && s.data && s.data.news ) {
                        datacacheProvider.save("", constants.key.storage.DATA_TOP_NEWS, s.data.news);
                        resolve(s.data.news);
                    }
                    reject([]);
                });
            }
        });
    },
 
}