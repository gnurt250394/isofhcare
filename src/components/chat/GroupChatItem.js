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
class GroupChatItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            unReadCount: 0
        }
    }
    openGroup(groupId) {
        if (this.props.onOpenGroup)
            this.props.onOpenGroup(groupId);
    }
    componentDidMount() {
        let item = this.props.group;
        firebaseUtils.getGroupName(this.props.userApp.currentUser.id, item).then(x => {
            this.setState({ name: x.name ? x.name : "Tin nhắn", avatar: x.avatar ? x.avatar.absoluteUrl() : "" });
        }).catch(x => {
            this.setState({ name: item.name ? item.name : "Tin nhắn", avatar: item.avatar ? item.avatar.absoluteUrl() : "" });
        });
        let message = item.data().group.collection("messages");
        this.snapshot = message.orderBy('createdDate', 'desc').limit(1).onSnapshot((snap) => {
            snap.docChanges().forEach((item) => {
                if (item.type == "added") {
                    this.setState({
                        lastMessage: item.doc.data()
                    });
                }
                firebaseUtils.getUnReadMessageCount(this.props.userApp.currentUser.id, this.props.group.id).then(x => {
                    this.setState({
                        unReadCount: x
                    });
                }).catch(x =>
                    this.setState({
                        unReadCount: 0
                    }));
            });
        });
    }
    highlighMessage(item) {
        try {
            return item.readed.indexOf(this.props.userApp.currentUser.id + "") == -1 ? "900" : "normal";
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
    render() {
        let item = this.props.group;
        return (
            <TouchableOpacity onPress={this.openGroup.bind(this, item.id)} >
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    {
                        this.state.avatarError ?
                            <Image source={require("@images/user.png")} style={{ width: 60, height: 60 }}></Image> :
                            <Image source={{ uri: this.state.avatar }} style={{ width: 60, height: 60, borderRadius: 30 }} resizeMode="cover" onError={this.onError.bind(this)}></Image>
                    }

                    {/* <ImageLoad
                        customImagePlaceholderDefaultStyle={{ width: 60, height: 60 }}
                        resizeMode="cover"
                        placeholderSource={require("@images/noimage.jpg")}
                        style={{ width: 60, height: 60 }}
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={{ uri: this.state.avatar }}
                    /> */}
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
                                <Text style={{ marginTop: 5, textAlign: 'right', fontStyle: 'italic', fontSize: 13, color: '#717171' }}>
                                    {this.state.lastMessage.createdDate.toDate().getPostTime()}
                                </Text>
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
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(GroupChatItem);