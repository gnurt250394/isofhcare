import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, AppState, ScrollView, Keyboard, Image, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import connectionUtils from '@utils/connection-utils';
const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;
import DateTimePicker from 'mainam-react-native-date-picker';
import snackbar from '@utils/snackbar-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import specialistProvider from '@data-access/specialist-provider'
import dataCacheProvider from '@data-access/datacache-provider';
import constants from '@resources/strings';
import medicalRecordProvider from '@data-access/medical-record-provider';
import serviceTypeProvider from '@data-access/service-type-provider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import bookingProvider from '@data-access/booking-provider';
import walletProvider from '@data-access/wallet-provider';
import StarRating from 'react-native-star-rating';
import bookingDoctorProvider from '@data-access/booking-doctor-provider'
import ViewHeader from '@components/booking/doctor/ViewHeader';
class AddBookingDoctorScreen extends Component {
    constructor(props) {
        super(props);
        let profileDoctor = this.props.navigation.getParam('profileDoctor', {})
        let bookingDate = this.props.navigation.getParam('bookingDate', {})
        let schedule = this.props.navigation.getParam('schedule', {})
        let hospital = this.props.navigation.getParam('hospital', {})


        this.state = {
            colorButton: 'red',
            imageUris: [],
            bookingDate,
            schedule,
            allowBooking: true,
            contact: 2,
            listServicesSelected: [],
            profileDoctor,
            hospital,
            paymentMethod: 2,
            detailSchedule: this.props.navigation.getParam('detailSchedule', {})
        }
    }
    _changeColor = () => {
        this.setState = ({ colorButton: !this.setState.colorButton })
    }
    removeImage(index) {
        var imageUris = this.state.imageUris;
        imageUris.splice(index, 1);
        this.setState({ imageUris });
    }
    componentDidMount() {
        // AppState.addEventListener('change', this._handleAppStateChange);
        dataCacheProvider.read(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_PROFILE, (s, e) => {
            if (s) {
                
                this.setState({ profile: s })
            } else {
                medicalRecordProvider.getByUser(this.props.userApp.currentUser.id, 1, 100).then(s => {
                    switch (s.code) {
                        case 0:
                            if (s.data && s.data.data && s.data.data.length != 0) {

                                let data = s.data.data;
                                let profile = data.find(item => {
                                    return item.medicalRecords.status == 1;
                                });
                                if (profile) {
                                    this.setState({ profile: profile });
                                    dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_PROFILE, profile);
                                }
                            }
                            break;
                    }
                });
            }
        });


    }
    selectImage() {
        if (this.state.imageUris && this.state.imageUris.length >= 5) {
            snackbar.show(constants.msg.booking.image_without_five, "danger");
            return;
        }
        connectionUtils.isConnected().then(s => {
            if (this.imagePicker) {
                this.imagePicker.show({
                    multiple: true,
                    mediaType: 'photo',
                    maxFiles: 5,
                    compressImageMaxWidth: 500,
                    compressImageMaxHeight: 500
                }).then(images => {
                    let listImages = [];
                    if (images.length)
                        listImages = [...images];
                    else
                        listImages.push(images);
                    let imageUris = this.state.imageUris;
                    listImages.forEach(image => {
                        if (imageUris.length >= 5)
                            return;
                        let temp = null;
                        imageUris.forEach((item) => {
                            if (item.uri == image.path)
                                temp = item;
                        })
                        if (!temp) {
                            imageUris.push({ uri: image.path, loading: true });
                            imageProvider.upload(image.path, (s, e) => {
                                if (s.success) {
                                    if (s.data.code == 0 && s.data.data && s.data.data.images && s.data.data.images.length > 0) {
                                        let imageUris = this.state.imageUris;
                                        imageUris.forEach((item) => {
                                            if (item.uri == s.uri) {
                                                item.loading = false;
                                                item.url = s.data.data.images[0].image;
                                                item.thumbnail = s.data.data.images[0].thumbnail;
                                            }
                                        });
                                        this.setState({
                                            imageUris
                                        });
                                    }
                                } else {
                                    imageUris.forEach((item) => {
                                        if (item.uri == s.uri) {
                                            item.error = true;
                                        }
                                    });
                                }
                            });
                        }
                    })
                    this.setState({ imageUris: [...imageUris] });
                });

            }
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        });
    }
    selectProfile(profile) {
        this.setState({ profile, allowBooking: true });
    }

    selectService(services) {
        this.setState({ listServicesSelected: services });
    }
    componentWillUnmount() {
        // AppState.removeEventListener('change', this._handleAppStateChange);
    }
    // _handleAppStateChange = (nextAppState) => {
    //     if (nextAppState == 'inactive' || nextAppState == 'background') {

    //     } else {
    //         let { paymentMethod } = this.state
    //         this.setState({ isLoading: true }, () => {
    //             bookingProvider.detail(this.state.booking.book.id).then(s => {
    //                 this.setState({ isLoading: false }, () => {
    //                     if (s.code == 0 && s.data && s.data.booking) {
    //                         if (s.code == 0 && s.data && s.data.booking) {
    //                             switch (s.data.booking.status) {
    //                                 case 3: //đã thanh toán
    //                                     let booking = this.state.booking;
    //                                     booking.hospital = this.state.hospital;
    //                                     booking.profile = this.state.profile;
    //                                     booking.payment = paymentMethod;
    //                                     this.props.navigation.navigate("homeTab", {
    //                                         navigate: {
    //                                             screen: "createBookingSuccess",
    //                                             params: {
    //                                                 booking,
    //                                                 service: this.state.service,
    //                                                 voucher: this.state.voucher

    //                                             }
    //                                         }
    //                                     });
    //                                     break;
    //                             }
    //                         }
    //                     }
    //                 });
    //             });
    //         });
    //     }
    // };

    confirmPayment(booking, bookingId, paymentMethod) {

        booking.hospital = this.state.hospital;
        booking.profile = this.state.profile;
        booking.payment = this.state.paymentMethod;
        this.setState({ isLoading: true }, () => {
            bookingProvider.confirmPayment(bookingId, paymentMethod).then(s => {
                switch (s.code) {

                    case 0:
                        if (paymentMethod) {
                            this.props.navigation.navigate("homeTab", {
                                navigate: {
                                    screen: "createBookingWithPayment",
                                    params: {
                                        booking,
                                        service: this.state.service,
                                        voucher: this.state.voucher

                                    }
                                }
                            });
                        }
                        else {
                            this.props.navigation.navigate("homeTab", {
                                navigate: {
                                    screen: "createBookingSuccess",
                                    params: {
                                        booking,
                                        service: this.state.service,
                                        voucher: this.state.voucher

                                    }
                                }
                            });
                        }
                        break;
                    case 5:
                        this.setState({ isLoading: false }, () => {
                            snackbar.show(constants.msg.booking.booking_expired, "danger");
                        });
                }
            }).catch(e => {
                this.setState({ isLoading: false }, () => {
                    snackbar.show(constants.msg.booking.booking_err2, "danger");
                });
            });
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
                return "CASH";
        }
    }
    getPaymentReturnUrl() {
        let { paymentMethod } = this.state
        switch (paymentMethod) {
            case 1:
                return constants.key.payment_return_url.vnpay;
            // return "http://localhost:8888/order/vnpay_return";
            case 2:
                return "";
            case 3:
            case 5:
            case 4:
                return constants.key.payment_return_url.payoo;
        }
    }
    getPaymentMethodUi() {
        let { paymentMethod } = this.state
        switch (paymentMethod) {
            case 3:
            case 5:
                return "SDK";
            default:
                return "";
        }
    }

    getBookingTime = () => {
        try {
            return this.state.bookingDate.format("yyyy-MM-dd") + " " + (this.state.schedule.timeString || ((this.state.schedule.time || new Date()).format("HH:mm:ss")));
        } catch (error) {

        }
        return "";
    }


    getPaymentLink(booking) {
        let { paymentMethod } = this.state
        booking.hospital = this.state.hospital;
        booking.profile = this.state.profile;
        booking.payment = paymentMethod;
        let price = 0;
        let serviceText = "";
        if (this.state.service && this.state.service.length) {
            price = this.state.service.reduce((total, item) => {
                return total + parseInt((item && item.service && item.service.price ? item.service.price : 0));
            }, 0);
            serviceText = this.state.service.map(item => (item && item.service ? item.service.id + " - " + item.service.name : "")).join(', ');
        }

        this.setState({ isLoading: true }, () => {
            let memo = `THANH TOÁN ${this.getPaymentMethod()} - Đặt khám - ${booking.book.codeBooking} - ${serviceText} - ${this.state.hospital.hospital.name} - ${this.getBookingTime()} - ${this.state.profile.medicalRecords.name}`;
            let voucher = null
            if (this.state.voucher && this.state.voucher.code) {
                voucher = {
                    code: this.state.voucher.code,
                    amount: this.state.voucher.price
                }
            }

            walletProvider.createOnlinePayment(
                this.props.userApp.currentUser.id,
                this.getPaymentMethod(),
                this.state.hospital.hospital.id,
                booking.book.id,
                this.getPaymentReturnUrl(),
                price,
                memo,
                booking.book.hash,
                booking.jwtData,
                this.getPaymentMethodUi(),
                booking.book.expireDatePayoo,
                booking.timeInitBooking,
                booking.book.createdDate,
                booking.timeZone,
                voucher
            ).then(s => {
                let data = s.data;
                let paymentId = data.id;
                this.setState({ isLoading: false, paymentId }, () => {
                    switch (paymentMethod) {
                        case 4:
                            booking.online_transactions = data.online_transactions;
                            booking.valid_time = data.valid_time;
                            this.props.navigation.navigate("homeTab", {
                                navigate: {
                                    screen: "createBookingSuccess",
                                    params: {
                                        booking,
                                        service: this.state.service,
                                        voucher: this.state.voucher

                                    }
                                }
                            });
                            break;
                        case 3:
                        case 5:
                            let vnp_TxnRef = data.online_transactions[0].id;
                            let payment_order = s.payment_order;
                            payment_order.orderInfo = payment_order.data;
                            payment_order.cashAmount = this.state.service.reduce((total, item) => {
                                return total + parseInt(item.service.price)
                            }, 0);
                            this.payment(payment_order, vnp_TxnRef, booking, data);

                            break;
                        case 1:
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
                                    booking.vnPayId = data.id
                                    booking.vnPayDate = obj["vnp_PayDate"]
                                    walletProvider.onlineTransactionPaid(obj["vnp_TxnRef"], this.getPaymentMethod(), obj);
                                    if (obj["vnp_TransactionNo"] == 0) {
                                        booking.transactionCode = obj["vnp_TxnRef"];
                                        this.props.navigation.navigate("paymentBookingError", { booking })
                                    }
                                    else {
                                        this.props.navigation.navigate("homeTab", {
                                            navigate: {
                                                screen: "createBookingSuccess",
                                                params: {
                                                    booking,
                                                    service: this.state.service,
                                                    voucher: this.state.voucher

                                                }
                                            }
                                        });
                                    }
                                },
                                onError: url => {
                                    this.props.navigation.navigate("paymentBookingError", { booking })
                                }
                            });
                            break;
                    }

                })
            }).catch(e => {
                this.setState({ isLoading: false }, () => {
                    if (e && e.response && e.response.data) {
                        let response = e.response.data;

                        let message = "";
                        switch (response.type) {
                            case "ValidationError":
                                message = response.message;
                                for (let key in message) {
                                    switch (key) {
                                        case "id":
                                            snackbar.show(constants.booking.payment_not_permission, "danger");
                                            return;
                                        case "order_ref_id":
                                            this.retry(this.state.paymentId);
                                            return;
                                        case "vendor_id":
                                            snackbar.show(constants.booking.vendor_not_found, "danger");
                                            return;
                                    }
                                }
                                break;
                            case "BadRequestError":
                                message = response.message;
                                if (message == "order_existed") {
                                    this.retry(this.state.paymentId);
                                    return;
                                } else {
                                    if (message) {
                                        snackbar.show(message, "danger");
                                        return;
                                    }
                                }
                        }
                    }
                    snackbar.show(constants.booking.create_payment_fail, "danger");
                    // this.props.navigation.navigate("paymentBookingError", { booking })
                })
            });
        })
    }

    payment(payment_order, vnp_TxnRef, booking, data) {
        let payooSDK = payoo;
        let { paymentMethod } = this.state
        if (Platform.OS == 'ios') {
            payooSDK = PayooModule;
        }
        payooSDK.initialize(payment_order.shop_id, payment_order.check_sum_key).then(() => {
            payooSDK.pay(paymentMethod == 5 ? 1 : 0, payment_order, {}).then(x => {
                let obj = JSON.parse(x);
                walletProvider.onlineTransactionPaid(vnp_TxnRef, this.getPaymentMethod(), obj);
                this.props.navigation.navigate("homeTab", {
                    navigate: {
                        screen: "createBookingSuccess",
                        params: {
                            booking,
                            service: this.state.service,
                            voucher: this.state.voucher
                        }
                    }
                });
            }).catch(y => {
                if (y.code != 2) {
                    booking.transactionCode = data.online_transactions[0].id;
                    this.props.navigation.navigate("paymentBookingError", { booking })
                }
            });
        })
    }

    retry(paymentId) {
        let booking = this.state.booking;
        let { paymentMethod } = this.state

        this.setState({ isLoading: true }, () => {
            let voucher = null
            if (this.state.voucher && this.state.voucher.code) {
                voucher = {
                    code: this.state.voucher.code,
                    amount: this.state.voucher.price
                }
            }
            walletProvider.retry(paymentId, this.getPaymentReturnUrl(), this.getPaymentMethodUi(), this.getPaymentMethod(), voucher).then(s => {
                this.setState({ isLoading: false }, () => {
                    let data = s.data;
                    if (!data) {
                        snackbar.show(constants.booking.create_payment_fail, "danger");
                        return;
                    }
                    switch (paymentMethod) {
                        case 4:

                            booking.online_transactions = data.online_transactions;
                            booking.valid_time = data.valid_time;
                            this.props.navigation.navigate("homeTab", {
                                navigate: {
                                    screen: "createBookingSuccess",
                                    params: {
                                        booking,
                                        service: this.state.service,
                                        voucher: this.state.voucher

                                    }
                                }
                            });
                            break;
                        case 3:
                        case 5:
                            let vnp_TxnRef = data.id;
                            let payment_order = s.payment_order;
                            payment_order.orderInfo = payment_order.data;
                            payment_order.cashAmount = this.state.service.reduce((total, item) => {
                                return total + parseInt(item.service.price)
                            }, 0);
                            this.payment(payment_order, vnp_TxnRef, booking, data);
                            break;
                        case 1:
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
                                    walletProvider.onlineTransactionPaid(obj["vnp_TxnRef"], this.getPaymentMethod(), obj);
                                    if (obj["vnp_TransactionNo"] == 0) {
                                        booking.transactionCode = obj["vnp_TxnRef"];
                                        this.props.navigation.navigate("paymentBookingError", { booking })
                                    }
                                    else {
                                        booking.vnPayDate = obj["vnp_PayDate"]
                                        booking.vnPayDate = data.id
                                        this.props.navigation.navigate("homeTab", {
                                            navigate: {
                                                screen: "createBookingSuccess",
                                                params: {
                                                    booking,
                                                    service: this.state.service,
                                                    voucher: this.state.voucher
                                                }
                                            }
                                        });
                                    }
                                },
                                onError: url => {
                                    this.props.navigation.navigate("paymentBookingError", { booking })
                                }
                            });
                            break;
                    }

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
                                            snackbar.show(constants.booking.payment_not_permission, "danger");
                                            return;
                                        case "order_ref_id":
                                            snackbar.show(constants.booking.booking_invalid, "danger");
                                            return;
                                        case "vendor_id":
                                            snackbar.show(constants.booking.vendor_not_found, "danger");
                                            return;
                                    }
                                }
                                break;
                        }
                    }
                    snackbar.show(constants.booking.create_payment_fail, "danger");
                    // this.props.navigation.navigate("paymentBookingError", { booking })
                })
            });
        })
    }

    createBooking() {
        let { paymentMethod } = this.state
        let date = new Date(this.state.schedule.key).format("yyyy-MM-dd")
        let { reason, voucher, detailSchedule, profile, schedule, profileDoctor } = this.state
        
        
        
        
        let patitent = profile && profile.medicalRecords
        connectionUtils.isConnected().then(s => {
            this.setState({ isLoading: true }, () => {
                bookingDoctorProvider.create(
                    date,
                    reason,
                    voucher,
                    detailSchedule.doctor,
                    profileDoctor.hospital,
                    detailSchedule.medicalService,
                    patitent,
                    this.getPaymentMethod(),
                    detailSchedule.id,
                    schedule.label,
                    detailSchedule.room
                ).then(s => {
                    this.setState({ isLoading: false }, () => {
                        if (s && s.reference) {
                            s.payment = this.state.paymentMethod
                            snackbar.show('Đặt khám thành công', 'success')
                            this.props.navigation.navigate("homeTab", {
                                navigate: {
                                    screen: "createBookingDoctorSuccess",
                                    params: {
                                        detailSchedule,
                                        voucher: this.state.voucher,
                                        booking: s
                                    }
                                }
                            });
                        }
                    })
                    // 
                }).catch(e => {
                    this.setState({ isLoading: false });
                    if (e.response && e.response.data.error == 'Locked') {
                        snackbar.show(e.response.data.message, 'danger')
                    } else {
                        snackbar.show('Đặt khám không thành công', 'danger')
                    }
                });

            });
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })
    }

    onTimePickerChange(schedule) {
        if (schedule)
            this.setState({ schedule, scheduleError: "" });
        else {
            this.setState({ schedule });
        }
    }
    onSelectDateTime = (date, schedule, hospital) => {
        this.setState({ schedule, bookingDate: date, scheduleError: "", hospital });
    }
    selectTime = () => {

        this.props.navigation.navigate("selectTimeDoctor", {
            service: this.state.listServicesSelected,
            isNotHaveSchedule: true,
            // onSelected: this.onSelectDateTime
        });
    }

    onSelectProfile = () => {
        connectionUtils.isConnected().then(s => {
            this.props.navigation.navigate("selectProfile", {
                onSelected: this.selectProfile.bind(this),
                profile: this.state.profile
            });
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        });
    }
    renderBookingTime() {
        if (this.state.bookingDate && this.state.schedule)
            return <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Text style={{ textAlign: 'left', color: '#000', fontWeight: 'bold', paddingRight: 10, }}>{(new Date(this.state.schedule.key)).format("dd/MM/yyyy")}</Text>
                <Text style={{ textAlign: 'left', color: '#02c39a', fontWeight: 'bold' }}>{(new Date(this.state.schedule.key)).format("HH:mm tt")}</Text>
            </View>
        return <Text style={{ textAlign: 'left' }}>Chọn ngày và giờ</Text>;
    }

    getPrice = () => {
        const { detailSchedule } = this.state

        let priceVoucher = this.state.voucher && this.state.voucher.price ? this.state.voucher.price : 0
        // let services = detailSchedule.detailSchedule || []
        let services = detailSchedule.medicalService || {}



        // let priceFinal = services.reduce((start, item) => {

        //     return start + parseInt(item.monetaryAmount.value)
        // }, 0)

        // return (priceFinal - priceVoucher).formatPrice()
        let price = services && services.monetaryAmount && services.monetaryAmount.value ? services.monetaryAmount.value.formatPrice() : 0
        return price

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
            booking: this.state.hospital
        })
    }
    renderServices = (hospital) => {
        if (Array.isArray(hospital))
            return (
                <View style={styles.containerService} >
                    <View style={styles.flexRow}>
                        <ScaleImage style={styles.image} height={13} source={require("@images/new/booking/ic_specialist.png")} />
                        <View style={styles.groupService}>
                            <Text >Dịch vụ</Text>
                            {hospital.services && hospital.services.length > 0 ?
                                hospital.services.map((e, i) => {
                                    return <View key={i} style={styles.containerPrice}>
                                        <Text style={styles.txtService} >{e.name}</Text>
                                        <Text style={styles.txtPrice}>{e.price.formatPrice()}đ </Text>
                                    </View>
                                }) : null}

                        </View>
                    </View>


                </View>

            )
        else
            return (
                <View style={styles.containerService} >
                    <View style={styles.flexRow}>
                        <ScaleImage style={styles.image} height={13} source={require("@images/new/booking/ic_specialist.png")} />
                        <View style={styles.groupService}>
                            <Text >Dịch vụ</Text>
                            {hospital && hospital.name ?
                                <View style={styles.containerPrice}>
                                    <Text style={styles.txtService} >{hospital.name}</Text>
                                    <Text style={styles.txtPrice}>{hospital.monetaryAmount.value.formatPrice()}đ </Text>
                                </View>
                                : null}

                        </View>
                    </View>


                </View>
            )
    }
    renderSelectTime = () => {
        return <TouchableOpacity style={styles.containerService}
            onPress={this.selectTime} >
            <View style={styles.flexRow}>
                <ScaleImage style={styles.image} height={15} source={require("@images/new/booking/ic_bookingTime.png")} />
                <View style={styles.groupService}>
                    <Text >Thời gian khám</Text>
                    {this.renderBookingTime()}
                </View>
                <ScaleImage style={styles.imgmdk} height={11} source={require("@images/new/booking/ic_next.png")} />

            </View>


        </TouchableOpacity>
    }
    selectHospital = (hospital) => {
        this.setState({ hospital })
    }
    onSelectServices = () => {
        let listHospital = this.props.navigation.getParam('listHospital', [])
        this.props.navigation.navigate('listHospital', {
            listHospital,
            onItemSelected: this.selectHospital
        })
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
    onSelectPaymentMethod = (paymentMethod) => {
        this.setState({ paymentMethod })
    }
    setlectPaymentMethod = () => {
        this.props.navigation.navigate('listPaymentMethod', {
            onItemSelected: this.onSelectPaymentMethod
        })
    }
    render() {

        let minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        // minDate.setDate(minDate.getDate());
        const { profileDoctor, profile, hospital, detailSchedule } = this.state
        const services = hospital.services || []
        return (
            <ActivityPanel title="Đặt Khám"
                isLoading={this.state.isLoading} >
                <View style={{ backgroundColor: 'rgba(225,225,225,0.3)', flex: 1 }}>
                    <KeyboardAwareScrollView>
                        {/** */}

                        <ViewHeader
                            iconRight={true}
                            onPress={this.onSelectProfile}
                            button={true}
                            source={require("@images/new/booking/ic_people.png")}
                            name={profile && profile.medicalRecords ? profile.medicalRecords.name : null}
                            subName={constants.booking.select_profile}
                            label={'Người tới khám'}
                        />

                        <ViewHeader
                            source={require("@images/new/booking/ic_serviceType.png")}
                            name={profileDoctor ? profileDoctor.academicDegree + ' ' + profileDoctor.name : null}
                            subName={''}
                            label={'Bác sĩ'}
                        />
                        <ViewHeader
                            source={require("@images/new/booking/ic_placeholder.png")}
                            name={profileDoctor && profileDoctor.hospital ? profileDoctor.hospital.name : null}
                            subName={''}
                            label={'Cơ sở y tế'}
                        />

                        {this.renderServices(detailSchedule.medicalService)}
                        {this.renderSelectTime()}
                        {
                            this.state.bookingError ?
                                <Text style={[styles.errorStyle]}>{this.state.bookingError}</Text> : null
                        }


                        <View style={[styles.article,]}>
                            <View style={styles.lineBetween} />
                            <Form
                                ref={ref => (this.form = ref)} style={styles.mota}>
                                <TextField
                                    hideError={true}
                                    validate={{
                                        rules: {
                                            // required: true,
                                            maxlength: 500
                                        },
                                        messages: {
                                            // required: "Mô tả triệu chứng không được bỏ trống",
                                            maxlength: constants.msg.app.text_without_500
                                        }
                                    }}

                                    onValidate={(valid, messages) => {
                                        if (valid) {
                                            this.setState({ symptonError: "" });
                                        }
                                        else {
                                            this.setState({ symptonError: messages });
                                        }
                                    }}
                                    onChangeText={s => {
                                        this.setState({ reason: s, allowBooking: true })
                                    }}
                                    style={{ flex: 1 }}
                                    inputStyle={styles.mtTr}
                                    multiline={true} placeholder={constants.msg.booking.booking_note}></TextField>
                                <TouchableOpacity style={styles.imgMT} onPress={this.selectImage.bind(this)}>
                                    <ScaleImage height={15} source={require("@images/new/booking/ic_image.png")} />
                                </TouchableOpacity>
                            </Form>

                        </View>
                        {this.state.symptonError ?
                            <Text style={[styles.errorStyle]}>{this.state.symptonError}</Text>
                            :
                            null
                        }
                        {/**Voucher */}
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
                        <View style={styles.containerVoucher}>
                            <Text style={styles.txtSumPrice}>Tổng tiền</Text>
                            <Text style={styles.sumPrice}>{this.getPrice()}đ</Text>
                        </View>

                        {/** Payment Method */}
                        <View>
                            <TouchableOpacity style={styles.buttonPayment}
                                onPress={this.setlectPaymentMethod}
                            >
                                <ScaleImage style={styles.image} source={require("@images/new/booking/ic_price.png")} width={18} />
                                <View style={styles.groupService}>
                                    <Text>Phương thức thanh toán</Text>
                                    <Text style={styles.txtPaymentMethod}>{this.renderPaymentMethod()}</Text>
                                </View>
                                <ScaleImage style={styles.imgmdk} height={11} source={require("@images/new/booking/ic_next.png")} />
                            </TouchableOpacity>
                        </View>
                        {this.state.imageUris && this.state.imageUris.length > 0 ?
                            <View style={styles.list_image}>
                                {
                                    this.state.imageUris.map((item, index) => <View key={index} style={styles.containerImagepicker}>
                                        <View style={styles.groupImagePicker}>
                                            <Image source={{ uri: item.uri }} resizeMode="cover" style={styles.imagePicker} />
                                            {
                                                item.error ?
                                                    <View style={styles.error} >
                                                        <ScaleImage source={require("@images/ic_warning.png")} width={40} />
                                                    </View> :
                                                    item.loading ?
                                                        < View style={styles.imgLoading} >
                                                            <ScaleImage source={require("@images/loading.gif")} width={40} />
                                                        </View>
                                                        : null
                                            }
                                        </View>
                                        <TouchableOpacity onPress={this.removeImage.bind(this, index)} style={{ position: 'absolute', top: 0, right: 0 }} >
                                            <ScaleImage source={require("@images/new/ic_close.png")} width={16} />
                                        </TouchableOpacity>
                                    </View>)
                                }
                            </View>
                            :
                            null
                        }
                        {/* <SelectPaymentDoctor service={services} ref={ref => this = ref} /> */}
                        <Text style={styles.txtHelper}>Nếu số tiền thanh toán trước cao hơn thực tế, quý khách sẽ nhận lại tiền thừa tại CSYT khám bệnh</Text>
                        <View style={styles.btn}>
                            <TouchableOpacity onPress={this.createBooking.bind(this)} style={[styles.button, this.state.allowBooking ? { backgroundColor: "#02c39a" } : {}]}>
                                <Text style={styles.datkham}>Đặt khám</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>


                    <ImagePicker ref={ref => this.imagePicker = ref} />

                    <DateTimePicker
                        isVisible={this.state.toggelDateTimePickerVisible}
                        onConfirm={newDate => {
                            this.setState({
                                toggelDateTimePickerVisible: false,
                            }, () => {
                                if (newDate && this.state.bookingDate && newDate.ddmmyyyy() == this.state.bookingDate.ddmmyyyy())
                                    return;
                                this.setState({
                                    bookingDate: newDate,
                                    date: newDate.format("thu, dd tháng MM").replaceAll(" 0", " "),
                                    allowBooking: true,
                                    serviceError: "",
                                    scheduleError: ""
                                });
                            })
                        }}
                        onCancel={() => {
                            this.setState({ toggelDateTimePickerVisible: false })
                        }}
                        minimumDate={minDate}
                        cancelTextIOS={constants.actionSheet.cancel2}
                        confirmTextIOS={constants.actionSheet.confirm}
                        date={this.state.bookingDate || minDate}
                    />
                </View>
            </ActivityPanel >);
    }
}

const styles = StyleSheet.create({
    txtPaymentMethod: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#000000",
    },
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
        paddingHorizontal: 10,
        backgroundColor: 'rgba(225,225,225,0.3)',
        paddingVertical: 20,
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
    flex: { flex: 1 },
    txtLabelVoucher: {
        color: '#111',
        fontWeight: 'bold'
    },
    lineBetween: {
        height: 12,
        backgroundColor: 'rgba(225,225,225,0.3)',
        width: '100%'
    },
    txtPrice: {
        fontSize: 15,
        fontWeight: "600",
        color: "#ccc",
        fontStyle: 'italic',
    },
    txtService: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#000000",
        flex: 1
    },
    containerPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        flex: 1,
        paddingRight: 10,
    },
    groupService: {
        flex: 1,
        paddingLeft: 7,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    containerService: {
        paddingHorizontal: 10,
        borderBottomWidth: 0.7,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    positionDoctor: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 12
    },
    imgLoading: {
        position: 'absolute',
        left: 20,
        top: 20,
        backgroundColor: '#FFF',
        borderRadius: 20
    },
    error: {
        position: 'absolute',
        left: 20,
        top: 20
    },
    imagePicker: {
        width: 80,
        height: 80,
        borderRadius: 8
    },
    groupImagePicker: {
        marginTop: 8,
        width: 80,
        height: 80
    },
    containerImagepicker: {
        margin: 2,
        width: 88,
        height: 88,
        position: 'relative'
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

    article: {
        backgroundColor: "#ffffff",
    },
    imgmdk: {
        marginRight: 5,
        alignSelf: 'center'
    },
    mota: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: "#ffffff",
        borderColor: "#ccc",
        alignItems: 'center',
        borderTopWidth: 0.3,
        borderBottomWidth: 0.7
    },
    mtTr: {
        flex: 1,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
        padding: 0,
        paddingLeft: 10
    },
    imgMT: {
        marginRight: 10
    },
    btn: {
        alignItems: 'center',
        padding: 30
    },
    button: {
        borderRadius: 6,
        backgroundColor: "#cacaca",
        // backgroundColor: "#02c39a",
        shadowColor: "rgba(0, 0, 0, 0.21)",
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        width: 250,
        maxWidth: DEVICE_HEIGHT
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
    list_image: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        marginHorizontal: 20
    },
    errorStyle: {
        color: 'red',
        marginTop: 10,
        marginLeft: 25,
        marginRight: 25
    },
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(AddBookingDoctorScreen);