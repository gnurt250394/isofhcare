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
        this.state = {
            refreshing: false,
            data: [],
            loading: false,
            bookings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            hospitals: [],
            loadFirstTime: true,
            currentDate: new Date(),
        }
    }
    componentDidMount() {
        this.onRefresh();
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
        try {
            // day.timestamp = new Date(day.timestamp.toDateObject().format("MM/dd/yyyy")).getTime();
            // if (!this.props.booking.specialist2) {
            //     snackbar.show(dhyCommand.msg.booking.please_select_service_first);
            //     return;
            // }

            // var schedule = this.getScheduleOnDay(day);
            // if (!schedule || schedule.disabled) {
            //     snackbar.show(dhyCommand.msg.booking.not_found_schedule_of_doctor_in_this_day);
            //     return;
            // }

            // this.props.dispatch({
            //     type: dhyCommand.action.action_select_booking_date
            //     , value: day
            // });

            // var newListScheduleText = JSON.parse(this.state.listScheduleText);

            // var key = day.year + "-" + (day.month < 10 ? "0" : "") + day.month + "-" + (day.day < 10 ? "0" : "") + day.day;
            // if (newListScheduleText[key])
            //     newListScheduleText[key].selected = true;
            // this.setState({
            //     listSchedule: newListScheduleText
            // })
            // this.props.dispatch({
            //     type: dhyCommand.action.action_select_schedule, value: newListScheduleText[key]
            // });

            // this.loadListBooking(day);
        } catch (error) {
            console.log(error)
        }
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
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                        <Calendar style={{ marginBottom: 3, backgroundColor: "#FFF", width: '100%' }}
                            // markedDates={this.state.listSchedule}
                            current={'2012-03-01'}
                            onDayPress={(day) => { console.log('selected day', day) }}
                            onDayLongPress={(day) => { console.log('selected day', day) }}
                            monthFormat={'MMMM - yyyy'}
                            onMonthChange={(month) => { console.log('month changed', month) }}
                            // hideArrows={true}
                            hideExtraDays={true}
                            // onDayPress={(day) => { this.onDayPress(day) }}
                            // monthFormat={'MMMM - yyyy'}
                            // onMonthChange={(month) => { this.onMonthChange(month, true) }}
                            firstDay={1}
                            // hideExtraDays={true}
                            markingType={'multi-dot'}
                            markedDates={{
                                '2012-05-16': { selected: true, marked: true, selectedColor: 'blue' },
                                '2012-05-17': { marked: true },
                                '2012-05-18': { marked: true, dotColor: 'red', activeOpacity: 0 },
                                '2012-05-19': { disabled: true, disableTouchEvent: true }
                            }}
                        />
                        <TouchableOpacity style={styles.viewBtn}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>KẾT QUẢ KHÁM</Text>
                        </TouchableOpacity>
                        <Card style={styles.cardView}>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <View style={styles.viewLine}></View>
                                <Text style={{ marginLeft: 5, color: '#9caac4', fontSize: 18 }}>Bạn cần làm gì</Text>
                            </View>
                            <Text style={{ color: '#bdc6d8', fontSize: 15 }}>Suggestion</Text>
                            <View style={styles.viewBTnSuggest}>
                                <TouchableOpacity style={[styles.btnReExamination, { backgroundColor: '#4CD565', }]}>
                                    <Text style={{ color: '#fff', padding: 2 }}>Lịch tái khám</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnReExamination, { backgroundColor: '#00B1FF', }]}>
                                    <Text style={{ color: '#fff', padding: 2 }}>Khám lại</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnReExamination, { backgroundColor: '#2E66E7', }]}>
                                    <Text style={{ color: '#fff', padding: 2 }}>Chia sẻ y bạ</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 1, backgroundColor: '#97979710', marginVertical: 10 }} />
                            <View>
                                <Text style={styles.txLabel}>Ghi chú</Text>
                                <TextInput multiline={true} underlineColorAndroid={'#fff'} style={[styles.txContent, { height: 41 }]} placeholder={'Nhập ghi chú'}></TextInput>
                            </View>
                            <View>
                                <Text style={styles.txLabel}>Thời gian</Text>
                                <TouchableOpacity><Text style={styles.txContent}>06:00 AM</Text></TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View >
                                    <Text style={styles.txLabel}>Nhắc uống thuốc</Text>
                                    <TouchableOpacity><Text style={styles.txContent}>08:30</Text></TouchableOpacity>
                                </View>
                                <Switch onValueChange={this.onSetAlarm} trackColor={{
                                    true: "yellow",
                                    false: "purple",
                                }}
                                    value={this.state.switchValue} ></Switch>
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </ActivityPanel >
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
        width: 350,
        maxWidth: DEVICE_WIDTH - 50,
        borderRadius: 5,
        height: 365,
        padding: 25,
    },
    viewLine: {
        backgroundColor: '#4CD565',
        height: '100%',
        width: 1
    },
    viewBTnSuggest: {
        flexDirection: 'row'
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