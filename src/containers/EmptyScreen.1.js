import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import firebaseUtils from '@utils/firebase-utils';

class LoginScreen extends Component {
    constructor(props) {
        super(props)
    }

    connect() {
        firebaseUtils.connect("2", "Mai Ngọc Nam", "hêhÏ", "").then(x => {

            let groupDb = firebaseUtils.getGroupDb();
            let group = groupDb.doc("12ef4915-71ae-f2ab-20a9-84923ba79ea3");
            group.collection("messages").onSnapshot((snap) => {
                snap.docChanges().forEach((item) => {
                    console.log(item.doc.data());
                });
            });
        }).catch(e => { alert(e) });
    }

    send() {
        firebaseUtils.sendMessage("12ef4915-71ae-f2ab-20a9-84923ba79ea3", "testưertwert" + Date.now(), {}).catch(e => {
            console.log(e);
        });
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Đăng nhập" showFullScreen={true} >
                <TouchableOpacity onPress={this.connect.bind(this)}>
                    <Text>Connect</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.send.bind(this)}>
                    <Text>Send</Text>
                </TouchableOpacity>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(LoginScreen);