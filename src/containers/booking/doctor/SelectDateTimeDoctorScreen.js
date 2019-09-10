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
const DEVICE_WIDTH = Dimensions.get('window').width;
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from "mainam-react-native-date-picker";
const data = [
    {
        id: 1,
        name: 'Bệnh viện E',
        location: 'Tòa nhà A1',
        services: [{
            name: 'Khám bệnh theo yêu cầu',
            price: 100000
        },
        {
            name: 'Khám bệnh theo yêu cầu',
            price: 100000
        },
        ]
    },
    {
        id: 2,
        name: 'Bệnh viện đại học Y',
        location: 'Tòa nhà A2',
        services: [{
            name: 'Khám bệnh theo yêu cầu',
            price: 200000
        }]
    },
]
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
            listHospital: []
        }
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

    selectDay(day) {
        let data = this.state.schedules[day].schedules || [];
        let listTime = [];
        if (this.state.schedules[day].noSchedule) {
            let date = new Date(new Date(day).format("yyyy-MM-dd"));
            // 
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            date.setMinutes(date.getMinutes() + (8 * 60));
            while (true) {
                if (date.format("HH:mm") > "16:00")
                    break;

                if (date.format("HH:mm") < "11:30" || date.format("HH:mm") >= "13:30") {
                    listTime.push({
                        key: date.getTime(),
                        schedule: {
                        },
                        time: date.getTime(),
                        type: 3,
                        label: date.format("HH:mm"),
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
        if (item.type == 0)
            return "#d0021b";
        if (item.type == 1)
            return "#ffa500";
        if (item.type == 2)
            return "#efd100";
        return "#02c39a";
    }

    componentDidMount() {
        this.selectMonth(new Date());
    }
    generateSchedule(month) {
        let firstDay = month.getFirstDateOfMonth();
        let lastDay = month.getLastDateOfMonth();
        let obj = {};
        while (firstDay <= lastDay) {
            let key = firstDay.format("yyyy-MM-dd");;
            obj[key] = {}
            if (new Date(key) <= new Date()
                // || firstDay.getDay() == 6 
                || firstDay.getDay() == 0) {
                obj[key].disabled = true;
                obj[key].disableTouchEvent = true;
            } else {
                obj[key].noSchedule = true;
                obj[key].schedules = [];
                obj[key].marked = true;
                obj[key].color = 'green';
                obj[key].selectedColor = '#27ae60';
            }
            // return;
            firstDay.setDate(firstDay.getDate() + 1)
        }
        let selected = null;
        for (let key in obj) {
            if (obj[key].disabled)
                continue;
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
                        selectedColor: '#27ae60'
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
        } else {
            if (this.state.service && this.state.service.length) {
                let service = this.state.service[0];
                this.setState({ isLoading: true }, () => {


                    scheduleProvider.getByMonthAndService(service.service.id, date.format("yyyyMM")).then(s => {
                        this.setState({ isLoading: false }, () => {
                            this.groupSchedule(s.data);
                        });
                    }).catch(e => {
                        this.setState({ isLoading: false });
                    })
                })
            }
        }
    }

    selectTime = (item) => () => {

        if (item.type == 0) {
            snackbar.show("Đã kín lịch trong khung giờ này", "danger");
            return;
        }
        let list = data
        list[0].checked = true
        this.setState({ schedule: item, allowBooking: true, listHospital: list })
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
            let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
            if (callback) {
                let data = this.state.listHospital
                let listFinal = data.find(e => e.checked = true)
                callback(this.state.bookingDate, this.state.schedule, listFinal);
                this.props.navigation.pop();
            }
        } else {
            this.setState({ scheduleError: "Vui lòng chọn ngày và khung giờ khám" });
        }
    }

    renderTimePicker(fromHour, toHour, label) {
        return (
            (this.state.listTime.filter(item => new Date(item.time).format("HH") >= fromHour && new Date(item.time).format("HH") < toHour).length) ?
                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: '#00c088', fontWeight: 'bold', marginLeft: 5, fontSize: 16 }}>{label}</Text>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                        {
                            this.state.listTime.filter(item => new Date(item.time).format("HH") >= fromHour && new Date(item.time).format("HH") < toHour).map((item, index) => {
                                return <TouchableOpacity onPress={this.selectTime(item)} key={index} style={[{ paddingHorizontal: 5, alignSelf: 'center', minWidth: 60, borderRadius: 8, paddingVertical: 3, borderWidth: 1, borderColor: '#cacaca', margin: 5 },
                                {
                                    borderColor: this.getColor(item)
                                }, this.state.schedule == item ? styles.item_selected : {}]}>
                                    <Text style={[{ fontWeight: 'bold', color: '#00c088', textAlign: 'center', color: this.getColor(item) },
                                    this.state.schedule == item ? styles.item_label_selected : {}]}>{item.label}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </View> : null
        )
    }

    onCheck = (item) => () => {
        let data = [...this.state.listHospital]
        data.forEach(e => {
            if (e.id == item.id) {
                e.checked = true
            } else {
                e.checked = false
            }
        })
        this.setState({ listHospital: data })
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
    render() {

        return (<ActivityPanel
            isLoading={this.state.isLoading}
            title="Chọn thời gian">
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
                        <Text style={{ color: '#00c088', fontWeight: 'bold', fontSize: 16, margin: 10 }}>CHỌN NGÀY GIỜ CÓ MÀU XANH</Text>
                        <View style={{ position: 'relative', left: 0, right: 0, width: DEVICE_WIDTH }}>
                            <Calendar style={{ width: '100%' }}
                                markedDates={this.state.schedules}
                                current={(this.state.latestTime || new Date()).format("yyyy-MM-dd")}
                                onDayPress={(day) => {
                                    let schedules = JSON.parse(JSON.stringify(this.state.schedules));
                                    if (schedules.hasOwnProperty(day.dateString)) {
                                        if (this.state.dateString) {
                                            delete schedules[this.state.dateString].selected;
                                        }
                                        schedules[day.dateString].selected = true;
                                        schedules[day.dateString].selectedColor = '#27ae60';
                                        this.setState({
                                            dateString: day.dateString,
                                            bookingDate: day.dateString.toDateObject(),
                                            schedules: schedules
                                        }, () => {
                                            this.selectDay(this.state.dateString);
                                        })
                                    }
                                }}
                                monthFormat={'MMMM - yyyy'}
                                onMonthChange={(month) => {
                                    this.setState({ latestTime: new Date(month.dateString) }, () => {
                                        this.selectMonth(month.dateString.toDateObject())
                                    })
                                }}
                                // hideArrows={true}
                                hideExtraDays={true}
                                firstDay={1}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ toggelMonthPicker: true })
                                }}
                                style={{ position: 'absolute', top: 0, left: 70, right: 70, height: 60 }}>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.dateString ?
                                this.state.listTime && this.state.listTime.length ?
                                    <View style={{ margin: 10 }}>
                                        <Text style={{ color: '#00c088', fontWeight: 'bold', fontSize: 16 }}>LỊCH KHÁM {this.state.dateString.toDateObject().format("thu, dd/MM/yyyy").toUpperCase()}</Text>
                                        {
                                            this.state.scheduleError ?
                                                <Text style={[styles.errorStyle]}>{this.state.scheduleError}</Text> :
                                                <Text style={{ fontStyle: 'italic', marginVertical: 20, textAlign: 'center' }}>Vui lòng nhấn để chọn khung giờ khám</Text>
                                        }

                                        {this.renderTimePicker(0, 12, "Sáng")}
                                        {this.renderTimePicker(12, 24, "Chiều")}
                                    </View>
                                    : !this.state.isLoading ? <Text style={[styles.errorStyle]}>{"Ngày bạn chọn không có lịch khám nào"}</Text> : null
                                :
                                <Text style={{ fontStyle: 'italic', marginVertical: 20, textAlign: 'center' }}>Vui lòng chọn khung giờ khám</Text>
                        }
                        <View style={{
                            padding: 10
                        }}>
                            <Text style={{
                                color: '#02c39a',
                                fontSize: 16,
                                fontWeight: 'bold',
                                paddingVertical: 10
                            }}>Địa điểm khám</Text>
                            <FlatList
                                data={this.state.listHospital}
                                renderItem={this.renderItem}
                                extraData={this.state}
                                keyExtractor={this.keyExtractor}
                            />
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={[styles.button, this.state.allowBooking ? { backgroundColor: "#02c39a" } : {}]} onPress={this.confirm}>
                        <Text style={styles.btntext}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    mode={'date'}
                    isVisible={this.state.toggelMonthPicker}
                    onConfirm={newDate => {
                        this.setState({ latestTime: newDate, toggelMonthPicker: false }, () => {
                            this.selectMonth(newDate);
                        })
                    }}
                    onCancel={() => {
                        this.setState({ toggelMonthPicker: false });
                    }}
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
        backgroundColor: '#00c088'
    }
})
export default connect(mapStateToProps)(SelectDateTimeDoctorScreen);