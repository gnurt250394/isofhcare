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
import profileProvider from '@data-access/profile-provider';
import snackbar from '@utils/snackbar-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Card } from 'native-base';
import ReactNativeAN from 'react-native-alarm-notification';

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
const fireDate = '10-06-2019 15:52:00';			  // set exact date time | Format: dd-MM-yyyy HH:mm:ss
const alarmNotifData = {
    id: "12345",                                  // Required
    title: "My Notification Title",               // Required
    message: "My Notification Message",           // Required
    channel: "8888",                     // Required. Same id as specified in MainApplication's onCreate method
    ticker: "My Notification Ticker",
    auto_cancel: true,                            // default: true
    vibrate: true,
    vibration: 100,                               // default: 100, no vibration if vibrate: false
    small_icon: "ic_launcher",                    // Required
    large_icon: "ic_launcher",
    play_sound: true,
    sound_name: null,                             // Plays custom notification ringtone if sound_name: null
    color: "red",
    schedule_once: true,                          // Works with ReactNativeAN.scheduleAlarm so alarm fires once
    tag: 'some_tag',
    fire_date: fireDate,                          // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.
  	data: { foo: "bar" },
};
class ListProfileScreen extends Component {
    constructor(props) {
        super(props)
        let patient = this.props.navigation.state.params.patient;

        let latestTime = patient.latestTime ? patient.latestTime.toDateObject("-") : new Date()
        let histories = this.groupHistory(patient.history, latestTime);
        this.state = {
            refreshing: false,
            data: [],
            loading: false,
            bookings: [],
            hospitals: [],
            loadFirstTime: true,
            currentDate: new Date(),
            toggelDateTimePickerVisible: false,
            lastDate: this.props.navigation.state.params && this.props.navigation.state.params.lastDate ? this.props.navigation.state.params.lastDate : '',
            suggestions: '',
            patient: patient,
            latestTime,
            histories,
            switchValue: false,
            dateSelected: latestTime.format("yyyy-MM-dd")
        }
    }
    groupHistory(histories, focusDay) {
        let obj = {};
        histories.forEach(item => {
            if (item.timeGoIn) {
                let tgi = item.timeGoIn.toDateObject("-").format("yyyy-MM-dd");
                if (!obj[tgi]) {
                    obj[tgi] = {
                        history: item,
                        marked: true,
                        color: 'green',
                        selectedColor: 'blue'
                    }
                }
            }
        });
        let focus = obj[focusDay.format("yyyy-MM-dd")];
        if (focus) {
            focus.selected = true;
        }
        return obj;
    }
    componentDidMount() {
        this.onGetDetails()
    }
    onGetDetails = () => {
        let lastDate = this.state.lastDate ? this.state.lastDate.toDateObject('-').format('dd/MM/yyyy') : null
        let dateSelected = this.state.dateString ? this.state.dateString.toDateObject('-').format('dd/MM/yyyy') : null
        let patientHistoryId = this.state.patient.patientHistoryId
        let hospitalId = this.state.patient.hospitalEntity.id
        ehealthProvider.detailPatientHistory(patientHistoryId, hospitalId).then(res => {
            let medicineTime = (new Date().format("dd/MM/yyyy") + " " + res.data.data.medicineTime).toDateObject('/')
            let time = (new Date().format("dd/MM/yyyy") + " " + res.data.data.time).toDateObject('/')
            this.setState({
                note: res.data.data.note,
                isMedicineTime: res.data.data.isMedicineTime ? true : false,
                timeAlarm: res.data.data.medicineTime,
                suggestions: res.data.data.suggestions,
                date: res.data.data.time,
                dob: time,
                dobAlarm: medicineTime,
                appointmentDate: res.data.data.appointmentDate
            })
        }).catch(err => {
            console.log(err);
        })
    }
    setDate(newDate) {
        this.setState({ dob: newDate, date: newDate.format("dd/MM/yyyy") }, () => {
        });
    }
    onDayPress(day) {

        if (this.state.histories[day.dateString]) {
            let histories = JSON.parse(JSON.stringify(this.state.histories));
            if (this.state.dateSelected && histories[this.state.dateSelected]) {
                delete histories[this.state.dateSelected].selected;
            }
            histories[day.dateString].selected = true;
            this.setState({
                dateSelected: day.dateString,
                histories: histories
            }, () => {
                console.log(day.dateString, histories);
            });
        } else {
            this.setState({
                status: 1,
                isVisible: true
            })
        }
    }
    onPressTime = () => {
        this.setState({ toggelDateTimePickerVisible: true, isTimeAlarm: false })
    }
    onPressTimeAlarm = () => {
        this.setState({ toggelDateTimePickerVisible: true, isTimeAlarm: true })
    }
    onConfirm = (newDate) => {

        !this.state.isTimeAlarm ? this.setState(
            {
                dob: newDate,
                date: newDate.format("HH:mm"),
                toggelDateTimePickerVisible: false
            }, () => {
                let note = this.state.note
                let suggestions = this.state.suggestions
                let time = this.state.dob ? this.state.dob.format('HH:mm:ss') : ''
                let medicineTime = this.state.dobAlarm ? this.state.dobAlarm.format('HH:mm:ss') : ''
                let isMedicineTime = this.state.isMedicineTime ? 1 : 0
                let item = this.props.navigation.state.params.patient
                let id = item.history[0].id
                ehealthProvider.updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id).then(res => {
                }).catch(err => {
                    console.log(err);
                })
            }
        ) : this.setState(
            {
                dobAlarm: newDate,
                timeAlarm: newDate.format("HH:mm"),
                toggelDateTimePickerVisible: false
            }, () => {
                let note = this.state.note
                let suggestions = this.state.suggestions
                let time = this.state.dob ? this.state.dob.format('HH:mm:ss') : ''
                let medicineTime = this.state.dobAlarm ? this.state.dobAlarm.format('HH:mm:ss') : ''
                let isMedicineTime = this.state.isMedicineTime ? 1 : 0
                let item = this.props.navigation.state.params.patient
                let id = item.history[0].id
                ehealthProvider.updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id).then(res => {
                }).catch(err => {
                    console.log(err);
                })
            }
        );


    }

    onSetAlarm = () => {
        if (this.state.switchValue) {
            this.setState({
                switchValue: false
            }, () => {
                let note = this.state.note
                let suggestions = this.state.suggestions
                let time = this.state.dob ? this.state.dob.format('HH:mm:ss') : ''
                let medicineTime = this.state.dobAlarm ? this.state.dobAlarm.format('HH:mm:ss') : ''
                let isMedicineTime = 0
                let item = this.props.navigation.state.params.patient
                let id = item.history[0].id
                ehealthProvider.updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id).then(res => {
                })
            })

        } else {
            this.setState({
                switchValue: true
            }, () => {
                ReactNativeAN.scheduleAlarm(alarmNotifData);
                let note = this.state.note
                let suggestions = this.state.suggestions
                let time = this.state.dob ? this.state.dob.format('HH:mm:ss') : ''
                let medicineTime = this.state.dobAlarm ? this.state.dobAlarm.format('HH:mm:ss') : ''
                let isMedicineTime = 1
                let item = this.props.navigation.state.params.patient
                let id = item.history[0].id
                ehealthProvider.updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id).then(res => {

                }).catch(err => {
                    console.log(err);
                })
            })

        }
    }
    onBlur = () => {
        let note = this.state.note
        let suggestions = this.state.suggestions
        let time = this.state.dob ? this.state.dob.format('HH:mm:ss') : ''
        let medicineTime = this.state.dobAlarm ? this.state.dobAlarm.format('HH:mm:ss') : ''
        let isMedicineTime = this.state.isMedicineTime ? 1 : 0
        let item = this.props.navigation.state.params.patient
        let id = item.history[0].id
        console.log(this.state.dobAlarm, this.state.dob, 'timetimetime');
        ehealthProvider.updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id).then(res => {

        }).catch(err => {
            console.log(err);
        })
    }
    renderTextContent = () => {
        switch (this.state.status) {
            case 1: return (
                <Text style={{ textAlign: 'center', marginVertical: 20, marginHorizontal: 10 }}>{constants.msg.ehealth.not_result_of_this_date}</Text>
            )
            case 2: return (
                <Text style={{ textAlign: 'center', marginVertical: 20, marginHorizontal: 10 }}>{constants.msg.ehealth.re_examination_in_date + this.state.reCheckDate.toDateObject('-').format('dd/MM/yyyy') + '!'}</Text>
            )
            case 3: return (
                <Text style={{ textAlign: 'center', marginVertical: 20, marginHorizontal: 10 }}>{constants.msg.ehealth.examination_in_date}</Text>
            )
            case 4: return (
                <Text style={{ textAlign: 'center', marginVertical: 20, marginHorizontal: 10 }}>{constants.msg.ehealth.not_re_examination}</Text>
            )
            case 5: return (
                <Text style={{ textAlign: 'center', marginVertical: 20, marginHorizontal: 10 }}>{constants.msg.ehealth.not_examination}</Text>
            )
            default: return (
                <Text style={{ textAlign: 'center', marginVertical: 20, marginHorizontal: 10 }}>{constants.msg.ehealth.not_examination}</Text>
            )
        }
    }
    viewResult() {
        this.props.navigation.navigate("viewInDay", {
            dateSelected: this.state.dateSelected
        });
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Y BẠ ĐIỆN TỬ"
                icBack={require('@images/new/left_arrow_white.png')}
                iosBarStyle={'dark-content'}
                isLoading={this.state.isLoading}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#22b060"
                actionbarStyle={{
                    backgroundColor: '#22b060',
                    borderBottomWidth: 0
                }}
                titleStyle={{
                    color: '#FFF'
                }}
            >
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                        <Calendar style={{ marginBottom: 3, backgroundColor: "#FFF", width: '100%' }}
                            // markedDates={this.state.listSchedule}
                            current={this.state.latestTime.format("yyyy-MM-dd")}
                            // onDayPress={(day) => { console.log('selected day', day) }}
                            onDayLongPress={(day) => { console.log('selected day', day) }}
                            monthFormat={'MMMM - yyyy'}
                            onMonthChange={(month) => { console.log('month changed', month) }}
                            hideArrows={true}
                            hideExtraDays={true}
                            onDayPress={(day) => { this.onDayPress(day) }}
                            // monthFormat={'MMMM - yyyy'}
                            // onMonthChange={(month) => { this.onMonthChange(month, true) }}
                            firstDay={1}
                            markedDates={this.state.histories}
                        />
                        <TouchableOpacity onPress={this.viewResult.bind(this)} style={styles.viewBtn}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>KẾT QUẢ KHÁM</Text>
                        </TouchableOpacity>
                        <Card style={styles.cardView}>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <View style={styles.viewLine}></View>
                                <TextInput onBlur={this.onBlur} multiline={true} onChangeText={s => {
                                    this.setState({ suggestions: s })
                                }} value={this.state.suggestions} underlineColorAndroid={'#fff'} style={{ marginLeft: 5, color: '#9caac4', width: 200, fontSize: 18 }} placeholder={'Bạn cần làm gì?'}></TextInput>
                            </View>
                            <Text style={{ color: '#bdc6d8', fontSize: 15 }}>Suggestion</Text>
                            <View style={styles.viewBTnSuggest}>
                                <TouchableOpacity style={[styles.btnReExamination, { backgroundColor: '#4CD565', }]}>
                                    <Text style={{ color: '#fff', padding: 2 }}>Lịch tái khám</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnReExamination, { backgroundColor: '#2E66E7', }]}>
                                    <Text style={{ color: '#fff', padding: 2 }}>Chia sẻ y bạ</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 1, backgroundColor: '#97979710', marginVertical: 10 }} />
                            <View>
                                <Text style={styles.txLabel}>Ghi chú</Text>
                                <TextInput onBlur={this.onBlur} multiline={true} onChangeText={s => {
                                    this.setState({ note: s })
                                }} value={this.state.note} underlineColorAndroid={'#fff'} style={[styles.txContent, { height: 41 }]} placeholder={'Nhập ghi chú'}></TextInput>
                            </View>
                            <View>
                                <Text style={styles.txLabel}>Thời gian</Text>
                                <TouchableOpacity onPress={this.onPressTime}><Text style={styles.txContent}>{this.state.date ? (new Date().format("dd/MM/yyyy") + " " + this.state.date).toDateObject('/').format('HH:mm') : 'Chọn giờ'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View >
                                    <Text style={styles.txLabel}>Nhắc uống thuốc</Text>
                                    <TouchableOpacity onPress={this.onPressTimeAlarm}><Text style={styles.txContent}><Text style={styles.txContent}>{this.state.timeAlarm ? (new Date().format("dd/MM/yyyy") + " " + this.state.timeAlarm).toDateObject('/').format('HH:mm') : 'Chọn giờ'}</Text></Text></TouchableOpacity>
                                </View>
                                <Switch onValueChange={this.onSetAlarm} trackColor={{
                                    true: "yellow",
                                    false: "purple",
                                }}
                                    value={this.state.switchValue} ></Switch>
                            </View>
                        </Card>
                    </View>
                    <View style={{ height: 50 }}></View>
                </ScrollView>
                <DateTimePicker
                    mode={'time'}
                    isVisible={this.state.toggelDateTimePickerVisible}
                    onConfirm={newDate => this.onConfirm(newDate)}
                    onCancel={() => {
                        this.setState({ toggelDateTimePickerVisible: false });
                    }}
                    date={new Date()}
                    maximumDate={new Date()}
                    cancelTextIOS={"Hủy bỏ"}
                    confirmTextIOS={"Xác nhận"}
                    date={this.state.dob || new Date()}
                />
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={() => this.setState({ isVisible: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <View style={{ backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 60, borderRadius: 5 }}>
                        <Text style={{ fontSize: 22, color: '#27AE60', textAlign: 'center', marginTop: 10, marginHorizontal: 20 }}>Thông báo</Text>
                        {this.renderTextContent(1)}
                        <TouchableOpacity onPress={() => this.setState({ isVisible: false })} style={{ justifyContent: 'center', alignItems: 'center', height: 41, backgroundColor: '#878787', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}><Text style={{ color: '#fff' }}>OK, XONG</Text></TouchableOpacity>
                    </View>
                </Modal>
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
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
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(ListProfileScreen);