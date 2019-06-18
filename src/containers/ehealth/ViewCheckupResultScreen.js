import React, { Component, PropTypes, PureComponent } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, RefreshControl, TouchableHighlight, TextInput, Switch, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import Dash from 'mainam-react-native-dash-view';
import bookingProvider from '@data-access/booking-provider';
import hospitalProvider from '@data-access/hospital-provider';
import constants from '@resources/strings';
import constants2 from '@ehealth/daihocy/resources/strings';
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
        console.log(this.props, 'view in ViewEhealthDetailScreen')

        let result = this.props.navigation.state.params.result;
        let resultDetail = this.props.navigation.state.params.resultDetail;
        console.log(result);
        this.state = {
            result,
            resultDetail,
            detailsHospital: '',
        }
    }

    renderDetails = () => {
        return (
            <ScrollView ref={ref => this.flListDate = ref} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <ProfileInfomation2 title="KẾT QUẢ KHÁM" resultDetail={this.state.resultDetail} />
                <CheckupResult showTitle={false} result={this.state.result} />
                <TouchableOpacity style={{
                    alignSelf: 'center',
                    width: 252,
                    maxWidth: DEVICE_WIDTH,
                    backgroundColor: '#27ae60',
                    borderRadius: 5,
                    height: 48,
                    marginVertical: 20,
                    padding: 10, alignItems: 'center'
                }} onPress={() => {
                    this.props.navigation.pop();
                }}><Text style={{ fontWeight: 'bold', color: '#FFF', fontSize: 17 }}>XEM XONG</Text>
                </TouchableOpacity>
                <View style={{ height: 50 }} />
            </ScrollView>
        )
    }
    render() {

        return (
            <ActivityPanel style={{ flex: 1 }} title={constants.title.ehealth_details}
                icBack={require('@images/new/left_arrow_white.png')}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#22b060"
                actionbarStyle={{
                    backgroundColor: '#22b060',
                    borderBottomWidth: 0
                }}
                titleStyle={{
                    color: '#FFF'
                }}
                isLoading={this.state.isLoading}>
                {this.renderDetails()}
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(ViewCheckupResultScreen);