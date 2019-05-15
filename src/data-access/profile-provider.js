import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';

const Realm = require('realm');
import realmModel from '@models/realm-models';
import { resolve } from 'uri-js';
module.exports = {
    getByUser(userId, callback, requestApi) {
        if (!requestApi) {
            datacacheProvider.readPromise(userId, constants.key.storage.USER_PROFILE).then(s => {
                if (callback)
                    callback(s);
                this.getByUser(userId, null, true);
            }).catch(e => {
                this.getByUser(userId, callback, true);
            });
        }
        else {
            client.requestApi("get", constants.api.profile.get_by_user + "/" + userId, {}, (s, e) => {
                if (s && s.code == 0 && s.data && s.data.profiles && s.data.profiles.length > 0) {
                    datacacheProvider.save(userId, constants.key.storage.USER_PROFILE, s.data.profiles[0]);
                    if (callback) {
                        callback(s.data.profiles[0], e);
                    }
                }
                else {
                    if (callback)
                        callback(undefined, e);
                }
            });
        }
    },
    getByUserPromise(userId) {
        return new Promise((resolve, reject) => {
            this.getByUser(userId, (s, e) => {
                if (s)
                    resolve(s);
                reject(e);
            }, false);
        })
    },
    getUserInfo(id){
        return new Promise((resolve, reject) => {
        client.requestApi('get',constants.api.profile.get_details_user+ "/" + id, {}, (s, e) =>{
            if(s)
            resolve(s)
            if(e)
            reject(e)
        })
    })
    }
}