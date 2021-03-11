import React, { Component, } from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from "mainam-react-native-date-utils";
import ImageLoad from 'mainam-react-native-image-loader';
import ScaledImage from "mainam-react-native-scaleimage";
import QRCode from 'react-native-qrcode-svg';


class ProfileInfomation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }
    onBackdropPress = () => this.setState({ isVisible: false })

    formatDate = (date) => {
        let dateFormat = date.substring(0, 10).split('-')
        let dd = dateFormat[2];
        let mm = dateFormat[1];
        let yy = dateFormat[0]
        return `${dd}/${mm}/${yy}`
    }
    onQrClick = () => {
        this.setState({
            isVisible: true,
            value: 123456
        })
    }
    render() {
        let { resultDetail, data } = this.props;
        if (!resultDetail)
            return null;
        let serviceCheckup = (resultDetail.ListService || []).find(item => item.ServiceType == "CheckUp");
        const icSupport = require("@images/new/user.png");
        const source = this.props.ehealth.patient.avatar
            ? { uri: this.props.ehealth.patient.avatar }
            : icSupport;
        return <View style={styles.container}>
            <View style={styles.viewInfo}>
                <Text style={[styles.itemlabel, styles.txTitle]}>{this.props.title}</Text>
                <View style={styles.viewDate}>
                    <View style={styles.item}>
                        <Text
                            style={[styles.itemlabel, { color: '#626263' }]}
                        >Ngày Khám: <Text style={[styles.itemcontent, { color: '#626263' }]}
                        >{resultDetail?.Profile?.TimeGoIn ? resultDetail?.Profile?.TimeGoIn?.toDateObject()?.format("dd/MM/yyyy") : this.formatDate(data?.timeGoIn)}</Text></Text>

                    </View>
                    <View style={[styles.item, { marginTop: 10 }]}>
                        <Text style={[styles.itemlabel, styles.txName]}>{this.props.patientName ? this.props.patientName : this.props.ehealth.patient.patientName}</Text>
                    </View>
                </View>
            </View>
            <ImageLoad
                resizeMode="cover"
                imageStyle={styles.imgStyle}
                borderRadius={35}
                customImagePlaceholderDefaultStyle={styles.imgCustom}
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
            <TouchableOpacity onPress={this.onQrClick} style={{ marginRight: 10, alignItems: 'center' }}>
                <QRCode
                    value={this.state.booking.reference || 0}
                    logo={require('@images/new/logo.png')}
                    logoSize={20}
                    size={80}
                    logoBackgroundColor='transparent'
                />
                <Text>{this.state.booking.reference}</Text>
            </TouchableOpacity>
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
                    value={this.state.value}
                    size={250}
                    fgColor='white' />
            </Modal>

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
    item: { marginTop: 10, flexDirection: 'row' },
    container: { flexDirection: 'row', flex: 1, padding: 8 },
    viewInfo: { flex: 1 },
    txTitle: { fontWeight: 'bold', fontSize: 18, marginTop: 0, color: '#172957' },
    viewDate: { flex: 1, marginLeft: 0 },
    txName: { fontSize: 16, marginTop: 0, color: '#192a58' },
    imgStyle: { borderRadius: 35, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' },
    imgCustom: {
        width: 70,
        height: 70,
        alignSelf: "center"
    },
    imgLoad: { width: 70, height: 70 },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
export default connect(mapStateToProps)(ProfileInfomation);