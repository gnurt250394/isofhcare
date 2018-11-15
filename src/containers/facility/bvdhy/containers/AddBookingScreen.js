import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import constants from '@dhy/strings';
import AddBookingHasProfile from '@dhy/components/AddBookingHasProfile';
import AddBookingNoProfile from '@dhy/components/AddBookingNoProfile';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import userProvider from '@data-access/user-provider';
import profileProvider from '@dhy/data-access/booking-profile-provider';
import bookingProvider from '@dhy/data-access/booking-provider';
import Dimensions from 'Dimensions';
// import banner from '@resources/booking_banner.png';
import dateUtils from 'mainam-react-native-date-utils';
import client from '@utils/client-utils';
import snackbar from '@utils/snackbar-utils';
import DialogBox from 'react-native-dialogbox';
// import storage from '@data-access/storage-provider';
import RequiredLogin from '@components/account/RequiredLogin';
import redux from '@redux-store';
class AddBookingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            profile: null
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true }, () => {
            profileProvider.getListProfiles(this.props.userApp.currentUser.id, (s, e) => {
                this.setState({
                    isLoading: false,
                    profile: s
                })
            })
        })
    }

    getDate(date) {
        if (date) {
            var _date = new Date(date.timestamp);
            return _date.format("thu, dd/MM/yyyy");
        }
    }
    showLoading(isLoading) {
        this.setState({
            isLoading: isLoading
        })
    }
    selectSchedule(time) {
        if (this.props.booking.schedule && this.props.booking.schedule.dots) {
            for (var i = 0; i < this.props.booking.schedule.dots.length; i++) {
                var item = this.props.booking.schedule.dots[i].schedule;
                if (item.schedule.startWorking <= time && item.schedule.endWorking >= time)
                    return item.schedule;
            }
        }
        return null;

    }
    addBooking(profile) {
        // alert(JSON.stringify(this.props.booking.date.dateString) + "\n " + this.props.booking.time.time)
        let myTime = this.props.booking.time.time;
        // myTime.substr(0, myTime.indexOf(':')) < 10 ? myTime = "0" + myTime : myTime
        Keyboard.dismiss();
        var schedule = this.getSchedule();
        if (!schedule)
            return;
        this.setState({
            isLoading: true
        }, () => {
            bookingProvider.addBooking(
                profile.profile.id,
                schedule.id,
                this.props.booking.date.dateString + " " + myTime + ":00",
                this.state.note,
                1, (s, e) => {
                    // this.showLoading(false);
                    this.setState({
                        isLoading: false,
                    })
                    try {
                        var value = JSON.parse(s.data.checkinResult).Patient.Value;
                        if (result) {
                            profile.value = result;
                            this.props.dispatch({ type: constants.action.action_load_booking_profile, value: profile })
                        }
                    } catch (error) {

                    }
                    if (s) {
                        switch (s.code) {
                            case 0:
                                // this.props.dispatch(redux.userAddNewBooking(s.data));
                                this.dialogbox.tip({
                                    title: constants.alert,
                                    content: [constants.msg.booking.add_booking_success],
                                    btn: {
                                        text: constants.view,
                                        style: {
                                            color: 'red'
                                        }
                                    }
                                }).then((event) => {
                                    this.props.navigation.navigate("ehealth");
                                    // this.props.dispatch({ type: constants.action.action_select_ehealth_tab, value: true });
                                    // this.props.dispatch({ type: constants.action.action_trigger_load_list_booking, value: true });
                                    // Actions.popTo('main');
                                });
                                return;
                            case 2:
                                snackbar.show(constants.msg.booking.maximum_booking_count_in_this_time)
                                return;
                            case 3:
                                snackbar.show(constants.msg.booking.add_booking_check_in_not_success)
                                return;
                            case 6:
                                snackbar.show(s.message);
                                return;
                            case 7:
                                snackbar.show(s.message);
                                return;
                            case 8:
                                snackbar.show(s.message);
                                return;
                            case 9:
                                snackbar.show(constants.msg.booking.exist_booking_not_payment);
                                return;
                            case 500:
                                snackbar.show(constants.msg.booking.add_booking_error)
                                return;

                        }


                    } else {
                        snackbar.show(constants.msg.booking.add_booking_error)
                    }
                })
        })
        // this.showLoading(true);
        this.setState({
            isLoading: false,
        })
    }
    getSchedule() {
        var schedule = this.selectSchedule(this.props.booking.time.value);
        if (!schedule) {
            snackbar.show(constants.msg.booking.not_found_schedule_of_doctor_in_this_day);
            return null;
        }
        if (!this.state.note || this.state.note.trim() == "") {
            snackbar.show(constants.msg.booking.please_input_booking_note);
            return null;
        }
        if (this.state.note.length > 150) {
            snackbar.show(constants.msg.booking.please_input_booking_note_less_than_150_character);
            return null;
        }
        return schedule;
    }
    createProfile() {
        try {
            Keyboard.dismiss();
            if (!this.getSchedule())
                return;

            var temp = this.formProfile.getWrappedInstance().createProfile();
            console.log(temp)
            if (temp) {
                this.showLoading(true);
                profileProvider.createProfile(
                    1, // Source Default DHY = 1
                    this.props.userApp.currentUser.id,
                    temp.fullname.trim(),
                    temp.gender,
                    temp.bod.format("yyyy-MM-dd"),
                    temp.country.id,
                    temp.country.name,
                    temp.province.id,
                    temp.province.name,
                    temp.district.id,
                    temp.district.name,
                    temp.zone.id,
                    temp.zone.name,
                    temp.phoneNumber,
                    temp.guardianPhoneNumber,
                    temp.guardianName,
                    (res) => {
                        if (res) {
                            this.showLoading(false);
                            if (res.code == 0) {
                                this.props.dispatch({
                                    type: constants.action.action_load_booking_profile, value: { profile: res.data.profile }
                                });
                                // storage.save(constants.key.storage.user_profile + this.props.userApp.currentUser.id, [res.data.profile]);
                                this.addBooking({ profile: res.data.profile });
                            } else {
                                if (res.code == 1) {
                                    snackbar.show(constants.msg.booking.exist_profile, "danger");
                                }
                                else {
                                    snackbar.show("Lỗi, vui lòng thử lại sau", "danger");
                                }
                            }
                        }
                    })
            }
        } catch (error) {
            console.log(error);
            this.showLoading(false);

        }
    }
    render() {
        console.log("00000000000000000000000000000000000000000000000000")
        console.log(this.state.profile)
        console.log("00000000000000000000000000000000000000000000000000")
        return (
            <ActivityPanel style={{ flex: 1, }} hideActionbar={!this.props.userApp.isLogin} title="Đặt lịch khám" isLoading={this.state.isLoading} touchToDismiss={true} showFullScreen={true} >
                {/* {
                    !this.props.userApp.isLogin ?
                        <RequiredLogin directScreen={() => { Actions.popTo('viewScheduleDoctor') }} /> 
                        : */}
                <View style={{ flex: 1 }}>
                    <View style={{ padding: 10, flexDirection: 'column', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={{ width: 60, height: 60, borderRadius: 30 }} source={require("@images/doctor.png")}></Image>
                            <View style={{ flex: 1, marginLeft: 10, flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold' }}>
                                    {this.props.booking.doctor.academicRankShortName} {this.props.booking.doctor.fullname}
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    <Text style={{ color: '#00accc', fontWeight: 'bold' }}>{this.props.booking.time.label}</Text>
                                    <Text style={{ marginLeft: 5 }}>- {this.getDate(this.props.booking.date)}</Text>
                                </View>
                                {this.props.booking.specialist2 ?
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Chuyên khoa: </Text>
                                        <Text style={{ flex: 1, color: '#00accc', fontWeight: 'bold' }}>{this.props.booking.specialist2.name}</Text>
                                    </View> : null}
                                {
                                    this.props.booking.time && this.props.booking.time.service ?
                                        <View>
                                            <View style={{ flexDirection: 'row', marginTop: 7 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Dịch vụ: </Text>
                                                <Text style={{ flex: 1, color: '#00accc', padding: 2, paddingLeft: 5, paddingRight: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 5, fontWeight: 'bold' }}>{this.props.booking.time.service.name}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', marginTop: 7 }}>
                                                <Text style={{ fontWeight: 'bold' }}>Giá dịch vụ: </Text>
                                                <Text style={{ flex: 1, color: '#00accc', padding: 2, paddingLeft: 5, paddingRight: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 5, fontWeight: 'bold' }}>{this.props.booking.time.service.price.formatPrice()} đ</Text>
                                            </View>
                                        </View> : null
                                }
                            </View>
                        </View>
                    </View>
                    <ScrollView style={{ flex: 1, padding: 10, flexDirection: 'column', paddingBottom: 20 }} keyboardShouldPersistTaps='always'>
                        {
                            this.state.profile && (this.state.profile.length > 0 || this.state.profile.profile) ?
                                <AddBookingHasProfile profile={this.state.profile}></AddBookingHasProfile> :
                                <AddBookingNoProfile ref={(element) => this.formProfile = element}></AddBookingNoProfile>
                        }
                        <KeyboardAvoidingView behavior="padding">
                            <View style={{ flexDirection: 'row', padding: 3, marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>{constants.msg.booking.reason_booking}</Text>
                            </View>
                            <TextInput
                                onChangeText={(s) => { this.setState({ note: s }) }}
                                multiline={true} underlineColorAndroid='transparent' style={{ borderColor: constants.colors.primaryColor, borderWidth: 1, margin: 3, minHeight: 100, textAlignVertical: 'top', paddingLeft: 5, paddingRight: 5 }} placeholder="Nhập tình trạng sức khỏe của bạn" />
                            <View style={{ flex: 1, alignItems: 'flex-end', marginBottom: 50 }}>
                                <TouchableOpacity onPress={() =>
                                    this.state.profile && (this.state.profile.length > 0 || this.state.profile.profile)
                                        ? this.addBooking(this.state.profile)
                                        : this.createProfile()
                                }>
                                    <Text style={{ margin: 3, padding: 5, backgroundColor: constants.colors.buttonOkColor, color: '#FFF', fontWeight: 'bold', borderRadius: 15, paddingLeft: 15, paddingRight: 15, marginTop: 10 }}>Gửi lịch</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 50 }} />
                        </KeyboardAvoidingView>
                    </ScrollView >
                    <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }} />
                </View>
                {/* } */}
            </ActivityPanel >
        )
    }
}
const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    timeItem: {
        flex: 1, color: '#FFF',
        fontWeight: 'bold',
        padding: 3,
        margin: 0.8,
        borderRadius: 5,
        textAlign: 'center',
        backgroundColor: '#0c8c8b'

    },

    tabContainer: { flexDirection: 'row', height: 60, backgroundColor: '#000' },
    tabItem: { flex: 1, backgroundColor: '#FFF', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    tabImage: {
        width: 21, height: 21, marginBottom: 5, marginTop: 10
    },
    tabText: {
        fontSize: 12
    }

});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.dhyBooking
    };
}
export default connect(mapStateToProps)(AddBookingScreen);