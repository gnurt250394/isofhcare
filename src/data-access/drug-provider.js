import client from '@utils/client-utils';
import string from 'mainam-react-native-string-utils';
import constants from '@resources/strings';
import datacacheProvider from '@data-access/datacache-provider';
module.exports = {
    createDrug(id, path, location, note, idUser, name, phone) {
        let body = {
            "images": [
                {
                    "id": id,
                    "path": path
                }
            ],
            "location": location,
            "note": note,
            "owner": {
                "id": idUser,
                "name": name,
                "phone": phone
            }
        }
        return new Promise((resolve, reject) => {
            client.requestApi("post", `${constants.api.drug.create_drug}`, body, (s, e) => {
                if (s) {
                    resolve(s);
                }
                reject(e);
            });
        });
    },
    getLocation(id, page, size) {
        return new Promise((resolve, reject) => {
            client.requestApi('get', `${constants.api.drug.get_location}/${id}/address?page=${page}&size=${size}&sort=desc&properties=created`, {}, (s, e) => {
                if (s)
                    resolve(s)
                else
                    reject(e)
            })
        })
    },
    addLocation(data){
        return new Promise((resolve,reject) => {
        client.requestApi('post',`${constants.api.drug.add_location}`,data,(s,e) => {
            if(s)
            resolve(s)
            else
            reject(e)
        })
        })
    }
}
