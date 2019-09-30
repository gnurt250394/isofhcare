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
        const icSupport = require("@images/new/user.png");
        const source = this.props.ehealth.patient.avatar
            ? { uri: this.props.ehealth.patient.avatar.absoluteUrl() }
            : icSupport;
        return <View style={styles.viewInfoProfile}>
            <View style={styles.viewItem}></View>
            <View style={styles.viewLabel}>
                <View style={[styles.item, { marginTop: 0 }]}>
                    <View style={styles.round1}>
                        <View style={styles.round2} />
                    </View>
                    <Text style={[styles.itemlabel, styles.txLabel]}>{this.props.patientName ? this.props.patientName : this.props.ehealth.patient.patientName}</Text>
                </View>
                <View style={styles.item}>
                    <View style={styles.round1}>
                        <View style={styles.round3} />
                    </View>
                    <Text style={styles.itemlabel}>{this.props.hospitalName ? this.props.hospitalName : this.props.ehealth.hospital.hospital.name}</Text>
                </View>
                <View style={styles.item}>
                    <View style={styles.round1}>
                        <View style={styles.round2} />
                    </View>
                    <Text style={styles.itemlabel}>Mã: <Text style={styles.itemcontent}>{resultDetail.Profile.Value}</Text></Text>
                </View>
                {
                    serviceCheckup &&
                    <View>
                        <View style={styles.item}>
                            <View style={styles.round1}>
                                <View style={styles.round3} />
                            </View>
                            <Text style={styles.itemlabel}>Dịch vụ: <Text style={styles.itemcontent}>{serviceCheckup.Name}</Text></Text>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.round1}>
                                <View style={styles.round2} />
                            </View>
                            <Text style={styles.itemlabel}>Khoa: <Text style={styles.itemcontent}>{serviceCheckup.DepartmentName}</Text></Text>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.round1}>
                                <View style={styles.round3} />
                            </View>
                            <Text style={styles.itemlabel}>Nơi khám: <Text style={styles.itemcontent}>{serviceCheckup.RoomName} - {serviceCheckup.Location}</Text></Text>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.round1}>
                                <View style={styles.round2} />
                            </View>
                            <Text style={styles.itemlabel}>Bác sĩ: <Text style={styles.itemcontent}>{serviceCheckup.DoctorFullName == 'System' ? '' : serviceCheckup.DoctorFullName}</Text></Text>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.round1}>
                                <View style={styles.round3} />
                            </View>
                            <Text style={styles.itemlabel}>Số khám: <Text style={styles.itemcontent}>{serviceCheckup.SequenceNoInt}</Text></Text>
                        </View>
                    </View>
                }
            </View>
            <ImageLoad
                resizeMode="cover"
                imageStyle={styles.imageStyle}
                borderRadius={35}
                customImagePlaceholderDefaultStyle={styles.customImage}
                placeholderSource={icSupport}
                style={styles.imgLoad}
                resizeMode="cover"
                loadingStyle={{ size: "small", color: "gray" }}
                source={source}
                defaultImage={() => {
                    return (
                        <ScaledImage
                            resizeMode="cover"
                            source={icSupport}
                            width={70}
                            style={styles.imgLoad}
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
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' },
    viewInfoProfile: { flexDirection: 'row', position: 'relative', flex: 1, padding: 8 },
    viewItem: { width: 1.5, top: 10, bottom: 10, left: 17.5, backgroundColor: '#8fa1aa', position: 'absolute' },
    viewLabel: { flex: 1, marginLeft: 0 },
    txLabel: { fontWeight: 'bold', fontSize: 18, marginTop: 0 },
    imageStyle: { borderRadius: 35, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' },
    customImage: {
        width: 70,
        height: 70,
        alignSelf: "center"
    },
    imgLoad: { width: 70, height: 70 },

})
export default connect(mapStateToProps)(ProfileInfomation);