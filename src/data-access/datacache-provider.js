// import { AsyncStorage } from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import realmModel from '@models/realm-models';
module.exports = {
    save(userId, key, value, saveToLocalStorage) {

        try {
            AsyncStorage.setItem(userId + "_" + key, JSON.stringify({
                value: value
            }));
        } catch (error) {
            console.log(error);
        }
    },
    read(userId, key, callback, fromLocalStorage) {
        if (callback) {
            try {
                AsyncStorage.getItem(userId + "_" + key).then(value => {
                    if (value) {
                        let json = JSON.parse(value);
                        callback(json.value);
                    }
                    else {
                        callback(undefined, { message: "not found" });
                    }
                });
            } catch (e) {
                callback(undefined, {
                    message: e ? JSON.stringify(error) : ""
                });
            }
        }
    },
    readPromise(userId, key, fromLocalStorage) {
        return new Promise((resolve, reject) => {
            try {
                AsyncStorage.getItem(userId + "_" + key).then(value => {
                    if (value) {
                        let json = JSON.parse(value);
                        resolve(json.value);
                    }
                    else {
                        reject({ message: "not found" });
                    }
                });
            } catch (e) {
                reject({
                    message: e ? JSON.stringify(e) : ""
                });
            }
        });
    }
}