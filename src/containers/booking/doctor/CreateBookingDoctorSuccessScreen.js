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

class CreateBookingDoctorSuccessScreen extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isVisible: false,
        isOnline: this.props.navigation.getParam('isOnline') || false
    }
    onQrClick = () => {
        this.setState({
            isVisible: true,
        })
    }

    getPaymentMethod(paymentMethod) {
        switch (paymentMethod) {
            case 1:
                return constants.payment.VNPAY;
            case 2:
                return constants.payment.pay_later;
            case 3:
                return "Ví MOMO";
            case 4:
                return constants.payment.PAYOO_convenient_shop;
            case 6:
                return constants.payment.direct_transfer;
        }
        return "";
    }
    onCopyNumber = (nummber) => {
        Clipboard.setString(nummber)
        snackbar.show(constants.booking.copy_success, 'success')
    }
    onCopyContents = (codeBooking) => () => {
        Clipboard.setString('DK ' + codeBooking)
        snackbar.show(constants.booking.copy_success, 'success')

    }
    goHome = () => {
        this.props.navigation.pop();
    }
    getPrice = (service, voucher) => {
        let price = voucher && voucher.price ? voucher.price : 0
        let promotionPrice = 0
        promotionPrice = this.pricePromotion(service) - price
        if (promotionPrice < 0) {
            return 0
        }
        return (promotionPrice).formatPrice()
    }
    onBackdropPress = () => this.setState({ isVisible: false })
    renderAcademic = (academicDegree) => {
        if (academicDegree) {
            switch (academicDegree) {
                case 'BS': return 'BS.'
                case 'ThS': return 'Ths.'
                case 'TS': return 'TS.'
                case 'PGS': return 'PGS.'
                case 'GS': return 'GS.'
                case 'BSCKI': return 'BSCKI.'
                case 'BSCKII': return 'BSCKII.'
                case 'GSTS': return 'GS.TS.'
                case 'PGSTS': return 'PGS.TS.'
                case 'ThsBS': return 'Ths.BS.'
                case 'ThsBSCKII': return 'Ths.BSCKII.'
                case 'TSBS': return 'TS.BS.'
                default: return ''
            }
        }
        else {
            return ''
        }
    }
    disablePromotion = (promotion) => {
        let dayOfWeek = {
            0: 6,
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4,
            6: 5
        }
        let startDate = new Date(promotion.startDate)
        let endDate = new Date(promotion.endDate)
        let day = new Date()
        let isDayOfWeek = (promotion.dateRepeat | Math.pow(2, dayOfWeek[day.getDay()]))
        if (startDate < day && endDate > day && isDayOfWeek != 0) {
            return true
        }
        return false
    }
    pricePromotion = (item) => {
        console.log('item: ', item);
        let value = 0
        if (item?.promotion && this.disablePromotion(item.promotion)) {
            if (item?.promotion?.type == "PERCENT") {
                value = (item.monetaryAmount.value - (item.monetaryAmount.value * (item.promotion.value / 100) || 0))
            } else {

                value = ((item?.monetaryAmount?.value - item?.promotion?.value) || 0)
                console.log('value: ', value);
            }
        } else {
            value = item?.monetaryAmount?.value
        }

        if (value < 0) {
            return 0
        }
        return value
    }
    renderPromotion = (promotion) => {
        let text = ''
        if (promotion.type == "PERCENT") {
            text = promotion.value + '%'
        } else {
            // let value = (promotion?.value || 0).toString()
            // if (value.length > 5) {
            //     text = value.substring(0, value.length - 3) + 'K'
            // } else {
            text = promotion.value.formatPrice() + 'đ'

            // }
        }
        return text
    }
    render() {
        let detailSchedule = this.props.navigation.getParam('detailSchedule');
        let bookingDate = this.props.navigation.getParam('bookingDate');
        let booking = this.props.navigation.getParam('booking');
        console.log('booking: aa', booking);
        let service = detailSchedule.medicalService || [];
        let voucher = this.props.navigation.getParam('voucher');
        let paymentMethod = this.props.navigation.getParam('paymentMethod');
        // if (!booking || !booking.profile || !booking.hospital || !booking.hospital.hospital || !booking.book) {
        //     this.props.navigation.pop();
        //     return null;
        // }
        let bookingTime = new Date(bookingDate)
        return (
            <ActivityPanel
                hideBackButton={true}
                title={this.state.isOnline ? "Chi tiết lịch gọi" : constants.title.create_booking_success}
                titleStyle={styles.txtTitle}
                transparent={true}
            >
                <View style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps='handled' style={styles.flex}>
                        {/* <ScaleImage style={styles.image1} height={80} source={require("@images/new/booking/ic_rating.png")} />
                        <Text style={styles.text1}>{constants.booking.booking_success}</Text> */}
                        <View style={styles.view2}>
                            <View style={styles.col}>
                                <Text style={styles.col1}>{constants.booking.code}</Text>
                                <TouchableOpacity onPress={this.onQrClick} style={styles.buttonQRCode}>
                                    <QRCode
                                        value={booking.reference || ""}
                                        logo={require('@images/new/logo.png')}
                                        logoSize={20}
                                        size={100}
                                        logoBackgroundColor='transparent'
                                    />
                                </TouchableOpacity>
                                <Text style={styles.txtCodeBooking}>{constants.booking.code_booking} {booking.reference}</Text>
                            </View>
                        </View>
                        <View style={styles.groupBody}>
                            <View style={styles.row}>
                                <Text style={styles.label}>Người tới khám:</Text>
                                <Text style={styles.text}>{booking.patient.name}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Bác sĩ:</Text>
                                <Text style={styles.text}>{this.renderAcademic(detailSchedule.doctor.academicDegree)} {detailSchedule.doctor.name}</Text>
                            </View>
                            <View style={styles.between} />
                            <View style={styles.row}>
                                <Text style={styles.label}>{constants.booking.CSYT}:</Text>
                                <Text style={styles.text}>{booking.hospital.name}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>{constants.booking.address}:</Text>
                                <Text style={styles.txtAddressBooking}>{booking.hospital.address}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Nơi làm thủ tục:</Text>
                                <Text style={styles.txtAddressBooking}>{booking.hospital.checkInPlace}</Text>
                            </View>
                            <View style={styles.between} />
                            {service && service.name ?
                                <View style={styles.row}>
                                    <Text style={styles.label}>{constants.booking.services}:</Text>
                                    <View style={styles.containerServices}>
                                        <View style={styles.flex}>
                                            <Text numberOfLines={1} style={[styles.text, styles.flex]}>{service.name}</Text>
                                            <Text style={[styles.text, { marginBottom: 5, color: '#BBB', fontStyle: 'italic' }]}>({parseInt(service.monetaryAmount.value).formatPrice()}đ) </Text>
                                        </View>
                                    </View>
                                </View> : null
                            }
                            {service && service.promotion && this.disablePromotion(service.promotion)?
                                <View style={styles.row}>
                                    <Text style={styles.label}>Khuyến mại:</Text>
                                    <View style={styles.containerServices}>
                                        <View style={styles.flex}>
                                            {/* <Text numberOfLines={1} style={[styles.text, styles.flex]}>{service.name}</Text> */}
                                            <Text style={[styles.text, { marginBottom: 5, color: '#BBB', fontStyle: 'italic' }]}>Giảm {this.renderPromotion(service.promotion)}</Text>
                                        </View>
                                    </View>
                                </View> : null
                            }
                            <View style={styles.row}>
                                <Text style={styles.label}>{constants.booking.time}</Text>
                                <Text style={styles.text}> <Text style={{ color: '#00BA99' }}>{booking.time} </Text>{" - " + bookingTime.format("thu, dd/MM/yyyy")}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Triệu chứng:</Text>
                                <Text style={styles.txtAddressBooking}>{booking.description}</Text>
                            </View>
                            <View style={styles.between} />
                            {voucher && voucher.price ?
                                <View style={styles.row}>
                                    <Text style={styles.txtTotalPrice}></Text>
                                    <Text style={[styles.text, { color: '#BBB', fontStyle: 'italic' }]}>-{voucher.price.formatPrice()}đ </Text>
                                </View>
                                : null
                            }
                            {
                                service && service.monetaryAmount && service.monetaryAmount.value ?
                                    <View style={styles.row}>
                                        <Text style={styles.txtTotalPrice}>{constants.booking.sum_price}:</Text>
                                        <Text style={[styles.text, { color: "#d0021b", fontStyle: 'italic' }]}>{this.getPrice(service, voucher)}đ </Text>
                                    </View> : null
                            }
                            <View style={styles.row}>
                                <Text style={styles.txtPaymentMethod}>{constants.booking.payment_method}</Text>
                                <Text style={styles.text}>{this.getPaymentMethod(paymentMethod)}</Text>
                            </View>
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
                        {
                            booking.hospital.accountNo &&   paymentMethod == 6 ?
                                <View style={styles.paymentInfo}>
                                    <Text style={styles.txStep1}>{constants.booking.guide.part_1}</Text>
                                    <View><View style={styles.viewBank}><View style={styles.viewInfoBank}><Text
                                        style={styles.txBank}>{constants.booking.guide.bank}:</Text><Text
                                            style={styles.txBankName}>{booking.hospital.bank}</Text></View>
                                        <Text style={[styles.txBank, { marginTop: 5 }]} >{constants.booking.guide.account_number}</Text></View>
                                        <View style={styles.bankInfo}>
                                            <View style={styles.viewBankNumber}>
                                                <Text style={styles.txNumber}>{booking.hospital.accountNo}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.onCopyNumber(booking.hospital.accountNo)} style={styles.btnCopy}>
                                                <Text style={styles.txCopy}>{constants.booking.guide.copy}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <View style={styles.viewInfoBank}><Text style={styles.txBank}>{constants.booking.guide.owner_name}:</Text>
                                                <Text style={styles.txBankName}>{booking.hospital.owner}</Text></View>
                                            <View style={styles.viewInfoBank}><Text style={styles.txBank}>{constants.booking.guide.branch}:</Text>
                                                <Text style={styles.txBankName}>{booking.hospital.branch}</Text></View>
                                            <View style={{ marginTop: 5 }}><Text style={styles.txBank}>{constants.booking.guide.enter_content_payment}</Text></View>
                                        </View>

                                        <View style={styles.bankInfo}>
                                            <View style={styles.viewBankNumber}>
                                                <Text style={styles.txNumber}>{'DK ' + booking.reference}</Text>
                                            </View>
                                            <TouchableOpacity onPress={this.onCopyContents(booking.reference)} style={styles.btnCopy}>
                                                <Text style={styles.txCopy}>{constants.booking.guide.copy}</Text>
                                            </TouchableOpacity>
                                        </View></View>
                                    <Text style={styles.txStep1}>{constants.booking.guide.part_2}</Text>
                                    <View style={styles.viewBank}>
                                        <Text style={styles.contentsPay}>{constants.booking.guide.notifi}</Text>
                                        <Text style={styles.notePay}>{constants.booking.guide.notifi2}</Text>
                                    </View>
                                </View>
                                : null
                        }

                        <Text style={{
                            textAlign: 'center',
                            paddingHorizontal: 40,
                            paddingTop: 20
                        }}>Lịch đặt khám của bạn đã được gửi đi. Vui lòng đợi iSofHcare xác nhận, bạn sẽ nhận được thông báo ngay khi xác nhận thành công!</Text>
                        <TouchableOpacity style={styles.btn}><Text style={styles.btntext} onPress={this.goHome}>{constants.booking.go_home}</Text></TouchableOpacity>
                    </ScrollView>
                </View>
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={this.onBackdropPress}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={styles.modal}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <QRCode
                        value={booking.reference || ""}
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
        userApp: state.auth.userApp
    };
}
const styles = StyleSheet.create({
    txtPaymentMethod: {
        fontSize: 13,
        letterSpacing: 0,
        color: "#000000",
        fontWeight: '600'

    },
    txtTotalPrice: {
        fontSize: 13,
        letterSpacing: 0,
        color: "#000000",
        fontWeight: '600'
    },
    txtAddressBooking: {
        textAlign: 'right',
        flex: 1,
        fontSize: 13
    },
    between: {
        backgroundColor: '#BBBBBB',
        height: 0.7,
        width: '100%',
        marginTop: 20
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerServices: {
        flex: 1,
        marginLeft: 10
    },
    groupBody: {
        // backgroundColor: '#effbf9',
        padding: 20,
        marginTop: 20
    },
    txtCodeBooking: {
        textAlign: 'center',
        color: '#4a4a4a',
        marginVertical: 5
    },
    buttonQRCode: {
        alignItems: 'center',
        marginTop: 10
    },
    flex: { flex: 1 },
    backgroundContainer: {
        backgroundColor: "#02C39A"
    },
    txtTitle: {
        color: '#FFF',
        marginRight: 31
    },
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
        // borderRadius: 6,
        // backgroundColor: "#02c39a",
        // shadowColor: "rgba(0, 0, 0, 0.21)",
        // shadowOffset: {
        //     width: 2,
        //     height: 4
        // },
        // shadowRadius: 10,
        // shadowOpacity: 1,
        marginTop: 30,
        marginLeft: 50,
        marginRight: 50,
        marginVertical: 20
    },
    btntext: {
        color: '#3161AD',
        textAlign: 'center',
        padding: 15,
        textDecorationLine: "underline",
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
    viewInfoBank: { flexDirection: 'row', marginTop: 5 },
    notePay: { marginTop: 5, fontSize: 14, color: '#000', textAlign: 'left', },
    viewBank: { justifyContent: 'center', }

})
export default connect(mapStateToProps)(CreateBookingDoctorSuccessScreen);