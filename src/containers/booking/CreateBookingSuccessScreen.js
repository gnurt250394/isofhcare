import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import ScaleImage from "mainam-react-native-scaleimage";
import QRCode from 'react-native-qrcode';

class CreateBookingSuccessScreen extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        let booking = this.props.navigation.state.params.booking;
        if (!booking || !booking.profile || !booking.hospital || !booking.hospital.hospital || !booking.book) {
            this.props.navigation.pop();
            return null;
        }
        console.log(this.props.navigation.state.params.booking.book)
        let bookingTime = booking.book.bookingTime.toDateObject("-");
        console.log(bookingTime);
        return (
            <ActivityPanel
                hideBackButton={true}
                style={styles.AcPanel} title="Đặt lịch khám"
                titleStyle={{ color: '#FFF', marginRight: 31 }}
                containerStyle={{
                    backgroundColor: "#02C39A"
                }}
                actionbarStyle={{
                    backgroundColor: '#02C39A'
                }}>
                <View style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1 }}>
                        <ScaleImage style={styles.image1} height={80} source={require("@images/new/booking/ic_rating.png")} />
                        <Text style={styles.text1}>Đặt khám thành công!</Text>
                        <View style={{ backgroundColor: '#effbf9', padding: 20, marginTop: 20 }}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Họ tên:</Text>
                                <Text style={styles.text}>{(booking.profile.medicalRecords.name || "").toUpperCase()}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Địa chỉ đặt khám:</Text>
                                <Text style={styles.text}>{booking.hospital.hospital.name}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Thời gian:</Text>
                                <Text style={styles.text}>{bookingTime.format("HH:mm tt - thu, dd/MM/yyyy")}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Số khám:</Text>
                                <Text style={styles.text}>{booking.book.sequenceNo}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Hình thức thanh toán:</Text>
                                <Text style={styles.text}>{booking.payment == 2 ? "Thanh toán tại viện" : "VNPay"}</Text>
                            </View>
                        </View>
                        <View style={styles.view2}>
                            <View style={styles.col}>
                                <Text style={styles.col1}>Mã code:</Text>
                                <View style={{ alignItems: 'center', marginTop: 10 }}>
                                    <QRCode
                                        style={{ alignSelf: 'center', backgroundColor: '#000' }}
                                        value={booking.book.codeBooking}
                                        size={100}
                                        fgColor='white' />
                                </View>
                            </View>
                        </View>
                        <View style={styles.view1}>
                            <Text style={styles.text2}>Lịch đặt khám của bạn đã được gửi đi. Vui lòng đến trước hẹn 15 phút để thực hiện các thủ tục khác.</Text>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.btn}><Text style={styles.btntext} onPress={() => {
                        this.props.navigation.pop();
                    }}>Về trang chủ</Text></TouchableOpacity>
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
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#4a4a4a",
        textAlign: 'center',
        fontStyle: 'italic'
    },
    row: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
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