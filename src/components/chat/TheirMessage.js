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

class TheirMessage extends React.Component {
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
                snackbar.show("Không có ảnh nào");
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
        const chatProfile = this.props.chatProfile;
        let avatar = chatProfile && chatProfile.avatar ? chatProfile.avatar.absoluteUrl() : "";
        return (
            <View style={{ marginBottom: this.props.isLast ? 30 : 0 }}>
                {
                    this.state.showDate ? <DateMessage message={this.props.message} /> : null
                }
                <View style={{ marginLeft: 5, marginRight: 5, minHeight: 50, marginTop: 5, flexDirection: 'row' }}>
                    {
                        this.state.showAuthor || this.state.showDate ?
                            <ImageLoad
                                customImagePlaceholderDefaultStyle={{ width: 50, height: 50, borderRadius: 25 }}
                                resizeMode="cover"
                                placeholderSource={require("@images/noimage.jpg")}
                                style={{ width: 50, height: 50, borderRadius: 25 }}
                                loadingStyle={{ size: 'small', color: 'gray' }}
                                borderRadius={25}
                                imageStyle={{ width: 50, height: 50, borderRadius: 25 }}
                                source={{ uri: avatar }}
                                defauleImage={() => {
                                    return <ScaleImage resizeMode='cover' source={require("@images/noimage.jpg")} width={50} style={{ borderRadius: 25 }} />
                                }}
                            /> : <View style={{ width: 50, height: 50 }} />
                    }
                    <View style={{ marginLeft: 5, backgroundColor: 'white', padding: 5, borderRadius: 10, minWidth: 120 }}>
                        {/* {
                            this.state.showAuthor || this.state.showDate ?
                                <Text style={{ marginBottom: 5, fontWeight: '800', color: '#25bb99', fontSize: 15 }}>{this.props.message.sender.nickname}</Text>
                                : null
                        }*/}

                        {
                            this.props.message.type == 4 ?
                                <TouchableOpacity onPress={this.photoViewer.bind(this, message.message ? message.message.absoluteUrl() : "")}>
                                    <ImageLoad
                                        resizeMode="cover"
                                        placeholderSource={require("@images/noimage.jpg")}
                                        style={{ width: 150, height: 150 }}
                                        loadingStyle={{ size: 'small', color: 'gray' }}
                                        source={{ uri: message.message ? message.message.absoluteUrl() : "" }}
                                        defaultImage={() => {
                                            return <ScaleImage resizeMode='cover' source={require("@images/noimage.jpg")} width={150} />
                                        }}
                                    />
                                </TouchableOpacity>
                                :
                                <Text>{message.message}</Text>
                        }

                        <Text style={{ marginTop: 7, color: '#bababa', fontSize: 13 }}>{this.props.message.createdDate.toDate().format("hh:mm")}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(TheirMessage);