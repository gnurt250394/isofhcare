import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import ScaleImage from "mainam-react-native-scaleimage";
import QRCode from 'react-native-qrcode';
import Modal from "@components/modal";
import constants from '@resources/strings';

class CreateBookingSuccessScreen extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isVisible: false
    }
    onQrClick = () => {
        this.setState({
            isVisible: true,
        })
    }

    getPaymentMethod(booking) {
        switch (booking.payment) {
            case 1:
                return "VNPAY";
            case 2:
                return constants.booking.payment_csyt;
            case 3:
                return "PAYOO";
            case 4:
                return constants.booking.payment_payoo;
        }
        return "";
    }

    render() {
        let booking = this.props.navigation.state.params.booking;
        let service = this.props.navigation.state.params.service || [];
        if (!booking || !booking.profile || !booking.hospital || !booking.hospital.hospital || !booking.book) {
            this.props.navigation.pop();
            return null;
        }
        let bookingTime = booking.book.bookingTime.toDateObject("-");
        return (
            <ActivityPanel
                hideBackButton={true}
                title={constants.title.create_booking_success}
                titleStyle={{ color: '#FFF', marginRight: 31 }}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#02C39A"
                containerStyle={{
                    backgroundColor: "#02C39A"
                }}
                actionbarStyle={{
                    backgroundColor: '#02C39A'
                }}>
                <View style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
                        <ScaleImage style={styles.image1} height={80} source={require("@images/new/booking/ic_rating.png")} />
                        <Text style={styles.text1}>{constants.booking.booking_success}</Text>
                        <View style={{ backgroundColor: '#effbf9', padding: 20, marginTop: 20 }}>
                            <View style={styles.row}>
                                <Text style={styles.label}>{constants.booking.name}</Text>
                                <Text style={styles.text}>{(booking.profile.medicalRecords.name || "").toUpperCase()}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{constants.booking.location_booking}</Text>
                                <Text style={styles.text}>{booking.hospital.hospital.name}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{constants.booking.time}</Text>
                                <Text style={styles.text}>{bookingTime.format("HH:mm") + " " + (bookingTime.format("HH") < 12 ? "AM" : "PM") + " - " + bookingTime.format("thu, dd/MM/yyyy")}</Text>
                            </View>
                            {service && service.length ?
                                <View style={styles.row}>
                                    <Text style={styles.label}>{"Dịch vụ"}</Text>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        {service.map((item, index) => {
                                            return <View key={index} style={{ flex: 1 }}>
                                                <Text numberOfLines={1} style={[styles.text, { flex: 1 }]}>{item.service.name}</Text>
                                                <Text style={[styles.text, { marginBottom: 5 }]}>({parseInt(item.service.price).formatPrice()}đ)</Text>
                                            </View>
                                        })}
                                    </View>
                                </View> : null
                            }
                            <View style={styles.row}>
                                <Text style={styles.label}>{constants.booking.payment_method}</Text>
                                <Text style={styles.text}>{this.getPaymentMethod(booking)}</Text>
                            </View>
                            {
                                service && service.length ?
                                    <View style={styles.row}>
                                        <Text style={styles.label}>{"Tổng tiền"}</Text>
                                        <Text style={[styles.text, { color: "#d0021b" }]}>{service.reduce((start, item) => {
                                            return start + parseInt(item.service.price)
                                        }, 0).formatPrice()}đ</Text>
                                    </View> : null
                            }

                            {/* {
                                booking.payment == 4 && <View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>{constants.booking.code_payment}</Text>
                                        <Text style={styles.text}>{booking.online_transactions && booking.online_transactions.length ? booking.online_transactions[0].bill_ref_code : ""}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>{constants.booking.payment_duration}</Text>
                                        <Text style={styles.text}>{booking.book.expireDatePayoo.toDateObject('-').format("dd/MM/yyyy")}</Text>
                                    </View>
                                </View>
                            } */}
                        </View>
                        <View style={styles.view2}>
                            <View style={styles.col}>
                                <Text style={styles.col1}>{constants.booking.code}</Text>
                                <TouchableOpacity onPress={this.onQrClick} style={{ alignItems: 'center', marginTop: 10 }}>
                                    <QRCode
                                        style={{ alignSelf: 'center', backgroundColor: '#000' }}
                                        value={booking.book.codeBooking}
                                        size={100}
                                        fgColor='white' />
                                </TouchableOpacity>
                                <Text style={{ textAlign: 'center', color: '#4a4a4a', marginVertical: 5 }}>{constants.booking.code_booking} {booking.book.codeBooking}</Text>

                            </View>
                        </View>
                        <View style={styles.view1}>
                            <Text style={styles.text2}>{constants.booking.booking_send}</Text>
                        </View>

                    </ScrollView>
                    <TouchableOpacity style={styles.btn}><Text style={styles.btntext} onPress={() => {
                        this.props.navigation.pop();
                    }}>{constants.booking.go_home}</Text></TouchableOpacity>
                </View>
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={() => this.setState({ isVisible: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <QRCode
                        value={booking.book.codeBooking}
                        size={250}

                        fgColor='white' />
                </Modal>
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
    AcPanel: {
        flex: 1,
        backgroundColor: '#cacaca',
    },
    container: {
        flex: 1,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        backgroundColor: '#fff',
    },
    thanhngang: {
        textAlign: 'center',
        marginTop: 10,
    },
    image1: {
        alignSelf: 'center',
        marginTop: 30,
    },
    text1: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a",
        marginTop: 15
    },
    text2: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#4a4a4a90",
        textAlign: 'center',
        fontStyle: 'italic'
    },
    row: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    label: {
        opacity: 0.8,
        fontSize: 13,
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
    },
    text: {
        textAlign: 'right',
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
        color: "#000000",
    },
    view1: {
        marginTop: 10,
        paddingLeft: 25,
        paddingRight: 25,
    },
    view2: {
    },
    col1: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 20,
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"
    },
    image2: {
        alignSelf: 'center'
    },
    col: {
        flexDirection: 'column',
        marginTop: 5,
        marginBottom: 15,
    },
    btn: {
        borderRadius: 6,
        backgroundColor: "#02c39a",
        shadowColor: "rgba(0, 0, 0, 0.21)",
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        marginTop: 30,
        marginLeft: 50,
        marginRight: 50,
        marginVertical: 20
    },
    btntext: {
        color: '#ffffff',
        textAlign: 'center',
        padding: 15,
        fontWeight: 'bold',
        fontSize: 16
    },
    view3: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
    },
    diachi: {
        textAlign: 'center',
        letterSpacing: 0,
        color: "#000000",
        opacity: 0.7,
    },
    time: {
        textAlign: 'center',
        letterSpacing: 0,
        color: "#000000",
        opacity: 0.7,
        padding: 5
    },
    sokham: {
        textAlign: 'center',
        letterSpacing: 0,
        color: "#000000",
        opacity: 0.7,
    },
    time1: {
        color: '#6a0136',
        fontWeight: 'bold'
    }
})
export default connect(mapStateToProps)(CreateBookingSuccessScreen);