import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import stringUtils from 'mainam-react-native-string-utils';
import ScaleImage from "mainam-react-native-scaleimage";
import bookingProvider from '@data-access/booking-provider';
import walletProvider from '@data-access/wallet-provider';
import snackbar from '@utils/snackbar-utils';

class ConfirmBookingScreen extends Component {
    constructor(props) {
        super(props);
        let serviceType = this.props.navigation.state.params.serviceType;
        let service = this.props.navigation.state.params.service;
        let hospital = this.props.navigation.state.params.hospital;
        let profile = this.props.navigation.state.params.profile;
        let specialist = this.props.navigation.state.params.specialist;
        let bookingDate = this.props.navigation.state.params.bookingDate;
        let schedule = this.props.navigation.state.params.schedule;
        let reason = this.props.navigation.state.params.reason;
        let images = this.props.navigation.state.params.images;

        this.state = {
            serviceType,
            service,
            hospital,
            profile,
            specialist,
            bookingDate,
            schedule,
            reason,
            images,
            paymentMethod: 1
        }
    }
    confirmPayment(booking, bookingId) {
        booking.hospital = this.state.hospital;
        booking.profile = this.state.profile;
        booking.payment = this.state.paymentMethod;
        this.setState({ isLoading: true }, () => {
            bookingProvider.confirmPayment(bookingId).then(s => {
                if (s.code == 0) {
                    this.props.navigation.navigate("home", {
                        navigate: {
                            screen: "createBookingSuccess",
                            params: {
                                booking
                            }
                        }
                    });
                }
                else {
                    this.setState({ isLoading: false }, () => {
                        snackbar.show("Xác nhận đặt khám không thành công", "danger");
                    });
                }
            }).catch(e => {
                this.setState({ isLoading: false }, () => {
                    snackbar.show("Xác nhận đặt khám không thành công", "danger");
                });
            });
        })
    }
    getPaymentLink(booking) {
        booking.hospital = this.state.hospital;
        booking.profile = this.state.profile;
        booking.payment = this.state.paymentMethod;
        // this.props.navigation.navigate("paymentBookingError", { booking })
        // return;

        this.setState({ isLoading: true }, () => {
            walletProvider.createOnlinePayment(this.props.userApp.currentUser.id, "VNPAY", this.state.hospital.hospital.id, booking.book.id, "http://localhost:8888/order/vnpay_return", this.state.service.price, "", booking.book.hash).then(s => {
                this.setState({ isLoading: false }, () => {
                    this.props.navigation.navigate("paymentVNPay", {
                        urlPayment: s.payment_url,
                        onSuccess: url => {
                            let obj = {};
                            let arr = url.split('?');
                            if (arr.length == 2) {
                                arr = arr[1].split("&");
                                arr.forEach(item => {
                                    let arr2 = item.split("=");
                                    if (arr2.length == 2) {
                                        obj[arr2[0]] = arr2[1];
                                    }
                                })
                            }
                            walletProvider.onlineTransactionPaid(obj["vnp_TxnRef"], "VNPAY", obj);
                            this.props.navigation.navigate("home", {
                                navigate: {
                                    screen: "createBookingSuccess",
                                    params: {
                                        booking
                                    }
                                }
                            });
                        },
                        onError: url => {
                            this.props.navigation.navigate("paymentBookingError", { booking })
                        }
                    })
                })
            }).catch(e => {
                this.setState({ isLoading: false }, () => {
                    if (e && e.response && e.response.data) {
                        let response = e.response.data;
                        switch (response.type) {
                            case "ValidationError":
                                let message = response.message;
                                for (let key in message) {
                                    switch (key) {
                                        case "id":
                                            snackbar.show("Tài khoản không tồn tại trong hệ thống", "danger");
                                            return;
                                    }
                                }
                                break;
                        }
                    }
                    snackbar.show("Tạo thanh toán không thành công", "danger");
                    // this.props.navigation.navigate("paymentBookingError", { booking })
                })
            });
        })
    }
    createBooking() {
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
                this.state.images
            ).then(s => {
                if (s) {
                    switch (s.code) {
                        case 0:
                            if (this.state.paymentMethod == 2)
                                this.confirmPayment(s.data, s.data.book.id);
                            else {
                                this.getPaymentLink(s.data);
                            }
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
                        default:
                            this.setState({ isLoading: false }, () => {
                                snackbar.show("Đặt khám không thành công", "danger");
                            });
                            break;
                    }
                }





                // this.setState({ isLoading: false }, () => {
                //     if (s) {
                //         switch (s.code) {
                //             case 500:
                //                 snackbar.show("Đặt khám không thành công", "danger");
                //                 return;
                //             case 0:
                //                 if (this.state.paymentMethod == 2) {
                //                     snackbar.show("Đặt khám thành công", "success");
                //                 } else {
                //                 }
                //                 return;
                //         }
                //     }
                // });
            }).catch(e => {
                this.setState({ isLoading: false }, () => {
                });
            })
        })
    }

    render() {
        return (
            <ActivityPanel style={styles.AcPanel} title="Đặt Lịch Khám"
                isLoading={this.state.isLoading}
                containerStyle={{
                    backgroundColor: "#FFF"
                }} actionbarStyle={{
                    backgroundColor: '#ffffff',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0, 0, 0, 0.06)'
                }}>
                <ScrollView style={styles.container}>
                    <View style={styles.viewDetails}>
                        <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'rgb(2,195,154)', marginRight: 10 }}>DỊCH VỤ {(this.state.service.name || "").toUpperCase()}</Text>
                            <ScaleImage width={20} source={require("@images/new/booking/ic_tick.png")} />
                        </View>
                        <View style={styles.view11} >
                            <View style={[styles.view2, { alignItems: 'flex-start' }]}>
                                <ScaleImage style={styles.ic_Location} width={20} source={require("@images/new/hospital/ic_place.png")} />
                                <View>
                                    <Text style={[styles.text5, { fontWeight: 'bold' }]}>{this.state.hospital.hospital.name}</Text>
                                    <Text style={[styles.text5, { marginTop: 10 }]}>Địa chỉ: <Text>{this.state.hospital.hospital.address}</Text></Text>
                                </View>
                            </View>

                            <View style={styles.view2}>
                                <ScaleImage style={styles.ic_Location} width={20} source={require("@images/new/booking/ic_doctor.png")} />
                                <Text style={styles.text5}>{this.state.schedule.doctor.name}</Text>
                            </View>

                            <View style={[styles.view2, { alignItems: 'flex-start' }]}>
                                <ScaleImage style={styles.ic_Location} width={20} source={require("@images/new/booking/ic_bookingDate2.png")} />
                                <View>
                                    <Text style={[styles.text5, {}]}>Thời gian</Text>
                                    <Text style={[styles.text5, { marginTop: 10 }]}><Text style={{ color: 'rgb(106,1,54)', fontWeight: 'bold' }}>{this.state.schedule.label} {this.state.schedule.time / 60 < 12 ? "sáng" : "chiều"} - {this.state.bookingDate.format("thu")}</Text> ngày {this.state.bookingDate.format("dd/MM/yyyy")} </Text>
                                </View>
                            </View>

                            <View style={styles.view2}>
                                <ScaleImage style={[styles.ic_Location, { marginRight: 22 }]} width={17} source={require("@images/new/booking/ic_note.png")} />
                                <Text style={styles.text5}>Lý do: {this.state.reason}</Text>
                            </View>
                            <View style={styles.view2}>
                                <ScaleImage style={[styles.ic_Location]} width={20} source={require("@images/new/booking/ic_coin.png")} />
                                <Text style={styles.text5}>Giá dịch vụ: {parseFloat(this.state.service.price).formatPrice()} đ</Text>
                            </View>


                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: 'rgb(2,195,154)', marginRight: 10 }}>CHỌN PHƯƠNG THỨC THANH TOÁN</Text>
                        <ScaleImage width={20} source={require("@images/new/booking/ic_tick.png")} />
                    </View>


                    {/* <View style={styles.ckeck}> */}
                    {/* <ScaleImage style={styles.ckecked} height={20} source={require("@images/new/ic_ckecked.png")} /> */}
                    {/* <Text style={styles.ckeckthanhtoan}>Ví ISOFHCARE</Text> */}
                    {/* </View> */}
                    {/* <View>
                        <Text style={styles.sodu}>Số dư hiện tại: 350.000đ</Text>
                    </View> */}
                    <TouchableOpacity style={styles.ckeck} onPress={() => this.setState({ paymentMethod: 1 })}>
                        <View style={{ width: 20, height: 20, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgb(2,195,154)' }}>
                            {this.state.paymentMethod == 1 &&
                                <View style={{ backgroundColor: 'rgb(2,195,154)', width: 10, height: 10, borderRadius: 5 }}></View>
                            }
                        </View>
                        <Text style={styles.ckeckthanhtoan}>VNPAY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ckeck} onPress={() => this.setState({ paymentMethod: 2 })}>
                        <View style={{ width: 20, height: 20, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgb(2,195,154)' }}>
                            {this.state.paymentMethod == 2 &&
                                <View style={{ backgroundColor: 'rgb(2,195,154)', width: 10, height: 10, borderRadius: 5 }}></View>
                            }
                        </View>
                        <Text style={styles.ckeckthanhtoan}>Thanh toán tại bệnh viện</Text>
                    </TouchableOpacity>

                </ScrollView>
                <TouchableOpacity style={styles.btn} onPress={this.createBooking.bind(this)}>
                    <Text style={styles.btntext}>Xác Nhận</Text>
                </TouchableOpacity>
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
    view1: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    ic_Location: {
        marginHorizontal: 20
    },
    title: {

        fontSize: 22,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        flex: 1,
        textAlign: 'center',
        shadowRadius: 8,
        shadowOpacity: 1
    },
    viewDetails: {
        backgroundColor: "#effbf9",
    },
    view2: {
        flexDirection: 'row',
        marginTop: 13,
        alignItems: 'center'
    },

    text1: {
        opacity: 0.8,

        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        color: "#000000",
        marginLeft: 20,
        flex: 1
    },

    text2: {

        fontSize: 14,
        opacity: 0.8,
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#000000",
        marginLeft: 77,
        width: 280,
    },

    text3: {

        fontSize: 14,
        opacity: 0.8,
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#000000",
        marginLeft: 17,
        width: 280

    },
    text4: {
        color: "#6a0136",
        marginLeft: 77
    },
    text5: {
        fontSize: 14,
        opacity: 0.8,
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#000000",
        marginLeft: 20,
        width: 280
    },
    ckecked: {
        marginTop: 10,
        marginLeft: 25,
    },
    ckeck: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 20
    },
    btn: {
        backgroundColor: '#02c39a',
        shadowColor: 'rgba(0, 0, 0, 0.21)',
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        borderRadius: 6,
        marginTop: 40,
        width: 250,
        marginBottom: 40,
        alignSelf: 'center'
    },
    btntext: {
        color: "#fff",
        textAlign: 'center',
        padding: 10,
        fontWeight: 'bold'
    },
    view11: {

        paddingVertical: 20,
    },
    thanhtoan: {
        opacity: 0.54,

        fontSize: 16, fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        marginHorizontal: 30,
        marginTop: 17
    },
    ckeckthanhtoan: {
        opacity: 0.8,

        fontSize: 16, fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        flex: 1,
        marginLeft: 10
    },
    sodu: {
        opacity: 0.72,

        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        marginLeft: 55
    }
})
export default connect(mapStateToProps)(ConfirmBookingScreen);