import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Clipboard, BackHandler, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import ScaleImage from "mainam-react-native-scaleimage";
import QRCode from 'react-native-qrcode-svg';
import Modal from "@components/modal";
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';
import bookingDoctorProvider from '@data-access/booking-doctor-provider'
import voucherProvider from '@data-access/voucher-provider'

class ConfirmBookingDoctorScreen extends Component {
    constructor(props) {
        super(props)
        let detailSchedule = this.props.navigation.getParam('detailSchedule');
        let bookingDate = this.props.navigation.getParam('bookingDate');
        let booking = this.props.navigation.getParam('booking');
        let isOnline = this.props.navigation.getParam('isOnline');
        this.state = {
            isVisible: false,
            isOnline,
            paymentMethod: isOnline ? 6 : 2,
            booking,
            bookingDate,
            detailSchedule,
            voucher: {}
        }
        this.isChecking = true
    }

    onQrClick = () => {
        this.setState({
            isVisible: true,
        })
    }


    onCopyNumber = () => {
        Clipboard.setString(constants.booking.guide.number)
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
        console.log('service: ', service);
        let price = voucher && voucher.price ? voucher.price : 0
        let promotionPrice = 0
        promotionPrice = this.pricePromotion(service) - price
        if (promotionPrice < 0) {
            return 0
        }
        return (promotionPrice).formatPrice()
    }
    onSelectPaymentMethod = (paymentMethod) => {
        this.setState({ paymentMethod })
    }
    setlectPaymentMethod = () => {
        this.props.navigation.navigate('listPaymentMethod', {
            onItemSelected: this.onSelectPaymentMethod
        })
    }
    getPaymentMethod() {
        let { paymentMethod } = this.state
        switch (paymentMethod) {
            case 1:
                return "VNPAY";
            case 2:
                return "CASH";
            case 3:
            case 5:
            // return "PAYOO";
            case 4:
                return "PAYOO";
            case 6:
                return "BANK_TRANSFER";
        }
    }
    renderPaymentMethod = () => {
        const { paymentMethod } = this.state

        switch (paymentMethod) {
            case 1: return 'VNPAY'
            case 2: return 'Thanh toán sau tại CSYT'
            case 3: return 'PAYOO'
            case 4: return 'PAYOO - cửa hàng tiện ích'
            case 5: return 'PAYOO - trả góp 0%'
            case 6: return 'Chuyển khoản trực tiếp'
            default:
        }
    }
    confirmVoucher = async (voucher, idBooking) => {
        try {
            let idHospital = this.state.booking.hospital.id
            let data = await voucherProvider.selectVoucher(voucher.id, idBooking, idHospital);
            return data.code == 0;
        } catch (error) {

            return false;
        }
    }
    createBooking = () => {
        const { bookingDate, booking, detailSchedule } = this.state
        if (this.isChecking) {
            this.isChecking = false
            this.setState({ isLoading: true }, async () => {
                if (this.state.voucher && this.state.voucher.code) {

                    let dataVoucher = await this.confirmVoucher(this.state.voucher, booking.id);
                    if (!dataVoucher) {
                        this.isChecking = true
                        this.setState({ isLoading: false }, () => {
                            snackbar.show(constants.voucher.voucher_not_found_or_expired, "danger");
                        });
                        return
                    }
                }
                bookingDoctorProvider.confirmBooking(booking.id, this.getPaymentMethod(), this.state.voucher).then(res => {
                    this.setState({ isLoading: false })
                    if (res) {
                        snackbar.show('Đặt khám thành công', 'success')
                        this.props.navigation.navigate("homeTab", {
                            navigate: {
                                screen: "createBookingDoctorSuccess",
                                params: {
                                    detailSchedule: this.state.detailSchedule,
                                    voucher: this.state.voucher,
                                    booking: this.state.booking,
                                    bookingDate: this.state.bookingDate,
                                    paymentMethod: this.state.paymentMethod,
                                    isOnline: this.state.isOnline
                                }
                            }
                        });
                    }
                }).catch(err => {
                    this.isChecking = true
                    this.setState({ isLoading: false })

                })

            })

        }
    }
    renderPaymentMethod = () => {
        const { paymentMethod } = this.state

        switch (paymentMethod) {
            case 1: return 'VNPAY'
            case 2: return 'Thanh toán sau tại CSYT'
            case 3: return 'PAYOO'
            case 4: return 'PAYOO - cửa hàng tiện ích'
            case 5: return 'PAYOO - trả góp 0%'
            case 6: return 'Chuyển khoản trực tiếp'
            default:
        }
    }
    componentWillReceiveProps = (props) => {
        if (props && props.navigation && props.navigation.getParam('voucher')) {
            this.setState({ voucher: props.navigation.getParam('voucher') })
        }
    }
    getVoucher = (voucher) => {

        this.setState({ voucher: voucher })
    }
    goVoucher = () => {
        this.props.navigation.navigate('myVoucher', {
            onSelected: this.getVoucher,
            booking: this.state.booking,
            voucher: this.state.voucher
        })
    }
    componentDidMount() {
        DeviceEventEmitter.addListener('hardwareBackPress', this.handleBackButton)
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    }

    handleBackButton() {
        return true;
    }
    static navigationOptions = {
        gesturesEnabled: false,
    };
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
        let startDate = new Date(promotion.startDate)
        let endDate = new Date(promotion.endDate)
        let day = new Date()
        let isDayOfWeek = (promotion.dateRepeat & Math.pow(2, day.getDay() - 1))
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
        // let detailSchedule = this.props.navigation.getParam('detailSchedule');
        // let bookingDate = this.props.navigation.getParam('bookingDate');
        // let booking = this.props.navigation.getParam('booking');
        const { booking, bookingDate, detailSchedule, voucher } = this.state

        let service = detailSchedule.medicalService || [];

        // let voucher = this.state;
        // if (!booking || !booking.profile || !booking.hospital || !booking.hospital.hospital || !booking.book) {
        //     this.props.navigation.pop();
        //     return null;
        // }
        let bookingTime = new Date(bookingDate)
        console.log(booking, 'âsđá')
        return (
            <ActivityPanel
                hideBackButton={true}
                title={'Chọn phương thức thanh toán'}
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
                                <Text style={styles.text}>{this.renderAcademic(detailSchedule.doctor.academicDegree)}{detailSchedule.doctor.name}</Text>
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
                            {service && service.promotion && this.disablePromotion(service.promotion) ?
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


                        </View>
                        <TouchableOpacity
                            onPress={this.goVoucher}
                            style={styles.btnVoucher}
                        >
                            <View style={styles.flex}>
                                <Text style={styles.txtLabelVoucher}>Mã ưu đãi</Text>
                                {this.state.voucher && this.state.voucher.price ?
                                    <Text style={[{
                                        color: '#00CBA7',
                                        fontWeight: 'bold'
                                    }, styles.flex]}>{`GIẢM ${this.state.voucher.price.formatPrice()}đ KHI ĐẶT KHÁM`}</Text>
                                    : null
                                }

                            </View>
                            <View style={styles.flexRowCenter}>
                                <Text style={styles.txtChange}>Chọn hoặc nhập mã</Text>
                                <ScaleImage style={styles.imgmdk} height={11} source={require("@images/new/booking/ic_next.png")} />

                            </View>
                        </TouchableOpacity>
                        {/** sum Price */}
                        <View style={styles.containerPriveVoucher}>
                            {
                                this.state.voucher && this.state.voucher.price ?
                                    <View style={[styles.containerVoucher, { paddingBottom: 5 }]}>
                                        <Text style={styles.txtSumPrice}></Text>
                                        <Text style={{
                                            color: '#000'
                                        }}>-{this.state.voucher.price.formatPrice()}đ</Text>
                                    </View>
                                    : null
                            }
                            {
                                service && service.monetaryAmount && service.monetaryAmount.value ?
                                    <View style={styles.containerVoucher}>
                                        <Text style={styles.txtSumPrice}>Tổng tiền</Text>
                                        <Text style={styles.sumPrice}>{this.getPrice(service, voucher)}đ</Text>
                                    </View> : null
                            }
                        </View>
                        {/** Payment Method */}
                        <View>
                            <TouchableOpacity disabled={this.state.isOnline} style={styles.buttonPayment}
                                onPress={this.setlectPaymentMethod}
                            >
                                <ScaleImage style={styles.image} source={require("@images/new/booking/ic_price.png")} width={18} />
                                <View style={styles.groupService}>
                                    <Text>Phương thức thanh toán</Text>
                                    <Text style={styles.txtPaymentMethod}>{this.renderPaymentMethod()}</Text>
                                </View>
                                {
                                    !this.state.isOnline ?
                                        <ScaleImage style={styles.imgmdk} height={11} source={require("@images/new/booking/ic_next.png")} />
                                        : null
                                }
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.txtHelper}>Nếu số tiền thanh toán trước cao hơn thực tế, quý khách sẽ nhận lại tiền thừa tại CSYT khám bệnh</Text>

                        <View style={styles.btn}>
                            <TouchableOpacity onPress={this.createBooking} style={[styles.button, this.state.allowBooking ? { backgroundColor: "#02c39a" } : {}]}>
                                <Text style={styles.datkham}>Hoàn thành</Text>
                            </TouchableOpacity>
                        </View>
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
        userApp: state.userApp
    };
}
const styles = StyleSheet.create({
    flex: { flex: 1 },
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
        alignItems: 'center',
        padding: 30
    },
    button: {
        borderRadius: 6,
        // backgroundColor: "#cacaca",
        backgroundColor: "#02c39a",
        shadowColor: "rgba(0, 0, 0, 0.21)",
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        width: 250,
    },
    datkham: {
        fontSize: 16,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#ffffff",
        padding: 15,
        textAlign: 'center'
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
    viewBank: { justifyContent: 'center', },



    containerPriveVoucher: {
        paddingHorizontal: 10,
        backgroundColor: 'rgba(225,225,225,0.3)',
        paddingVertical: 20,
    },
    // txtPaymentMethod: {
    //     fontSize: 15,
    //     fontWeight: "bold",
    //     color: "#000000",
    // },
    buttonPayment: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderBottomWidth: 0.7,
        borderTopWidth: 0.7,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    image: {
        marginTop: 4,
        tintColor: '#FC4A5F'
    },
    txtHelper: {
        color: '#b3b3b3',
        textAlign: 'center',
        paddingHorizontal: 25,
        paddingTop: 15,
        fontStyle: 'italic'
    },
    sumPrice: {
        color: '#FC4A5F',
        fontWeight: 'bold',
    },
    txtSumPrice: {
        color: '#000',
        fontSize: 15,
        fontWeight: '800',
        flex: 1
    },
    containerVoucher: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    txtChange: {
        fontWeight: '700',
        paddingHorizontal: 7,
        backgroundColor: '#fff',
        marginRight: 5,
        paddingVertical: 6,
        borderRadius: 5
    },
    flexRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtLabelVoucher: {
        color: '#111',
        fontWeight: 'bold'
    },
    groupService: {
        flex: 1,
        paddingLeft: 7,
    },

    btnVoucher: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6fffa',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 0.7,
        borderBottomColor: '#ccc',
    },
    imgmdk: {
        marginRight: 5,
        alignSelf: 'center'
    },
})
export default connect(mapStateToProps)(ConfirmBookingDoctorScreen);