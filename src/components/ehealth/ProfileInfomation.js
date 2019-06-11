import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
import scheduleProvider from '@data-access/schedule-provider';
import snackbar from '@utils/snackbar-utils';
import dateUtils from "mainam-react-native-date-utils";
import bookingProvider from '@data-access/booking-provider';
import dataCacheProvider from '@data-access/datacache-provider';
import constants from '@resources/strings';
const DEVICE_WIDTH = Dimensions.get('window').width;
import ImageLoad from 'mainam-react-native-image-loader';
import ScaledImage from "mainam-react-native-scaleimage";


class SelectTimeScreen extends Component {
    constructor(props) {
        super(props);
        debugger;
        console.log(this.props.ehealth);
        this.state = {
            listTime: []
        }
    }


    render() {
        const icSupport = require("@images/new/user.png");
        const source = this.props.userApp.currentUser.avatar
            ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() }
            : icSupport;
        return <View>
            <ImageLoad
                resizeMode="cover"
                imageStyle={{ borderRadius: 35, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' }}
                borderRadius={35}
                customImagePlaceholderDefaultStyle={{
                    width: 70,
                    height: 70,
                    alignSelf: "center"
                }}
                placeholderSource={icSupport}
                style={{ width: 70, height: 70, alignSelf: "center" }}
                resizeMode="cover"
                loadingStyle={{ size: "small", color: "gray" }}
                source={source}
                defaultImage={() => {
                    return (
                        <ScaledImage
                            resizeMode="cover"
                            source={icSupport}
                            width={70}
                            style={{ width: 70, height: 70, alignSelf: "center" }}
                        />
                    );
                }}
            />
            <Text>header</Text>
        </View>
    }
}

function mapStateToProps(state) {
    debugger;
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
const styles = StyleSheet.create({

})
export default connect(mapStateToProps)(SelectTimeScreen);