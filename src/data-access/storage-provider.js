import { AsyncStorage } from "react-native";

const mode = "test";
// const mode = "release";
class StorageFactory {
    static async get(key, defaultValue, callback) {
        try {
            let value = await AsyncStorage.getItem(key + mode);
            if (value) {
                let json = JSON.parse(value);
                if (callback)
                    callback(json.value);
            }
            else {
                if (callback)
                    callback(defaultValue);
            }
        } catch (ex) {
            console.log(ex);
            callback(defaultValue);
        }
    }
    static save(key, value) {
        try {
            var obj = {
                value: value
            }
            AsyncStorage.setItem(key + mode, JSON.stringify(obj)); 
            console.log("save data to storage success");
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = StorageFactory;