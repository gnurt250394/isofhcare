import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
import scheduleProvider from '@data-access/schedule-provider';
import snackbar from '@utils/snackbar-utils';
import dateUtils from "mainam-react-native-date-utils";
import { Card } from 'native-base';
const DEVICE_WIDTH = Dimensions.get('window').width;
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from "mainam-react-native-date-picker";
import bookingDoctorProvider from '@data-access/booking-doctor-provider'

LocaleConfig.locales['en'] = {
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    monthNamesShort: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'],
    dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7']
};

LocaleConfig.defaultLocale = 'en';




class SelectDateTimeDoctorScreen extends Component {
    constructor(props) {
        super(props);
        let service = this.props.navigation.state.params.service;
        let isNotHaveSchedule = this.props.navigation.state.params.isNotHaveSchedule;
        this.state = {
            service,
            listTime: [],
            isNotHaveSchedule,
            listHospital: [],
            profileDoctor: {}
        }
        this.days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    }
    getTime(yourDateString) {
        var yourDate = new Date(yourDateString);
        try {

            // yourDate.setMinutes(yourDate.getMinutes() + yourDate.getTimezoneOffset());
            yourDate.setMinutes(yourDate.getMinutes());

        } catch (error) {

        }
        return yourDate;
    }
    getDayOfWeek = (dateSelect) => {
        let date = new Date(dateSelect)
        let dayOfWeek = this.days[date.getDay()];

        return dayOfWeek
    }

    selectDay(day) {

        let data = this.state.schedules[day].lock || [];

        let listSchedules = this.state.profileDoctor.schedules || []


        let dateOfWeek = this.getDayOfWeek(day)
        let listTime = [];
        if (this.state.schedules[day].noSchedule) {
            let date = new Date(day)
            console.log('date: ', date);

            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            date.setMinutes(date.getMinutes() + (8 * 60));
            while (true) {
                if (date.format("HH:mm") > "16:00")
                    break;

                if (date.format("HH:mm") < "11:30" || date.format("HH:mm") >= "13:30") {

                    let disabled = true;
                    let id;
                    let maximumCapacity;
                    for (let i = 0; i <= listSchedules.length; i++) {
                        if (listSchedules[i] && listSchedules[i].workTime.dayOfTheWeek == dateOfWeek) {
                            let index = listSchedules[i].timeSlots.findIndex(e => e.date == day && e.time == date.format("HH:mm"))
                            let indexParent = listSchedules.findIndex(e => e.parent == listSchedules[i].id && e.workTime.day == day && !e.workTime.repeat)
                            let indexChilOfParent = listSchedules.findIndex(e => e.parent && e.parent == listSchedules[i].parent && !e.workTime.repeat && e.workTime.day == day)
                            if (index != -1) {
                                if (listSchedules[i].timeSlots[index].lock) {
                                    disabled = true
                                    id = listSchedules[i].id
                                    break
                                }
                            }

                            if (listSchedules[i].parent && listSchedules[i].workTime.day == day
                                && listSchedules[i].workTime.start <= date.format('HH:mm')
                                && listSchedules[i].workTime.end > date.format('HH:mm')
                            ) {
                                maximumCapacity = listSchedules[i].maximumCapacity
                                disabled = false
                                id = listSchedules[i].id
                                break
                            }
                            if (listSchedules[i].workTime.start <= date.format('HH:mm')
                                && listSchedules[i].workTime.end > date.format('HH:mm')
                                && (((indexParent == -1) && listSchedules[i].workTime.day <= day
                                    && listSchedules[i].workTime.expired >= day && indexChilOfParent == -1 && listSchedules[i].workTime.repeat)
                                    || (!listSchedules[i].workTime.repeat && listSchedules[i].workTime.day == day))
                            ) {
                                maximumCapacity = listSchedules[i].maximumCapacity
                                disabled = false
                                id = listSchedules[i].id
                                break;
                            }
                        }
                    }

                    listTime.push({
                        key: date.getTime(),
                        schedule: {
                        },
                        id,
                        maximumCapacity,
                        time: date.getTime(),
                        type: 3,
                        label: date.format("HH:mm"),
                        disabled,
                        timeString: date.format("HH:mm:ss"),
                    });

                }
                date.setMinutes(date.getMinutes() + 30);

            }
            this.setState({ listTime })

        }
        else {
            data.forEach((item, index) => {
                for (var key in item) {
                    try {
                        let time = this.getTime(key);
                        label = time.format("HH") + "h" + time.format("mm");
                        let schedule = {
                            label,
                            time,
                            key: key,
                            percent: 100
                        }
                        let schedules = ((item[key] || {}).detailSchedules || []);
                        schedules.forEach((item2, index2) => {
                            let detailSchedule = item2.detailSchedule;
                            if (item2.numberCase && detailSchedule) {
                                let percent = ((item2.numberSlot || 0) * 100) / (item2.numberCase || 1);
                                if (percent <= schedule.percent) {
                                    schedule.percent = percent;
                                    schedule.schedule = detailSchedule;
                                    schedule.doctor = item2.doctorVendor;
                                    schedule.numberSlot = item2.numberSlot || 0;
                                    schedule.numberCase = item2.numberCase || 1;

                                    let available = 100 - percent;
                                    if (available == 0)
                                        schedule.type = 0;
                                    else
                                        if (available < 30)
                                            schedule.type = 1;
                                        else
                                            if (available < 70)
                                                schedule.type = 2;
                                            else
                                                schedule.type = 3;
                                }
                            }
                        });
                        if (schedule.schedule) {
                            listTime.push(schedule);
                        }
                    } catch (error) {

                    }
                }
            });

        }
        this.setState({
            listTime: listTime.sort((a, b) => {
                return a.time - b.time
            }),
        }, () => {
        });
    }

    getColor(item) {
        if (!item.disabled)
            return "#3161AD";
        else
            return "#BBBBBB"
        // if (item.type == 1)
        //     return "#ffa500";
        // if (item.type == 2)
        //     return "#efd100";
        // return "#3161AD";
    }
    getListSchedule = (hospitalId, doctorId) => {
        bookingDoctorProvider.get_list_schedules(hospitalId, doctorId, 0).then(res => {

        }).catch(err => {

        })
    }
    getDetailDoctor = () => {
        try {
            this.setState({ isLoading: true }, () => {
                const item = this.props.navigation.getParam('item', {})
                let id = item && item.id
                bookingDoctorProvider.detailDoctor(id).then(s => {
                    this.setState({ isLoading: false })
                    if (s) {
                        // this.getListSchedule(s.hospital.id, s.id)
                        this.setState({ profileDoctor: s, isLoading: false }, () => {
                            this.selectMonth(new Date());
                        })
                    }
                }).catch(e => {
                    // this.selectMonth(new Date());
                    this.setState({ isLoading: false })
                    if (e) {
                        this.setState({
                            isLoading: false
                        })
                    }
                })
            })

        } catch (error) {
            this.setState({ isLoading: false })

        }

    }
    componentDidMount() {
        this.getDetailDoctor()

    }
    generateSchedule(month) {
        try {
            let arrIndex = []
            let firstDay = month.getFirstDateOfMonth();

            let lastDay = month.getLastDateOfMonth();

            let obj = {};
            while (firstDay <= lastDay) {
                let key = firstDay.format("yyyy-MM-dd");
                let dayOfWeek = this.getDayOfWeek(key)


                obj[key] = {}

                if (new Date(key) <= new Date()
                    // || firstDay.getDay() == 6 
                    // || firstDay.getDay() == 0
                ) {
                    obj[key].disabled = true;
                    obj[key].disableTouchEvent = true;

                } else {
                    obj[key].disabled = true;
                    obj[key].disableTouchEvent = true;
                    obj[key].noSchedule = false;
                    obj[key].schedules = [];
                    obj[key].marked = false;
                    obj[key].color = 'green';
                    obj[key].selectedColor = '#3161AD';
                    obj[key].customStyles = {
                        container: {
                            backgroundColor: '#FFF',
                        }
                    }
                }
                // return;
                firstDay.setDate(firstDay.getDate() + 1)
            }
            let selected = null;
            for (let key in obj) {
                let dayOfWeek = this.getDayOfWeek(key)
                if (new Date(key) <= new Date())
                    continue;
                let keyDate = new Date(key);

                if (this.state.profileDoctor.schedules && this.state.profileDoctor.schedules.length == 0) {
                    let doctor = this.state.profileDoctor
                        && this.state.profileDoctor.academicDegree
                        && this.state.profileDoctor.name
                        ? this.state.profileDoctor.academicDegree + " " + this.state.profileDoctor.name
                        : 'Bác sĩ'
                    snackbar.show(doctor + ' không có lịch làm việc trong thời gian này', 'danger')
                }

                let dataSchedules = this.state.profileDoctor.schedules ? this.state.profileDoctor.schedules : []
                for (let i = 0; i < dataSchedules.length; i++) {
                    // if (dataSchedules[i].workTime.dayOfTheWeek == dayOfWeek) {

                    if ((dataSchedules[i].workTime.dayOfTheWeek == dayOfWeek
                        && dataSchedules[i].workTime.expired >= key
                        && dataSchedules[i].workTime.repeat && key >= dataSchedules[i].workTime.day) || (key == dataSchedules[i].workTime.day)) {
                        arrIndex.push(i)
                        let indexDelete = dataSchedules[i].breakDays.findIndex(e => e == key)
                        if (indexDelete != -1) {
                            obj[key].disabled = true;
                            obj[key].disableTouchEvent = true;
                            break
                        }
                        obj[key].marked = true;
                        obj[key].noSchedule = true;
                        obj[key].disabled = false;
                        obj[key].disableTouchEvent = false;
                        obj[key].customStyles = {
                            container: {
                                backgroundColor: '#FFF',
                                borderWidth: 1,
                                borderColor: '#3161AD'
                            }
                        }
                        if (arrIndex && arrIndex.length == 1) {
                            selected = keyDate;
                            obj[key].customStyles = {
                                container: {
                                    backgroundColor: '#3161AD'
                                },
                                text: {
                                    color: '#FFF'
                                }
                            }
                        }
                        break;
                    }
                    else {
                        obj[key].customStyles = {
                            container: {
                                backgroundColor: '#FFF',
                            }
                        }
                    }
                    // if ((dataSchedules[i].workTime.repeat || key != dataSchedules[i].workTime.day)
                    // ) {
                    //     break;
                    // }
                }
            }
            if (selected) {
                (obj[selected.format("yyyy-MM-dd")] || {}).selected = true;

            }

            this.setState({
                dateString: selected ? selected.format("yyyy-MM-dd") : null,
                bookingDate: selected,
                schedules: obj
            }, () => {
                if (this.state.dateString)
                    this.selectDay(this.state.dateString);
            })
            return obj;
        } catch (error) {


        }

    }
    groupSchedule(schedules) {
        let obj = {};
        schedules.forEach(item => {
            if (Object.keys(item).length) {
                let key = new Date(Object.keys(item)[0]);
                if (new Date(key) <= new Date())
                    return;
                let tgi = new Date(key).format("yyyy-MM-dd");
                if (!obj[tgi]) {
                    obj[tgi] = {
                        schedules: [],
                        marked: true,
                        color: 'green',
                        selectedColor: '#3161AD',
                        customStyles: {
                            container: {
                                backgroundColor: '#3161AD'
                            },
                            text: {
                                color: '#FFF'
                            }
                        }
                    }
                } else {
                    obj[tgi].schedules.push(item);
                }
            }
        });
        let selected = null;
        for (let key in obj) {
            let keyDate = new Date(key);
            if (keyDate > new Date() && (selected == null || keyDate < selected)) {
                selected = keyDate;
            }
        }
        if (selected) {
            (obj[selected.format("yyyy-MM-dd")] || {}).selected = true;
        }
        this.setState({
            dateString: selected ? selected.format("yyyy-MM-dd") : null,
            bookingDate: selected,
            schedules: obj
        }, () => {
            if (this.state.dateString)
                this.selectDay(this.state.dateString);
        })
        return obj;
    }

    selectMonth(date) {
        if (this.state.isNotHaveSchedule) {
            this.generateSchedule(date);
        }
        // else {
        //     if (this.state.service && this.state.service.length) {
        //         let service = this.state.service[0];
        //         this.setState({ isLoading: true }, () => {


        //             scheduleProvider.getByMonthAndService(service.service.id, date.format("yyyyMM")).then(s => {
        //                 this.setState({ isLoading: false }, () => {
        //                     this.groupSchedule(s.data);
        //                 });
        //             }).catch(e => {
        //                 this.setState({ isLoading: false });
        //             })
        //         })
        //     }
        // }
    }
    daysBetween = (date1, date2) => {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    }
    selectTime = (item) => () => {
        console.log('item: ', item);
        if (item.type == 0) {
            snackbar.show("Đã kín lịch trong khung giờ này", "danger");
            return;
        }
        let date = new Date(item.key)
        console.log('this.daysBetween(new Date(), date): ', this.daysBetween(new Date(), date));
        if (item.maximumCapacity < this.daysBetween(new Date(), date)) {
            snackbar.show(`Bạn chỉ được đặt lịch trước ${item.maximumCapacity} ngày`, "danger");
            return
        }

        this.setState({ schedule: item, allowBooking: true }, () => {
        })
    }

    confirm = () => {
        if (!this.state.allowBooking)
            return;
        let error = false;

        if (this.state.schedule) {
            this.setState({ scheduleError: "" })
        } else {
            this.setState({ scheduleError: "Giờ khám không được bỏ trống" })
            error = true;
        }

        if (error)
            return;

        if (this.state.bookingDate && this.state.schedule) {
            // let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
            // if (callback) {

            // callback(this.state.bookingDate, this.state.schedule, listFinal);
            //     this.props.navigation.pop();
            // }

            this.setState({ isLoading: true }, () => {
                bookingDoctorProvider.get_detail_schedules(this.state.schedule.id).then(res => {
                    this.setState({ isLoading: false })
                    this.props.navigation.navigate('addBookingDoctor', {
                        profileDoctor: this.state.profileDoctor,
                        bookingDate: this.state.bookingDate,
                        detailSchedule: res,
                        schedule: this.state.schedule,
                    })
                }).catch(err => {

                })

            })

        } else {
            this.setState({ scheduleError: "Vui lòng chọn ngày và khung giờ khám" });
        }
    }

    renderTimePicker(fromHour, toHour, label) {
        return (
            (this.state.listTime.filter(item => new Date(item.time).format("HH") >= fromHour && new Date(item.time).format("HH") < toHour).length) ?
                <View style={styles.containerTimePicker}>
                    <Text style={styles.txtlabel}>{label}</Text>
                    <View style={styles.containerButtonTimePicker}>
                        {
                            this.state.listTime.filter(item => new Date(item.time).format("HH") >= fromHour && new Date(item.time).format("HH") < toHour).map((item, index) => {
                                return <TouchableOpacity
                                    onPress={this.selectTime(item)}
                                    disabled={item.disabled}
                                    key={index} style={[styles.buttonTimePicker,
                                    {
                                        borderColor: this.getColor(item)
                                    }, this.state.schedule == item ? styles.item_selected : {}]}>
                                    <Text style={[styles.txtTimePicker, {
                                        color: this.getColor(item)
                                    },
                                    this.state.schedule == item ? styles.item_label_selected : {}]}>{item.label}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </View> : null
        )
    }

    onCheck = (item) => () => {
        let data2 = [...this.state.listHospital]
        data2.forEach(e => {
            if (e.id == item.id) {
                e.checked = true
            } else {
                e.checked = false
            }
        })
        this.setState({ listHospital: data2 }, () => {

        })
    }
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={this.onCheck(item)}
                style={styles.btnCheck}>
                <View style={styles.groupCheck}>
                    {item.checked ?
                        <ScaleImage source={require('@images/new/ic_question_check_specialist.png')} width={17} />
                        : null
                    }
                </View>
                <Text style={styles.nameHospital}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    keyExtractor = (item, index) => item.id.toString() || index.toString()
    onSelectDay = (day) => {
        let schedules = JSON.parse(JSON.stringify(this.state.schedules));
        if (schedules.hasOwnProperty(day.dateString)) {
            if (this.state.dateString) {
                schedules[this.state.dateString].customStyles = {
                    container: {
                        backgroundColor: '#FFF',
                        borderWidth: 1,
                        borderColor: '#3161AD'
                    }
                }
                // delete schedules[this.state.dateString].selected;
            }
            // schedules[day.dateString].selected = true;
            // schedules[day.dateString].selectedColor = '#3161AD';
            schedules[day.dateString].customStyles = {
                container: {
                    backgroundColor: '#3161AD',
                },
                text: {
                    color: '#FFF'
                }
            }
            this.setState({
                dateString: day.dateString,
                bookingDate: day.dateString.toDateObject(),
                schedules: schedules,
                allowBooking: false,
                listHospital: []
            }, () => {
                this.selectDay(this.state.dateString);
            })
        }
    }
    onMonthChange = (month) => {
        this.setState({ latestTime: new Date(month.dateString) }, () => {
            this.selectMonth(month.dateString.toDateObject())
        })
    }
    onClickToggleDay = () => {
        this.setState({ toggelMonthPicker: true })
    }
    onConfirmDate = newDate => {
        this.setState({ latestTime: newDate, toggelMonthPicker: false }, () => {
            this.selectMonth(newDate);
        })
    }
    onCancelDate = () => {
        this.setState({ toggelMonthPicker: false });
    }
    render() {
        const { profileDoctor } = this.state
        return (<ActivityPanel
            isLoading={this.state.isLoading}
            title="Chọn thời gian">
            <View style={styles.flex}>
                <View style={styles.container}>
                    <ScrollView
                        ref={ref => this.scroll = ref}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag">

                        <Card style={styles.containerCalendar}>
                            <Text style={styles.txtTitleHeader}>{profileDoctor.academicDegree} {profileDoctor.name}</Text>
                            <Text style={styles.txtDateBooking}>NGÀY KHÁM</Text>
                            <View style={styles.groupCalendar}>
                                <Calendar style={styles.calendar}
                                    markingType="custom"
                                    markedDates={this.state.schedules}
                                    current={(this.state.latestTime || new Date()).format("yyyy-MM-dd")}
                                    onDayPress={this.onSelectDay}
                                    monthFormat={'MMMM - yyyy'}
                                    onMonthChange={this.onMonthChange}
                                    ref={ref => this.calendar = ref}
                                    // hideArrows={true}
                                    hideExtraDays={true}
                                    firstDay={1}
                                />
                                <TouchableOpacity
                                    onPress={this.onClickToggleDay}
                                    style={styles.buttonToggleDay}>
                                </TouchableOpacity>
                            </View>
                        </Card>
                        {
                            this.state.dateString ?
                                this.state.listTime && this.state.listTime.length ?
                                    <View style={styles.containerListTime}>
                                        <Text style={styles.txtSchedule}>GIỜ KHÁM</Text>
                                        {
                                            this.state.scheduleError ?
                                                <Text style={[styles.errorStyle]}>{this.state.scheduleError}</Text> :
                                                null
                                        }

                                        {this.renderTimePicker(0, 12, "Buổi sáng")}
                                        {this.renderTimePicker(12, 24, "Buổi chiều")}
                                    </View>
                                    : !this.state.isLoading ? <Text style={[styles.errorStyle]}>{"Ngày bạn chọn không có lịch khám nào"}</Text> : null
                                :
                                <Text style={styles.txtHelp}>Vui lòng chọn khung giờ khám</Text>
                        }
                        {/* <View style={{ padding: 10 }}>
                            <Text style={styles.address}>Địa điểm khám</Text>
                            <FlatList
                                data={this.state.listHospital}
                                renderItem={this.renderItem}
                                extraData={this.state}
                                keyExtractor={this.keyExtractor}
                            />
                        </View> */}
                    </ScrollView>
                    <TouchableOpacity style={[styles.button, this.state.allowBooking ? { backgroundColor: "#00CBA7" } : {}]} onPress={this.confirm}>
                        <Text style={styles.btntext}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    mode={'date'}
                    isVisible={this.state.toggelMonthPicker}
                    onConfirm={this.onConfirmDate}
                    onCancel={this.onCancelDate}
                    cancelTextIOS={"Hủy bỏ"}
                    confirmTextIOS={"Xác nhận"}
                    date={this.state.latestTime || new Date()}
                />
            </View>
        </ActivityPanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
const styles = StyleSheet.create({
    groupCalendar: {
        borderColor: '#ccc',
        borderWidth: 1,
        margin: 10,
        borderRadius: 10,
        padding: 10,
    },
    txtDateBooking: {
        paddingLeft: 15,
        color: '#000',
        fontWeight: 'bold'
    },
    txtHelp: {
        fontStyle: 'italic',
        marginVertical: 20,
        textAlign: 'center'
    },
    txtSchedule: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16
    },
    containerListTime: {
        margin: 10
    },
    buttonToggleDay: {
        position: 'absolute',
        top: 0,
        left: 70,
        right: 70,
        height: 60
    },
    calendar: {
        width: '100%',
        borderRadius: 10
    },
    containerCalendar: {
        position: 'relative',
        left: 0,
        right: 0,
        width: DEVICE_WIDTH - 20,
        alignSelf: 'center',
        borderRadius: 10,
    },
    txtTitleHeader: {
        color: '#3161AD',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 10,
    },
    flex: { flex: 1 },
    txtTimePicker: {
        fontWeight: 'bold',
        color: '#3161AD',
        textAlign: 'center',
    },
    buttonTimePicker: {
        paddingHorizontal: 5,
        alignSelf: 'center',
        minWidth: 60,
        borderRadius: 8,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: '#cacaca',
        margin: 5
    },
    containerButtonTimePicker: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
    },
    txtlabel: {
        color: '#999',
        fontStyle: 'italic',
        marginLeft: 5,
        fontSize: 16
    },
    containerTimePicker: {
        marginTop: 10
    },
    address: {
        color: '#3161AD',
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    nameHospital: {
        color: '#111',
        paddingLeft: 15,
        fontSize: 15
    },
    groupCheck: {
        borderRadius: 5,
        height: 18,
        width: 18,
        borderColor: '#00c088',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnCheck: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
    },
    container: {
        flex: 1,
    },
    name: {
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.06)",
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    imgName: {
        alignItems: 'center',
        padding: 10,


    },
    txtname: {
        fontSize: 17,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        flex: 1,
        marginLeft: 10
    },
    img: {
        marginRight: 5

    },
    article: {
        marginTop: 25,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.06)",

    },
    mucdichkham: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    mdk: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"

    },

    border: {
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.06)",
        marginLeft: 15
    },
    imgIc: {
        marginLeft: 10,
        marginRight: 10
    },
    imgmdk: {
        marginRight: 5
    },

    datkham: {
        fontSize: 16,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#ffffff",
        padding: 15,
        paddingLeft: 100,
        paddingRight: 100
    },
    txtchongiokham: {
        fontSize: 14,
        marginLeft: 20,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"
    },
    chonGioKham: {
        flex: 1, marginTop: 20,
        backgroundColor: '#fff',
        padding: 20
    },
    button: {
        borderRadius: 6,
        backgroundColor: "#cacaca",
        shadowColor: "rgba(0, 0, 0, 0.21)",
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        width: 250,
        marginVertical: 20,
        alignSelf: 'center'
    },
    btntext: {
        fontSize: 15,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#ffffff",
        padding: 15,
        textAlign: 'center'
    },
    slider: {
        marginLeft: 20,
        marginRight: 20
    },
    circle: {
        padding: 5,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: "rgba(151, 151, 151, 0.29)",
        marginLeft: 5
    },
    errorStyle: {
        marginVertical: 20,
        color: 'red',
        textAlign: 'center'
    },

    titleStyle: {
        color: '#FFF'
    },
    item_label_selected: {
        color: '#FFF'
    },
    item_selected: {
        backgroundColor: '#3161AD'
    }
})
export default connect(mapStateToProps)(SelectDateTimeDoctorScreen);