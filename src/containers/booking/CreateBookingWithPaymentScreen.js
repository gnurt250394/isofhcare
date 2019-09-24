import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import ScaleImage from "mainam-react-native-scaleimage";
import QRCode from 'react-native-qrcode-svg';
import Modal from "@components/modal";
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';

class CreateBookingWithPaymentScreen extends Component {
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
            case 6:
                return 'Chuyển khoản trực tiếp';
        }
        return "";
    }
    onCopyNumber = () => {
        Clipboard.setString('22010000749786')
        snackbar.show('Sao chép thành công', 'success')
    }
    onCopyContents = (codeBooking) => {
        Clipboard.setString('DK ' + codeBooking)
        snackbar.show('Sao chép thành công', 'success')

    }
    goHome = () => {
        this.props.navigation.pop();
    }
    getPriceSecive = (service, voucher) => {
        let priceVoucher = voucher && voucher.price ? voucher.price : 0
        let priceFinal = service.reduce((start, item) => {
            return start + parseInt(item.service.price)
        }, 0)
        if (priceVoucher > priceFinal) {
            return 0
        }
        return (priceFinal - priceVoucher).formatPrice()
    }
    onBackdropPress = () => this.setState({ isVisible: false })
    render() {
        let booking = this.props.navigation.state.params.booking;
        let voucher = this.props.navigation.state.params.voucher || {};
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
                        {/* <ScaleImage style={styles.image1} height={80} source={require("@images/new/booking/ic_rating.png")} />
                        <Text style={styles.text1}>{constants.booking.booking_success}</Text> */}
                        <View style={styles.view2}>
                            <View style={styles.col}>
                                <Text style={styles.col1}>{constants.booking.code}</Text>
                                <TouchableOpacity onPress={this.onQrClick} style={{ alignItems: 'center', marginTop: 10 }}>
                                    <QRCode
                                        value={booking.book.codeBooking || ""}
                                        logo={require('@images/new/logo.png')}
                                        logoSize={20}
                                        size={100}
                                        logoBackgroundColor='transparent'
                                    />
                                </TouchableOpacity>
                                <Text style={{ textAlign: 'center', color: '#4a4a4a', marginVertical: 5 }}>{constants.booking.code_booking} {booking.book.codeBooking}</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#effbf9', padding: 20, marginTop: 20 }}>
                            <View style={styles.row}>
                                <Text style={styles.label}>{"Cơ sở y tế:"}</Text>
                                <Text style={styles.text}>{booking.hospital.hospital.name}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{"Địa chỉ:"}</Text>
                                <Text style={styles.text}>{booking.hospital.hospital.address}</Text>
                            </View>

                            {/* Ho ten <View style={styles.row}>
                                <Text style={styles.label}>{constants.booking.name}</Text>
                                <Text style={styles.text}>{(booking.profile.medicalRecords.name || "").toUpperCase()}</Text>
                            </View> */}

                            <View style={styles.row}>
                                <Text style={styles.label}>{constants.booking.time}</Text>
                                <Text style={styles.text}>{bookingTime.format("hh:mm") + " " + (bookingTime.format("HH") < 12 ? "AM" : "PM") + " - " + bookingTime.format("thu, dd/MM/yyyy")}</Text>
                            </View>
                            {service && service.length ?
                                <View style={styles.row}>
                                    <Text style={styles.label}>{"Dịch vụ:"}</Text>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        {service.map((item, index) => {
                                            return <View key={index} style={{ flex: 1 }}>
                                                <Text numberOfLines={1} style={[styles.text, { flex: 1 }]}>{item.service.name}</Text>
                                                <Text style={[styles.text, { marginBottom: 5 }]}>({parseInt(item.service.price).formatPrice()}đ)</Text>
                                            </View>
                                        })}
                                        {voucher && voucher.price ?
                                            <View style={{ flex: 1 }}>
                                                <Text numberOfLines={1} style={[styles.text, styles.flex]}>{constants.booking.voucher}</Text>
                                                <Text style={[styles.text, { marginBottom: 5 }]}>(-{parseInt(voucher.price).formatPrice()}đ)</Text>
                                            </View> : null
                                        }
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
                                        <Text style={styles.label}>{constants.booking.sum_price}:</Text>
                                        <Text style={[styles.text, { color: "#d0021b" }]}>{this.getPriceSecive(service, voucher)}đ</Text>
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
                        <View style={styles.paymentInfo}>
                            <Text style={styles.txStep1}>Bước 1: Điền thông tin chuyển khoản thụ hưởng:</Text>
                            <View><View style={styles.viewBank}><View style={styles.viewInfoBank}><Text style={styles.txBank}>Ngân hàng:</Text><Text style={styles.txBankName}>TECHCOMBANK</Text></View>
                                <Text style={[styles.txBank, { marginTop: 5 }]} >Số tài khoản:</Text></View>
                                <View style={styles.bankInfo}>
                                    <View style={styles.viewBankNumber}>
                                        <Text style={styles.txNumber}>19134033802010</Text>
                                    </View>
                                    <TouchableOpacity onPress={this.onCopyNumber} style={styles.btnCopy}>
                                        <Text style={styles.txCopy}>SAO CHÉP</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <View style={styles.viewInfoBank}><Text style={styles.txBank}>Tên chủ thẻ:</Text><Text style={styles.txBankName}>CONG TY TNHH MOT THANH VIEN ISOFHCARE</Text></View>
                                    <View style={styles.viewInfoBank}><Text style={styles.txBank}>Chi nhánh:</Text><Text style={styles.txBankName}>TECHCOMBANK Ba Đình</Text></View>
                                    <View style={{ marginTop: 5 }}><Text style={styles.txBank}>Nhập nội dung chuyển khoản:</Text></View>
                                </View>

                                <View style={styles.bankInfo}>
                                    <View style={styles.viewBankNumber}>
                                        <Text style={styles.txNumber}>{'DK ' + booking.book.codeBooking}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.onCopyContents(booking.book.codeBooking)} style={styles.btnCopy}>
                                        <Text style={styles.txCopy}>SAO CHÉP</Text>
                                    </TouchableOpacity>
                                </View></View>
                            <Text style={styles.txStep1}>Bước 2: Thực hiện chuyển khoản:</Text>
                            <View style={styles.viewBank}>
                                <Text style={styles.contentsPay}>iSofHcare sẽ thông báo cho bạn sau khi bạn chuyển khoản thành công.</Text>
                                <Text style={styles.notePay}>Để chắc chắn giao dịch chính xác, bạn hãy làm theo các bước hướng dẫn trên.</Text>
                            </View>
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
                        value={booking.book.codeBooking || ""}
                        logo={require('@images/new/logo.png')}
                        logoSize={40}
                        size={250}
                        logoBackgroundColor='transparent'
                    />
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
        fontWeight: "bold",
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
    },
    paymentInfo: {
        padding: 10,
        justifyContent: 'center',
    },
    txStep1: {
        color: '#000',
        fontSize: 14,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    txBank: {
        color: '#000',
        fontSize: 14
    },
    txBankName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#02c39a',
        marginLeft: 5,
        marginRight: 10

    },
    bankInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    viewBankNumber: {
        height: 41, paddingHorizontal: 5, borderRadius: 5, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center', width: '60%'
    },
    btnCopy: {
        height: 41, paddingHorizontal: 10, backgroundColor: '#02c39a', marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5, width: '40%'
    },
    txNumber: {
        color: '#02c39a',
        fontSize: 14,
        fontWeight: 'bold'
    },
    txCopy: {
        fontSize: 14,
        color: '#fff'
    },
    contentsPay: {
        color: 'red',
        fontSize: 14,
        textAlign: 'left',
        marginTop: 5,
    },
    viewInfoBank: { flexDirection: 'row', marginTop: 5,paddingRight:10 },
    notePay: { marginTop: 5, fontSize: 14, color: '#000', textAlign: 'left', },
    viewBank: { justifyContent: 'center', }

})
export default connect(mapStateToProps)(CreateBookingWithPaymentScreen);