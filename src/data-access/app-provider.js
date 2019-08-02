import client from "@utils/client-utils";
import constants from "@resources/strings";

module.exports = {
    lastActive: new Date(),
    setActiveApp() {
        return new Promise((resolve, reject) => {
            client.requestApi("get", constants.api.user.use_app, {}, (s, e) => {
                if (s)
                    resolve(s);
                else
                    reject(e);
            });
        })
    }
}