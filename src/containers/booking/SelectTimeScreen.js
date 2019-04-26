import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, Slider } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
import { Card } from 'native-base';

const DEVICE_HEIGHT = Dimensions.get('window').height;
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
import scheduleProvider from '@data-access/schedule-provider';
import specialistProvider from '@data-access/specialist-provider';
import DateTimePicker from 'mainam-react-native-date-picker';

import snackbar from '@utils/snackbar-utils';
import dateUtils from "mainam-react-native-date-utils";
import ImageLoad from 'mainam-react-native-image-loader';
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import Field from "mainam-react-native-form-validate/Field";

class SelectTimeScreen extends Component {
    constructor(props) {
        super(props);
        let serviceType = this.props.navigation.state.params.serviceType;
        let hospital = this.props.navigation.state.params.hospital;
        let profile = this.props.navigation.state.params.profile;
        let specialist = this.props.navigation.state.params.specialist;
        let bookingDate = this.props.navigation.state.params.bookingDate;
        let reason = this.props.navigation.state.params.reason;
        let images = this.props.navigation.state.params.images;

        this.state = {
            serviceType,
            hospital,
            profile,
            specialist,
            bookingDate,
            listTime: [],
            reason,
            images
        }
    }
    getLable(time) {
        let h = parseInt(time / 60);
        let m = time % 60;
        return (h ? h < 10 ? "0" + h : h : "00") + ":" + (m ? m : "00");
    }
    selectService(service) {
        // alert(JSON.stringify(service));
        // return;
        this.setState({ service: service, schedule: null, serviceError: "", scheduleError: "" }, () => {
            this.setState({ isLoading: true }, () => {
                scheduleProvider.getByDateAndService(service.id, this.state.bookingDate.format("yyyy-MM-dd")).then(s => {
                    let listTime = [];
                    if (s.code == 0 && s.data) {
                        let schedule = s.data.schedule;
                        for (var i = 0; i < 1410; i += 30) {
                            let dateString = this.state.bookingDate.format("yyyy-MM-dd") + "T" + this.getLable(i);
                            let date = new Date(dateString);
                            for (var j = 0; j < schedule.length; j++) {
                                if (schedule[j].deleted != 0)
                                    continue;
                                let startWorking = new Date(schedule[j].startWorking);
                                let endWorking = new Date(schedule[j].endWorking);
                                if (startWorking <= date && date <= endWorking) {
                                    if (listTime.filter(item => {
                                        return item.time == i;
                                    }).length == 0)
                                        listTime.push({
                                            date,
                                            time: i,
                                            label: this.getLable(i),
                                            count: 0,
                                            allowBooking: true,
                                            isAvailable: true,
                                            schedule: schedule[j]
                                        })
                                }
                            }
                        }
                    }
                    this.setState({
                        isLoading: false,
                        listTime: listTime.sort((a, b) => {
                            return a.time - b.time
                        })
                    })
                }).catch(e => {
                    this.setState({
                        isLoading: false,
                        listTime: []
                    })
                });
            })
        });
    }

    analyzeDoctorTime(listBooking) {
        return;
        var time = this.state.listTime;
        var bookingInSchedule = {}
        var isToday = this.state.bookingDate ? this.state.bookingDate.format("yyyy-MM-dd") == new Date().format("yyyy-MM-dd") : false;

        for (var i = 0; i < listBooking.length; i++) {
            var item = listBooking[i];
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
    showLabel(item, index) {
        if (item.time % 60 == 0)
            return true;
        if (index == 0)
            return true;
        let hour1 = parseInt(item.time / 60);
        let hour0 = parseInt(this.state.listTime[index - 1].time / 60);
        if (hour0 != hour1)
            return true;
        return false;

    }
    confirmBooking() {
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
        this.props.navigation.navigate("confirmBooking", {
            serviceType: this.state.serviceType,
            service: this.state.service,
            profile: this.state.profile,
            hospital: this.state.hospital,
            specialist: this.state.specialist,
            bookingDate: this.state.bookingDate,
            schedule: this.state.schedule,
            reason: this.state.reason,
            images: this.state.images
        });
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
                <View style={styles.article}>
                    <TouchableOpacity style={styles.mucdichkham} onPress={() => {
                        this.props.navigation.navigate("selectService", { hospital: this.state.hospital, specialist: this.state.specialist, onSelected: this.selectService.bind(this) })
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
                            <Text style={{ marginTop: 20, fontSize: 13 }}>Gợi ý: Chọn những giờ màu xanh sẽ giúp bạn được phục vụ nhanh hơn</Text>
                            <View style={{ width: this.state.listTime.length * 32 + 100, alignSelf: 'center', position: 'relative', marginTop: 20 }}>
                                {this.state.schedule &&
                                    <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', left: (this.state.index || 0) * 32 + 53, top: 0 }}>
                                        <ScaleImage height={30} source={require("@images/new/booking/ic_timepicker1.png")} />
                                        <Text style={{ fontSize: 9, marginLeft: 5, fontWeight: 'bold' }}>{this.state.schedule.label}</Text>
                                    </View>
                                }
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                                    {
                                        this.state.listTime.map((item, index) => {
                                            return <TouchableOpacity key={index} style={{ justifyContent: 'center' }}
                                                onPress={() => {
                                                    this.setState({ schedule: item, index })
                                                }}
                                            >
                                                {
                                                    item == this.state.schedule ?
                                                        <View style={{ height: 30 }}></View>
                                                        // <ScaleImage height={30} source={require("@images/new/booking/ic_timepicker1.png")} />
                                                        : <View style={{ height: 30 }}></View>
                                                }

                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                                                    <View style={{ width: 12, height: 5, backgroundColor: index != 0 ? '#02c39a' : 'transparent' }}></View>
                                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#02c39a', justifyContent: 'center', alignItems: 'center' }}>
                                                        <View style={{ width: 2, height: 2, backgroundColor: '#FFF', borderRadius: 1 }}></View>
                                                    </View>
                                                    <View style={{ width: 12, height: 5, backgroundColor: index < this.state.listTime.length - 1 ? '#02c39a' : 'transparent' }}></View>
                                                </View>
                                                <Text style={{ fontSize: 9 }}>{this.showLabel(item, index) ?
                                                    item.label : " "}</Text>
                                            </TouchableOpacity>
                                        })
                                    }
                                </View>
                            </View>
                            {
                                this.state.scheduleError ?
                                    <Text style={[styles.errorStyle]}>{this.state.scheduleError}</Text> : null
                            }

                        </View> : null
                }

                <View style={styles.btn}>
                    <TouchableOpacity style={styles.button} onPress={this.confirmBooking.bind(this)}>
                        <Text style={styles.txtbtn}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
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
    btn: {
        position: 'absolute',
        alignItems: 'center',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 30

    },
    button: {
        borderRadius: 6,
        backgroundColor: "#02c39a",
        shadowColor: "rgba(0, 0, 0, 0.21)",
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1

    },
    txtbtn: {
        fontSize: 18,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#ffffff",
        padding: 15,
        paddingLeft: 100,
        paddingRight: 100
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