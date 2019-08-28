import React, { Component, PropTypes, PureComponent } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, TextInput, Switch, Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';
import constants from '@resources/strings';
import dateUtils from 'mainam-react-native-date-utils';
import snackbar from '@utils/snackbar-utils';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Card, Icon } from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import { Notification, NotificationOpen } from 'react-native-firebase';
import DateTimePicker from "mainam-react-native-date-picker";
import TextField from "mainam-react-native-form-validate/TextField";
import ehealthProvider from '@data-access/ehealth-provider';
import bookingProvider from '@data-access/booking-provider';
import resultUtils from './utils/result-utils';
import ExportPDF from '@components/ehealth/ExportPDF';
import firebase from 'react-native-firebase';
import connectionUtils from '@utils/connection-utils';
import ScaledImage from 'mainam-react-native-scaleimage';

const DEVICE_WIDTH = Dimensions.get('window').width;
LocaleConfig.locales['en'] = {
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    monthNamesShort: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'],
    dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7']
};

LocaleConfig.defaultLocale = 'en';

class ListProfileScreen extends Component {

    constructor(props) {
        super(props)
        console.log(this.props, 'view in month')
        let patient = this.props.ehealth.patient;
        patient.history = (patient.history || []).sort((a, b) => {
            a.timeGoIn && b.timeGoIn ? a.timeGoIn.toDateObject("-") - b.timeGoIn.toDateObject("-") : ''
        });

        let latestTime = patient.latestTime ? patient.latestTime.toDateObject("-") : new Date()
        let histories = this.groupHistory(patient.history, latestTime);
        let dateSelected = "";
        if (latestTime) {
            dateSelected = latestTime.format("yyyy-MM-dd");
            if (!histories[dateSelected]) {
                if (patient.history && patient.history.length && patient.history[patient.history.length - 1].timeGoIn) {
                    dateSelected = patient.history[patient.history.length - 1].timeGoIn.toDateObject("-").format("yyyy-MM-dd")
                    histories[dateSelected].selected = true;

                } else
                    dateSelected = "";
            }
            else {
                histories[dateSelected].selectedColor = '#27ae60';
            }
        }
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
            dataPatient: '',
            dateSelected,
            isVisible: false,
            hasResult: true

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
                        selectedColor: '#27ae60'
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
    onAlarm = (fire_date, patientHistoryId, hospitalId) => {
        if (fire_date < new Date().getTime())
            return;
        console.log('runnnnnn')
        const notification = new firebase.notifications.Notification().setNotificationId('alarm_id')
            .setBody('Đã đến giờ uống thuốc')
            .setTitle('Isofh-Care')
            .android.setChannelId("isofh-care-channel")
            .android.setSmallIcon("ic_launcher")
            .setSound("default")
            .setData({
                id: 6,
                type: -1,
                patientHistoryId: patientHistoryId,
                hospitalId: hospitalId
            });

        firebase.notifications().scheduleNotification(notification, {
            fireDate: fire_date,
            id: "alarm_notification",
            push_type: 'alarm',
            large_icon: 'ic_launcher',
            repeat_interval: "day",
            vibrate: 500,
            title: 'Hello',
            sub_text: 'sub text',
            priority: "high",
            show_in_foreground: true,
            wake_screen: true,
            extra1: { a: 1 },
            extra2: 1
        })

    }
    onGetDetails = () => {
        let patientHistoryId = this.state.patient.patientHistoryId;
        let hospitalId = this.state.patient.hospitalEntity.id;
        bookingProvider.detailPatientHistory(patientHistoryId, hospitalId).then(res => {
            let medicineTime = res.data.data.medicineTime ? (new Date().format("yyyy/MM/dd") + " " + res.data.data.medicineTime).toDateObject('/') : ''
            console.log(medicineTime, 'medicineTime')
            let time = res.data.data.time ? (new Date().format("yyyy/MM/dd") + " " + res.data.data.time).toDateObject('/') : ''
            this.setState({
                note: res.data.data.note,
                switchValue: res.data.data.isMedicineTime ? true : false,
                timeAlarm: res.data.data.medicineTime,
                suggestions: res.data.data.suggestions,
                date: res.data.data.time,
                dob: time,
                dataPatient: res.data.data,
                dobAlarm: medicineTime,
                appointmentDate: res.data.data.appointmentDate,
            })
            // let date = new Date().getDate()
            // let month = new Date().getMonth() + 1
            // let year = new Date().getFullYear()
            // let fire_date = medicineTime ? `${date}-${month}-${year} ${medicineTime.format('HH:mm:ss')}` : ''
            medicineTime && medicineTime.setMinutes(medicineTime.getMinutes());
            res.data.data.isMedicineTime && this.onAlarm(medicineTime.getTime(), patientHistoryId, hospitalId)

        }).catch(err => {
            console.log(err);
        })
    }
    setDate(newDate) {
        this.setState({ dob: newDate, date: newDate.format("dd/MM/yyyy") }, () => {
        });
    }


    onDayPress(day) {
        if (day && this.state.histories[day.dateString]) {
            let histories = JSON.parse(JSON.stringify(this.state.histories));
            if (this.state.dateSelected && histories[this.state.dateSelected]) {
                delete histories[this.state.dateSelected].selected;
            }
            histories[day.dateString].selected = true;
            histories[day.dateString].selectedColor = '#27ae60'
            let patientHistoryId = histories[day.dateString].history.patientHistoryId
            let hospitalId = this.state.patient.hospitalEntity.id
            bookingProvider.detailPatientHistory(patientHistoryId, hospitalId).then(res => {
                let medicineTime = res.data.data.medicineTime ? (new Date().format("yyyy/MM/dd") + " " + res.data.data.medicineTime).toDateObject('/') : ''
                let time = res.data.data.time ? (new Date().format("yyyy/MM/dd") + " " + res.data.data.time).toDateObject('/') : ''
                this.setState({
                    note: res.data.data.note,
                    switchValue: res.data.data.isMedicineTime ? true : false,
                    timeAlarm: res.data.data.medicineTime,
                    suggestions: res.data.data.suggestions,
                    date: res.data.data.time,
                    dob: time,
                    dobAlarm: medicineTime,
                    dataPatient: res.data.data,
                    appointmentDate: res.data.data.appointmentDate
                })

                medicineTime && medicineTime.setMinutes(medicineTime.getMinutes())
                let dataAlarm = this.state.dobAlarm;
                if (dataAlarm.getMinutes)
                    dataAlarm.setMinutes(dataAlarm.getMinutes());
                res.data.data.isMedicineTime &&
                    this.onAlarm(dataAlarm.getTime(), patientHistoryId, hospitalId)
            }).catch(err => {
                console.log(err);
            })

            this.setState({
                hasResult: true,
                dateSelected: day.dateString,
                histories: histories,
            }, () => {

            });
        } else {
            this.setState({
                hasResult: false,
            });
            snackbar.show(this.renderTextError(1), "danger");
        }
    }
    onPressTime = () => {
        this.setState({ toggelDateTimePickerVisible: true, isTimeAlarm: false })
    }
    onPressTimeAlarm = () => {
        this.setState({ toggelDateTimePickerVisible: true, isTimeAlarm: true })
    }
    onConfirm = (newDate) => {
        console.log(newDate, 'newDate')

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
                let histories = JSON.parse(JSON.stringify(this.state.histories));
                let id = this.state.dateSelected ? histories[this.state.dateSelected].history.id : histories[this.state.latestTime.format("yyyy-MM-dd")].history.id
                ehealthProvider.updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id).then(res => {
                }).catch(err => {
                    console.log(err);
                })
            }
        ) : this.setState(
            {
                dobAlarm: newDate,
                timeAlarm: newDate.format("HH:mm"),
                toggelDateTimePickerVisible: false,
                switchValue: false
            }, () => {
                let note = this.state.note
                let suggestions = this.state.suggestions
                let time = this.state.dob ? this.state.dob.format('HH:mm:ss') : ''
                let medicineTime = this.state.dobAlarm ? this.state.dobAlarm.format('HH:mm:ss') : ''
                let isMedicineTime = this.state.isMedicineTime ? 1 : 0
                let histories = JSON.parse(JSON.stringify(this.state.histories));

                let id = this.state.dateSelected ? histories[this.state.dateSelected].history.id : histories[this.state.latestTime.format("yyyy-MM-dd")].history.id
                ehealthProvider.updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id).then(res => {
                }).catch(err => {
                    console.log(err);
                })
            }
        );


    }
    onSetDate = () => {
        let fireDate = (new Date().format("dd/MM/yyyy") + " " + this.state.dobAlarm).toDateObject('/')
    }
    onSetAlarm = () => {

        if (this.state.dobAlarm) {
            if (this.state.switchValue) {
                this.setState({
                    switchValue: false
                }, () => {
                    let note = this.state.note
                    let suggestions = this.state.suggestions
                    let time = this.state.dob ? this.state.dob.format('HH:mm:ss') : ''
                    let medicineTime = this.state.dobAlarm ? this.state.dobAlarm.format('HH:mm:ss') : ''
                    let isMedicineTime = 0
                    let histories = JSON.parse(JSON.stringify(this.state.histories));
                    let id = this.state.dateSelected ? histories[this.state.dateSelected].history.id : histories[this.state.latestTime.format("yyyy-MM-dd")].history.id
                    ehealthProvider.updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id).then(res => {

                    })
                })

            } else {
                this.setState({
                    switchValue: true
                }, () => {
                    let note = this.state.note
                    let suggestions = this.state.suggestions
                    let time = this.state.dob ? this.state.dob.format('HH:mm:ss') : ''
                    let medicineTime = this.state.dobAlarm ? this.state.dobAlarm.format('HH:mm:ss') : ''
                    let isMedicineTime = 1
                    let histories = JSON.parse(JSON.stringify(this.state.histories));
                    let id = this.state.dateSelected ? histories[this.state.dateSelected].history.id : histories[this.state.latestTime.format("yyyy-MM-dd")].history.id
                    let patientHistoryId = this.state.dateSelected ? histories[this.state.dateSelected].history.patientHistoryId : histories[this.state.latestTime.format("yyyy-MM-dd")].history.patientHistoryId
                    let hospitalId = this.state.patient.hospitalEntity.id
                    ehealthProvider.updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id).then(res => {
                        let time = this.state.dobAlarm.format('HH')
                        let minutes = this.state.dobAlarm.format('mm')
                        let dataAlarm = this.state.dobAlarm;
                        if (dataAlarm.getMinutes)
                            dataAlarm.setMinutes(dataAlarm.getMinutes());
                        this.onAlarm(dataAlarm.getTime(), patientHistoryId, hospitalId)
                    }).catch(err => {
                        console.log(err);
                    })
                })

            }
        } else {
            snackbar.show(constants.msg.ehealth.not_select_time_drug, 'danger');
        }
    }
    onBlur = () => {
        let note = this.state.note
        let suggestions = this.state.suggestions
        let time = this.state.dob ? this.state.dob.format('HH:mm:ss') : ''
        let medicineTime = this.state.dobAlarm ? this.state.dobAlarm.format('HH:mm:ss') : ''
        let isMedicineTime = this.state.isMedicineTime ? 1 : 0
        let histories = JSON.parse(JSON.stringify(this.state.histories));
        let id = this.state.dateSelected ? histories[this.state.dateSelected].history.id : histories[this.state.latestTime.format("yyyy-MM-dd")].history.id
        ehealthProvider.updateDataUSer(note, suggestions, time, medicineTime, isMedicineTime, id).then(res => {

        }).catch(err => {
            console.log(err);
        })
    }
    onPressAppointment = () => {
        if (this.state.appointmentDate) {
            snackbar.show(this.renderTextError(2), "danger");

        } else {
            snackbar.show(this.renderTextError(4), "danger");

        }
    }
    onShareEhealth = () => {
        this.props.navigation.navigate("ehealthSharing", {
            history: this.state.histories[this.state.dateSelected].history
        });
    }
    renderTextError = (status) => {
        switch (status) {
            case 1: return constants.msg.ehealth.not_result_of_this_date;
            case 2: return constants.msg.ehealth.re_examination_in_date + this.state.reCheckDate.toDateObject('-').format('dd/MM/yyyy') + '!';
            case 3: return constants.msg.ehealth.examination_in_date;
            case 4: return constants.msg.ehealth.not_re_examination;
            case 5: return constants.msg.ehealth.not_examination;
            case 6: return "Bạn chưa có kết quả khám ở ngày này!";
            case 7: return "Đã chia sẻ Y bạ thành công!";
            case 8: return "Chưa chia sẻ được!";
            default: return constants.msg.ehealth.not_examination;
        }
    }
    viewResult() {
        connectionUtils.isConnected().then(s => {
            this.setState({
                isLoading: true
            }, () => {
                try {
                    let patientHistoryId = this.state.histories[this.state.dateSelected].history.patientHistoryId;
                    let hospitalId = this.state.patient.hospitalEntity.id;
                    resultUtils.getDetail(patientHistoryId, hospitalId).then(result => {
                        this.setState({
                            isLoading: false
                        }, () => {
                            if (result.hasResult) {
                                this.props.navigation.navigate("viewInDay", {
                                    dateSelected: this.state.dateSelected,
                                    histories: this.state.histories
                                });
                            } else {
                                snackbar.show(this.renderTextError(6), "danger");
                            }
                        });
                    }).catch(err => {
                        this.setState({
                            isLoading: false
                        }, () => {
                            snackbar.show(this.renderTextError(6), "danger");
                        });
                    })
                } catch (error) {
                    this.setState({
                        isLoading: false,
                    }, () => {
                        snackbar.show(this.renderTextError(6), "danger");
                    });
                }
            });
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params && nextProps.navigation.state.params.status) {
            snackbar.show(this.renderTextError(nextProps.navigation.state.params.status), "danger");
            nextProps.navigation.state.params.status = null
        }
    }
    exportPdf() {
        this.setState({
            isLoading: true
        }, () => {
            try {
                let patientHistoryId = this.state.histories[this.state.dateSelected].history.patientHistoryId;
                let hospitalId = this.state.patient.hospitalEntity.id;
                resultUtils.getDetail(patientHistoryId, hospitalId).then(result => {
                    if (result) {
                        result = result.result;
                        result.hospital = this.props.ehealth.hospital.hospital;
                        this.exportPdfCom.getWrappedInstance().exportPdf({
                            type: "all",
                            result: result,
                            fileName: constants.filenamePDF + patientHistoryId
                        }, () => {
                            this.setState({ isLoading: false });
                        });
                    }
                    else {
                        this.setState({ isLoading: false });
                    }
                }).catch(err => {
                    this.setState({ isLoading: false });
                })
            } catch (error) {
                this.setState({ isLoading: false });
            }
        });
    }
    openHistorySharing = () => {
        try {
            if (this.state.histories && this.state.dateSelected) {
                let patientHistoryId = this.state.histories[this.state.dateSelected].history.patientHistoryId;
                this.props.navigation.navigate("historySharing", {
                    patientHistoryId
                });
            }
        } catch (error) {

        }
    }
    selectDate = () => {
        let histories = this.state.histories;
        let latestTime = this.state.latestTime || new Date();
        let start = latestTime.format("yyyy-MM") + "-01";
        let end = latestTime.format("yyyy-MM") + "-31";
        let keys = [];
        for (var key in histories) {
            if (key >= start && key <= end) {
                keys.push(key);
            }
        }
        keys.sort((itema, itemb) => { return itema < itemb ? 1 : -1 });
        if (keys.length) {
            this.onDayPress({
                dateString: keys[0]
            })
        } else {
            this.onDayPress(null);
        }
    }
    showShare = () => {
        this.actionSheetShare.show();
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title={constants.title.ehealth}
                icBack={require('@images/new/left_arrow_white.png')}
                isLoading={this.state.isLoading}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#4BBA7B"
                actionbarStyle={styles.actionbarStyle}
                titleStyle={styles.titleStyle}
                menuButton={this.state.dateSelected ?
                    <TouchableOpacity style={styles.btnShare} onPress={this.showShare}><Icon name='share' style={{ color: '#FFF' }} /></TouchableOpacity> :
                    <TouchableOpacity style={[styles.btnShare, { width: 50 }]} onPress={this.showShare}></TouchableOpacity>}

            >
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View style={styles.viewCalendar}>
                        <View style={{ position: 'relative', left: 0, right: 0, width: DEVICE_WIDTH }}>
                            <Calendar style={styles.calendarStyle}
                                // markedDates={this.state.listSchedule}
                                current={this.state.latestTime.format("yyyy-MM-dd")}
                                // onDayPress={(day) => { console.log('selected day', day) }}
                                onDayLongPress={(day) => { console.log('selected day', day) }}
                                monthFormat={'MMMM - yyyy'}
                                onMonthChange={(month) => {
                                    if (!this.state.latestTime || !this.state.latestTime.format("MMyyyy") != month.month + month.year) {
                                        this.setState({ latestTime: new Date(month.dateString), toggelMonthPicker: false }, () => {
                                            this.selectDate();
                                        })
                                    }
                                }}
                                // hideArrows={true}
                                hideExtraDays={true}
                                onDayPress={(day) => { this.onDayPress(day) }}
                                // monthFormat={'MMMM - yyyy'}
                                // onMonthChange={(month) => { this.onMonthChange(month, true) }}
                                firstDay={1}
                                markedDates={this.state.histories}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ toggelMonthPicker: true })
                                }}
                                style={{ position: 'absolute', top: 0, left: 70, right: 70, height: 60 }}>
                            </TouchableOpacity>
                        </View>
                        {
                            (this.state.dateSelected && this.state.hasResult) &&
                            <React.Fragment>
                                <TouchableOpacity onPress={this.viewResult.bind(this)} style={[styles.viewBtn, { backgroundColor: '#25B05F' }]}>
                                    <Text style={styles.txCheckResult}>{constants.ehealth.checkupResult}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.onPressAppointment} style={styles.viewBtn}>
                                    <Text style={styles.txCheckResult}>{'LỊCH TÁI KHÁM'}</Text>
                                </TouchableOpacity>

                                <Card style={styles.cardView}>

                                    <View>
                                        <Text style={styles.txLabel}>{constants.ehealth.clock}</Text>
                                        <TouchableOpacity onPress={this.onPressTime}><Text style={styles.txContent}>{this.state.date ? (new Date().format("dd/MM/yyyy") + " " + this.state.date).toDateObject('/').format('HH:mm') : 'Chọn giờ'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.viewAlarm}>
                                        <View >
                                            <Text style={styles.txLabel}>{constants.ehealth.redmine_drug}</Text>
                                            <TouchableOpacity onPress={this.onPressTimeAlarm}><Text style={styles.txContent}><Text style={styles.txContent}>{this.state.timeAlarm ? (new Date().format("dd/MM/yyyy") + " " + this.state.timeAlarm).toDateObject('/').format('HH:mm') : 'Chọn giờ'}</Text></Text></TouchableOpacity>
                                        </View>
                                        <Switch onValueChange={this.onSetAlarm} trackColor={{
                                            true: "yellow",
                                            false: "purple",
                                        }}
                                            value={this.state.switchValue} ></Switch>
                                    </View>
                                    <View>
                                        <Text style={styles.txLabel}>{constants.ehealth.note}</Text>
                                        <TextInput onBlur={this.onBlur} multiline={true} onChangeText={s => {
                                            this.setState({ note: s })
                                        }} value={this.state.note} underlineColorAndroid={'#fff'} style={[styles.txContent,]} placeholder={'Nhập ghi chú'}></TextInput>
                                    </View>
                                    <View style={styles.viewSuggest}>
                                        <View style={styles.viewLine}></View>
                                        <TextInput onBlur={this.onBlur} multiline={true} onChangeText={s => {
                                            this.setState({ suggestions: s })
                                        }} value={this.state.suggestions} underlineColorAndroid={'#fff'} style={styles.inputSuggest} placeholder={'Bạn cần làm gì?'}></TextInput>
                                    </View>
                                </Card>
                            </React.Fragment>
                        }
                    </View>
                    <View style={styles.viewSpaceBottom}></View>
                </ScrollView>
                <DateTimePicker
                    mode={'date'}
                    isVisible={this.state.toggelMonthPicker}
                    onConfirm={newDate => {
                        this.setState({ latestTime: newDate, toggelMonthPicker: false }, () => {
                            this.selectDate();
                        })
                    }}
                    onCancel={() => {
                        this.setState({ toggelMonthPicker: false });
                    }}
                    cancelTextIOS={"Hủy bỏ"}
                    confirmTextIOS={"Xác nhận"}
                    date={this.state.latestTime || new Date()}
                />
                <DateTimePicker
                    mode={'time'}
                    isVisible={this.state.toggelDateTimePickerVisible}
                    onConfirm={newDate => this.onConfirm(newDate)}
                    onCancel={() => {
                        this.setState({ toggelDateTimePickerVisible: false });
                    }}
                    cancelTextIOS={"Hủy bỏ"}
                    confirmTextIOS={"Xác nhận"}
                    date={(this.state.isTimeAlarm ? this.state.dobAlarm : this.state.dob) || new Date()}
                />
                <ActionSheet
                    ref={o => this.actionSheetShare = o}
                    options={["Chia sẻ trên hồ sơ iSofHCare", "Chia sẻ trên ứng dụng khác", "Lịch sử chia sẻ", constants.actionSheet.cancel]}
                    cancelButtonIndex={3}
                    destructiveButtonIndex={3}
                    onPress={(index) => {
                        switch (index) {
                            case 0:
                                this.onShareEhealth();
                                break;
                            case 1:
                                this.exportPdf();
                                break;
                            case 2:
                                this.openHistorySharing();


                        }
                    }}
                />
                <ExportPDF ref={(element) => this.exportPdfCom = element} />
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
    titleStyle:
    {
        color: '#FFF', marginLeft: 65
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
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: '#F7685B',
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
        backgroundColor: '#373A3C',
        width: 1,
        height: 30
    },
    viewBTnSuggest: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 40
    },
    btnReExamination: {
        padding: 2, borderRadius: 3, marginRight: 5, marginVertical: 10, paddingHorizontal: 5,
        minWidth: 150
    },
    txLabel: {
        color: '#9caac4',
        fontSize: 15
    },
    txContent: {
        color: '#FF5444',
        marginTop: 5, marginBottom: 25,
    },
    txPopUp: { textAlign: 'center', marginVertical: 20, marginHorizontal: 10 },
    txShareFinish: { textAlign: 'center', marginVertical: 20, marginHorizontal: 10, fontSize: 18 },
    viewShareErr: { flexDirection: 'row', alignItems: 'center', padding: 10 },
    txShareErr: { textAlign: 'center', marginVertical: 20, marginHorizontal: 10, fontSize: 18 },
    actionbarStyle: {
        backgroundColor: '#4BBA7B',
        borderBottomWidth: 0
    },
    viewCalendar: { justifyContent: 'center', flex: 1, alignItems: 'center' },
    calendarStyle: { marginBottom: 3, backgroundColor: "#FFF", width: '100%' },
    txCheckResult: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    viewSuggest: { flexDirection: 'row', marginVertical: 10, alignItems: 'center' },
    inputSuggest: { marginLeft: 5, color: '#9caac4', fontSize: 18, width: '95%' },
    txSuggest: { color: '#bdc6d8', fontSize: 15 },
    txReExamination: { color: '#fff', fontSize: 15, textAlign: 'center', paddingVertical: 10, fontWeight: 'bold' },
    viewBorder: { height: 1, backgroundColor: '#97979710', marginVertical: 10 },
    viewAlarm: { flexDirection: 'row', justifyContent: 'space-between' },
    viewSpaceBottom: { height: 50 },
    viewModal: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    viewPopup: { backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 60, borderRadius: 5 },
    txNotifi: { fontSize: 22, color: '#27AE60', textAlign: 'center', marginTop: 10, marginHorizontal: 20 },
    btnDone: { justifyContent: 'center', alignItems: 'center', height: 41, backgroundColor: '#878787', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 },
    txDone: { color: '#fff' },
    btnShare: {
        paddingHorizontal: 20
    }

});

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(ListProfileScreen);