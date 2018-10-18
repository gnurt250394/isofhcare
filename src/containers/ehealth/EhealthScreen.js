import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import Dash from 'mainam-react-native-dash-view';
import bookingProvider from '@data-access/booking-provider';
import constants from '@resources/strings';
import constants2 from '@ehealth/daihocy/resources/strings';
import dateUtils from 'mainam-react-native-date-utils';

import { Card } from 'native-base';
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            data: [],
            loading: false,
            bookings: [],
            hospitals: [],
            loadFirstTime: true
        }
    }
    componentDidMount() {
        this.onRefresh();
    }

    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, loading: true }, () => {
                this.onLoad();
            });
    }
    getListBookings(hospitals) {
        let data = [];
        if (hospitals != null && hospitals.length > 0) {
            hospitals.forEach(item => {
                if (item != null) {
                    if (item.patientHistories && item.hospital) {
                        if (item.patientHistories.patientHistory && item.patientHistories.patientHistory.length > 0) {
                            item.patientHistories.patientHistory.forEach(item2 => {
                                if (item2) {
                                    item2.hospitalId = item.hospital.id;
                                    item2.hospitalName = item.hospital.name;
                                    data.push(item2)
                                }
                            })
                        }
                        if (item.patientHistories.bookingNotInHis && item.patientHistories.bookingNotInHis.length > 0) {
                            item.patientHistories.bookingNotInHis.forEach(item2 => {
                                if (item2) {
                                    item2.hospitalId = item.hospital.id;
                                    item2.hospitalName = item.hospital.name;
                                    data.push(item2)
                                }
                            })
                        }
                    }
                }
            });
        }
        return data;
    }
    selectHospital(hospital) {
        let bookings = [];
        if (hospital)
            bookings = this.getListBookings([hospital]);
        else
            bookings = this.getListBookings(this.state.hospitals);
        this.setState({ currentHospital: hospital, bookings });
    }
    onLoad() {
        this.setState({
            loading: true,
            refreshing: true
        }, () => {
            bookingProvider.getListBooking(this.props.userApp.currentUser.id, (s, e) => {
                this.setState({ loadFirstTime: false });

                this.setState({
                    loading: false,
                    refreshing: false
                }, () => {
                    if (s && s.code == 0 && s.data && s.data.hospitals) {
                        let hospitals = s.data.hospitals;
                        let currentHospital = null;
                        // if (hospitals.length != 1)
                        hospitals.splice(0, 0, null);
                        // else
                        //     currentHospital = hospitals[0];
                        let bookings = this.getListBookings(hospitals);
                        this.setState({ hospitals, bookings, currentHospital });
                    }
                });
            });
        });
    }

    renderHeader() {
        if (this.state.loadFirstTime) {
            return null;
        }


        return <View style={{ padding: 20, width: '100%' }}>
            <View style={{
                flexDirection: 'row', alignItems: 'center',
            }}>
                <ScaledImage source={require("@images/ehealth/ichospital.png")} width={20} style={{ marginRight: 8 }} />
                <Text style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    color: "#9b9b9b"
                }}>Bệnh viện</Text>
            </View>
            <TouchableOpacity
                onPress={() => this.setState({ toggleHospital: true })}
                style={{
                    marginLeft: 28, borderRadius: 4,
                    borderStyle: "solid",
                    borderWidth: 1,
                    padding: 10,
                    marginTop: 13,
                    borderColor: "#3160ac",
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                <Text style={{ flex: 1 }}>{this.state.currentHospital && this.state.currentHospital.hospital ? this.state.currentHospital.hospital.name : "Tất cả bệnh viện"}</Text>
                <ScaledImage source={require("@images/ehealth/icdropdown.png")} width={10} />
            </TouchableOpacity>
            <View style={{
                flexDirection: 'row', alignItems: 'center', marginTop: 20
            }}>
                <ScaledImage source={require("@images/ehealth/ichistory.png")} width={20} style={{ marginRight: 8 }} />
                <Text style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    color: "#9b9b9b"
                }}>Lịch sử</Text>
            </View>
            {
                !this.state.bookings || this.state.bookings.length == 0 ?
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ fontStyle: 'italic' }}>Không thấy lịch sử khám nào</Text>
                    </View> : null
            }
        </View>
    }

    getDetailBooking(patientHistoryId, hospitalId) {
        this.setState({ isLoading: true }, () => {
            this.props.dispatch({ type: constants2.action.action_select_hospital, value: hospitalId });
            bookingProvider.detailPatientHistory(patientHistoryId, hospitalId, (s, e) => {
                if (s && s.code == 0) {
                    this.setState({ isLoading: false });
                    let booking = s.data.data;
                    booking.hasCheckin = true;
                    booking.hospitalId = hospitalId;
                    booking.patientHistoryId = patientHistoryId;
                    this.props.navigation.navigate("ehealthDHY", { booking, patientHistoryId })
                }
            });
        });
    }
    openBooking(booking, hospitalId) {
        this.props.dispatch({ type: constants2.action.action_select_hospital, value: hospitalId });
        booking.hasCheckin = false;
        booking.hospitalId = hospitalId;
        this.props.navigation.navigate("ehealthDHY", { booking })
    }

    renderItemBookingInHis(booking, index) {
        if (booking) {
            if (booking.hospitalId == constants.hospital.BENH_VIEN_DAI_HOC_Y) {
                return <View style={{ position: 'relative', left: 20, right: 30 }}>
                    <TouchableOpacity style={{ position: 'relative', marginLeft: 15, right: 35 }} onPress={this.getDetailBooking.bind(this, booking.PatientHistoryId, booking.hospitalId)}>
                        <View style={{
                            backgroundColor: '#f8fcf4',
                            borderStyle: 'solid',
                            borderWidth: 1,
                            borderColor: 'rgba(155, 155, 155, 0.47)',
                            borderRadius: 6,
                            marginTop: 10,
                            marginLeft: 45,
                            padding: 12
                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{booking.PatientName}</Text>
                            <Text style={{ marginTop: 13 }}>Bệnh viện: <Text style={{ fontWeight: 'bold' }}>{booking.hospitalName}</Text></Text>
                            <Text style={{ marginTop: 8 }}>Mã hồ sơ: <Text style={{ fontWeight: 'bold' }}>{booking.PatientHistoryId}</Text></Text>
                            <Text style={{ marginTop: 8 }}>Thời gian: <Text style={{ fontWeight: 'bold' }}>{booking.TimeGoIn.toDateObject().format("dd/MM/yyyy hh:mm tt")}</Text></Text>
                        </View>
                        <ScaledImage source={require("@images/ehealth/square1.png")} width={20} style={{ marginRight: 8, position: 'absolute', top: '50%', marginTop: -10, left: 31 }} />
                    </TouchableOpacity>
                    <Dash style={{ width: 2, flexDirection: 'column', position: 'absolute', top: 0, left: 10, bottom: 0 }} dashColor="#00977c" />
                    <View style={{ width: 10, height: 10, backgroundColor: '#9b9b9b', borderRadius: 5, position: 'absolute', left: 6, top: '50%', marginTop: -5 }} />
                </View>
            }
        }
        return null;
    }
    renderItemBookingNotInHis(booking, index) {
        if (booking) {
            if (booking.hospitalId == constants.hospital.BENH_VIEN_DAI_HOC_Y) {
                return <View style={{ position: 'relative' }}>
                    <TouchableOpacity style={{ position: 'relative', marginLeft: 15 }} onPress={this.openBooking.bind(this, booking, booking.hospitalId)}>
                        <View style={{
                            flex: 1,
                            backgroundColor: '#f8fcf4',
                            borderStyle: 'solid',
                            borderWidth: 1,
                            borderColor: 'rgba(155, 155, 155, 0.47)',
                            borderRadius: 6,
                            marginTop: 10,
                            marginLeft: 14,
                            padding: 12
                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{booking.profile.name}</Text>
                            <Text style={{ marginTop: 13 }}>Bệnh viện: <Text style={{ fontWeight: 'bold' }}>{booking.hospitalName}</Text></Text>
                            {/* <Text style={{ marginTop: 8 }}>Mã hồ sơ: <Text style={{ fontWeight: 'bold' }}>{booking.PatientHistoryId}</Text></Text> */}
                            <Text style={{ marginTop: 8 }}>Thời gian: <Text style={{ fontWeight: 'bold' }}>{booking.booking.bookingTime.toDateObject("-").format("dd/MM/yyyy hh:mm tt")}</Text></Text>
                        </View>
                        <ScaledImage source={require("@images/ehealth/square1.png")} width={20} style={{ marginRight: 8, position: 'absolute', top: '50%', marginTop: -10, left: 0 }} />
                    </TouchableOpacity>
                    <Dash style={{ width: 2, flexDirection: 'column', position: 'absolute', top: 0, left: 10, bottom: 0 }} dashColor="#00977c" />
                    <View style={{ width: 10, height: 10, backgroundColor: '#9b9b9b', borderRadius: 5, position: 'absolute', left: 6, top: '50%', marginTop: -5 }} />
                </View>
            }
        }
        return null;
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Y BẠ ĐIỆN TỬ" showFullScreen={true} isLoading={this.state.isLoading}>
                <FlatList
                    onRefresh={this.onRefresh.bind(this)}
                    refreshing={this.state.refreshing}
                    style={{ flex: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.bookings}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                    renderItem={({ item, index }) => {
                        if (!item.booking)
                            return this.renderItemBookingInHis(item, index)
                        return this.renderItemBookingNotInHis(item, index)
                    }
                    }
                />
                <Modal
                    isVisible={this.state.toggleHospital}
                    onBackdropPress={() => this.setState({ toggleHospital: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                                CHỌN BỆNH VIỆN
                            </Text>
                        </View>
                        <FlatList
                            style={{ padding: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            data={this.state.hospitals}
                            ListHeaderComponent={() =>
                                !this.state.hospitals || this.state.hospitals.length == 0 ?
                                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                                        <Text style={{ fontStyle: 'italic' }}>Danh sách các bệnh viện đang trống</Text>
                                    </View>
                                    : null
                            }
                            ListFooterComponent={() => <View style={{ height: 50 }}></View>}
                            renderItem={({ item, index }) =>
                                <Card>
                                    <TouchableOpacity onPress={() => { this.setState({ currentHospital: item, toggleHospital: false }); this.selectHospital(item); }}>
                                        <Text style={{ padding: 10, fontWeight: '300', color: this.state.currentHospital == item ? "red" : "black" }}>{item && item.hospital ? item.hospital.name : "Tất cả"}</Text>
                                    </TouchableOpacity>
                                </Card>
                            }
                        />
                    </View>
                </Modal>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(LoginScreen);