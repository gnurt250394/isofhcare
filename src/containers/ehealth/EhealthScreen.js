import React, { Component, PropTypes, PureComponent } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import Dash from 'mainam-react-native-dash-view';
import bookingProvider from '@data-access/booking-provider';
import hospitalProvider from '@data-access/hospital-provider';
import constants from '@resources/strings';
import constants2 from '@ehealth/daihocy/resources/strings';
import dateUtils from 'mainam-react-native-date-utils';

import { Card } from 'native-base';
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
class LoginScreen extends PureComponent {
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
        this.loadListHospital();
    }

    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, loading: true }, () => {
                this.onLoad();
            });
    }
    loadListHospital() {
        hospitalProvider.getAll().then(s => {
            if (s.code == 0) {
                this.setState({ hospitals: s.data.hospitals });
            }
        }).catch(e => {
        });
    }

    componentWillReceiveProps(nextProps) {
        try {
            let s = nextProps.navigation.getParam('reloadTime', undefined);
            if (s != this.state.reloadTime) {
                this.setState({
                    reloadTime: s
                }, () => {
                    this.onRefresh();
                })
            }
        } catch (error) {

        }
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
                            <Text style={{ marginTop: 8 }}>Mã hồ sơ: <Text style={{ fontWeight: 'bold' }}>{booking.PatientDocument}</Text></Text>
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
                return <View style={{ position: 'relative', left: 20, right: 30 }}>
                    <TouchableOpacity style={{ position: 'relative', marginLeft: 15, right: 35 }} onPress={this.openBooking.bind(this, booking, booking.hospitalId)}>
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
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{booking.profile.name}</Text>
                            <Text style={{ marginTop: 13 }}>Bệnh viện: <Text style={{ fontWeight: 'bold' }}>{booking.hospitalName}</Text></Text>
                            {/* <Text style={{ marginTop: 8 }}>Mã hồ sơ: <Text style={{ fontWeight: 'bold' }}>{booking.PatientHistoryId}</Text></Text> */}
                            <Text style={{ marginTop: 8 }}>Thời gian: <Text style={{ fontWeight: 'bold' }}>{booking.booking.bookingTime.toDateObject("-").format("dd/MM/yyyy hh:mm tt")}</Text></Text>
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
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Y BẠ ĐIỆN TỬ" showFullScreen={true} isLoading={this.state.isLoading}>
                <View>
                    <Text style={[styles.text1, {
                        marginLeft: 20, marginBottom: 10
                    }]}>Cơ sở y tế đã khám</Text>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.hospitals}
                        ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                        renderItem={({ item, index }) => <TouchableOpacity key={index}
                            onPress={() => {
                                this.setState({ currentHospital: item });
                            }}
                            style={this.state.currentHospital == item ? styles.hospital_selected : styles.hospital}>
                            <ScaledImage source={require("@images/logo.png")} height={45} style={{ marginTop: 10 }} />
                            <View style={{ flex: 1, alignContent: 'flex-end', justifyContent: 'flex-end' }}>
                                <Text numberOfLines={2} style={styles.hospital_text}>
                                    {item.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        }
                    />
                    <View style={styles.style1}>
                        <ScaledImage source={require("@images/ehealth/ichistory.png")} width={20} style={{ marginRight: 8 }} />
                        <Text style={styles.text1}>Lịch sử</Text>
                    </View>
                </View>
                <FlatList
                    onRefresh={this.onRefresh.bind(this)}
                    refreshing={this.state.refreshing}
                    style={{ flex: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.bookings}
                    ListHeaderComponent={() => {
                        if (!this.state.bookings || this.state.bookings.length == 0)
                            return <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <Text style={{ fontStyle: 'italic' }}>Không thấy lịch sử khám nào</Text>
                            </View>
                        return null
                    }}
                    ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                    renderItem={({ item, index }) => {
                        if (!item.booking)
                            return this.renderItemBookingInHis(item, index)
                        return this.renderItemBookingNotInHis(item, index)
                    }
                    }
                />                
            </ActivityPanel >
        );
    }
}

const styles = StyleSheet.create({
    style1: {
        flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 20
    },
    text1: {
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000"
    },
    hospital_selected: {
        alignItems: 'center',
        height: 105,
        width: 105,
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 3,
        borderColor: '#02c39a',
        borderRadius: 6,
        margin: 5
    },
    hospital: {
        alignItems: 'center',
        height: 105,
        width: 105,
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: 6,
        margin: 5
    },
    hospital_text: { alignItems: 'flex-end', textAlign: 'center', margin: 5 }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(LoginScreen);