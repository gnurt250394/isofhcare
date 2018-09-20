/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import sendbirdUtils from '@utils/send-bird-utils';
import SendBird from 'sendbird';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtils from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import snackbar from '@utils/snackbar-utils';
import DateMessage from '@components/chat/DateMessage';
import ImageLoad from 'mainam-react-native-image-loader';
import { connect } from 'react-redux';
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
        if (item.members.length == 2) {
            let user = (item.members[0].id == this.props.userApp.currentUser.id) ? item.members[1] : item.members[0]
            user.get().then(doc => {
                let data = doc.data();
                this.setState({ name: data.fullname });
            });
        }
    }
    render() {
        let item = this.props.group;
        return (
            <TouchableOpacity onPress={this.openGroup.bind(this, item.id)}>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <ScaleImage source={require("@images/doctor.png")} width={60} />
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
                        {/* <Text style={{ marginTop: 5 }}>
                                        {item.lastMessage.message}
                                    </Text>
                                    <Text style={{ marginTop: 5, textAlign: 'right', fontStyle: 'italic', fontSize: 13, color: '#717171' }}>
                                        {item.lastMessage.createdAt.getPostTime()}
                                    </Text> */}
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