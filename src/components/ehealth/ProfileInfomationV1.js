import React, { Component, } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from "mainam-react-native-date-utils";
import ImageLoad from 'mainam-react-native-image-loader';
import ScaledImage from "mainam-react-native-scaleimage";
import QRCode from 'react-native-qrcode-svg';
import Modal from "@components/modal";
import { Card } from 'native-base';


class ProfileInfomation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }
    onQrClick = () => {
        this.setState({
            isVisible: true,
        })
    }
    onBackdropPress = () => this.setState({ isVisible: false })

    render() {
        let { resultDetail } = this.props;

        if (!resultDetail)
            return null;
        let serviceCheckup = (resultDetail.ListService || []).find(item => item.ServiceType == "CheckUp");
        const icSupport = require("@images/new/user.png");

        const source = this.props.ehealth?.patient?.avatar
            ? { uri: this.props.ehealth.patient.avatar.absoluteUrl() }
            : icSupport;
        const hospital = this.props.ehealth.hospital && this.props.ehealth.hospital.hospital ? this.props.ehealth.hospital.hospital : this.props.ehealth.hospital

        return (
            <View style={styles.viewInfoProfile}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    width: '100%'
                }}>
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={styles.imageStyle}
                        borderRadius={30}
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
                                    width={60}
                                    style={styles.imgLoad}
                                />
                            );
                        }}
                    />
                    {/* <View style={styles.viewItem}></View> */}
                    <View style={styles.viewLabel}>
                        <View style={[styles.item, { marginTop: 0 }]}>

                            <Text style={[styles.itemlabel, styles.txLabel]}>{this.props?.patientName ? this.props?.patientName : this.props?.ehealth?.patient?.patientName}</Text>
                        </View>
                        <Text style={[styles.itemlabel, { paddingTop: 5 }]}>{resultDetail?.Profile?.GenderId == "F" ? "Nữ," : resultDetail?.Profile?.GenderId == "M" ? "Nam," : ""} {resultDetail?.Profile?.Birthday ? resultDetail?.Profile?.Birthday.toDateObject().getAge() : ''} tuổi</Text>
                        <View style={styles.item}>

                            <Text style={[styles.itemlabel, { color: '#075BB5' }]}>Mã NB: <Text style={[styles.itemcontent, { fontWeight: 'bold' }]}>{resultDetail?.Profile?.Value}</Text></Text>
                            <Text style={styles.itemlabel}>Mã HS: <Text style={styles.itemcontent}>{resultDetail?.Profile?.PatientDocument}</Text></Text>
                        </View>

                    </View>
                    {/* {
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
                                <Text style={styles.itemlabel}>Nơi khám: {serviceCheckup.RoomName && serviceCheckup.Location ? <Text style={styles.itemcontent}>{serviceCheckup.RoomName} - {serviceCheckup.Location}</Text> : ''}</Text>
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
                    } */}
                    <Card style={{ padding: 5, borderRadius: 6 }}>
                        <TouchableOpacity onPress={this.onQrClick} style={{ alignItems: 'center' }}>
                            <QRCode
                                value={resultDetail?.Profile?.Value}
                                logo={require('@images/new/logo.png')}
                                logoSize={20}
                                size={70}
                                logoBackgroundColor='transparent'
                            />
                        </TouchableOpacity>
                    </Card>
                </View>

                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={this.onBackdropPress}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={styles.modal}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <QRCode
                        value={resultDetail?.Profile?.Value}
                        size={250}
                        fgColor='white' />
                </Modal>
            </View>)
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        ehealth: state.auth.ehealth
    };
}
const styles = StyleSheet.create({
    round1: {
        width: 20,
        height: 20,
        backgroundColor: '#FFF',
        borderColor: '#8fa1aa',
        borderWidth: 1.5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    round2: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#7daa3c'
    },
    round3: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#c74444'
    },
    itemlabel: {
        marginLeft: 5,
        marginTop: 2
    },
    itemcontent: {
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexShrink: 1
    },
    viewInfoProfile: {
        flexDirection: 'row',
        position: 'relative',
        flex: 1,
        padding: 15,
        marginTop: 10
    },
    viewItem: {
        width: 1.5,
        top: 10,
        bottom: 10,
        left: 17.5,
        backgroundColor: '#8fa1aa',
        position: 'absolute'
    },
    viewLabel: {
        flex: 1,
        marginLeft: 0,
        paddingLeft: 10
    },
    txLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 0
    },
    imageStyle: {
        borderRadius: 30,
        borderWidth: 0.5,
        borderColor: 'rgba(151, 151, 151, 0.29)'
    },
    customImage: {
        width: 60,
        height: 60,
        alignSelf: "center"
    },
    imgLoad: {
        width: 60,
        height: 60
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

})
export default connect(mapStateToProps)(ProfileInfomation);