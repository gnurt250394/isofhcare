import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
import scheduleProvider from '@data-access/schedule-provider';
import snackbar from '@utils/snackbar-utils';
import dateUtils from "mainam-react-native-date-utils";
import bookingProvider from '@data-access/booking-provider';
import dataCacheProvider from '@data-access/datacache-provider';
import constants from '@resources/strings';
const DEVICE_WIDTH = Dimensions.get('window').width;
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from "mainam-react-native-date-picker";

LocaleConfig.locales['en'] = {
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    monthNamesShort: ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'],
    dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7']
};

LocaleConfig.defaultLocale = 'en';


class SelectTimeScreen extends Component {
    constructor(props) {
        super(props);
        let serviceType = this.props.navigation.state.params.serviceType;
        let hospital = this.props.navigation.state.params.hospital;
        let profile = this.props.navigation.state.params.profile;
        let specialist = this.props.navigation.state.params.specialist;
        let service = this.props.navigation.state.params.service;
        let bookingDate = this.props.navigation.state.params.bookingDate;
        let reason = this.props.navigation.state.params.reason;
        let contact = this.props.navigation.state.params.contact;
        let images = this.props.navigation.state.params.images;
        this.state = {
            serviceType,
            hospital,
            profile,
            service,
            specialist,
            bookingDate,
            listTime: [],
            reason,
            images,
            contact
        }
    }
    getLable(time) {
        let h = parseInt(time / 60);
        let m = time % 60;
        return (h ? h < 10 ? "0" + h : h : "00") + ":" + (m ? m : "00");
    }
    getTime(yourDateString) {
        var yourDate = new Date(yourDateString);
        try {
            console.log(yourDateString, yourDate, yourDate.getTimezoneOffset());
            // yourDate.setMinutes(yourDate.getMinutes() + yourDate.getTimezoneOffset());
            yourDate.setMinutes(yourDate.getMinutes());
            console.log(yourDate);
        } catch (error) {
            console.log(error);
        }
        return yourDate;
    }
    analyseTime(listTime) {
        let numberIgnore = 0;
        let itemWidth = 30;
        let widthIgnore = 30;

        length = listTime.length;
        for (let i = 0; i < listTime.length; i++) {
            if (i == length - 1)
                continue;
            let nex = listTime[i + 1];
            let item = listTime[i];
            if (nex.time - item.time > 30 * 60 * 1000) {
                nex.left = 1;
                item.right = 1;
                numberIgnore++;
            }
        }

        // let width = (length * itemWidth) + (numberIgnore * (itemWidth + 5));

        // if (width >= DEVICE_WIDTH - 80) {
        //     width = DEVICE_WIDTH - 80;

        //     itemWidth = (width - (5 * numberIgnore)) / (length + numberIgnore);
        //     widthIgnore = itemWidth + 5;
        // }

        let width = (length * itemWidth) + (numberIgnore * widthIgnore);

        if (width >= DEVICE_WIDTH - 80) {
            width = DEVICE_WIDTH - 80;

            itemWidth = (width - numberIgnore * widthIgnore) / (length);
            // widthIgnore = itemWidth + 5;
        }
        if (itemWidth < 15) {
            widthIgnore = 30;
            width = (length * itemWidth) + (numberIgnore * widthIgnore);

            if (width >= DEVICE_WIDTH - 80) {
                width = DEVICE_WIDTH - 80;

                itemWidth = (width - numberIgnore * widthIgnore) / (length);
                // widthIgnore = itemWidth + 5;
            }

        }

        let marginLeft = (DEVICE_WIDTH - width) / 2 - 30;
        for (let i = 0; i < listTime.length; i++) {
            let item = listTime[i];
            if (i != 0) {
                if (item.left) {
                    marginLeft += widthIgnore + itemWidth;
                }
                else {
                    marginLeft += itemWidth;
                }
            }
            item.marginLeft = marginLeft;
        }
        console.log(listTime);
        this.setState({
            itemWidth,
            numberIgnore,
            widthIgnore,
            timeWidth: width
        })
    }
    selectService(service) {
        this.setState({ schedule: null, serviceError: "", scheduleError: "", allowBooking: true }, () => {
            this.setState({ isLoading: true }, () => {
                scheduleProvider.getByDateAndService(service.id, this.state.bookingDate.format("yyyy-MM-dd")).then(s => {
                    let listTime = [];
                    if (s.code == 0 && s.data) {
                        let data = s.data || [];
                        data.forEach((item, index) => {
                            for (var key in item) {
                                try {
                                    // let date = new Date(key).format("yyyy/MM/dd HH:mm:ss") + " GMT +7";
                                    // let key1 = key.replace("T", " ") + ":00 GMT +7";
                                    let time = this.getTime(key);
                                    // let minute = time.format("mm");
                                    // let label = "";
                                    // if (minute == 0)
                                    //     label = time.format("HH:mm");
                                    // else
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
                    console.log(listTime);

                    this.setState({
                        isLoading: false,
                        listTime: listTime.sort((a, b) => {
                            return a.time - b.time
                        }),
                    }, () => {
                        this.analyseTime(this.state.listTime);
                    });
                }).catch(e => {
                    this.setState({
                        isLoading: false,
                        listTime: []
                    })
                });
            })
        });
    }
    confirmBooking() {
        if (!this.state.allowBooking)
            return;
        let error = false;

        if (this.state.service) {
            if (!this.state.listTime || this.state.listTime.length == 0)
                this.setState({ serviceError: "Không tồn tại lịch khám của dịch vụ này" })
            else
                this.setState({ serviceError: "" })
        } else {
            this.setState({ serviceError: "Dịch vụ không được bỏ trống" })
            error = true;
        }
        if (this.state.schedule) {
            this.setState({ scheduleError: "" })
        } else {
            this.setState({ scheduleError: "Giờ khám không được bỏ trống" })
            error = true;
        }

        if (error)
            return;
        connectionUtils.isConnected().then(s => {
            console.log(this.state.schedule.time, this.state.schedule.time.format("yyyy-MM-dd HH:mm:ss"));
            this.setState({ isLoading: true }, () => {
                console.log(this.state.schedule.time);
                bookingProvider.create(
                    this.state.hospital.hospital.id,
                    this.state.schedule.schedule.id,
                    this.state.profile.medicalRecords.id,
                    this.state.specialist.id,
                    this.state.service.id,
                    this.state.schedule.time.format("yyyy-MM-dd HH:mm:ss"),
                    this.state.reason,
                    this.state.images,
                    this.state.contact
                ).then(s => {
                    this.setState({ isLoading: false }, () => {
                        if (s) {
                            switch (s.code) {
                                case 0:
                                    dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_PROFILE, this.state.profile);

                                    this.props.navigation.navigate("confirmBooking", {
                                        serviceType: this.state.serviceType,
                                        service: this.state.service,
                                        profile: this.state.profile,
                                        hospital: this.state.hospital,
                                        specialist: this.state.specialist,
                                        bookingDate: this.state.bookingDate,
                                        schedule: this.state.schedule,
                                        reason: this.state.reason,
                                        images: this.state.images,
                                        contact: this.state.contact,
                                        booking: s.data
                                    });
                                    break;
                                case 1:
                                    this.setState({ isLoading: false }, () => {
                                        snackbar.show("Đặt khám phải cùng ngày giờ với lịch làm việc", "danger");
                                    });
                                    break;
                                case 2:
                                    this.setState({ isLoading: false }, () => {
                                        snackbar.show("Đã kín lịch trong khung giờ này", "danger");
                                    });
                                    break;
                                case 401:
                                    this.setState({ isLoading: false }, () => {
                                        snackbar.show("Vui lòng đăng nhập để thực hiện", "danger");
                                        this.props.navigation.navigate("login"
                                            // , {
                                            //     nextScreen: {
                                            //         screen: "confirmBooking", params: this.props.navigation.state.params
                                            //     }
                                            // }
                                        );
                                    });
                                    break;
                                default:
                                    this.setState({ isLoading: false }, () => {
                                        snackbar.show("Đặt khám không thành công", "danger");
                                    });
                                    break;
                            }
                        }
                    });
                }).catch(e => {
                    this.setState({ isLoading: false }, () => {
                    });
                })
            });
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })
        return;
        // this.props.navigation.navigate("confirmBooking", {
        //     serviceType: this.state.serviceType,
        //     service: this.state.service,
        //     profile: this.state.profile,
        //     hospital: this.state.hospital,
        //     specialist: this.state.specialist,
        //     bookingDate: this.state.bookingDate,
        //     schedule: this.state.schedule,
        //     reason: this.state.reason,
        //     images: this.state.images,
        //     contact: this.state.contact
        // });
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


    getIcon(item) {
        if (item.type == 0)
            return require("@images/new/booking/ic_timepicker0.png");
        if (item.type == 1)
            return require("@images/new/booking/ic_timepicker1.png");
        if (item.type == 2)
            return require("@images/new/booking/ic_timepicker2.png");
        return require("@images/new/booking/ic_timepicker3.png");
    }
    renderLabel(item, index) {
        let margin = 0;
        let label = item.label;
        if (item.right && index != 0 && !(item.left & item.right)) {
            let time = new Date(item.time.getTime() + 30 * 60000);
            label = time.format("HH") + "h" + time.format("mm");
            margin += this.state.itemWidth;
        }
        margin += 7;
        if (index == 0 || index == this.state.listTime.length - 1 || item.left || item.right)
            return (<Text style={{ fontSize: 9, position: 'absolute', left: item.marginLeft + margin, top: 50 }}>{label}</Text>)
        return null;
    }
    renderIgnoreTime(item, index) {
        return <TouchableOpacity
            onPress={() => {
                snackbar.show("Không có lịch trong khung giờ này", "danger");
                return;
            }}
            style={{
                position: 'absolute', left: this.state.itemWidth - 0, flexDirection: 'row', alignItems: 'center', paddingVertical: 20,
            }}>
            <View style={{ width: this.state.widthIgnore + 10, height: 5, backgroundColor: '#cacaca' }}>
            </View>
            <View style={{
                position: 'absolute',
                width: 8, height: 8,
                borderRadius: 4,
                backgroundColor: '#cacaca', justifyContent: 'center', alignItems: 'center'
            }}>
                <View style={{ width: 2, height: 2, backgroundColor: '#FFF', borderRadius: 1 }}></View>
            </View>
        </TouchableOpacity>
    }
    renderPointer(item, time) {
        return <View style={{
            top: 18.7, position: 'absolute', width: 8, height: 8,
            borderRadius: 4,
            backgroundColor: this.getColor(item), justifyContent: 'center', alignItems: 'center'
        }}>
            <View style={{ width: 2, height: 2, backgroundColor: '#FFF', borderRadius: 1 }}></View>
        </View>
    }
    renderTime(item, index) {
        return <TouchableOpacity onPress={() => {
            if (item.type == 0) {
                snackbar.show("Đã kín lịch trong khung giờ này", "danger");
                return;
            }
            this.setState({ schedule: item, index })
        }}
            style={[{ flexDirection: 'row', position: 'absolute', paddingVertical: 20, left: item.marginLeft + 7, alignItems: 'center', marginTop: 20 }, item.right ? { width: this.state.itemWidth + this.state.widthIgnore + 1 } : {}]}>

            <View style={[{ width: this.state.itemWidth + 1, height: 5, backgroundColor: this.getColor(item), marginLeft: 0, borderTopLeftRadius: 2.5, borderBottomLeftRadius: 2.5 }, index == this.state.listTime.length - 1 ? { borderTopRightRadius: 2.5, borderBottomRightRadius: 2.5 } : {}]}>
            </View>
            {
                item.right && this.renderIgnoreTime(item, index)
            }
            {
                this.renderPointer(item, index)
            }
        </TouchableOpacity>
    }

    selectMonth(date) {
        if (this.state.service && this.state.service.length) {
            let service = this.state.service[0];
            this.setState({ isLoading: true }, () => {
                console.log(this.state.service);
                scheduleProvider.search(service.service.id, date.getFirstDateOfMonth().format("yyyy-MM-dd 00:00:00"), date.getLastDateOfMonth().format("yyyy-MM-dd 23:59:59"), 1, 1000).then(s => {
                    alert(JSON.stringify(s));
                })
                this.setState({ isLoading: false });
            })
        }
    }

    selectTime = (item) => () => {
        if (item.type == 0) {
            snackbar.show("Đã kín lịch trong khung giờ này", "danger");
            return;
        }
        this.setState({ schedule: item })
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

    render() {
        console.log(this.state.listTime);
        return (<ActivityPanel
            icBack={require('@images/new/left_arrow_white.png')}
            iosBarStyle={'light-content'}
            statusbarBackgroundColor="#4BBA7B"
            actionbarStyle={styles.actionbarStyle}
            titleStyle={styles.titleStyle}
            isLoading={this.state.isLoading}
            title="Chọn thời gian" >
            <View style={{ backgroundColor: '#FFF', flex: 1 }}>
                <ScaleImage source={require("@images/new/booking/bg_booking.png")} height={200} width={DEVICE_WIDTH} style={{ position: 'absolute', bottom: 10, right: 10 }} />
                <View style={styles.container}>
                    <Text style={{ color: '#00c088', fontWeight: 'bold', fontSize: 16, margin: 10 }}>CHỌN NGÀY GIỜ CÓ MÀU XANH</Text>
                    <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

                        <View style={{ position: 'relative', left: 0, right: 0, width: DEVICE_WIDTH }}>
                            <Calendar style={{ width: '100%' }}
                                // markedDates={this.state.listSchedule}
                                current={(this.state.latestTime || new Date()).format("yyyy-MM-dd")}
                                onDayPress={(day) => {
                                    this.setState({
                                        dateString: day.dateString,
                                        bookingDate: day.dateString.toDateObject()
                                    }, () => {
                                        this.selectService(this.state.service[0].service)
                                    })
                                }}
                                monthFormat={'MMMM - yyyy'}
                                onMonthChange={(month) => {
                                    this.selectMonth(month.dateString.toDateObject())
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
                                    : <Text style={[styles.errorStyle]}>{"Ngày bạn chọn không có lịch khám nào"}</Text>
                                :
                                null
                        }

                    </ScrollView>
                    <TouchableOpacity style={[styles.button, this.state.allowBooking ? { backgroundColor: "#02c39a" } : {}]} onPress={this.confirmBooking.bind(this)}>
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
    actionbarStyle: {
        backgroundColor: '#4BBA7B',
        borderBottomWidth: 0
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
export default connect(mapStateToProps)(SelectTimeScreen);