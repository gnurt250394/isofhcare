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
class ListProfileScreen extends PureComponent {
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
            histories
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
        this.onRefresh();
    }
    setDate(newDate) {
        this.setState({ dob: newDate, date: newDate.format("dd/MM/yyyy") }, () => {
        });
    }

    getListBooking(hospitalId) {
        if (this.state.profile && this.state.profile.profile) {
            bookingProvider.getListBooking(this.state.profile.profile.id, hospitalId).then(s => {
                if (s.code == 0) {
                    let data = [...s.data.bookingNotInHis, ...s.data.patientHistorys];
                    this.setState({
                        bookings: data,
                        refreshing: false
                    })
                }
            }).catch(e => {
                this.setState({
                    refreshing: false
                })
            });
        } else {
            this.setState({
                refreshing: false
            })
        }
    }

    onRefresh() {
        this.setState({ refreshing: true }, () => {
            hospitalProvider.getByProfile().then(s => {
                if (s.code == 0) {
                    this.setState({ hospitals: (s.data || []) }, () => {
                        profileProvider.getByUserPromise(this.props.userApp.currentUser.id).then(s => {
                            this.setState({ profile: s }, () => {
                                this.getListBooking(this.state.hospitalId);
                            })
                        }).catch(e => {
                            this.setState({ refreshing: false });
                        })
                    });
                }
                else {
                    this.setState({ refreshing: false });
                }
            }).catch(e => {
                this.setState({ refreshing: false });
            });
        })
    }

    openBookingInHis(booking) {
        // this.setState({ isLoading: true }, () => {
        bookingProvider.detailPatientHistory(booking.patientHistory.patientHistoryId, booking.hospital ? booking.hospital.id : "");
        booking.patientHistory.hasCheckin = true;
        this.props.navigation.navigate("ehealthDHY", { booking: booking.patientHistory, hospital: booking.hospital })
    }
    openBooking(booking, hospitalId) {
        this.props.dispatch({ type: constants2.action.action_select_hospital, value: hospitalId });
        booking.hasCheckin = false;
        booking.hospitalId = hospitalId;
        this.props.navigation.navigate("ehealthDHY", { booking })
    }

    renderItemProfile(item, index) {
        const source = require("@images/new/user.png");

        return <TouchableOpacity style={{}}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center', padding: 10 }}>
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={{ borderRadius: 30, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' }}
                        borderRadius={30}
                        customImagePlaceholderDefaultStyle={[styles.avatar, { width: 60, height: 60 }]}
                        placeholderSource={require("@images/new/user.png")}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={{
                            alignSelf: 'center',
                            borderRadius: 30,
                            width: 60,
                            height: 60
                        }}
                        defaultImage={() => {
                            return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
                        }}
                    />
                    <Text style={{ color: '#758289' }}>1000000</Text>
                </View>

                <View style={{ flex: 1, borderRightColor: '#c8d1d6', borderRightWidth: 1, paddingVertical: 10 }}>
                    <View style={{ marginHorizontal: 10, position: 'relative', paddingHorizontal: 30 }}>
                        <View style={{ position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, backgroundColor: '#91a3ad' }}></View>
                        <View style={{ width: 20, height: 20, borderWidth: 1.5, borderColor: '#91a3ad', borderRadius: 10, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, top: 0, backgroundColor: '#FFF' }}>
                            <View style={{ width: 8, height: 8, backgroundColor: '#7eac39', borderRadius: 4 }}></View>
                        </View>
                        <View style={{ width: 20, height: 20, borderWidth: 1.5, borderColor: '#91a3ad', borderRadius: 10, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, bottom: 0, backgroundColor: '#FFF' }}>
                            <View style={{ width: 8, height: 8, backgroundColor: '#c84242', borderRadius: 4 }}></View>
                        </View>
                        <Text style={{ fontWeight: 'bold', color: '#63737a' }}>MAI NGỌC NAM</Text>
                        <Text style={{ marginTop: 10 }}>BỆNH VIỆN E</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10, alignItems: 'center' }}>
                        <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={20} />
                        <Text style={{ marginLeft: 5, color: '#33799e' }}>Gần nhất: 19/8/2019</Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'red', fontSize: 30 }}>03</Text>
                    <Text>lần</Text>
                </View>
            </View>
            <View style={{ height: 1, backgroundColor: '#00000050' }} />
        </TouchableOpacity>
    }


    onDayPress(day) {
        this.setState({
            dateSelected: { [day.dateString]: { selected: true, selectedColor: '#27AE60' } }

        }, () => {
            this.setState({
                dateString: day.dateString
            })
            // try {
            //     day.timestamp = new Date(day.timestamp.toDateObject().format("MM/dd/yyyy")).getTime();
            //     if (!this.props.booking.specialist2) {
            //         snackbar.show(dhyCommand.msg.booking.please_select_service_first);
            //         return;
            //     }

            //     var schedule = this.getScheduleOnDay(day);
            //     if (!schedule || schedule.disabled) {
            //         snackbar.show(dhyCommand.msg.booking.not_found_schedule_of_doctor_in_this_day);
            //         return;
            //     }

            //     this.props.dispatch({
            //         type: dhyCommand.action.action_select_booking_date
            //         , value: day
            //     });

            //     var newListScheduleText = JSON.parse(this.state.listScheduleText);

            //     var key = day.year + "-" + (day.month < 10 ? "0" : "") + day.month + "-" + (day.day < 10 ? "0" : "") + day.day;
            //     if (newListScheduleText[key])
            //         newListScheduleText[key].selected = true;
            //     this.setState({
            //         listSchedule: newListScheduleText
            //     })
            //     this.props.dispatch({
            //         type: dhyCommand.action.action_select_schedule, value: newListScheduleText[key]
            //     });

            //     this.loadListBooking(day);
        })

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
            },
        ) : this.setState(
            {
                dobAlarm: newDate,
                timeAlarm: newDate.format("HH:mm"),
                toggelDateTimePickerVisible: false
            },
        );
    }
    onClickResult = () => {
        // this.setState({
        //     isVisible: true
        // })
        // let note = this.state.note
        // let suggestions = this.state.suggestions
        // let time = this.state.dob ?  this.state.dob.format('HH:mm:ss') : ''
        // let medicineTime = this.state.dobAlarm ? this.state.dobAlarm.format('HH:mm:ss'):''
        // let isMedicineTime = this.state.isMedicineTime ? 1: 0
        // let id = this.props.userApp.currentUser.id
        // ehealthProvider.updateDataUSer(note,suggestions,time,medicineTime,isMedicineTime,id).then(res => {
        //     console.log(res);
        // }).catch(err =>{
        //     console.log(err);
        // })
        // let appointmentDate = this.state.dateString ? this.state.dateString : this.state.lastDate
        // let reCheckDate = ""
        let lastDate = this.state.lastDate ? this.state.lastDate.toDateObject('-').format('dd/MM/yyyy') : null
        let dateSelected = this.state.dateString ? this.state.dateString.toDateObject('-').format('dd/MM/yyyy') : null
        let hospitalId = this.props.navigation.state.params.hospitalId
        let patientHistoryId = this.props.navigation.state.params.patientHistoryId
        ehealthProvider.detailPatientHistory(patientHistoryId, hospitalId).then(res => {
            if (res.data.appointmentDate == null) {
                this.setState({
                    isVisible: true,
                    status: 1,
                })
                return
            }
            if (res.data.reCheckDate == null) {
                this.setState({
                    isVisible: true,
                    status: 5,
                })
                return
            }

            if (!dateSelected && res.data.appointmentDate.toDateObject('-').format('dd/MM/yyyy') == lastDate || dateSelected && res.data.appointmentDate.toDateObject('-').format('dd/MM/yyyy') == dateSelected) {
                this.props.navigation.navigate('viewInDay')
                return
            } if (res.data.appointmentDate == null && res.data.reCheckDate) {
                this.setState({
                    status: 2,
                    reCheckDate: res.data.reCheckDate
                })
                return
            }
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
    render() {
        console.log(this.state.lastDate ? this.state.lastDate.toDateObject('-').format('yyyy-MM-dd') : '');
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
                        <TouchableOpacity onPress={this.onClickResult} style={styles.viewBtn}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>KẾT QUẢ KHÁM</Text>
                        </TouchableOpacity>
                        <Card style={styles.cardView}>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <View style={styles.viewLine}></View>
                                <TextInput multiline={true} onChangeText={s => {
                                    this.setState({ suggestion: s })
                                }} value={this.state.suggestion} underlineColorAndroid={'#fff'} style={{ marginLeft: 5, color: '#9caac4', height: 41, width: 200, fontSize: 18 }} placeholder={'Bạn cần làm gì?'}></TextInput>
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
                                <TextInput multiline={true} onChangeText={s => {
                                    this.setState({ note: s })
                                }} value={this.state.note} underlineColorAndroid={'#fff'} style={[styles.txContent, { height: 41 }]} placeholder={'Nhập ghi chú'}></TextInput>
                            </View>
                            <View>
                                <Text style={styles.txLabel}>Thời gian</Text>
                                <TouchableOpacity onPress={this.onPressTime}><Text style={styles.txContent}>{this.state.date ? this.state.date : 'Chọn giờ'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View >
                                    <Text style={styles.txLabel}>Nhắc uống thuốc</Text>
                                    <TouchableOpacity onPress={this.onPressTimeAlarm}><Text style={styles.txContent}><Text style={styles.txContent}>{this.state.timeAlarm ? this.state.timeAlarm : 'Chọn giờ'}</Text></Text></TouchableOpacity>
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