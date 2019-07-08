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
        let date = new Date(new Date().format("MM/dd/yyyy"));
        let date1 = new Date(date.setMinutes(date.getMinutes() + (8 * 60)));
        listTime = [];
        listTime.push({
            type: 3,
            time: date1,
            label: "08:00"
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "08:30"
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "09:00"
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "09:30"
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "10:00"
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "10:30"
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "11:00"
        })
        // date1= new Date(date.setMinutes(date.getMinutes() + 30));
        // listTime.push({
        //     type: 3,
        //     time: date1,
        //     label: "11:30"
        // })
        date1 = new Date(date.setMinutes(date.getMinutes() + 150));
        listTime.push({
            type: 3,
            time: date1,
            label: "13:30",
            label2: "1:30"            
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "14:00",
            label2: "2:00"
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "14:30",
            label2: "2:30"
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "15:00",
            label2: "3:00"
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "15:30",
            label2: "3:30"
        })
        date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        listTime.push({
            type: 3,
            time: date1,
            label: "16:00",
            label2: "4:00"
        })
        // date1 = new Date(date.setMinutes(date.getMinutes() + 30));
        // listTime.push({
        //     type: 3,
        //     time: date1,
        //     label: "16:30"
        // })

        this.state = {
            listTime
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
            // console.log(yourDateString, yourDate, yourDate.getTimezoneOffset());
            yourDate.setMinutes(yourDate.getMinutes() + yourDate.getTimezoneOffset());
            console.log(yourDate);
        } catch (error) {
            console.log(error);
        }
        return yourDate;
    }
    componentDidMount() {
        this.analyseTime(this.state.listTime);
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

        let width = (length * itemWidth) + (numberIgnore * widthIgnore);

        if (width >= DEVICE_WIDTH - 80) {
            width = DEVICE_WIDTH - 80;

            itemWidth = (width - numberIgnore * widthIgnore) / (length);
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
    getColor(item) {
        if (item.type == 0)
            return "#d0021b";
        if (item.type == 1)
            return "#ffa500";
        if (item.type == 2)
            return "#efd100";
        return "#02c39a";
    }

    componentWillReceiveProps(props) {
        // if (this.state.schedules != props.schedules) {
        //     this.setState({ schedules: props.schedules, schedule: null }, () => {
        //         let listTime = [];
        //         if (props.schedules) {
        //             let data = props.schedules || [];
        //             data.forEach((item, index) => {
        //                 for (var key in item) {
        //                     try {
        //                         let time = this.getTime(key);
        //                         label = time.format("HH") + "h" + time.format("mm");
        //                         let schedule = {
        //                             label,
        //                             time,
        //                             key: key,
        //                             percent: 100
        //                         }
        //                         let schedules = ((item[key] || {}).detailSchedules || []);
        //                         schedules.forEach((item2, index2) => {
        //                             let detailSchedule = item2.detailSchedule;
        //                             if (item2.numberCase && detailSchedule) {
        //                                 let percent = ((item2.numberSlot || 0) * 100) / (item2.numberCase || 1);
        //                                 if (percent <= schedule.percent) {
        //                                     schedule.percent = percent;
        //                                     schedule.schedule = detailSchedule;
        //                                     schedule.doctor = item2.doctorVendor;
        //                                     schedule.numberSlot = item2.numberSlot || 0;
        //                                     schedule.numberCase = item2.numberCase || 1;

        //                                     let available = 100 - percent;
        //                                     if (available == 0)
        //                                         schedule.type = 0;
        //                                     else
        //                                         if (available < 30)
        //                                             schedule.type = 1;
        //                                         else
        //                                             if (available < 70)
        //                                                 schedule.type = 2;
        //                                             else
        //                                                 schedule.type = 3;
        //                                 }
        //                             }
        //                         });
        //                         if (schedule.schedule) {
        //                             listTime.push(schedule);
        //                         }
        //                     } catch (error) {

        //                     }
        //                 }
        //             });
        //         }
        //         console.log(listTime);

        //         this.setState({
        //             isLoading: false,
        //             listTime: listTime.sort((a, b) => {
        //                 return a.time - b.time
        //             })
        //         }, () => {
        //             this.analyseTime(this.state.listTime);
        //             if (this.props.onChange)
        //                 this.props.onChange(null);
        //         });
        //     });
        // }
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
            return (<Text key={index} style={{ fontSize: 9, position: 'absolute', left: item.marginLeft + margin, top: 50 }}>{label}</Text>)
        return null;
    }
    renderIgnoreTime(item, index) {
        return <TouchableOpacity
            onPress={() => {
                snackbar.show(constants.msg.booking.not_result_history_of_this_time, "danger");
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
        return <TouchableOpacity key={index} onPress={() => {
            if (item.type == 0) {
                snackbar.show(constants.msg.booking.full_slot_on_this_time, "danger");
                return;
            }
            this.setState({ schedule: item, index }, () => {
                if (this.props.onChange)
                    this.props.onChange(item);
            })
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
    // componentDidMount() {

    //     // let listTime = [];
    //     //     data.forEach((item, index) => {
    //     //         for (var key in item) {
    //     //             try {
    //     //                 let time = this.getTime(key);
    //     //                 label = time.format("HH") + "h" + time.format("mm");
    //     //                 let schedule = {
    //     //                     label,
    //     //                     time,
    //     //                     key: key,
    //     //                     percent: 100
    //     //                 }
    //     //                 let schedules = ((item[key] || {}).detailSchedules || []);
    //     //                 schedules.forEach((item2, index2) => {
    //     //                     let detailSchedule = item2.detailSchedule;
    //     //                     if (item2.numberCase && detailSchedule) {
    //     //                         let percent = ((item2.numberSlot || 0) * 100) / (item2.numberCase || 1);
    //     //                         if (percent <= schedule.percent) {
    //     //                             schedule.percent = percent;
    //     //                             schedule.schedule = detailSchedule;
    //     //                             schedule.doctor = item2.doctorVendor;
    //     //                             schedule.numberSlot = item2.numberSlot || 0;
    //     //                             schedule.numberCase = item2.numberCase || 1;

    //     //                             let available = 100 - percent;
    //     //                             if (available == 0)
    //     //                                 schedule.type = 0;
    //     //                             else
    //     //                                 if (available < 30)
    //     //                                     schedule.type = 1;
    //     //                                 else
    //     //                                     if (available < 70)
    //     //                                         schedule.type = 2;
    //     //                                     else
    //     //                                         schedule.type = 3;
    //     //                         }
    //     //                     }
    //     //                 });
    //     //                 if (schedule.schedule) {
    //     //                     listTime.push(schedule);
    //     //                 }
    //     //             } catch (error) {

    //     //             }
    //     //         }
    //     //     });
    //     // console.log(listTime);
    //     debugger;

    //     this.setState({
    //         listTime: [{

    //         }]
    //     });
    // }

    render() {
        if (this.state.listTime && this.state.listTime.length > 0)
            return <View style={{
                position: 'relative',
                marginTop: 20, height: 100, paddingTop: 40, marginLeft: 20
            }}>
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
        else {
            return (
                <View style={{ alignItems: 'center', paddingVertical: 20, height: 100, justifyContent: 'center' }}>
                    <View style={{ width: DEVICE_WIDTH - 80, height: 5, backgroundColor: '#cacaca', borderRadius: 2.5 }}></View>
                </View>
            );
        }

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
        color: "#000000"
    },
    chonGioKham: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center'
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