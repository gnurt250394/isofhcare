const firebase = require("firebase");
require("firebase/firestore");
import stringUtils from 'mainam-react-native-string-utils';
const errors = {
    exception(error) {
        return {
            code: 0,
            message: "exception",
            error
        }
    },
    user_not_found: {
        code: 1,
        message: "user not found"
    },
    user_not_connect: {
        code: 2,
        message: "Please connect to chat server before"
    },
    create_account_error: {
        code: 3,
        message: "Create account error"
    },
    select_user_to_group: {
        code: 4,
        message: "Select user to group"
    }
}
const message_type =
{
    message: 1,
    fileUrl: 2,
    videoUrl: 3,
    imageUrl: 4,
    link: 5
}
module.exports = {
    db: null,
    inited: false,
    init() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: 'AIzaSyAHxUA4Hak6WaDJoenoKHw2FANJgF-YKf0',
                authDomain: 'isofhcare.firebaseapp.com',
                projectId: 'isofhcare'
            });
        }
    },
    getDb() {
        if (!this.db) {
            this.init();
            this.db = firebase.firestore();
            this.db.settings({
                timestampsInSnapshots: true
            });
        }
        return this.db;
    },
    getUserDb() {
        let db = this.getDb();
        return db.collection("isofhcare").doc("chat").collection("users");
    },
    getGroupDb() {
        let db = this.getDb();
        return db.collection("isofhcare").doc("chat").collection("groups");
    },
    getUserById(userId) {
        var userDb = this.getUserDb();
        return new Promise((resolve, reject) => {
            try {
                userDb.doc(userId + "").get().then(doc => {
                    if (doc.exists) {
                        resolve(doc.data())
                    }
                    else {
                        reject(errors.user_not_found)
                    }
                });
            } catch (error) {
                reject(errors.exception(error));
            }
        });
    },
    createUser(userId, fullname, avatar, data) {
        var userDb = this.getUserDb();
        return new Promise((resolve, reject) => {
            let user = {
                userId: userId + "",
                fullname: fullname ? fullname : "",
                avatar: avatar ? avatar : "",
                data: data ? data : {}
            }
            try {
                userDb.doc(userId + "").set(user).then(() => {
                    resolve(user)
                }).catch(() => {
                    reject(errors.create_account_error)
                });

            } catch (error) {
                reject(errors.exception(error));
            }
        });
    },
    connect(userId, fullname, avatar, data) {
        let $this = this;
        return new Promise((resolve, reject) => {
            $this.getUserById(userId).then(x => {
                resolve(x);
            }).catch(y => {
                console.log("user not found, creating new user");
                $this.createUser(userId, fullname, avatar, data).then(x => {
                    resolve(x);
                }).catch(y => reject(y));
            });
        });
    },
    updateUser(userId, fullname, avatar, data) {
        let $this = this;
        return new Promise((resolve, reject) => {
            try {
                let userDb = $this.getUserDb();
                userDb.doc(userId + "").update({
                    fullname: fullname ? fullname : "",
                    avatar: avatar ? avatar : "",
                    data: data ? data : {}
                }).then(x => resolve(x)).catch(x => reject(x));
            } catch (error) {
                reject(errors.exception(error));
            }
        });
    },
    getGroup(userId) {
        let $this = this;
        return new Promise((resolve, reject) => {
            try {
                let userDb = this.getUserDb();
                userDb.doc(userId + "").get().then(doc => {
                    if (doc.exists) {
                        let data = doc.data();
                        if (data.groups && data.groups.length > 0) {
                            let promises = [];
                            data.groups.forEach((item) => {
                                promises.push(item.get());
                            });
                            Promise.all(promises).then(values => {
                                let groups = [];
                                values.forEach(item => {
                                    if (item.exists) {
                                        let data = item.data();
                                        if (data)
                                            groups.push(data);
                                    }
                                });
                                resolve(groups);
                            }).catch(e => {
                                resolve([]);
                            });
                        }
                        else
                            resolve([]);
                    }
                    else {
                        reject(errors.user_not_found);
                    }
                });
            } catch (error) {

            }
        });
    },
    createGroup(users, name, avatar) {
        let $this = this;
        return new Promise((resolve, reject) => {
            let groupDb = $this.getGroupDb();
            let userDb = $this.getUserDb();
            if (users && users.length > 1) {
                let id = stringUtils.guid();
                let group = groupDb.doc(id);
                let members = [];

                users.forEach((item, index) => {
                    let _user = userDb.doc(item + "");
                    _user.update({ groups: firebase.firestore.FieldValue.arrayUnion(group) });
                    members.push(_user);
                });
                group.set({
                    id,
                    name,
                    avatar,
                    members
                }).then(x => { resolve(x) });
            } else {
                reject(errors.select_user_to_group)
            }
        });
    },
    send(userId, groupId, message) {
        let $this = this;
        return new Promise((resolve, reject) => {
            debugger;
            let userDb = $this.getUserDb();
            message.user = userDb.doc(userId + "");
            message.createdDate = new Date();
            message.userId = userId + "";
            let groupDb = $this.getGroupDb();
            let group = groupDb.doc(groupId);
            group.get().then(doc => {
                if (doc.exists) {
                    group.collection("messages").doc(Date.now() + "").set(message).then(x => {
                        resolve();
                    }).catch(x => { reject(x); });
                    // group.update({ messages: firebase.firestore.FieldValue.arrayUnion(message) }).then(x => {
                    //     resolve();
                    // }).catch(x => reject(x));
                }
            });
        });
    },
    sendFileUrl(userId, groupId, fileUrl, data) {
        return this.send(userId, groupId, {
            type: message_type.fileUrl,
            type_name: 'file url',
            message: fileUrl,
            data: data ? data : {}
        });
    },
    sendVideo(userId, groupId, videoUrl, data) {
        return this.send(userId, groupId, {
            type: message_type.videoUrl,
            type_name: 'video url',
            message: videoUrl,
            data: data ? data : {}
        });
    },
    sendMessage(userId, groupId, message, data) {
        return this.send(userId, groupId, {
            type: message_type.message,
            type_name: 'message',
            message,
            data: data ? data : {}
        });
    },
    sendImage(userId, groupId, imageUrl, data) {
        return this.send(userId, groupId, {
            type: message_type.imageUrl,
            type_name: 'image url',
            message: imageUrl,
            data: data ? data : {}
        });
    },
    sendLink(userId, groupId, link, data) {
        return this.send(userId, groupId, {
            type: message_type.link,
            type_name: 'link',
            message: link,
            data: data ? data : {}
        });
    }
    // ,
    // getMessage(groupId) {
    //     let $this = this;
    //     return new Promise((resolve, reject) => {
    //         if (!$this.rejectUserNotConnect(reject)) {
    //             let groupDb = $this.getGroupDb();
    //             let group = groupDb.doc(groupId);
    //             group.onSnapshot((doc) => {
    //                 resolve(doc.data());
    //             });
    //         }
    //     });
    // }
}