
import client from '@utils/client-utils';
import constants from '@resources/strings';

module.exports = {
    upload(uri, callback) {
        client.uploadFile(constants.api.upload.image, uri, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    addImageToConference(url, name, createdDate, note, conferenceId, callback) {
        client.requestApi("post", constants.api.image.add_to_conference, {
            images: [{
                url,
                name,
                note,
                objectId: conferenceId,
                createdDate
            }]
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    },
    getByConference(conferenceId, page, size, callback) {
        client.requestApi("get", constants.api.conference.get_image + "/" + conferenceId + "?page=" + page + "&size=" + size, {
        }, (s, e) => {
            if (callback)
                callback(s, e);
        });
    }
}