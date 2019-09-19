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

import scheduleProvider from '@data-access/schedule-provider';
import SelectPaymentDoctor from '@components/booking/doctor/SelectPaymentDoctor';
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
            hospital
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
        AppState.addEventListener('change', this._handleAppStateChange);
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
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState == 'inactive' || nextAppState == 'background') {

        } else {
            let paymentMethod = this.paymentSelect.state.paymentMethod || 2
            this.setState({ isLoading: true }, () => {
                bookingProvider.detail(this.state.booking.book.id).then(s => {
                    this.setState({ isLoading: false }, () => {
                        if (s.code == 0 && s.data && s.data.booking) {
                            if (s.code == 0 && s.data && s.data.booking) {
                                switch (s.data.booking.status) {
                                    case 3: //đã thanh toán
                                        let booking = this.state.booking;
                                        booking.hospital = this.state.hospital;
                                        booking.profile = this.state.profile;
                                        booking.payment = paymentMethod;
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
                                }
                            }
                        }
                    });
                });
            });
        }
    };

    confirmPayment(booking, bookingId, paymentMethod) {
        let paymentMethod2 = this.paymentSelect.state.paymentMethod || 2
        booking.hospital = this.state.hospital;
        booking.profile = this.state.profile;
        booking.payment = paymentMethod2;
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
        let paymentMethod = this.paymentSelect.state.paymentMethod || 2
        switch (paymentMethod) {
            case 1:
                return "VNPAY";
            case 2:
                return "";
            case 3:
            case 5:
                return "PAYOO";
            case 4:
                return "PAYOO_BILL";
            case 6:
                return "";
        }
    }
    getPaymentReturnUrl() {
        let paymentMethod = this.paymentSelect.state.paymentMethod || 2
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
        let paymentMethod = this.paymentSelect.state.paymentMethod || 2
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
        let paymentMethod = this.paymentSelect.state.paymentMethod || 2
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
        let paymentMethod = this.paymentSelect.state.paymentMethod || 2
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
        let paymentMethod = this.paymentSelect.state.paymentMethod || 2

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
        let paymentMethod = this.paymentSelect.state.paymentMethod || 2
        
        connectionUtils.isConnected().then(s => {
            this.setState({ isLoading: true }, () => {
                bookingProvider.detail(this.state.booking.book.id).then(s => {
                    this.setState({ isLoading: false }, () => {
                        if (s.code == 0 && s.data && s.data.booking) {
                            switch (s.data.booking.status) {
                                case 3: //đã thanh toán
                                    snackbar.show(constants.booking.booking_paid, "danger")
                                    break;
                                case 4: //payment_last
                                    snackbar.show(constants.booking.booking_paid_or_invalid);
                                    break;
                                default:
                                    this.setState({ isLoading: true }, () => {
                                        if (paymentMethod == 2) {
                                            this.confirmPayment(this.state.booking, this.state.booking.book.id);
                                            return
                                        }
                                        if (paymentMethod == 6) {
                                            this.confirmPayment(this.state.booking, this.state.booking.book.id, paymentMethod);
                                            return
                                        }
                                        else {
                                            this.getPaymentLink(this.state.booking);
                                        }
                                    });
                            }
                        }
                    })
                    // 
                }).catch(e => {
                    this.setState({ isLoading: false }, () => {
                    });
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
            return <View>
                <Text style={{ textAlign: 'right', color: '#02c39a', fontWeight: 'bold' }}>{(new Date(this.state.schedule.key)).format("HH:mm tt")}</Text>
                <Text style={{ textAlign: 'right', color: '#02c39a', fontWeight: 'bold' }}>{(new Date(this.state.schedule.key)).format("thu, ngày dd/MM/yyyy")}</Text>
            </View>
        return <Text style={{ textAlign: 'right' }}>Chọn ngày và giờ</Text>;
    }
    renderProfile = (profileDoctor) => {
        let avatar = (this.state.profileDoctor || {}).avatar;
        const source = avatar ? { uri: avatar.absoluteUrl() } : require("@images/new/user.png");
        return (
            <View style={styles.article}>
                <View style={styles.containerProfile}>
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={styles.imgProfile}
                        borderRadius={20}
                        customImagePlaceholderDefaultStyle={[styles.avatar, { width: 40, height: 40 }]}
                        placeholderSource={require("@images/new/user.png")}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={styles.imgDoctor}
                        defaultImage={() => {
                            return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
                        }}
                    />
                    <View style={{ flex: 1, paddingLeft: 5 }}>
                        <Text style={styles.txtname}>BS.{profileDoctor.name}</Text>
                        <View style={styles.containerRating}>
                            <StarRating
                                disabled={true}
                                starSize={12}
                                maxStars={5}
                                rating={profileDoctor.rating}
                                starStyle={{ margin: 1 }}
                                fullStarColor={"#fbbd04"}
                                emptyStarColor={"#fbbd04"}
                            />
                            <Text style={styles.txtRating}>{profileDoctor.rating}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.between} />

                <View style={styles.positionDoctor}>
                    <Text style={styles.txtAddress}>Chuyên khoa</Text>
                    <View>
                        {profileDoctor.position && profileDoctor.position.length > 0 ?
                            profileDoctor.position.map((e, i) => {
                                return (
                                    <Text key={i}>{e}</Text>
                                )
                            }) : null
                        }
                    </View>
                </View>
            </View>
        )
    }
    getPrice = () => {
        const { hospital } = this.state

        let priceVoucher = this.state.voucher && this.state.voucher.price ? this.state.voucher.price : 0
        let services = hospital.services || []

        let priceFinal = services.reduce((start, item) => {

            return start + parseInt(item.price)
        }, 0)

        return (priceFinal - priceVoucher).formatPrice()

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
    render() {

        let minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        // minDate.setDate(minDate.getDate());
        const { profileDoctor, profile, hospital } = this.state
        const services = hospital.services || []
        return (
            <ActivityPanel title="Đặt Khám"
                isLoading={this.state.isLoading} >
                <View>
                    <KeyboardAwareScrollView>
                        {this.renderProfile(profileDoctor)}
                        <View style={styles.article}>
                            <TouchableOpacity style={styles.mucdichkham} onPress={this.selectTime}>
                                <Text style={styles.mdk}>Thời gian khám</Text>
                                <View style={styles.ktq}>{this.renderBookingTime()}</View>
                                <ScaleImage style={styles.imgmdk} height={11} source={require("@images/new/booking/ic_next.png")} />
                            </TouchableOpacity>
                            {
                                this.state.bookingError ?
                                    <Text style={[styles.errorStyle]}>{this.state.bookingError}</Text> : null
                            }
                            <View style={{
                                paddingLeft: 10
                            }}>
                                <View style={styles.rowAddress}>
                                    <Text style={styles.txtAddress}>Địa điểm khám</Text>
                                    <Text>{hospital && hospital.name ? hospital.name : ''}</Text>
                                </View>
                                <View style={styles.rowAddress}>
                                    <Text style={styles.txtAddress}>Nơi làm thủ tục</Text>
                                    <Text>{hospital && hospital.location ? hospital.location : ''}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.between} />
                        <View style={[styles.article,]}>
                            <Text style={styles.txtServices}>Dịch vụ khám</Text>
                            {services && services.length > 0 ?
                                services.map((e, i) => {
                                    return (
                                        <View key={i} style={styles.groupServices}>
                                            <Text style={{ flex: 1 }}>{e.name}</Text>
                                            <Text>({e.price.formatPrice()}đ)</Text>
                                        </View>
                                    )
                                })
                                : null
                            }
                            <TouchableOpacity
                                onPress={this.goVoucher}
                                style={styles.btnVoucher}
                            >
                                <Text style={[styles.txtVoucher, { flex: 1 }]}>{this.state.voucher && this.state.voucher.price ? `GIẢM ${this.state.voucher.price.formatPrice()} KHI ĐẶT KHÁM` : 'Thêm mã ưu đãi'}</Text>
                                <ScaleImage style={styles.imgmdk} height={11} source={require("@images/new/booking/ic_next.png")} />

                            </TouchableOpacity>
                            <View style={styles.groupSumPrice}>
                                <Text style={styles.txtSumPrice}>Tổng tiền: </Text>
                                <Text style={{ color: '#111' }}>{this.getPrice()}đ</Text>
                            </View>


                            <TouchableOpacity style={styles.btnVoucher}
                                onPress={this.onSelectProfile}
                            >
                                <Text style={styles.txtVoucher}>Đặt khám cho: </Text>
                                {this.state.profile ?
                                    <Text style={{ color: '#111', flex: 1 }}>{this.state.profile.medicalRecords.name}</Text>
                                    :
                                    <Text style={styles.txtname}>{constants.booking.select_profile}</Text>

                                }
                                <ScaleImage style={styles.imgmdk} height={11} source={require("@images/new/booking/ic_next.png")} />
                            </TouchableOpacity>
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
                        <Text style={[styles.errorStyle]}>{this.state.symptonError}</Text>

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

                        <SelectPaymentDoctor service={services} ref={ref => this.paymentSelect = ref} />

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
            </ActivityPanel>);
    }
}

const styles = StyleSheet.create({
    positionDoctor: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: 10,
        paddingTop: 5
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
    txtSumPrice: {
        color: '#111',
        fontWeight: '500',
        width: '40%'
    },
    groupSumPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10
    },
    txtVoucher: {
        color: '#02c39a',
        fontWeight: 'bold',
        width: '40%'
    },
    btnVoucher: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFDD',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 10
    },
    groupServices: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    txtServices: {
        color: '#02c39a',
        fontSize: 15,
        fontWeight: '700',
        paddingLeft: 10
    },
    rowAddress: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingTop: 7
    },
    txtAddress: {
        width: '40%',
        fontSize: 15,
        color: '#02C39A',
        fontWeight: '700'
    },
    between: {
        backgroundColor: '#02C39A',
        height: 1,
        width: '95%',
        marginVertical: 7,
        alignSelf: 'center'
    },
    containerRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imgDoctor: {
        alignSelf: 'center',
        borderRadius: 20,
        width: 40,
        height: 40
    },
    imgProfile: {
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: 'rgba(151, 151, 151, 0.29)'
    },
    containerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    txtRating: {
        paddingLeft: 7
    },
    menu: {
        padding: 5,
        paddingRight: 15
    },
    container: {
        flex: 1,
        backgroundColor: "#f7f9fb",
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.06)"
    },
    imgName: {
        marginLeft: 5,
    },
    txtname: {
        fontSize: 15,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a",
        flex: 1,
    },
    img: {
        marginRight: 5
    },
    article: {
        // marginTop: 12,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.06)",
    },
    mucdichkham: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        // backgroundColor: '#02c39a'
    },
    mdk: {
        fontSize: 15,
        fontWeight: "700",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#111111"
    },
    ktq: {
        flex: 1,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "right",
        color: "#8e8e93",
        marginRight: 10,
        marginLeft: 20
    },
    imgmdk: {
        marginRight: 5
    },
    mota: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: "#ffffff",
        borderColor: "rgba(0, 0, 0, 0.06)",
        alignItems: 'center',
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
    list_image: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginHorizontal: 20 },
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