/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { TextInput, View, ScrollView, KeyboardAvoidingView, Text, StatusBar, TouchableOpacity, Image, Platform, Keyboard, AppState, FlatList } from 'react-native';
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
        this.state = {
            typing: [],
            disabled: true,
            channel: null,
            messageQuery: null,
            messages: [],
            text: '',
            disabled: true,
            show: false,
            hasRendered: false,
            listMessageIds: [],
            data: []
        };
    }
    // onMessageReceived(channel, message) {
    //     if (this.state.channel && message.channelUrl == this.state.channel.url) {
    //         if (this.state.messages) {
    //             if (this.state.listMessageIds.indexOf(message.messageId) == -1) {
    //                 this.state.listMessageIds.push(message.messageId);
    //                 this.state.messages.push(message);
    //             }
    //             this.setState({ messages: this.state.messages });
    //             setTimeout(() => {
    //                 this.flatList.scrollToEnd({ animated: true });
    //             }, 1000);
    //         }
    //     }
    // }
    // onTypingStatusUpdated(channel) {
    //     this.setState({ typing: channel.getTypingMembers() });
    // }
    // getGroupChannelCallback(channel, error) {
    //     if (error) {
    //         Actions.pop();
    //         snackbar.show("Xảy ra lỗi vui lòng thử lại sau");
    //     }
    //     if (channel) {
    //         this.setState({
    //             channel: channel
    //         }, () => { this.loadPreviousMessage(true, 20, this.loadPreviousMessageCallback.bind(this)) });
    //     }
    // }
    // loadPreviousMessageCallback(response, error) {
    //     if (error) {
    //         console.log('Get Message List Fail.', error);
    //         return;
    //     }

    //     var _messages = [];
    //     for (var i = 0; i < response.length; i++) {
    //         var _curr = response[i];
    //         if (this.state.listMessageIds.indexOf(_curr.messageId) == -1) {
    //             _messages.splice(0, 0, _curr);
    //             this.state.listMessageIds.push(_curr.messageId);
    //         }
    //     }

    //     console.log(_messages);
    //     this.setState({
    //         messages: this.state.messages.concat(_messages.reverse())
    //     });
    //     setTimeout(() => {
    //         if (this.flatList)
    //             this.flatList.scrollToEnd({ animated: true });
    //     }, 1000);
    // }
    // loadPreviousMessage(refresh, limit, handler) {
    //     if (refresh) {
    //         this.state.messageQuery = this.state.channel.createPreviousMessageListQuery();
    //         this.messages = [];
    //         this.listMessageIds = [];
    //     }
    //     if (!this.state.messageQuery.hasMore) {
    //         return;
    //     }
    //     this.state.messageQuery.load(limit, false, handler);
    // }
    next() {
        let { messages, lastMessage } = this.state;
        messages.limit(25).get().then(docs => {
            let data = [];
            if (docs.docs) {
                docs.docs.forEach((item) => {
                    data.push(item.ref.get());
                });
            }
            Promise.all(data).then(values => {
                let data = [];
                values.forEach((item => {
                    if (item.exists) {
                        data.push(item.data())
                    }
                }))
                this.setState({ data: [...data] });
            });
        });
    }
    componentDidMount() {
        let groupId = this.props.navigation.getParam("groupId", null);
        if (!groupId) {
            this.props.navigation.pop();
            return;
        }
        let groupDb = firebaseUtils.getGroupDb();
        let group = groupDb.doc(groupId);
        let messages = group.collection("messages");
        this.snapshot = messages.onSnapshot((snap) => {
            snap.docChanges().forEach((item) => {
                debugger;
                let data = this.state.data;
                data.push(item.doc.data());
                this.setState({
                    data: [...data]
                });
                setTimeout(() => {
                    if (this.flatList)
                        this.flatList.scrollToEnd({ animated: true });
                }, 1000);
            });
        });
        this.setState({ groupId, group, messages }, () => {
            messages.limit(25).get().then(docs => {
                if (docs.docs.length > 0) {
                    let lastMessage = docs.docs[docs.docs.length - 1];
                    this.setState({ lastMessage }, () => {
                        this.next();
                    });
                }
            });
        });


        // let sb = sendbirdUtils.getSendBird();
        // sendbirdUtils.setHandler(sb, "HANDLE_CHAT", this.onTypingStatusUpdated.bind(this), this.onMessageReceived.bind(this));
        // sb.GroupChannel.getChannel(this.props.groupUrl, this.getGroupChannelCallback.bind(this));


    }
    componentWillUnmount() {
        if (this.snapshot)
            this.snapshot();
        // if (sendbirdUtils.sendbird)
        //     sendbirdUtils.removeHandler(sendbirdUtils.sendbird, "HANDLE_CHAT");
        // AppState.removeEventListener('change', this._handleAppStateChange);
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
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Tin nhắn" showFullScreen={true} containerStyle={{ backgroundColor: "#afcccc" }} isLoading={this.state.isLoading}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={{ flex: 1 }}
                        ref={ref => this.flatList = ref}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.data}
                        renderItem={({ item, index }) =>
                            <View>
                                <MyMessage isLast={index == this.state.data.length - 1} message={item} preMessage={index == 0 ? null : this.state.data[index - 1]} />
                                {/* {item.sender.userId == "namy" ?
                                    <MyMessage isLast={index == this.state.data.length - 1} message={item} preMessage={index == 0 ? null : this.state.data[index - 1]} />
                                    :
                                    <TheirMessage isLast={index == this.state.data.length - 1} message={item} preMessage={index == 0 ? null : this.state.data[index - 1]} />
                                } */}
                            </View>
                        }
                    />
                    <ChatView behavior='padding' keyboardVerticalOffset={67}>
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