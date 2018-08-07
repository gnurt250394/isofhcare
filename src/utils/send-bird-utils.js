import SendBird from 'sendbird';

module.exports = {
    sendbird: null,
    initSendBird() {
        this.sendbird = new SendBird({ appId: '6A9F12AF-6937-4D5D-AEED-ACDBBE2341B2' });
    },
    getSendBird() {
        if (this.sendbird)
            return this.sendbird;
        this.initSendBird();
        return this.sendbird;
    },
    setHandler(sendBird, handleId, onTyping, onMessage, onMessageDeleted, onMessageUpdated, onReadReceiptUpdated) {
        let handler = new sendBird.ChannelHandler();
        if (onTyping)
            handler.onTypingStatusUpdated = onTyping;
        if (onMessage)
            handler.onMessageReceived = onMessage;
        if (onMessageDeleted)
            handler.onMessageDeleted = onMessageDeleted;
        if (onMessageUpdated)
            handler.onMessageUpdated = onMessageUpdated;
        if (onReadReceiptUpdated)
            handler.onReadReceiptUpdated = onReadReceiptUpdated;
        sendBird.addChannelHandler(handleId, handler);
        return handler;
    },
    removeHandler(sendbird, handleId) {
        sendbird.removeChannelHandler(handleId);
    },
    startSendBird(sb, userId, callback) {
        sb.connect(userId, function (user, error) {
            if (callback)
                callback(sb, user, error);
        });
    },
    stopSendBird(sb, callback) {
        sb.disconnect(function (user, error) {
            if (callback)
                callback(sb, user, error);
        });
    },
    updateUserInfo(sb, users, nickName, imageUrl) {
        sbIsInit = true;
        user = users;
        sb.updateCurrentUserInfo(nickName, imageUrl, function (response, error) {
            //            console.log("Sb update info response: " + response, "Sb update info error: " + error);
        });
    },
    getGroupChannelList(sb, size, callback) {
        let groupChannelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
        groupChannelListQuery.limit = size;
        groupChannelListQuery.includeEmpty = true;
        groupChannelListQuery.next(callback);
        return groupChannelListQuery;
    },
    getTotalUnread(sb, callback) {
        sb.GroupChannel.getTotalUnreadMessageCount(callback);
    },
}
