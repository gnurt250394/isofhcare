/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { TextInput, View, ScrollView, KeyboardAvoidingView, Text, StatusBar, ActivityIndicator, TouchableOpacity, Image, Platform, Keyboard, AppState, FlatList } from 'react-native';
import sendbirdUtils from '@utils/send-bird-utils';
import SendBird from 'sendbird';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtisl from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import snackbar from '@utils/snackbar-utils';
import MyMessage from '@components/chat/MyMessage';
import TheirMessage from '@components/chat/TheirMessage';
import ImagePicker from 'mainam-react-native-select-image';
import firebaseUtils from '@utils/firebase-utils';
import { connect } from 'react-redux';
import imageProvider from '@data-access/image-provider';
import constants from '@resources/strings';

const ChatView = Platform.select({
    ios: () => KeyboardAvoidingView,
    android: () => View,
})();

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        let title = this.props.navigation.getParam("title");
        if (!title)
            title = "Tin nhắn";
        let userId = this.props.navigation.getParam("userId");
        if (!userId)
            userId = this.props.userApp.currentUser.id;

        this.state = {
            title,
            userId,
            lastMessage: null,
            firstTime: true,
            chatProfile: [],

            typing: [],
            text: '',
            data: [],
            dataId: []
        };
    }
    data = [];
    dataIds = [];
    loadPreMessages() {
        this.setState({ loadingPre: true }, () => {
            firebaseUtils.getMessages(this.state.groupId, 40, this.state.lastMessage).then(s => {
                let lastMessage = this.state.lastMessage;
                s.forEach(item => {
                    if (this.dataIds.indexOf(item.id) == -1) {
                        this.data.splice(0, 0, item.data());
                        this.dataIds.splice(0, 0, item.id);
                    }
                });
                if (s.length > 0) {
                    lastMessage = s[s.length - 1];
                }
                this.setState({
                    lastMessage,
                    loadingPre: false,
                    data: [...this.data],
                    loadFinish: s.length == 0
                });
                if (this.state.firstTime) {
                    setTimeout(() => {
                        if (this.flatList)
                            this.flatList.scrollToEnd({ animated: true });
                    }, 1000);
                    this.setState({
                        firstTime: false
                    });
                }
            }).catch(x => {
                this.setState({ loadingPre: false });
            });
        })
    }
    onMessageChange(messages, groupId) {
        this.snapshot = messages.onSnapshot((snap) => {
            snap.docChanges().forEach((item) => {
                if (item.type == 'added') {
                    if (this.dataIds.indexOf(item.doc.id) == -1) {
                        this.data.push(item.doc.data());
                        this.dataIds.push(item.doc.id);
                        this.setState({
                            data: [...this.data],
                        });
                        firebaseUtils.markAsRead(this.state.userId, groupId);
                        firebaseUtils.markAsReadMessage(this.state.userId, groupId, item.doc.id);
                        setTimeout(() => {
                            if (this.flatList)
                                this.flatList.scrollToEnd({ animated: true });
                        }, 1000);
                    }
                }
            });
        }, (e) => {
            console.log(e);
        });
        this.loadPreMessages();
    }
    componentDidMount() {
        let groupId = this.props.navigation.getParam("groupId", null);
        if (!groupId) {
            this.props.navigation.pop();
            return;
        }
        let group = firebaseUtils.getGroup(groupId);
        firebaseUtils.getGroupName(this.state.userId).then(x => {
            this.setState({ title: x.name, avatar: x.avatar ? x.avatar.absoluteUrl() : "" });
        }).catch(x => {
            this.setState({ title: "Tin nhắn", avatar: "" });
        });
        let messages = group.collection("messages").orderBy('createdDate', 'desc');

        this.setState({ groupId, group, messages }, () => {
            messages.limit(1).get().then(docs => {
                if (docs.docs.length > 0) {
                    let lastMessage = docs.docs[docs.docs.length - 1];
                    firebaseUtils.markAsRead(this.state.userId, groupId);
                    firebaseUtils.markAsReadMessage(this.state.userId, groupId, lastMessage.id);
                    this.dataIds.push(lastMessage.id);
                    this.data.push(lastMessage.data());
                    this.setState({
                        data: [...this.data],
                        lastMessage
                    }, this.onMessageChange.bind(this, messages, groupId))
                } else {
                    this.onMessageChange(messages, groupId);
                }
            });
        });
    }
    componentWillUnmount() {
        if (this.snapshot)
            this.snapshot();
    }
    selectImage() {
        if (this.imagePicker) {
            this.imagePicker.open(false, 200, 200, this.selectImageCallback.bind(this));
        }
    }

    selectImageCallback(image) {
        this.setState({ isLoading: true }, () => {
            imageProvider.upload(image.path, (s, e) => {
                this.setState({ isLoading: false });
                if (s.success) {
                    if (s.data.code == 0 && s.data.data && s.data.data.images && s.data.data.images.length > 0) {
                        firebaseUtils.sendImage(this.props.userApp.currentUser.id, this.state.groupId, s.data.data.images[0].image).catch(e => {
                            snackbar.show(constants.msg.upload.upload_image_error, 'danger');
                        });
                    }
                    return;
                }
                snackbar.show(constants.msg.upload.upload_image_error, 'danger');
            });
        });
    }

    send(e) {
        e.preventDefault();
        if (!this.state.newMessage || !this.state.newMessage.trim()) {
            Keyboard.dismiss();
            setTimeout(() => {
                snackbar.show("Nhập nội dung cần gửi");
            }, 1000);
            return;
        }
        firebaseUtils.sendMessage(this.props.userApp.currentUser.id, this.state.groupId, this.state.newMessage);
        this.setState({
            newMessage: ""
        })
        this.txtMessage.clear();
        // Keyboard.dismiss();
    }
    getChatProfile(id) {
        if (this.state.chatProfile && this.state.chatProfile[id]) {
            return this.state.chatProfile[id];
        }
        firebaseUtils.getUser(id).get().then(doc => {
            if (doc.exists) {
                let data = this.state.chatProfile;
                if (doc.data()) {
                    data[id] = doc.data();
                    this.setState({
                        chatProfile: [...data]
                    });
                }
            }
        });

    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title={this.state.title} showFullScreen={true} containerStyle={{ backgroundColor: "#afcccc" }} isLoading={this.state.isLoading}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={{ flex: 1 }}
                        ref={ref => this.flatList = ref}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.data}
                        ListHeaderComponent={<View style={{ alignItems: 'center' }}>
                            {
                                (this.state.lastMessage && !this.state.loadFinish && !this.state.loadingPre) ?
                                    <TouchableOpacity onPress={this.loadPreMessages.bind(this)} style={{ borderRadius: 15, margin: 10, backgroundColor: '#00000050' }}><Text style={{ color: '#FFF', padding: 10 }}>Xem tin nhắn cũ hơn</Text></TouchableOpacity> :
                                    this.state.loadingPre ? <ActivityIndicator style={{ margin: 5 }}></ActivityIndicator> : null
                            }
                        </View>}
                        renderItem={({ item, index }) =>
                            <View>
                                {
                                    item.userId == this.props.userApp.currentUser.id ?
                                        <MyMessage isLast={index == this.state.data.length - 1} message={item} preMessage={index == 0 ? null : this.state.data[index - 1]} />
                                        :
                                        <TheirMessage chatProfile={this.getChatProfile(item.userId)} isLast={index == this.state.data.length - 1} message={item} preMessage={index == 0 ? null : this.state.data[index - 1]} />
                                }
                            </View>
                        }
                    />
                    <ChatView behavior='padding' keyboardVerticalOffset={80}>
                        {this.state.typing && this.state.typing.length != 0 ?
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontStyle: 'italic', padding: 10 }}><Text style={{ fontWeight: 'bold' }}>{this.state.typing[0].nickname}</Text>{this.state.typing.length > 1 ? " và " + (this.state.typing.length - 1) + " người khác" : ""} đang gõ ...</Text>
                            </View>
                            : null
                        }
                        <View style={{ flexDirection: 'row', backgroundColor: 'white', elevation: 5 }} shadowColor='#000000' shadowRadius={1} shadowOpacity={0.1}>
                            <TouchableOpacity style={{ width: 40, height: 40, marginTop: 5, borderRadius: 20, justifyContent: 'center', alignContent: 'center', marginLeft: 10 }} onPress={this.selectImage.bind(this)}>
                                <ScaleImage source={require("@images/image.png")} width={25} />
                            </TouchableOpacity>
                            <View style={[{ flex: 1, backgroundColor: '#00000010', maxHeight: 100, margin: 5, borderRadius: 7, marginLeft: 0, marginRight: 5, justifyContent: 'center' }, Platform.OS == "ios" ? { padding: 10, paddingTop: 7 } : {}]}>
                                <TextInput ref={ref => this.txtMessage = ref} style={{ color: '#000', padding: 0, paddingLeft: 5, paddingRight: 5 }} placeholderTextColor='#cacaca' underlineColorAndroid="transparent" placeholder={"Nhập nội dung cần gửi"} onChangeText={(s) => { this.setState({ newMessage: s }) }}
                                    multiline={true}
                                    autoCorrect={false}
                                    value={this.state.newMessage}
                                    onFocus={() => setTimeout(() => {
                                        if (this.flatList)
                                            this.flatList.scrollToEnd({ animated: true })
                                    }, 1000)
                                    }
                                />
                            </View>
                            <TouchableOpacity style={{ backgroundColor: 'blue', height: 40, margin: 5, borderRadius: 7, justifyContent: 'center', alignItems: 'center' }} onPress={this.send.bind(this)}>
                                <Text style={{ fontWeight: 'bold', color: 'white', minWidth: 50, textAlign: 'center' }}>Gửi</Text>
                            </TouchableOpacity>

                        </View>
                    </ChatView>
                </View>
                <ImagePicker ref={ref => this.imagePicker = ref} />

            </ActivityPanel >

        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ChatScreen);