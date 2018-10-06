import React, { Component } from 'react'
// import { Actions } from '';
import { connect } from 'react-redux';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';
import dhyCommand from '@dhy/strings';
import dateUtils from 'mainam-react-native-date-utils';
import snackbar from '@utils/snackbar-utils';

class DoctorTime extends Component {
    Actions;
    constructor(props) {
        super(props);
        var timeString = JSON.stringify({
            am: [
                {
                    time: "06:00",
                    label: "6h00",
                    value: 360,
                    count: 0, allowBooking: true, isAvailable: true
                },
                {
                    time: "06:30",
                    label: "6h30",
                    value: 390,
                    count: 0, allowBooking: true, isAvailable: true
                },
                {
                    time: "07:00",
                    label: "7h00",
                    value: 420,
                    count: 0, allowBooking: true, isAvailable: true
                },
                {
                    time: "07:30",
                    label: "7h30",
                    value: 450,
                    count: 0, allowBooking: true, isAvailable: true
                },
                {
                    time: "08:00",
                    label: "8h00",
                    value: 480,
                    count: 0, allowBooking: true, isAvailable: true
                },
                {
                    time: "08:30",
                    label: "8h30",
                    value: 510,
                    count: 0, allowBooking: true, isAvailable: true
                }, {
                    time: "09:00",
                    label: "9h00",
                    value: 540,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "09:30",
                    label: "9h30",
                    value: 570,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "10:00",
                    label: "10h00",
                    value: 600,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "10:00",
                    label: "10h30",
                    value: 630,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "11:00",
                    label: "11h00",
                    value: 660,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "11:30",
                    label: "11h30",
                    value: 690,
                    count: 0, allowBooking: true, isAvailable: true
                }
            ],
            pm: [
                {
                    time: "13:30",
                    label: "13h30",
                    value: 810,
                    count: 0, allowBooking: true, isAvailable: true
                }, {
                    time: "14:00",
                    label: "14h00",
                    value: 840,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "14:30",
                    label: "14h30",
                    value: 870,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "15:00",
                    label: "15h00",
                    value: 900,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "15:30",
                    label: "15h30",
                    value: 930,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "16:00",
                    label: "16h00",
                    value: 960,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "16:30",
                    label: "16h30",
                    value: 990,
                    count: 0, allowBooking: true, isAvailable: true
                }
                , {
                    time: "17:00",
                    label: "17h00",
                    value: 1020,
                    count: 0, allowBooking: true, isAvailable: true
                }

            ]
        });
        this.state = {
            doctor: props.doctor,
            timeString: timeString,
            time: JSON.parse(timeString),
            bookingInSchedule: {}
        }

    }

    checkAllowThisTime(time) {
        if (this.props.booking.schedule) {
            for (var i = 0; i < this.props.booking.schedule.dots.length; i++) {
                var item = this.props.booking.schedule.dots[i].schedule;

                if (time.value >= item.schedule.startWorking && time.value <= item.schedule.endWorking) {
                    time.numberCase = item.schedule.numberCase;
                    time.service = item.service;
                    return true;
                }
            }
        }
        return false;
    }

    checkTimeAvailable(date, time) {
        var currentTime = new Date().getTime();
        // alert((date + (time * 60) * 1000) + "\n" + currentTime)
        return !((date + (time * 60) * 1000) <= currentTime);
    }

    analyzeDoctorTime(listBooking) {
        var time = JSON.parse(this.state.timeString);
        var bookingInSchedule = {}
        var isToday = this.props.booking.date ? this.props.booking.date.dateString == new Date().format("yyyy-MM-dd") : false;

        for (var i = 0; i < listBooking.bookings.length; i++) {
            var item = listBooking.bookings[i];
            var dateFormat = new Date(item.booking.bookingTime).format("HH:mm")
            if (!bookingInSchedule[dateFormat])
                bookingInSchedule[dateFormat] = [];
            bookingInSchedule[dateFormat].push(item);
        }
        // check buoi sang 
        for (var i = 0; i < time.am.length; i++) {
            var item = time.am[i];
            if (isToday) {
                item.isAvailable = this.checkTimeAvailable(this.props.booking.date.timestamp, item.value);
            }
            item.allowBooking = this.checkAllowThisTime(item);
            if (bookingInSchedule[item.time])
                item.count = bookingInSchedule[item.time].length;
        }
        // check buoi chieu
        for (var i = 0; i < time.pm.length; i++) {
            var item = time.pm[i];
            if (isToday) {
                item.isAvailable = this.checkTimeAvailable(this.props.booking.date.timestamp, item.value);
            }
            item.allowBooking = this.checkAllowThisTime(item);
            if (bookingInSchedule[item.time])
                item.count = bookingInSchedule[item.time].length;
        }
        
        this.setState({ time });
    }

    click(item) {
        if (!item.isAvailable) {
            snackbar.show(dhyCommand.msg.booking.cannot_booking_in_this_time);
            return;
        }
        if (!item.allowBooking) {
            snackbar.show(dhyCommand.msg.booking.not_allow_booking_in_this_time);
            return;
        }
        if (item.count >= item.numberCase) {
            snackbar.show(dhyCommand.msg.booking.maximum_booking_count_in_this_time);
            return;
        }
        this.props.dispatch({
            type: dhyCommand.action.action_select_booking_time,
            value: item
        })
        // Test 
        // if (!this.props.userApp.isLogin) {
        //     this.props.dispatch({ type: dhyCommand.action.action_set_pending_booking, value: true });
        //     this.props.
        //     Actions.login({ directScreen: () => { Actions.popTo('viewScheduleDoctor') } });
        // }
        // else {
            // Actions.addBooking();
        // }
        this.props.navigation.navigate("ehealth")
    }   
    render() {
        return (
            <View style={{ marginBottom: 3, backgroundColor: "#FFF", padding: 10 }}>
                {this.props.booking.date ?
                    <Text style={{ padding: 5, fontStyle: 'italic' }}>Lịch khám ngày {new Date(this.props.booking.date.timestamp).format("thu, dd/MM/yyyy")}</Text>
                    : null}

                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                    <Text style={{ width: 60, color: '#00accc' }}>Sáng</Text>
                    <ScrollView horizontal={true}>
                        <FlatList
                            extraData={this.state}
                            keyExtractor={(item, index) => index}
                            style={{ flex: 1, marginLeft: 10 }}
                            numColumns={4}
                            data={this.state.time.am}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => {
                                    this.click(item);
                                }}>
                                    <Text style={
                                        item.isAvailable && item.allowBooking && item.count < item.numberCase
                                            ?
                                            styles.timeItemAvailable
                                            :
                                            styles.timeItem}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>}
                        />
                    </ScrollView>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                    <Text style={{ width: 60, color: '#00accc', }}>Chiều</Text>
                    <ScrollView horizontal={true}>
                        <FlatList
                            keyExtractor={(item, index) => index}
                            extraData={this.state}
                            style={{ flex: 1, marginLeft: 10 }}
                            numColumns={4}
                            data={this.state.time.pm}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => {
                                    this.click(item);
                                }}>
                                    <Text style={item.isAvailable && item.allowBooking && item.count < item.numberCase ? styles.timeItemAvailable : styles.timeItem}>{item.label}</Text>
                                </TouchableOpacity>}
                        />
                    </ScrollView>
                </View>
            </View>
        )
    }
}
DoctorTime.propTypes = {
    doctor: PropTypes.any
}
function mapStateToProps(state) {
    return {
        booking: state.dhyBooking,
        userApp: state.userApp,
        navigation: state.navigation
    }
}
export default connect(mapStateToProps, null, null, { withRef: true })(DoctorTime);

const styles = StyleSheet.create({

    timeItemAvailable:
    {
        width: 60,
        flex: 1, color: '#FFF',
        fontWeight: 'bold',
        padding: 3,
        margin: 2,
        borderRadius: 5,
        textAlign: 'center',
        overflow: "hidden",
        backgroundColor: '#0c8c8b'

    },
    timeItem: {
        width: 60,
        flex: 1, color: '#FFF',
        fontWeight: 'bold',
        padding: 3,
        margin: 2,
        overflow: "hidden",
        borderRadius: 5,
        textAlign: 'center',
        backgroundColor: '#aeacad'

    }
});