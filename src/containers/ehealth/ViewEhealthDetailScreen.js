import React, { Component, PropTypes, PureComponent } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, RefreshControl, TouchableHighlight, TextInput, Switch, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import Dash from 'mainam-react-native-dash-view';
import bookingProvider from '@data-access/booking-provider';
import hospitalProvider from '@data-access/hospital-provider';
import constants from '@resources/strings';
import dateUtils from 'mainam-react-native-date-utils';
import stringUtils from 'mainam-react-native-string-utils';
import profileProvider from '@data-access/profile-provider';
import snackbar from '@utils/snackbar-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import { Calendar, LocaleConfig, Agenda } from 'react-native-calendars';
import { Card, Icon } from 'native-base';
import ProfileInfomation from '@components/ehealth/ProfileInfomation';
import CheckupResult from '@components/ehealth/CheckupResult';
import SurgeryResult from '@components/ehealth/SurgeryResult';
import MedicalTestResult from '@components/ehealth/MedicalTestResult';
import DiagnosticResult from '@components/ehealth/DiagnosticResult';
import Medicine from '@components/ehealth/Medicine';
import TotalMoney from '@components/ehealth/TotalMoney';
import ExportPDF from '@components/ehealth/ExportPDF';


class ViewEhealthDetailScreen extends Component {
    constructor(props) {
        super(props)
        let result = this.props.navigation.state.params.result;
        let resultDetail = this.props.navigation.state.params.resultDetail;
        let user = this.props.navigation.state.params.user
        let hospitalName = this.props.navigation.state.params.hospitalName

        this.state = {
            result: result,
            resultDetail: resultDetail,
            user: user,
            hospitalName: hospitalName,
            detailsHospital: ""
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params && nextProps.navigation.state.params.result) {
            let result = nextProps.navigation.state.params.result;
            let resultDetail = nextProps.navigation.state.params.resultDetail;
            let user = nextProps.navigation.state.params.user
            let hospitalName = nextProps.navigation.state.params.hospitalName
            this.setState({
                result: result,
                resultDetail: resultDetail,
                user: user,
                hospitalName: hospitalName
            })
        }
    }
    renderDetails = () => {
        if (this.state.user) {
            return (
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <ProfileInfomation hospitalName={this.state.hospitalName} avatar={this.state.user.avatar} patientName={this.state.resultDetail.Profile.PatientName} resultDetail={this.state.resultDetail} />
                    <View style={styles.lineHeader} />
                    <CheckupResult result={this.state.result} />
                    <MedicalTestResult result={this.state.result} />
                    <DiagnosticResult result={this.state.result} />
                    <SurgeryResult result={this.state.result} />
                    <Medicine result={this.state.result} />
                    <TotalMoney result={this.state.result} resultDetail={this.state.resultDetail} />
                    <View style={styles.end} />
                </ScrollView>
            )
        } else {
            return (
                <ScrollView ref={ref => this.flListDate = ref} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <ProfileInfomation resultDetail={this.state.resultDetail} />
                    <View style={styles.lineHeader} />
                    <CheckupResult result={this.state.result} />
                    <MedicalTestResult result={this.state.result} />
                    <DiagnosticResult result={this.state.result} />
                    <SurgeryResult result={this.state.result} />
                    <Medicine result={this.state.result} />
                    <TotalMoney result={this.state.result} resultDetail={this.state.resultDetail} />
                    <View style={styles.end} />
                </ScrollView>
            )
        }
    }
    print = () => {
        let result = this.state.result;
        result.Profile = this.state.resultDetail.Profile
        result.hospital = this.props.ehealth.hospital.hospital;
        let patientHistoryId = this.props.ehealth.patient.patientHistoryId;
        this.setState({ isLoading: true }, () => {
            try {
                this.exportPdfCom.exportPdf({
                    type: "all",
                    result: result,
                    fileName: constants.filenamePDF + patientHistoryId,
                    print: true
                }, () => {
                    this.setState({ isLoading: false });
                });
            } catch (err) {
                this.setState({ isLoading: false });
            }
        })
    }


    render() {

        return (
            <ActivityPanel style={styles.container} title={constants.title.ehealth_details}
                isLoading={this.state.isLoading}
                titleStyle={styles.titleStyle}
                menuButton={<TouchableOpacity style={styles.btnPrint} onPress={this.print}><ScaledImage source={require('@images/new/ehealth/ic_print.png')} height={25} /></TouchableOpacity>}
            >
                {this.renderDetails()}
                <ExportPDF endLoading={() => { this.setState({ isLoading: false }) }} ref={(element) => this.exportPdfCom = element} />
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
    end: { height: 50 },
    lineHeader: {
        height: 1,
        backgroundColor: '#27ae60',
    },
    container: { flex: 1 },
    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' },
    viewRenderDetails: { height: 1, backgroundColor: '#27ae60', },
    viewBottomDetails: { height: 50 },

    titleStyle: {
        color: '#FFF',
        marginLeft: 50
    },
    btnPrint: {
        paddingHorizontal: 10
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        ehealth: state.auth.ehealth
    };
}
export default connect(mapStateToProps)(ViewEhealthDetailScreen);