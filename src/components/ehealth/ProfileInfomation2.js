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


class ProfileInfomation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }


    render() {
        let { resultDetail } = this.props;
        if (!resultDetail)
            return null;
        let serviceCheckup = (resultDetail.ListService || []).find(item => item.ServiceType == "CheckUp");
        console.log(serviceCheckup);
        console.log(this.props.ehealth);
        const icSupport = require("@images/new/user.png");
        const source = this.props.userApp.currentUser.avatar
            ? { uri: this.props.avatar ? this.props.avatar.absoluteUrl() : this.props.userApp.currentUser.avatar.absoluteUrl() }
            : icSupport;
        return <View style={{ flexDirection: 'row', flex: 1, padding: 8 }}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.itemlabel, { fontWeight: 'bold', fontSize: 18, marginTop: 0, color: '#172957' }]}>{this.props.title}</Text>
                <View style={{ flex: 1, marginLeft: 0 }}>
                    <View style={styles.item}>
                        <Text style={[styles.itemlabel, { color: '#626263' }]}>Ngày Khám: <Text style={[styles.itemcontent, { color: '#626263' }]}>{resultDetail.Profile.TimeGoIn.toDateObject().format("dd/MM/yyyy")}</Text></Text>
                    </View>
                    <View style={[styles.item, { marginTop: 10 }]}>
                        <Text style={[styles.itemlabel, { fontSize: 16, marginTop: 0, color: '#192a58' }]}>{this.props.patientName ? this.props.patientName : this.props.ehealth.patient.patientName}</Text>
                    </View>
                </View>
            </View>
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
                style={{ width: 70, height: 70 }}
                resizeMode="cover"
                loadingStyle={{ size: "small", color: "gray" }}
                source={source}
                defaultImage={() => {
                    return (
                        <ScaledImage
                            resizeMode="cover"
                            source={icSupport}
                            width={70}
                            style={{ width: 70, height: 70 }}
                        />
                    );
                }}
            />
        </View>
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
const styles = StyleSheet.create({
    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    item: { marginTop: 10, flexDirection: 'row' }
})
export default connect(mapStateToProps)(ProfileInfomation);