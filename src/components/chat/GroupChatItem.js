/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtils from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import snackbar from '@utils/snackbar-utils';
import DateMessage from '@components/chat/DateMessage';
import ImageLoad from 'mainam-react-native-image-loader';
import { connect } from 'react-redux';
import firebaseUtils from '@utils/firebase-utils';
import dataCacheProvider from '@data-access/datacache-provider';
class GroupChatItem extends React.Component {
    constructor(props) {
        super(props);
        let userId = this.props.userApp.currentUser.id;
        if (this.props.userId)
            userId = this.props.userId;
        this.state = {
            name: "",
            unReadCount: 0,
            userId
        }
        console.log(userId);
    }
    openGroup(groupId) {
        if (this.props.onOpenGroup)
            this.props.onOpenGroup(this.state.userId, groupId, this.state.name);
    }
    componentDidMount() {
        this.showData(this.props);
    }
    showData(props) {
        let item = props.group;
        let groupId = item.id;
        dataCacheProvider.read(this.state.userId, "group_chat_" + item.id, (s) => {
            console.log(s);
            if (s && JSON.stringify(s) != "{}") {
                try {
                    this.setState(s);
                } catch (error) {

                }
            }
            firebaseUtils.getGroupName(this.state.userId, groupId).then(x => {
                let info = { name: x.name ? x.name : "Tin nhắn", avatar: x.avatar ? x.avatar : "" }
                this.setState(info);
                dataCacheProvider.save(this.state.userId, "group_chat_" + groupId, info)
            }).catch(x => {
                let info = { name: "Tin nhắn", avatar: "" }
                this.setState(info);
                dataCacheProvider.save(this.state.userId, "group_chat_" + groupId, info)
            });
        });
        dataCacheProvider.read(this.state.userId, "group_chat_message" + groupId, (s) => {
            if (s && JSON.stringify(s) != "{}") {
                try {
                    this.setState({ lastMessage: s });
                } catch (error) {

                }
            }
            let message = item.data().group.collection("messages");
            this.snapshot = message.orderBy('createdDate', 'desc').limit(1).onSnapshot((snap) => {
                snap.docChanges().forEach((item) => {
                    if (item.type == "added") {
                        let lastMessage = item.doc.data();
                        this.setState({
                            lastMessage
                        });
                        dataCacheProvider.save(this.state.userId, "group_chat_message" + groupId, {
                            type: lastMessage.type,
                            message: lastMessage.message,
                            userId: lastMessage.userId,
                            fromCache: true,
                            createdDate: lastMessage.createdDate.toDate().getTime()
                        })
                    }
                    firebaseUtils.getUnReadMessageCount(this.state.userId, props.group.id).then(x => {
                        this.setState({
                            unReadCount: x
                        });
                    }).catch(x =>
                        this.setState({
                            unReadCount: 0
                        }));
                });
            });
        });
    }
    highlighMessage(item) {
        try {
            return item.readed.indexOf(this.state.userId + "") == -1 ? "900" : "normal";
        } catch (error) {

        }
        return 'normal';
    }
    componentWillUnmount() {
        if (this.snapshot) {
            this.snapshot();
            this.snapshot = null;
        }
    }
    onError() {
        this.setState({ avatarError: true });
    }
    componentWillReceiveProps(props) {
        if (this.props.group.id != props.group.id) {
            if (this.snapshot) {
                this.snapshot();
            }
            this.showData(props);
        }
    }
    render() {
        let item = this.props.group;
        return (
            <TouchableOpacity onPress={this.openGroup.bind(this, item.id)} >
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    {/* {
                        this.state.avatarError ?
                            <Image source={require("@images/user.png")} style={{ width: 60, height: 60 }}></Image> :
                            <Image source={{ uri: this.state.avatar }} style={{ width: 60, height: 60, borderRadius: 30 }} resizeMode="cover" onError={this.onError.bind(this)}></Image>
                    } */}

                    <ImageLoad
                        borderRadius={30}
                        customImagePlaceholderDefaultStyle={{ width: 60, height: 60, borderRadius: 30 }}
                        resizeMode="cover"
                        placeholderSource={require("@images/user.png")}
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        imageStyle={{ borderRadius: 30 }}
                        source={{ uri: this.state.avatar }}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row'
                            }} >
                                <Text style={{ fontWeight: 'bold', fontSize: 15, flex: 1 }}>
                                    {item.name ? item.name : (this.state.name)}</Text>
                                {
                                    this.state.unReadCount > 0 &&
                                    <Text style={{ backgroundColor: '#d8d8d8', borderRadius: 8, overflow: 'hidden', paddingHorizontal: 5, paddingVertical: 2 }}>{this.state.unReadCount > 100 ? "99+" : this.state.unReadCount}</Text>
                                }
                            </View>
                            {
                                item.typing ?
                                    <ScaleImage source={require("@images/typing.gif")} width={20} /> :
                                    null
                            }
                        </View>
                        {
                            this.state.lastMessage &&
                            <View>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginTop: 5, fontWeight: this.highlighMessage(this.state.lastMessage) }}>
                                    {this.state.lastMessage.type == 4 ? "[Hình ảnh]" : this.state.lastMessage.message}
                                </Text>
                                {
                                    !this.state.lastMessage.fromCache &&
                                    <Text style={{ marginTop: 5, textAlign: 'right', fontStyle: 'italic', fontSize: 13, color: '#717171' }}>
                                        {this.state.lastMessage.createdDate.toDate().getPostTime()}
                                    </Text>
                                }
                                {
                                    this.state.lastMessage.fromCache &&
                                    <Text style={{ marginTop: 5, textAlign: 'right', fontStyle: 'italic', fontSize: 13, color: '#717171' }}>
                                        {this.state.lastMessage.createdDate.toDateObject().getPostTime()}
                                    </Text>
                                }
                            </View>
                        }
                    </View>
                </View>
                <View style={{ marginLeft: 80, height: 1, backgroundColor: '#cbcbca', flex: 1 }} />
            </TouchableOpacity>
        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(GroupChatItem);