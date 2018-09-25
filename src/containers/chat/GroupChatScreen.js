/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Text, StatusBar, TouchableOpacity, Image, Platform, Keyboard, AppState, FlatList } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtisl from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import firebaseUtils from '@utils/firebase-utils';
import GroupChatItem from '@components/chat/GroupChatItem'
class GroupChatScreen extends React.Component {
    constructor(props) {
        super(props);
        selfSendBird = this;
        this.state =
            {
                listGroup: [],
            }
    }
    // _handleAppStateChange = currentAppState => {
    //     if (currentAppState === 'active') {
    //         console.log('appstate - foreground');
    //         if (sb) {
    //             sb.setForegroundState();
    //         }
    //     } else if (currentAppState === 'background') {
    //         console.log('appstate - background');
    //         if (sb) {
    //             sb.setBackgroundState();
    //         }
    //     }
    // };

    // onMessageReceived(channel, message) {
    //     for (var i = 0; i < this.state.listGroup.length; i++) {
    //         var item = this.state.listGroup[i];
    //         if (item.url === channel.url) {
    //             this.state.listGroup.splice(i, 1);
    //             break;
    //         }
    //     }
    //     this.state.listGroup.splice(0, 0, channel);
    //     this.setState({ listGroup: this.state.listGroup });
    // }
    // onTypingStatusUpdated(channel) {
    //     this.setState({ listGroup: this.state.listGroup });
    // }
    // groupChannelQueryNext(channels, error) {
    //     this.setState({ listGroup: channels });
    // }
    // sendBirtConnectCallback(sb, user, error) {
    //     sendbirdUtils.setHandler(sb, "HANDLE_GROUP", this.onTypingStatusUpdated.bind(this), this.onMessageReceived.bind(this));
    //     let groupChannelListQuery = sendbirdUtils.getGroupChannelList(sb, 100, this.groupChannelQueryNext.bind(this));
    // }

    getMyGroup() {
        firebaseUtils.getMyGroup(this.props.userApp.currentUser.id).then(x => {
            debugger;
            console.log(x);
            this.setState({ listGroup: [...x] });
        }).catch(x => {
            this.setState({ listGroup: [] })
        });
    }
    componentDidMount() {
        console.disableYellowBox = true;
        this.getMyGroup();
        // this.snap = firebaseUtils.getUserDb().doc(this.props.userApp.currentUser.id + "").collection("groups").onSnapshot((snap) => {
        //     snap.docChanges().forEach(item => {

        //     })
        //     this.setState({ listGroup: [] }, () => {
        //         setTimeout(() => {
        //             this.getMyGroup();
        //         }, 2000);
        //     });
        // });
    }
    componentWillUnmount() {
        if (this.snap)
            this.snap();
        //     if (sendbirdUtils.sendbird)
        //         sendbirdUtils.removeHandler(sendbirdUtils.sendbird, "HANDLE_GROUP");
        //     // AppState.removeEventListener('change', this._handleAppStateChange);
    }
    onOpenGroup(groupId) {
        this.props.navigation.navigate("chat", {
            groupId: groupId
        })
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Tin nhắn" showFullScreen={true}>

                <FlatList
                    style={{ flex: 1, paddingTop: 20 }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.listGroup}
                    renderItem={({ item, index }) =>
                        <GroupChatItem group={item} onOpenGroup={this.onOpenGroup.bind(this)} />
                    }
                />
            </ActivityPanel >

        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(GroupChatScreen);