import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import constants from '@dhy/strings';
import ActivityPanel from '@components/ActivityPanel';
import DoctorTime from '@dhy/components/DoctorTime';
import { connect } from 'react-redux';
import Modal from "react-native-modal";
import userProvider from '@data-access/user-provider';
import bookingProvider from '@dhy/data-access/booking-provider';
import Dimensions from 'Dimensions';
import stylemodal from "@styles/modal-style";
import banner from '@images/booking/booking_banner.png'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import serviceProvider from '@dhy/data-access/booking-service-provider';
import scheduleProvider from '@dhy/data-access/booking-schedule-provider';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import string from 'mainam-react-native-string-utils';
import dateUtils from 'mainam-react-native-date-utils';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';


LocaleConfig.locales['en'] = {
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    monthNamesShort: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'],
    dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7']
};

LocaleConfig.defaultLocale = 'en';
let $this;
class ViewScheduleDoctorScreen extends Component {
    constructor(props) {
        super(props);
        $this = this;
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        this.state = {
            listService: [],
            schedule: {},
            listSchedule: {},
            toggleModalService: false,
            currentDate: new Date(),
            startDate: new Date(y, m, 1).format("yyyy-MM-dd"),
            endDate: new Date(y, m + 1, 0).format("yyyy-MM-dd")
        }
    }

    getScheduleOnDay(day) {
        var key = day.year + "-" + (day.month < 10 ? "0" : "") + day.month + "-" + (day.day < 10 ? "0" : "") + day.day;
        return this.state.listSchedule[key];
    }

    onDayPress(day) {
        try {
            day.timestamp = new Date(day.timestamp.toDateObject().format("MM/dd/yyyy")).getTime();
            if (!this.props.booking.specialist2) {
                snackbar.show(constants.msg.booking.please_select_service_first);
                return;
            }

            var schedule = this.getScheduleOnDay(day);
            if (!schedule || schedule.disabled) {
                snackbar.show(constants.msg.booking.not_found_schedule_of_doctor_in_this_day);
                return;
            }

            this.props.dispatch({
                type: constants.action.action_select_booking_date
                , value: day
            });

            var newListScheduleText = JSON.parse(this.state.listScheduleText);

            var key = day.year + "-" + (day.month < 10 ? "0" : "") + day.month + "-" + (day.day < 10 ? "0" : "") + day.day;
            if (newListScheduleText[key])
                newListScheduleText[key].selected = true;
            this.setState({
                listSchedule: newListScheduleText
            })
            this.props.dispatch({
                type: constants.action.action_select_schedule, value: newListScheduleText[key]
            });

            this.loadListBooking(day);
        } catch (error) {

        }
    }

    loadListBooking(day) {
        bookingProvider.getListBooking(
            this.props.booking.doctor.id,
            this.props.booking.specialist2.id,
            day.dateString, (s, e) => {
                if (s) {
                    if (s.code == 0) {
                        if (this.doctorTime) {
                            var temp = this.doctorTime.getWrappedInstance();
                            if (temp) {
                                temp.analyzeDoctorTime(s.data);
                            }
                        }
                    }
                }
            })
    }

    onMonthChange(month, loadNewMonth) {
        var firstDayHasSchedule = this.generateCalendar(month.month, month.year);
        this.props.dispatch({
            type: constants.action.action_select_booking_date
            , value: null
        });
        $this = this;
        this.setState({
            currentDate: new Date(month.month + "/1/" + month.year),
            startDate: new Date(month.year, month.month - 1, 1).format("yyyy-MM-dd"),
            endDate: new Date(month.year, month.month, 0).format("yyyy-MM-dd")
        }, () => {
            $this.onDayPress(firstDayHasSchedule);
            if (loadNewMonth) {
                $this.loadSchedule(this.props.booking.doctor.id, this.props.booking.specialist.id);
            }

        })
    }

    componentWillMount() {
        this.props.dispatch({
            type: constants.action.action_select_booking_date
            , value: null
        });

        if (!this.props.booking.specialist) {
            serviceProvider.getListSpecialistByDoctorDepartment(this.props.booking.doctor.id, this.props.booking.currentDepartment.id, (res) => {
                if (res && res.length > 0) {
                    this.selectSpecialist(res[0]);
                }
                this.setState({
                    listService: res
                })
            });
        } else {
            this.loadSchedule(this.props.booking.doctor.id, this.props.booking.specialist.id);
        }
        this.props.dispatch({
            type: constants.action.action_select_booking_specialist2, value: this.props.booking.specialist
        })
    }

    toggleModalService() {
        this.setState({
            toggleModalService: !this.state.toggleModalService
        })
    }

    selectSpecialist(item) {
        this.setState({
            toggleModalService: false
        })
        this.setState({
            serviceSelected: item
        });
        this.loadSchedule(this.props.booking.doctor.id, item.id);
        this.props.dispatch({
            type: constants.action.action_select_booking_specialist2, value: item
        })
    }

    checkScheduleValid(day, schedule) {
        var today = new Date();
        if (schedule.schedule.numAllowedDate)
            today.setDate(today.getDate() + schedule.schedule.numAllowedDate);
        return day.compareDate(today) <= 0;
    }

    getNearestDay() {
        var schedule = this.state.schedule;
        if (!schedule) {
            return null;
        }
        else {
            let date = new Date();
            var m = date.getMonth() + 1;
            var year = date.getFullYear();
            for (var t = 0; t < 6; t++) {
                var month = m + t;
                if (month > 12) {
                    month = 1;
                    year++;
                }
                var today = date.getTime();

                for (var i = 1; i <= 31; i++) {
                    try {
                        var date2 = new Date(month + "/" + i + "/" + year);
                        var time = date2.getTime();
                        var compare = time.compareDate(today);
                        if (compare < 0)
                            continue;
                        if (!isNaN(time)) {
                            var temp = this.getScheduleByDate(date2, schedule)
                            if (temp && temp.length > 0) {
                                // if (temp && compare > 0) { release version
                                for (var j = 0; j < temp.length; j++) {
                                    var item = temp[j];
                                    if (this.checkScheduleValid(date2, item)) {
                                        return { month: month, year: year };
                                    }
                                }
                            }
                        }
                    } catch (error) {
                    }
                }
            }
        }
        return null;
    }

    getScheduleByDate(date, schedules) {
        let data = [];
        for (var i = 0; i < schedules.length; i++) {
            let temp = schedules[i].schedule.scheduleDate.toDateObject("-");
            if (date.compareDate(temp) == 0) {
                data.push(schedules[i]);
            }
        }
        return data;
    }
    generateCalendar(month, year) {
        var schedule = this.state.schedule;
        var firstDayHasSchedule = null;

        if (!schedule) {
            this.setState({
                listSchedule: {},
                firstDayHasSchedule: firstDayHasSchedule
            })
        } else {
            var listSchedule = {};
            var today = new Date().getTime();
            // alert(today)
            for (var i = 1; i <= 31; i++) {
                try {
                    var date = new Date(month + "/" + i + "/" + year);
                    var time = date.getTime();
                    var compare = time.compareDate(today);
                    if (compare < 0)
                        continue;
                    if (!isNaN(time)) {

                        var temp = this.getScheduleByDate(date, schedule)
                        if (temp && temp.length > 0) {

                            // if (temp && compare > 0) { release version
                            var key = year + "-" + (month < 10 ? "0" : "") + month + "-" + (i < 10 ? "0" : "") + i;
                            var valid = false;
                            for (var j = 0; j < temp.length; j++) {
                                var item = temp[j];

                                if (this.checkScheduleValid(date, item)) {

                                    if (!listSchedule[key]) {
                                        listSchedule[key] = {
                                            dots: [],
                                            marked: true,
                                        };
                                    }
                                    const dot = { key: 'dot_' + item.specialist.id, color: 'green', selectedColor: 'blue', schedule: item };

                                    listSchedule[key].dots.push(dot);
                                    valid = true;
                                    if (!firstDayHasSchedule)
                                        firstDayHasSchedule = date;
                                }
                            }

                            if (!valid)
                                listSchedule[key] = { disabled: true, disableTouchEvent: true };
                        }
                        else {
                            var key = year + "-" + (month < 10 ? "0" : "") + month + "-" + (i < 10 ? "0" : "") + i;
                            listSchedule[key] = { disabled: true, disableTouchEvent: true };
                        }
                    }
                } catch (error) {
                }
            }


            this.setState({
                listSchedule: listSchedule,
                listScheduleText: JSON.stringify(listSchedule),
                firstDayHasSchedule: firstDayHasSchedule ? {
                    dateString: firstDayHasSchedule.format("yyyy-MM-dd"),
                    day: parseInt(firstDayHasSchedule.format("dd")),
                    month: parseInt(firstDayHasSchedule.format("MM")),
                    timestamp: firstDayHasSchedule.getTime(),
                    year: parseInt(firstDayHasSchedule.format("yyyy"))
                } : null
            })
            return firstDayHasSchedule ? {
                dateString: firstDayHasSchedule.format("yyyy-MM-dd"),
                day: parseInt(firstDayHasSchedule.format("dd")),
                month: parseInt(firstDayHasSchedule.format("MM")),
                timestamp: firstDayHasSchedule.getTime(),
                year: parseInt(firstDayHasSchedule.format("yyyy"))
            } : null;

        }
    }

    // Lấy lịch làm việc theo Bác Sĩ, Chuyên Khoa, Khoa, Ngày đầu tiên đến ngày cuối cùng trong tháng
    loadSchedule(doctorId, specialistId) {
        let that = this;
        scheduleProvider.getListSchedule(doctorId, specialistId,
            this.props.booking.currentDepartment.id,
            this.state.startDate,
            this.state.endDate, (res) => {
                if (res && res.length > 0) {
                    this.setState({
                        service: res[0].service,
                        schedule: res
                    }, () => {
                        that.viewNearestDay()
                    })
                } else {
                    this.setState({
                        schedule: {}
                    })
                }
            })
    }

    viewNearestDay() {
        var value = this.getNearestDay();
        if (value) {
            this.onMonthChange(value);
        }
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1, }} title={this.props.booking.currentDepartment ? this.props.booking.currentDepartment.name : ""}>
                {this.props.booking.doctor ?
                    <ScrollView style={{ backgroundColor: "#e7fbff" }}>
                        <View style={{ marginBottom: 3, backgroundColor: "#FFF" }}>
                            <View style={{ backgroundColor: '#FFF', padding: 10, flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <ImageProgress
                                        indicator={Progress} resizeMode='cover' imageStyle={{ borderRadius: 30, borderWidth: 0.5, borderColor: constants.colors.primaryColor }} style={{ width: 60, height: 60 }} source={{ uri: this.props.booking.doctor.avatar ? this.props.booking.doctor.avatar : "undefined" }}
                                        defaultImage={() => {
                                            return (<ScaleImage source={require("@images/doctor.png")} width={60} />)
                                        }} />
                                    <View style={{ flex: 1, marginLeft: 10, flexDirection: 'column' }}>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {this.props.booking.doctor.academicRankShortName} {this.props.booking.doctor.fullname}
                                        </Text>
                                        {this.props.booking.doctor.award || this.props.booking.doctor.position ?
                                            <Text style={{ color: '#aeacad', marginTop: 5 }}>
                                                {((this.props.booking.doctor.position ? this.props.booking.doctor.position + " " : "") + (this.props.booking.doctor.award ? this.props.booking.doctor.award : "")).trim()}
                                            </Text> : null}
                                        {
                                            this.props.booking.specialist ?
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>Chuyên khoa: </Text>
                                                    <Text style={{ overflow: 'hidden', flex: 1, padding: 2, paddingLeft: 5, paddingRight: 5, backgroundColor: constants.colors.primaryColor, marginLeft: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 5, color: 'white', fontWeight: 'bold' }}>{this.props.booking.specialist.name}</Text>
                                                </View> :
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>Chuyên khoa: </Text>
                                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.toggleModalService() }}>
                                                        <View style={{ overflow: 'hidden', padding: 2, paddingLeft: 5, backgroundColor: constants.colors.primaryColor, marginLeft: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 5, flex: 1, paddingRight: 20 }}>
                                                            <Text style={{ color: 'white' }} numberOfLines={1} ellipsizeMode="tail">{this.state.serviceSelected ? this.state.serviceSelected.name : "Chọn chuyên khoa"}</Text>
                                                            <Image style={{ width: 12, height: 8, marginLeft: 5, position: 'absolute', right: 10 }} source={require('@images/ic_dropdown.png')} />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                        }
                                        {/* {
                                            console.log("BBBBBBBBB" + JSON.stringify( this.state.schedule))
                                        } */}
                                        {   this.state.schedule && this.state.schedule.length > 0 ?
                                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Giá dịch vụ: </Text>
                                                <Text style={{ fontWeight: 'bold' }}>{this.state.schedule[0].service.price.formatPrice() + " đ"}</Text>
                                            </View> 
                                            :
                                            null
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Calendar style={{ marginBottom: 3, backgroundColor: "#FFF" }}
                            markedDates={this.state.listSchedule}
                            current={this.state.currentDate}
                            minDate={new Date()}
                            onDayPress={(day) => { this.onDayPress(day) }}
                            monthFormat={'MMMM - yyyy'}
                            onMonthChange={(month) => { this.onMonthChange(month, true) }}
                            firstDay={1}
                            hideExtraDays={true}
                            markingType={'multi-dot'}
                        />
                        {
                            this.props.booking.date ? <DoctorTime ref={(element) => this.doctorTime = element} doctor={this.props.booking.doctor} /> :
                                <View>
                                    <Text style={{ padding: 10, fontStyle: 'italic', textAlign: 'center' }}>
                                        {constants.msg.ehealth.select_date_to_view_schedule}
                                    </Text>
                                    <TouchableOpacity onPress={() => { this.viewNearestDay() }}>
                                        <Text style={{
                                            flex: 1,
                                            backgroundColor: constants.colors.primaryColor,
                                            width: 250,
                                            alignSelf: 'center',
                                            color: constants.colors.white,
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            overflow: 'hidden',
                                            padding: 7,
                                            borderRadius: 17
                                        }}>
                                            Đi tới ngày làm việc gần nhất
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                        }
                        <Modal isVisible={this.state.toggleModalService}
                            onSwipe={() => this.setState({ toggleModalService: null })}
                            swipeDirection="left"
                            backdropOpacity={0.5}
                            animationInTiming={500}
                            animationOutTiming={500}
                            backdropTransitionInTiming={1000}
                            backdropTransitionOutTiming={1000}
                            onBackdropPress={() => this.toggleModalService()}
                            style={stylemodal.bottomModal}>
                            <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                                <View style={{ borderBottomWidth: 2, borderBottomColor: "#0c8c8b", flexDirection: 'row', alignItems: "center" }}>
                                    <Text style={{ fontWeight: 'bold', padding: 10, flex: 1 }}>
                                        Chọn chuyên khoa
                            </Text>
                                    <TouchableOpacity onPress={() => this.toggleModalService()}>
                                        <View style={{ padding: 10 }}>
                                            <ScaleImage source={require("@images/ic_close.png")} width={15}></ScaleImage>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {this.state.listService && this.state.listService.length > 0 ?

                                    <FlatList
                                        keyExtractor={(item, index) => index}
                                        data={this.state.listService}
                                        renderItem={({ item }) =>
                                            <TouchableOpacity onPress={() => this.selectSpecialist(item)}>
                                                <View style={{ marginBottom: 3, backgroundColor: '#FFF', borderBottomColor: '#41afdd', borderBottomWidth: 1, padding: 20, flexDirection: 'column' }}>
                                                    <Text>
                                                        {item.name}
                                                    </Text>
                                                </View></TouchableOpacity>} /> :
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontStyle: 'italic', textAlign: 'center', padding: 10 }}>
                                            Không có chuyên khoa nào
                                        </Text>
                                    </View>
                                }


                            </View>
                        </Modal>
                        <View style={{ height: 100 }}></View>
                    </ScrollView>

                    : null}
            </ActivityPanel>
        )
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps, null, null, { withRef: true })(ViewScheduleDoctorScreen);