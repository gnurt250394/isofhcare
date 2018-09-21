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
    },
    group_not_exist:
    {
        code: 5,
        message: "Groupd not exist"
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
    getUser(userId) {
        return this.getUserDb().doc(userId + "");
    },
    getGroupDb() {
        let db = this.getDb();
        return db.collection("isofhcare").doc("chat").collection("groups");
    },
    getGroup(groupId) {
        return this.getGroupDb().doc(groupId + "");
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
                userDb.doc(userId + "").collection("groups").get().then(docs => {
                    let groups = [];
                    docs.docs.forEach(item => {
                        if (item && item.exists && item.data().group)
                            groups.push(item.data().group.get())
                    })

                    Promise.all(groups).then(values => {
                        let groups = [];
                        values.forEach(item => {
                            if (item.exists) {
                                let data = item.data();
                                if (data)
                                    groups.push(data);
                            }
                        });
                        groups.sort((a, b) => {
                            try {
                                if (!a.updatedDate && !b.updatedDate)
                                    return 0;
                                if (!a.updatedDate)
                                    return 1;
                                if (!b.updatedDate)
                                    return -1;
                                if (a.updatedDate.toDate() < b.updatedDate.toDate())
                                    return 1;
                            } catch (error) {

                            }
                            return -1;
                        })
                        resolve(groups);
                    }).catch(e => {
                        resolve([]);
                    });
                    // resolve(groups);
                }).catch(x => resolve([]));
            } catch (error) {

            }
        });
    },

    createGroup2(id, users, name, avatar, data) {
        let $this = this;
        return new Promise((resolve, reject) => {
            let groupDb = $this.getGroupDb();
            let userDb = $this.getUserDb();
            let group = groupDb.doc(id);
            group.get().then(doc => {
                if (doc.exists) {
                    resolve({ groupId: doc.id });
                } else {
                    debugger;
                    users.forEach((item, index) => {
                        let memberId = item + "";
                        let user = userDb.doc(memberId);
                        user.collection("groups").doc(id).set({ group });
                        group.collection("members").doc(memberId).set({
                            user: user,
                            unread_message: []
                        })
                    });
                    let groupData = {
                        id,
                        name: name ? name : "",
                        avatar: avatar ? avatar : "",
                        data: data ? data : {}
                    };
                    group.set(groupData).then(x => {
                        resolve({ groupId: id })
                    }).catch(e => reject(errors.exception(e)));
                }
            }).catch(e => reject(errors.exception(e)));
        });
    },
    createGroup(users, name, avatar, data) {
        let $this = this;
        try {
            if (users && users.length > 1) {
                let id = stringUtils.guid();
                if (users.length == 2) {
                    if (users[0] > users[1]) {
                        id = users[0] + "_with_" + users[1];
                    } else {
                        id = users[1] + "_with_" + users[0];
                    }
                }
                return $this.createGroup2(id, users, name, avatar, data)
            } else {
                return new Promise((resolve, reject) => {
                    reject(errors.select_user_to_group)
                });
            }
        } catch (error) {
            return new Promise((resolve, reject) => {
                reject(errors.exception(error));
            });
        }
    },
    send(userId, groupId, message) {
        let $this = this;
        return new Promise((resolve, reject) => {
            let userDb = $this.getUserDb();
            message.user = userDb.doc(userId + "");
            message.createdDate = new Date();
            message.userId = userId + "";
            message.readed = [userId + ""];
            let groupDb = $this.getGroupDb();
            let group = groupDb.doc(groupId);
            group.get().then(doc => {
                if (doc.exists) {
                    let mesId = Date.now() + "_" + userId;
                    group.update({ updatedDate: new Date() })

                    group.collection("members").get().then(docs => {
                        let members = docs.docs;
                        members.forEach((item) => {
                            if (item.id != userId) {
                                item.ref.update("unread_message", firebase.firestore.FieldValue.arrayUnion(mesId));
                            }
                        });
                    });

                    group.collection("messages").doc(mesId).set(message).then(x => {
                        resolve();
                    }).catch(x => { reject(x); });
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
    },
    getGroupName(userId, groupData) {
        return new Promise((resolve, reject) => {
            let groupDb = this.getGroupDb();
            groupDb.doc(groupData.id).collection("members").get().then(docs => {
                let members = docs.docs;
                if (members.length == 2) {
                    let user = (members[0].id == userId) ? members[1] : members[0]
                    user.data().user.get().then(doc => {
                        let data = doc.data();
                        resolve({
                            name: data.fullname,
                            avatar: data.avatar
                        })
                    }).catch(x => {
                        resolve({
                            name: groupData.name ? groupData.name : "Tin nhắn",
                            avatar: groupData.avatar
                        })
                    });
                } else {
                    resolve({
                        name: groupData.name,
                        avatar: groupData.avatar
                    });
                }
            }).catch(x => {
                resolve({
                    name: groupData.name ? groupData.name : "Tin nhắn",
                    avatar: groupData.avatar
                })
            });
        });
    },
    markAsRead(userId, groupId) {
        return new Promise((resolve, reject) => {
            let groupDb = this.getGroupDb();
            groupDb.doc(groupId).get().then(doc => {
                if (doc.exists) {
                    groupDb.doc(groupId).collection("members").doc(userId + "").update({
                        unread_message: []
                    }).then(x => resolve()).catch(x => reject());
                }
                else {
                    reject(errors.group_not_exist);
                }
            });
        });
    },
    getUnReadMessageCount(userId, groupId) {
        return new Promise((resolve, reject) => {
            let groupDb = this.getGroupDb();
            groupDb.doc(groupId).collection("members").doc(userId + "").get().then(doc => {
                if (doc.exists) {
                    let data = doc.data();
                    if (data.unread_message && data.unread_message.length) {
                        resolve(data.unread_message.length);
                        return;
                    }
                }
                resolve(0);
            }).catch(x => resolve(0));
        });
    },
    getTotalUnReadMessageCount(userId) {
        return new Promise((resolve, reject) => {
            let userDb = this.getUserDb();
            userDb.doc(userId + "").get().then(doc => {
                if (doc.exists) {
                } else {
                    resolve(0);
                }
            }).catch(x => resolve(0));
        })
    },
    setTyping(userId, groupId) {
        return new Promise((resolve, reject) => {
            let groupDb = this.getGroup();
            let group = groupDb.doc(groupId);
            group.update({
                typing: {
                    userId,
                    time: new Date()
                }
            })
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