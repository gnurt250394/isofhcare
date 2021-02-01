import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Dimensions, FlatList, RefreshControl } from 'react-native';
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
import objectUtils from '@utils/object-utils';
import firebaseUtils from '@utils/firebase-utils';

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
        let isOnline = this.props.navigation.getParam('isOnline') || false;
        let item = this.props.navigation.getParam('item') || {};

        let isNotHaveSchedule = this.props.navigation.state.params.isNotHaveSchedule;
        this.state = {
            service,
            listTime: [],
            isNotHaveSchedule,
            listHospital: [],
            profileDoctor: {},
            scheduleFinal: [],
            isOnline,
            item,
            listSchedule: [],
            listTimeBooking: [],
            refreshing: false,
            isLoading: true
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
    convertDayOfWeek = (day) => {
        let date = {
            0: 7,
        }
        return date[day] || day
    }
    getTimeDate = (time) => {



        let time1 = '21:00'
        if (time) {
            let hoursStart = time / 60;

            let rhoursStart = Math.floor(hoursStart);
            let minutesStart = (hoursStart - rhoursStart) * 60;

            let rminutesStart = Math.floor(minutesStart);

            if (rminutesStart < 10) {
                time1 = rhoursStart + ":" + "0" + rminutesStart;
            } else {
                time1 = rhoursStart + ":" + rminutesStart;
            }


        }
        return time1
    }
    getTimeBooking = (date) => {
        let [h, m] = date.split(':')
        let time = (parseInt(m) / 60 + parseInt(h)) * 60
        return time
    }
    getListTimeBooking = (date) => {
        console.log('date: ', date);
        let fromDate = date.getFirstDateOfMonth().compareDate(new Date()) == -1 ? date.format('yyyy-MM-dd') : date.getFirstDateOfMonth().format('yyyy-MM-dd')
        let toDate = date.getLastDateOfMonth().format('yyyy-MM-dd')
        const { item, isOnline } = this.state
        // this.setState({ isLoading: true }, () => {
        bookingDoctorProvider.getListTimeBooking(item.id, isOnline, fromDate, toDate).then(res => {
            if (res && res.length) {
                let group = res.map((item) => item.date).filter((item, i, ar) => ar.indexOf(item) === i).map(item => {
                    let new_list = res.filter(itm => itm.date == item && itm.status != "MIN_CAPACITY");
                    return { date: item, value: new_list }
                });
                console.log('group: ', group);

                this.setState({
                    listTimeBooking: group,
                    isLoading: false,
                    refreshing: false
                }, () => {
                    this.generateSchedule(date);

                })
            } else {
                this.setState({
                    listTimeBooking: [],
                    isLoading: false,
                    refreshing: false,
                    scheduleError: '',
                }, () => {
                    this.generateSchedule(date);

                })
            }

        }).catch(err => {
            this.setState({
                listTimeBooking: [],
                isLoading: false,
                refreshing: false,
                scheduleError: ''

            }, () => {
                this.generateSchedule(date);

            })

        })
        // })

    }
    selectDay(dateTimeString) {
        let list = this.state.listTimeBooking.find(e => e.date == dateTimeString)

        this.setState({
            listTime: list.value
        })
    }

    getColor(item) {
        if (item.status == "AVAILABLE")
            return "#3161AD";
        else
            return "#BBBBBB"
        // if (item.type == 1)
        //     return "#ffa500";
        // if (item.type == 2)
        //     return "#efd100";
        // return "#3161AD";
    }

    getSchedusOnline = () => {
        const { item } = this.state

        let doctorId = item && item.id || ""
        let hospitalId = item && item.hospital ? item.hospital.id : ""
        this.setState({ isLoading: true }, () => {
            bookingDoctorProvider.get_detail_schedules_online(hospitalId, doctorId).then(res => {

                if (res)
                    this.setState({ isLoading: false, scheduleFinal: res, profileDoctor: item }, () => {
                        this.selectMonth(new Date());

                    })

            }).catch(err => {
                this.setState({ isLoading: false })
                this.selectMonth(new Date());

            })
        })

    }
    getDetailDoctor = () => {
        try {
            this.setState({ isLoading: true }, () => {
                const { item } = this.state

                let id = item && item.id
                bookingDoctorProvider.detailDoctor(id).then(s => {

                    this.setState({ isLoading: false })
                    if (s) {
                        // this.getListSchedule(s.hospital.id, s.id)
                        this.setState({ profileDoctor: s, scheduleFinal: s.schedules, isLoading: false }, () => {
                            this.selectMonth(new Date());
                        })
                    } else {
                        this.selectMonth(new Date());

                    }
                }).catch(e => {
                    // this.selectMonth(new Date());
                    this.selectMonth(new Date());
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
    getListSchedule = async () => {
        try {
            const { item } = this.state
            let hospitalId = item && item.hospital ? item.hospital.id : ""
            let res = await bookingDoctorProvider.get_list_schedules(hospitalId)
            return res
        } catch (error) {


        }

    }
    async componentDidMount() {
        try {
            this.selectMonth(new Date())

            const { isOnline } = this.state
            // let res = await this.getListSchedule()

            // if (res && res.length) {
            //     this.setState({
            //         listSchedule: res
            //     }, () => {
            //         if (isOnline) {
            //             this.getSchedusOnline()
            //         } else {

            //             this.getDetailDoctor()
            //         }
            //     })
            // } else {
            //     if (isOnline) {
            //         this.getSchedusOnline()
            //     } else {

            //         this.getDetailDoctor()
            //     }
            // }

        } catch (error) {
            // if (isOnline) {
            //     this.getSchedusOnline()
            // } else {

            //     this.getDetailDoctor()
            // }
        }



    }
    timeStringToDate(time) {
        let d = new Date();

        let [hours, minutes] = time.split(':');
        d.setHours(+hours);
        d.setMinutes(minutes);
        return d
    }
    renderAcademic = (academicDegree) => {
        if (academicDegree) {
            switch (academicDegree) {
                case 'BS': return 'BS. '
                case 'ThS': return 'ThS. '
                case 'TS': return 'TS. '
                case 'PGS': return 'PGS. '
                case 'GS': return 'GS. '
                case 'BSCKI': return 'BSCKI. '
                case 'BSCKII': return 'BSCKII. '
                case 'GSTS': return 'GS.TS. '
                case 'PGSTS': return 'PGS.TS. '
                case 'ThsBS': return 'ThS.BS.'
                case 'ThsBSCKII': return 'ThS.BSCKII. '
                case 'TSBS': return 'TS.BS. '
                default: return ''
            }
        }
        else {
            return ''
        }
    }
    convertTimeToInt = (time) => {
        return time ? parseInt(time.replace(':', '')) : ''
    }
    generateSchedule(month) {
        try {
            let arrIndex = []
            let firstDay = month.getFirstDateOfMonth();

            let lastDay = month.getLastDateOfMonth();
            let toDay = new Date()
            let obj = {};
            while (firstDay <= lastDay) {
                let key = firstDay.format("yyyy-MM-dd");
                let dayOfWeek = this.getDayOfWeek(key)


                obj[key] = {}

                if (new Date(key) <= toDay
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
                let keyDate = new Date(key);
                if ((this.state.isOnline && (new Date(key)).compareDate(toDay) == -1)) {
                    continue;
                } else if (!this.state.isOnline && (new Date(key)).compareDate(toDay) <= 0) {
                    continue;
                }
                let objDate = this.state.listTimeBooking.find(e => {
                    return e.date == key && e.value.length
                })


                if (objDate) {
                    arrIndex.push(objDate)
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
                } else {
                    obj[key].disabled = true;
                    obj[key].disableTouchEvent = true;
                }
               
            }
            if (selected) {
                (obj[selected.format("yyyy-MM-dd")] || {}).selected = true;
            }
            this.setState({
                dateString: selected ? selected.format("yyyy-MM-dd") : null,
                bookingDate: selected,
                schedules: obj,
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
        this.getListTimeBooking(date)
        // if (this.state.isNotHaveSchedule) {
        //     this.generateSchedule(date);
        // }

    }
    daysBetween = (date1, date2) => {
        var one_day = 1000 * 60 * 60 * 24;

        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        var difference_ms = date2_ms - date1_ms;
        return Math.round(difference_ms / one_day);
    }
    selectTime = (item) => () => {

        switch (item.status) {
            case "FULL":
                snackbar.show("Đã kín lịch trong khung giờ này", "danger");
                return;
            case "MIN_CAPACITY":
                snackbar.show(`Bạn chỉ được đặt lịch sau ${item.minimumCapacity} giờ`, "danger");
                return;
            case "MAX_CAPACITY":
                snackbar.show(`Bạn chỉ được đặt lịch trước ${item.maximumCapacity} ngày`, "danger");
                return;
            case "AVAILABLE":
                break;
            default:
                return;
        }
        // if (item.type == 0) {
        //     snackbar.show("Đã kín lịch trong khung giờ này", "danger");
        //     return;
        // }
        let date = new Date(item.key)

        if (item.maximumCapacity < this.daysBetween(new Date(), date)) {
            snackbar.show(`Bạn chỉ được đặt lịch trước ${item.maximumCapacity} ngày`, "danger");
            return
        }

        this.setState({ schedule: item, allowBooking: true }, () => {
        })
    }

    confirm = () => {
        firebaseUtils.sendEvent('Doctor_online_confirm')
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
                bookingDoctorProvider.get_detail_schedules(this.state.schedule.scheduleId).then(res => {
                    this.setState({ isLoading: false })
                    this.props.navigation.navigate('addBookingDoctor', {
                        profileDoctor: this.state.item,
                        bookingDate: this.state.bookingDate,
                        detailSchedule: res,
                        schedule: this.state.schedule,
                        isOnline: this.state.isOnline
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
            (this.state.listTime.filter(item => item.status !== "MIN_CAPACITY" && item.time.replace(':', "") >= fromHour.replace(':', "") && item.time.replace(':', "") <= toHour.replace(':', "")).length) ?
                <View style={styles.containerTimePicker}>
                    <Text style={styles.txtlabel}>{label}</Text>
                    <View style={styles.containerButtonTimePicker}>
                        {
                            this.state.listTime.filter(item => item.time.replace(':', "") >= fromHour.replace(':', "") && item.time.replace(':', "") <= toHour.replace(':', "")).map((item, index) => {
                                if (item.status == "MIN_CAPACITY") {
                                    return null
                                }
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
                                    this.state.schedule == item ? styles.item_label_selected : {}]}>{item.time}</Text>
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
                    },
                    text: {
                        color: '#000'
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
        this.setState({ latestTime: new Date(month.dateString), isLoading: true }, () => {
            this.selectMonth(month.dateString.toDateObject())
        })
    }
    onClickToggleDay = () => {
        this.setState({ toggelMonthPicker: true })
    }
    onConfirmDate = newDate => {
        this.setState({ latestTime: newDate, toggelMonthPicker: false, isLoading: true }, () => {
            this.selectMonth(newDate);
        })
    }
    onCancelDate = () => {
        this.setState({ toggelMonthPicker: false });
    }
    onRefresh = () => {
        this.setState({ refreshing: true }, () => this.selectMonth(this.state.latestTime || new Date()))
    }
    refreshControl = () => {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
            />
        )
    }
    render() {
        const { profileDoctor, item } = this.state
        console.log('item: ', item);
        return (<ActivityPanel
            isLoading={this.state.isLoading}
            transparent={true}
            title="Chọn thời gian">
            <View style={styles.flex}>
                <View style={styles.container}>
                    <ScrollView
                        ref={ref => this.scroll = ref}
                        refreshControl={this.refreshControl()}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag">

                        <Card style={styles.containerCalendar}>
                            <Text style={styles.txtTitleHeader}>{objectUtils.renderAcademic(item?.academicDegree)}{item?.name}</Text>
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

                                        {this.renderTimePicker('0:0', '11:30', "Buổi sáng")}
                                        {this.renderTimePicker('12:00', '24:00', "Buổi chiều")}
                                    </View>
                                    : !this.state.isLoading ? <Text style={[styles.errorStyle]}>{"Ngày bạn chọn không có lịch khám nào"}</Text> : null
                                :
                                <Text style={styles.txtHelp}>{objectUtils.renderAcademic(item.academicDegree)}{item?.name} không có lịch làm việc trong thời gian này</Text>
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
        userApp: state.auth.userApp
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
        textAlign: 'center',
        color: 'red'
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