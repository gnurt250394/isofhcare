import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, WebView, ScrollView } from 'react-native';
import constants from '@resources/strings';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import notificationProvider from '@data-access/notification-provider';
import snackbar from '@utils/snackbar-utils';
import stringUtils from 'mainam-react-native-string-utils';

let $this;
class NotificationScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messaging: this.props.messaging ? this.props.messaging : {}
        }
    }

    renderWebview() {
        const html = this.state.messaging.message;
        // if (this.state.messaging.type == 3)
        return <WebView
            automaticallyAdjustContentInsets={true}
            startInLoadingState={true}
            javaScriptEnabled={true}
            allowsInlineMediaPlayback={true}
            dataDetectorTypes={"all"}
            mixedContentMode='always'
            source={{ uri: this.state.messaging.message }} />
        // else {
        //     return <WebView
        //         allowsInlineMediaPlayback={true}
        //         javaScriptEnabled={true}
        //         mixedContentMode='always'
        //         source={{ html, baseUrl: 'web/' }} />
        // }
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Thông báo" isLoading={this.state.isLoading} touchToDismiss={false} showFullScreen={true}>
                <View style={{ flex: 1 }}>
                    {
                        this.state.messaging && (this.state.messaging.type == 3) ?
                            this.renderWebview() :
                            <ScrollView style={{ margin: 20 }}>
                                <Text>{this.state.messaging.message}</Text>
                            </ScrollView>
                    }
                </View>
            </ActivityPanel >
        )
    }
}

export default NotificationScreen;