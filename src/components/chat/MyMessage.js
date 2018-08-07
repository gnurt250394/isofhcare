/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { Text, View, Image } from 'react-native';
import sendbirdUtils from '@utils/send-bird-utils';
import SendBird from 'sendbird';
import ScaleImage from 'mainam-react-native-scaleimage';
import dateUtils from 'mainam-react-native-date-utils';
import ActivityPanel from '@components/ActivityPanel';
import snackbar from '@utils/snackbar-utils';
import DateMessage from '@components/chat/DateMessage';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';

export default class MyMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAuthor: (!this.props.preMessage) ? true : this.props.message.sender && this.props.preMessage.sender && (this.props.message.sender.userId != this.props.preMessage.sender.userId) ? true : false,
            showDate: (!this.props.preMessage) ? true : (this.props.message.createdAt && this.props.preMessage.createdAt && this.props.message.createdAt.toDateObject().format("dd/MM/yyyy") != this.props.preMessage.createdAt.toDateObject().format("dd/MM/yyyy")) ? true : false
        }
    }
    render() {
        return (
            <View style={{ minHeight: 50, marginTop: 5, marginBottom: this.props.isLast ? 30 : 0, marginTop: !this.state.showDate && this.state.showAuthor ? 20 : 0 }}>
                {
                    this.state.showDate ? <DateMessage message={this.props.message} /> : null
                }
                <View style={{ marginLeft: 5, marginRight: 5, minHeight: 50, marginTop: 5, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <View style={{ marginLeft: 5, backgroundColor: 'white', padding: 5, borderRadius: 10, minWidth: 120 }}>
                        {
                            this.props.message.messageType == "file" ?
                                <ImageProgress
                                    indicator={Progress} resizeMode='cover' style={{ width: 150, height: 150 }} source={{ uri: this.props.message.url }}
                                    defaultImage={() => {
                                        return <ScaleImage resizeMode='cover' source={require("@images/noimage.png")} width={150} />
                                    }} />
                                :
                                <Text>{this.props.message.message}</Text>
                        }
                        <Text style={{ marginTop: 7, color: '#bababa', fontSize: 13 }}>{this.props.message.createdAt.toDateObject().format("hh:mm")}</Text>
                    </View>
                </View>
            </View>
        );
    }
}