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
import ProfileInfomation from '@components/ehealth/ProfileInfomation';
import CheckupResult from '@components/ehealth/CheckupResult';
import MedicalTestResult from '@components/ehealth/MedicalTestResult';

const DEVICE_WIDTH = Dimensions.get('window').width;

class ViewEhealthDetailScreen extends Component {
    constructor(props) {
        super(props)
        let result = this.props.navigation.state.params.result;
        let resultDetail = this.props.navigation.state.params.resultDetail;
        console.log(result);
        this.state = {
            result,
            resultDetail
        }
    }
    componentDidMount() {
    }
    render() {

        return (
            <ActivityPanel style={{ flex: 1 }} title="CHI TIẾT Y BẠ"
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
                <ScrollView ref={ref => this.flListDate = ref} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <ProfileInfomation resultDetail={this.state.resultDetail} />
                    <View style={{ height: 1, backgroundColor: '#27ae60', }} />
                    <CheckupResult result={this.state.result} />
                    <MedicalTestResult result={this.state.result} />
                </ScrollView>
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
    round1: { width: 25, height: 25, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 2, borderRadius: 12.5, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(ViewEhealthDetailScreen);