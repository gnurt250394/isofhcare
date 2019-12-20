import client from "@utils/client-utils";
import string from "mainam-react-native-string-utils";
import constants from "../res/strings";
module.exports = {
    getLocationDirection(origin, destination, mode) {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=AIzaSyDM-WhL9Fb5NxuX3Gp0V9q864vWuJtUg2Q&mode=${mode}`;
        return new Promise((resolve, reject) => {

            client.requestApi(
                "get",
                url,
                {},
                (s, e) => {
                    if (s) resolve(s);
                     reject(e);
                }
            );
        });
    },

};
