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
import constants from '@resources/strings';

class MyMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAuthor: (!this.props.preMessage) ? true : this.props.message.userId != this.props.preMessage.userId ? true : false,
            showDate: (!this.props.preMessage) ? true : (this.props.message.createdDate && this.props.preMessage.createdDate && this.props.message.createdDate.toDate().format("dd/MM/yyyy") != this.props.preMessage.createdDate.toDate().format("dd/MM/yyyy")) ? true : false
        }
    }
    photoViewer(uri) {
        try {
            if (!uri) {
                snackbar.show(constants.msg.message.none_image);
                return;
            }
            this.props.navigation.navigate("photoViewer", { urls: [uri], index: 0 });

        } catch (error) {
        }
    }
    render() {
        let message = this.props.message;
        if (!message)
            message = {
                message: "",
                createdDate: new Date()
            }
        return (
            <View style={{ minHeight: 50, marginTop: 5, marginBottom: this.props.isLast ? 30 : 0, marginTop: !this.state.showDate && this.state.showAuthor ? 20 : 0 }}>
                {
                    this.state.showDate ? <DateMessage message={this.props.message} /> : null
                }
                <View style={{ marginLeft: 5, marginRight: 5, minHeight: 50, marginTop: 5, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <View style={{ marginLeft: 5, backgroundColor: '#0090ff', padding: 5, borderRadius: 10, minWidth: 120 }}>
                        {
                            this.props.message.type == 4 ?
                                <TouchableOpacity onPress={this.photoViewer.bind(this, message.message ? message.message : "")}>
                                    <ImageLoad
                                        resizeMode="cover"
                                        placeholderSource={require("@images/noimage.jpg")}
                                        style={{ width: 150, height: 150 }}
                                        loadingStyle={{ size: 'small', color: 'gray' }}
                                        source={{ uri: message.message ? message.message : "" }}
                                        defaultImage={() => {
                                            return <ScaleImage resizeMode='cover' source={require("@images/noimage.jpg")} width={150} />
                                        }}
                                    />
                                </TouchableOpacity>
                                :
                                <Text style={{ color: 'white' }}>{message.message}</Text>
                        }
                        <Text style={{ marginTop: 7, color: '#FFFFFF80', fontSize: 13 }}>{message.createdDate.toDate().format("hh:mm")}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(MyMessage);