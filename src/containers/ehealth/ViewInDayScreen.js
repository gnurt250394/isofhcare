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

const DEVICE_WIDTH = Dimensions.get('window').width;

import DateTimePicker from "mainam-react-native-date-picker";
import TextField from "mainam-react-native-form-validate/TextField";
import ehealthProvider from '@data-access/ehealth-provider'
import Modal from '@components/modal';
LocaleConfig.locales['en'] = {
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    monthNamesShort: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'],
    dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7']
};

LocaleConfig.defaultLocale = 'en';
class ViewInDateScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dayInMonth: [],
            dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
            hasResult: false
        }
    }
    componentDidMount() {
        let _dateSelected = this.props.navigation.state.params.dateSelected;
        let date = new Date(_dateSelected);
        let month = date.format("MM");
        let year = date.format("yyyy");
        this.renderDayInMonth(month, year, date);
    }

    renderDayInMonth(month, year, _dateSelected) {
        let dateSelected = null;
        let index = -1;
        let patientHistoryId = "";
        let obj = [];
        let patient = this.props.ehealth.patient;
        let obj2 = {};
        patient.history.forEach(item => {
            let key = item.timeGoIn.toDateObject('-').ddmmyyyy();
            obj2[key] = item;
        });
        for (var i = 1; i <= 31; i++) {
            try {
                var date = new Date(month + "/" + i + "/" + year);
                var time = date.getTime();
                if (!isNaN(time)) {
                    let patientHistory = obj2[date.ddmmyyyy()];
                    date.patientHistory = patientHistory;
                    if (!dateSelected && _dateSelected.format("yyyy-MM-dd") == date.format("yyyy-MM-dd")) {
                        dateSelected = date;
                        index = i - 1;
                        patientHistoryId = patientHistory.patientHistoryId;
                    }
                    obj.push(date);
                }
            } catch (e) {

            }
        }
        this.setState({
            dayInMonth: obj,
            dateSelected
        }, () => {
            if (index != -1 && this.flListDate) {
                setTimeout(() => {
                    try {
                        this.flListDate.scrollTo({ x: index * 70, y: 0, animated: true });
                    } catch (error) {

                    }
                }, 200);
            }
            if (patientHistoryId)
                this.getDetailPatientHistory(patientHistoryId)
        });
    }
    getDetailPatientHistory(patientHistoryId) {
        this.setState({ isLoading: true }, () => {
            bookingProvider.detailPatientHistory(patientHistoryId, this.props.ehealth.hospital.hospital.id).then(s => {
                this.setState({ isLoading: false }, () => {
                    switch (s.code) {
                        case 0:
                            if (s.data && s.data.data && s.data.data.result) {
                                try {
                                    let result = JSON.parse(s.data.data.result);
                                    console.log(result);
                                    let hasResult = false;
                                    if (result.ListDiagnostic && result.ListDiagnostic.length) {
                                        hasResult = true;
                                    }
                                    if (result.ListMedicine && result.ListMedicine.length) {
                                        hasResult = true;
                                    }
                                    if (result.ListResulGiaiPhau && result.ListResulGiaiPhau.length) {
                                        hasResult = true;
                                    }

                                    if (result.ListResulHoaSinh && result.ListResulHoaSinh.length) {
                                        hasResult = true;
                                    }

                                    if (result.ListResulHuyetHoc && result.ListResulHuyetHoc.length) {
                                        hasResult = true;
                                    }

                                    if (result.ListResulOther && result.ListResulOther.length) {
                                        hasResult = true;
                                    }

                                    if (result.ListResulViSinh && result.ListResulViSinh.length) {
                                        hasResult = true;
                                    }

                                    if (result.ListResulViSinh && result.ListResulViSinh.length) {
                                        hasResult = true;
                                    }

                                    if (result.ListResultCheckup && result.ListResultCheckup.length) {
                                        hasResult = true;
                                    }
                                    this.setState({ hasResult, result }, () => {
                                        if (!this.state.hasResult) {
                                            snackbar.show("Không tìm thấy kết quả", "danger");
                                        }
                                    })
                                } catch (error) {
                                    this.setState({ hasResult: false, result: {} }, () => {
                                        if (!this.state.hasResult) {
                                            snackbar.show("Không tìm thấy kết quả", "danger");
                                        }
                                    })
                                }
                            }
                            break;
                    }
                })
            }).catch(e => {
                this.setState({ isLoading: false }, () => {

                })
            })

        })
    }
    getItemLayout = (data, index) => (
        { length: data.length, offset: 70 * index, index }
    )
    dayPress(item) {
        if (!item.patientHistory) {
            snackbar.show("Không có kết quả vào ngày này", "danger");
            return;
        };
        this.setState({ dateSelected: item }, () => {
            this.getDetailPatientHistory(item.patientHistory.patientHistoryId)
        })
    }
    renderCheckupResult() {
        if (this.state.result && this.state.result.ListResultCheckup && this.state.result.ListResultCheckup.length) {
            let item = this.state.result.ListResultCheckup[this.state.result.ListResultCheckup.length - 1];
            let note = item.Diagnostic;
            if (note)
                note = item.DiseaseDiagnostic;
            if (note)
                note = item.First_Diagnostic;
            if (note)
                note = item.First_Diagnostic;
            if (note)
                return <View style={styles.card}>
                    <View style={{ width: 10, height: 10, backgroundColor: '#ff4355', borderRadius: 5, marginTop: 22, marginLeft: 10 }}></View>
                    <View style={{ flex: 1, padding: 15 }}>
                        <Text style={{ fontSize: 18 }}>Kết quả khám</Text>
                        <Text style={{ paddingTop: 5, color: '#ff4355' }}>{note}</Text>
                    </View>
                    <View style={{ width: 5, height: '100%', backgroundColor: '#ff4355', borderRadius: 2.5 }}></View>
                </View>
        }
        return null;
    }
    render() {

        return (
            <ActivityPanel style={{ flex: 1 }} title="Y BẠ ĐIỆN TỬ"
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
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ height: 100 }}>
                        <ScrollView ref={ref => this.flListDate = ref} horizontal={true} showsHorizontalScrollIndicator={false}>
                            {this.state.dayInMonth.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={this.dayPress.bind(this, item)} style={{ justifyContent: 'center', alignItems: 'center', width: 70 }}>
                                    <Text style={{ color: '#bbbbbb' }}>{this.state.dayNames[item.getDay()]}</Text>
                                    {item == this.state.dateSelected ?
                                        <View style={{
                                            width: 40, height: 40, borderRadius: 20,
                                            backgroundColor: '#27ae60',
                                            justifyContent: 'center', alignItems: 'center',
                                            shadowColor: 'rgba(46, 231, 58, 0.35)',
                                            shadowOffset: {
                                                width: 0,
                                                height: 4
                                            },
                                            shadowRadius: 10,
                                            shadowOpacity: 1,
                                            elevation: 3, margin: 5,
                                            marginTop: 10,
                                        }}>
                                            < Text style={{
                                                fontSize: 18,
                                                color: '#FFF',
                                            }}>{item.format("dd").toNumber()}</Text>
                                        </View> :
                                        <View style={{
                                            width: 40, height: 40, borderRadius: 20,
                                            justifyContent: 'center', alignItems: 'center',
                                            margin: 5,
                                            marginTop: 10,
                                        }}>
                                            < Text style={{
                                                fontSize: 18,
                                                color: '#2e2e39',
                                            }}>{item.format("dd").toNumber()}</Text>
                                        </View>
                                    }
                                </TouchableOpacity>
                            })}
                        </ScrollView>
                    </View>
                    {
                        this.state.hasResult && <ScrollView style={{ flex: 1, width: DEVICE_WIDTH, padding: 10 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {
                                this.renderCheckupResult()
                            }
                            <View style={styles.card}>
                                <View style={{ width: 10, height: 10, backgroundColor: '#2e66e7', borderRadius: 5, marginTop: 22, marginLeft: 10 }}></View>
                                <View style={{ flex: 1, padding: 15 }}>
                                    <Text style={{ fontSize: 18 }}>Kết quả xét nghiệm</Text>
                                    <Text style={{ paddingTop: 5, color: '#2e66e7' }}>Kết quả khám</Text>
                                </View>
                                <View style={{ width: 5, height: '100%', backgroundColor: '#0063ff', borderRadius: 2.5 }}></View>
                            </View>
                            <View style={styles.card}>
                                <View style={{ width: 10, height: 10, backgroundColor: '#2e66e7', borderRadius: 5, marginTop: 22, marginLeft: 10 }}></View>
                                <View style={{ flex: 1, padding: 15 }}>
                                    <Text style={{ fontSize: 18 }}>Kết quả chẩn đoán hình ảnh</Text>
                                    <Text style={{ paddingTop: 5, color: '#2e66e7' }}>Kết quả khám</Text>
                                </View>
                                <View style={{ width: 5, height: '100%', backgroundColor: '#0063ff', borderRadius: 2.5 }}></View>
                            </View>
                            <View style={styles.card}>
                                <View style={{ width: 10, height: 10, backgroundColor: '#fbaa21', borderRadius: 5, marginTop: 22, marginLeft: 10 }}></View>
                                <View style={{ flex: 1, padding: 15 }}>
                                    <Text style={{ fontSize: 18 }}>Thuốc</Text>
                                    <Text style={{ paddingTop: 5, color: '#fbaa21' }}>Kết quả khám</Text>
                                </View>
                                <View style={{ width: 5, height: '100%', backgroundColor: '#fbaa21', borderRadius: 2.5 }}></View>
                            </View>
                            <View style={styles.card}>
                                <View style={{ width: 10, height: 10, backgroundColor: '#ff4355', borderRadius: 5, marginTop: 22, marginLeft: 10 }}></View>
                                <View style={{ flex: 1, padding: 15 }}>
                                    <Text style={{ fontSize: 18 }}>Tiền</Text>
                                    <Text style={{ paddingTop: 5, color: '#ff4355' }}>Kết quả khám</Text>
                                </View>
                                <View style={{ width: 5, height: '100%', backgroundColor: '#ff4355', borderRadius: 2.5 }}></View>
                            </View>
                            <View style={{ height: 50 }}></View>
                        </ScrollView>
                    }
                    {this.state.hasResult &&
                        <TouchableOpacity style={{
                            width: 252,
                            maxWidth: DEVICE_WIDTH,
                            backgroundColor: '#27ae60',
                            borderRadius: 5,
                            height: 48,
                            marginVertical: 20,
                            padding: 10, alignItems: 'center'
                        }}>
                            <Text style={{ fontWeight: 'bold', color: '#FFF', fontSize: 17 }}>ĐẦY ĐỦ KẾT QUẢ</Text>
                        </TouchableOpacity>
                    }
                </View>
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 5,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 1, marginTop: 10, padding: 10, flexDirection: 'row', shadowOpacity: 1, borderRadius: 8
    },
    style1: {
        flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 20
    },
    text1: {
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000"
    },
    hospital_selected: {
        alignItems: 'center',
        height: 105,
        width: 105,
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 3,
        borderColor: '#02c39a',
        borderRadius: 6,
        margin: 5
    },
    hospital: {
        alignItems: 'center',
        height: 105,
        width: 105,
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: 6,
        margin: 5
    },
    item_ehealth: {
        position: 'relative',
        left: 20, right: 30
    },
    item_ehealth2: {
        backgroundColor: '#f8fcf4',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(155, 155, 155, 0.47)',
        borderRadius: 6,
        marginTop: 10,
        marginLeft: 45,
        padding: 12,
    },
    dash: { width: 2, flexDirection: 'column', position: 'absolute', top: 0, left: 10, bottom: 0 },
    item_cycle: { width: 10, height: 10, backgroundColor: '#02c39a', borderRadius: 5, position: 'absolute', left: 6, top: '50%', marginTop: -5 },
    hospital_text: { alignItems: 'flex-end', textAlign: 'center', margin: 5, fontSize: 13 },
    avatar: {
        alignSelf: 'center',
        borderRadius: 25,
        width: 45,
        height: 45
    },
    viewBtn: {
        width: 252,
        maxWidth: DEVICE_WIDTH - 80,
        height: 50,
        borderRadius: 5,
        marginVertical: 20,
        backgroundColor: '#27AE60',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardView: {
        marginTop: 20,
        width: 350,
        maxWidth: DEVICE_WIDTH - 50,
        borderRadius: 5,

        padding: 25,
    },
    viewLine: {
        backgroundColor: '#4CD565',
        height: '100%',
        width: 1
    },
    viewBTnSuggest: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnReExamination: {
        padding: 2, borderRadius: 3, marginRight: 5, marginVertical: 10, paddingHorizontal: 5
    },
    txLabel: {
        color: '#9caac4',
        fontSize: 15
    },
    txContent: {
        color: '#554a4c',
        marginTop: 5, marginBottom: 25,
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(ViewInDateScreen);