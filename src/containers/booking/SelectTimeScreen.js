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


class SelectTimeScreen extends Component {
    constructor(props) {
        super(props);
        let serviceType = this.props.navigation.state.params.serviceType;
        let hospital = this.props.navigation.state.params.hospital;
        let profile = this.props.navigation.state.params.profile;
        let specialist = this.props.navigation.state.params.specialist;
        let bookingDate = this.props.navigation.state.params.bookingDate;
        let reason = this.props.navigation.state.params.reason;
        let contact = this.props.navigation.state.params.contact;
        let images = this.props.navigation.state.params.images;

        this.state = {
            serviceType,
            hospital,
            profile,
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
            yourDate.setMinutes(yourDate.getMinutes() + yourDate.getTimezoneOffset());
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
        // alert(JSON.stringify(service));
        // return;
        this.setState({ service: service, schedule: null, serviceError: "", scheduleError: "", allowBooking: true }, () => {
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
                        })
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
            snackbar.show("Không có kết nối mạng", "danger");
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

    render() {
        return (<ActivityPanel isLoading={this.state.isLoading} style={{ flex: 1, backgroundColor: '#f7f9fb' }} title="Thời gian"
            titleStyle={{ marginLeft: 0 }}
            containerStyle={{
                backgroundColor: "#f7f9fb"
            }} actionbarStyle={{
                backgroundColor: '#ffffff',
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.06)'
            }}>

            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.article}>
                        <TouchableOpacity style={styles.mucdichkham} onPress={() => {
                            this.props.navigation.navigate("selectService", {
                                hospital: this.state.hospital,
                                specialist: this.state.specialist,
                                serviceType: this.state.serviceType,
                                onSelected: this.selectService.bind(this)
                            })
                        }}>
                            <ScaleImage style={styles.imgIc} height={15} source={require("@images/new/booking/ic_specialist.png")} />
                            <Text style={styles.mdk}>{this.state.service ? this.state.service.name : "Chọn dịch vụ"}</Text>
                            <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                        </TouchableOpacity>
                        {
                            this.state.serviceError ?
                                <Text style={[styles.errorStyle]}>{this.state.serviceError}</Text> : null
                        }

                        <View style={styles.border}></View>
                    </View>

                    {
                        this.state.listTime && this.state.listTime.length > 0 ?
                            <View style={styles.chonGioKham}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <ScaleImage source={require("@images/new/booking/ic_bookingDate.png")} width={20} />
                                    <Text style={styles.txtchongiokham}>Chọn giờ khám</Text>
                                </View>
                                <Text style={{ marginTop: 20, fontSize: 14, color:'#8e8e93' }}>Gợi ý: Chọn những giờ màu xanh sẽ giúp bạn được phục vụ nhanh hơn</Text>

                                <View style={{ position: 'relative', marginTop: 20, height: 100, paddingTop: 40 }}>
                                    {
                                        this.state.listTime.map((item, index) =>
                                            this.renderTime(item, index))
                                    }
                                    {this.state.schedule &&
                                        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', left: this.state.schedule.marginLeft - 1, top: 10 }}>
                                            <ScaleImage height={30} source={this.getIcon(this.state.schedule)} />
                                            <Text style={{ fontSize: 11, marginLeft: 2, fontWeight: 'bold' }}>{this.state.schedule.label}</Text>
                                        </View>
                                    }
                                    {
                                        this.state.listTime.map((item, index) =>
                                            this.renderLabel(item, index))
                                    }
                                </View>
                                {/* </View> */}



                                {/* <View style={{ width: this.state.listTime.length * 24 + 100, alignSelf: 'center', position: 'relative', marginTop: 20 }}>
                                    {this.state.schedule &&
                                        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', left: (this.state.index || 0) * 24 + 50, top: 0 }}>
                                            <ScaleImage height={30} source={this.getIcon(this.state.schedule)} />
                                            <Text style={{ fontSize: 9, marginLeft: 5, fontWeight: 'bold' }}>{this.state.schedule.label}</Text>
                                        </View>
                                    }
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        {
                                            this.state.listTime.map((item, index) => {
                                                return <TouchableOpacity key={index} style={{ justifyContent: 'center' }}
                                                    onPress={() => {
                                                        if (item.type == 0) {
                                                            snackbar.show("Đã kín lịch trong khung giờ này", "danger");
                                                            return;
                                                        }
                                                        this.setState({ schedule: item, index })
                                                    }}
                                                >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center", marginTop: 30 }}>
                                                        <View style={{ width: 8, height: 5, backgroundColor: index != 0 ? this.getColor(item) : 'transparent' }}></View>
                                                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: this.getColor(item), justifyContent: 'center', alignItems: 'center' }}>
                                                            <View style={{ width: 2, height: 2, backgroundColor: '#FFF', borderRadius: 1 }}></View>
                                                        </View>
                                                        <View style={{ width: 8, height: 5, backgroundColor: index < this.state.listTime.length - 1 ? this.getColor(item) : 'transparent' }}></View>
                                                    </View>
                                                    <Text style={{ fontSize: 7 }}>{this.showLabel(item, index) ?
                                                        item.label : " "}</Text>
                                                </TouchableOpacity>
                                            })
                                        }
                                    </View>
                                </View> */}
                                {
                                    this.state.scheduleError ?
                                        <Text style={[styles.errorStyle]}>{this.state.scheduleError}</Text> : null
                                }

                            </View> : null
                    }
                </ScrollView>
                <TouchableOpacity style={[styles.button, this.state.allowBooking ? { backgroundColor: "#02c39a" } : {}]} onPress={this.confirmBooking.bind(this)}>
                    <Text style={styles.btntext}>Xác nhận</Text>
                </TouchableOpacity>
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
        backgroundColor: "#f7f9fb",



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
        color: "#4a4a4a"
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
        color: 'red',
        marginTop: 10,
        marginLeft: 25
    }
})
export default connect(mapStateToProps)(SelectTimeScreen);