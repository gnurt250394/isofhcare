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
    },
    getProfileFamily(){
        return new Promise((resolve, reject) => {
        client.requestApi('get',constants.api.profile.get_profile_family, {}, (s, e) =>{
            if(s)
            resolve(s)
            if(e)
            reject(e)
        })
    })
    },
    getListProfile(){
        return new Promise((resolve, reject) => {
            client.requestApi('get',constants.api.profile.get_list_profile,{},(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
    deleteFamilyProfile(id){
        return new Promise ((resolve,reject) => {
            client.requestApi('delete',`${constants.api.profile.delete_family_profile}/${id}`,{},(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
    createProfile (data){
        return new Promise ((resolve,reject) => {
            client.requestApi('post',`${constants.api.profile.create_profile}`,data,(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
    updateProfile(id,data){
        return new Promise((resolve,reject) => {
            client.requestApi('put',`${constants.api.profile.update_profile}/${id}`,data,(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
    updateAvatar(id,data){
        return new Promise((resolve,reject) => {
            client.requestApi('put',`${constants.api.profile.update_avatar}/${id}`,data,(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
    updateCover(id,data){
        return new Promise((resolve,reject) => {
            client.requestApi('put',`${constants.api.profile.update_cover}/${id}`,data,(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
    sendConfirmProfile(id){
        return new Promise((resolve,reject) => {
            client.requestApi('put',`${constants.api.profile.send_confirm}/${id}`,{},(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
    sharePermission(data){
        return new Promise((resolve,reject) => {
            client.requestApi('put',constants.api.profile.share_permission,data,(s,e) => {
                if(s)
                resolve(s)
                else 
                reject(e)
            })
        })
    },
    checkOtp (data,id){
        return new Promise((resolve,reject) => {
            client.requestApi('put',constants.api.profile.check_otp + '/' + id,data,(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    },
    resendOtp (id){
        return new Promise((resolve,reject) => {
            client.requestApi('put',constants.api.profile.resend_otp + '/' +id,{},(s,e) => {
                if(s)
                resolve(s)
                else
                reject(e)
            })
        })
    }
}