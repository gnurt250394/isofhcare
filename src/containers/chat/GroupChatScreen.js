/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Text, StatusBar, TouchableOpacity, Image, Platform, Keyboard, AppState, FlatList } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import dateUtisl from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import firebaseUtils from '@utils/firebase-utils';
import GroupChatItem from '@components/chat/GroupChatItem'
class GroupChatScreen extends React.Component {
    constructor(props) {
        super(props);
        let facility = this.props.navigation.getParam("facility");
        let title = "Tin nhắn";
        let userId = this.props.userApp.currentUser.id;
        if (facility) {
            title = facility.facility.name;
            userId = facility.facility.id;
        }
        this.state =
            {
                loadingGroup: true,
                listGroup: [],
                title, userId
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


    data = [];
    dataIds = [];
    removeGroup(id) {
        let index = this.dataIds.indexOf(id);
        if (index != -1) {
            this.data.splice(index, 1);
            this.dataIds.splice(index, 1);
        }
    }
    addGroup(group, index) {
        this.removeGroup(group.doc.id);
        this.data.splice(index, 0, group.doc);
        this.dataIds.splice(index, 0, group.doc.id);
    }
    getMyGroup() {
        this.setState({ loadingGroup: true }, () => {
            firebaseUtils.getMyGroup(this.state.userId).then(x => {
                this.setState({
                    listGroup: x,
                    loadingGroup: false
                })
            }).catch(x => {
                this.setState({
                    listGroup: [],
                    loadingGroup: false
                })
            });
        });
    }
    componentDidMount() {
        console.disableYellowBox = true;
        this.setState({ loadingGroup: true }, () => {
            this.getMyGroup();
            this.snap = this.snap = firebaseUtils.onMyGroupChange(this.state.userId, (snap) => {
                snap.docChanges().forEach(item => {
                    if (item.type == 'added') {
                        this.getMyGroup();
                    }
                });
            });
        })
    }
    componentWillUnmount() {
        if (this.snap)
            this.snap();
    }
    onOpenGroup(groupId, title) {
        this.props.navigation.navigate("chat", {
            groupId: groupId,
            title
        })
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title={this.state.title} showFullScreen={true}>

                <FlatList
                    onRefresh={this.getMyGroup.bind(this)}
                    refreshing={this.state.loadingGroup}
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