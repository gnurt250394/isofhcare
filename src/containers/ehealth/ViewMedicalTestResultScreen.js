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
import { Card } from 'native-base';
import ProfileInfomation2 from '@components/ehealth/ProfileInfomation2';
import CheckupResult from '@components/ehealth/CheckupResult';
import SurgeryResult from '@components/ehealth/SurgeryResult';
import MedicalTestResult from '@components/ehealth/MedicalTestResult';
import DiagnosticResult from '@components/ehealth/DiagnosticResult';
import Medicine from '@components/ehealth/Medicine';
import TotalMoney from '@components/ehealth/TotalMoney';

const DEVICE_WIDTH = Dimensions.get('window').width;

class ViewCheckupResultScreen extends Component {
    constructor(props) {
        super(props)
        let result = this.props.navigation.state.params.result;
        let resultDetail = this.props.navigation.state.params.resultDetail;
        this.state = {
            result,
            resultDetail,
            detailsHospital: '',
        }
    }

    renderDetails = () => {
        return (
            <ScrollView ref={ref => this.flListDate = ref} showsVerticalScrollIndicator={false} style={styles.container}>
                <ProfileInfomation2 title="KẾT QUẢ XÉT NGHIỆM" resultDetail={this.state.resultDetail} />
                <MedicalTestResult showTitle={false} result={this.state.result} />
                <TouchableOpacity style={styles.btnViewFinish} onPress={() => {
                    this.props.navigation.pop();
                }}><Text style={styles.txDone}>{constants.ehealth.view_finish}</Text>
                </TouchableOpacity>
                <View style={styles.viewBottomSpace} />
            </ScrollView>
        )
    }
    render() {

        return (
            <ActivityPanel style={styles.container} title={constants.title.ehealth_details}
                isLoading={this.state.isLoading}>
                {this.renderDetails()}
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
    container:{ flex: 1 },
    btnViewFinish:{
        alignSelf: 'center',
        width: 252,
        maxWidth: DEVICE_WIDTH,
        backgroundColor: '#27ae60',
        borderRadius: 5,
        height: 48,
        marginVertical: 20,
        padding: 10, alignItems: 'center'
    },
    txDone:{ fontWeight: 'bold', color: '#FFF', fontSize: 17 },
    viewBottomSpace:{ height: 50 }
}); 

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(ViewCheckupResultScreen);