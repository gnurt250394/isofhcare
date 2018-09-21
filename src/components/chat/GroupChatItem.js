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
            name: ""
        }
    }
    openGroup(groupId) {
        this.props.navigation.navigate("chat", { groupId: groupId })
        // firebaseUtils.sendMessage(this.props.userApp.currentUser.id, groupId, "test", "");
    }
    componentDidMount() {
        let item = this.props.group;
        firebaseUtils.getGroupName(this.props.userApp.currentUser.id, item).then(x => {
            this.setState({ name: x.name ? x.name : "Tin nhắn", avatar: x.avatar ? x.avatar.absoluteUrl() : "" });
        }).catch(x => {
            this.setState({ name: item.name ? item.name : "Tin nhắn", avatar: item.avatar ? item.avatar.absoluteUrl() : "" });
        });

        let groupDb = firebaseUtils.getGroupDb();
        let group = groupDb.doc(item.id);
        let message = group.collection("messages");
        let snapshot = message.onSnapshot((snap) => {
            snap.docChanges().forEach((item) => {
                if (item.type == "added") {
                    console.log(item);
                    this.setState({
                        lastMessage: item.doc.data()
                    });
                }
            });
        });
        // message.orderBy('createdDate', 'desc').limit(1).get().then((snap) => {
        //     if (snap.docs && snap.docs.length > 0) {
        //         let data = snap.docs[0].data();
        //         this.setState({
        //             lastMessage: data
        //         });
        //         console.log(data);
        //     }
        //     // snap.docChanges().forEach((item) => {
        //     //     this.setState({
        //     //         lastMessage: item
        //     //     });
        //     // });
        // });
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
                            <Text style={{ fontWeight: 'bold', fontSize: 15, flex: 1 }}>
                                {item.name ? item.name : (this.state.name)}</Text>
                            {
                                item.typing ?
                                    <ScaleImage source={require("@images/typing.gif")} width={20} /> :
                                    null
                            }
                        </View>
                        {
                            this.state.lastMessage &&
                            <View>
                                <Text style={{ marginTop: 5 }}>
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