import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Platform, AppState } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import stringUtils from 'mainam-react-native-string-utils';
import ScaleImage from "mainam-react-native-scaleimage";
import bookingProvider from '@data-access/booking-provider';
import walletProvider from '@data-access/wallet-provider';
import snackbar from '@utils/snackbar-utils';
import connectionUtils from '@utils/connection-utils';
import payoo from 'mainam-react-native-payoo';
import { NativeModules } from 'react-native';
import constants from '@resources/strings';
import voucherProvider from '@data-access/voucher-provider'
import bookingDoctorProvider from '@data-access/booking-doctor-provider'

var PayooModule = NativeModules.PayooModule;

class ConfirmBookingScreen extends Component {
    constructor(props) {
        super(props);
        let serviceType = this.props.navigation.state.params.serviceType;
        let service = this.props.navigation.state.params.service;
        let hospital = this.props.navigation.state.params.hospital;
        let profile = this.props.navigation.state.params.profile;
        let bookingDate = this.props.navigation.state.params.bookingDate;
        let schedule = this.props.navigation.state.params.schedule;
        let reason = this.props.navigation.state.params.reason;
        let images = this.props.navigation.state.params.images;
        let contact = this.props.navigation.state.params.contact;
        let booking = this.props.navigation.state.params.booking;
        if (!booking) {
            snackbar.show(constants.booking.booking_not_found, "danger");
            this.props.navigation.pop();
        }
        this.state = {
            serviceType,
            service,
            hospital,
            profile,
            bookingDate,
            schedule,
            reason,
            images,
            paymentMethod: 2,
            contact,
            booking,
            voucher: {}
        }
    }
    componentDidMount() {
        // AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        // AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState == 'inactive' || nextAppState == 'background') {

        } else {
            this.setState({ isLoading: true }, () => {
                bookingProvider.detail(this.state.booking.id).then(s => {
                    this.setState({ isLoading: false }, () => {
                        if (s.code == 0 && s.data && s.data.booking) {
                            if (s.code == 0 && s.data && s.data.booking) {
                                switch (s.data.booking.status) {
                                    case 3: //đã thanh toán
                                        let booking = this.state.booking;
                                        booking.hospital = this.state.hospital;
                                        booking.profile = this.state.profile;
                                        booking.payment = this.state.paymentMethod;
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

    confirmVoucher = async (voucher, idBooking) => {
        try {
            let data = await voucherProvider.selectVoucher(voucher.id, idBooking);
            return data.code == 0;
        } catch (error) {
            return false;
        }
    }
    confirmPayment(booking, bookingId, paymentMethod) {
        booking.hospital = this.state.hospital;
        booking.profile = this.state.profile;
        booking.payment = this.state.paymentMethod;

        this.setState({ isLoading: true }, async () => {
            if (this.state.voucher && this.state.voucher.code) {
                let dataVoucher = await this.confirmVoucher(this.state.voucher, bookingId);
                if (!dataVoucher) {
                    this.setState({ isLoading: false }, () => {
                        snackbar.show(constants.voucher.voucher_not_found_or_expired, "danger");
                    });
                    return
                }
            }

            bookingProvider.confirmPayment(bookingId, paymentMethod).then(s => {
                this.setState({ isLoading: false }, () => {
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
                            snackbar.show(constants.msg.booking.booking_expired, "danger");
                    }
                });
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
                return "BANK_TRANSFER";
        }
    }
    getPaymentReturnUrl() {
        switch (this.state.paymentMethod) {
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
        switch (this.state.paymentMethod) {
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
        booking.hospital = this.state.hospital;
        booking.profile = this.state.profile;
        booking.payment = this.state.paymentMethod;
        let price = 0;
        let serviceText = "";
        if (this.state.service && this.state.service.length) {
            price = this.state.service.reduce((total, item) => {
                return total + parseInt((item && item.price ? item.price : 0));
            }, 0);
            serviceText = this.state.service.map(item => (item  ? item.id + " - " + item.name : "")).join(', ');
        }

        this.setState({ isLoading: true }, async () => {
            // let memo = `THANH TOÁN ${this.getPaymentMethod()} - Đặt khám - ${booking.book.codeBooking} - ${serviceText} - ${this.state.hospital.hospital.name} - ${this.getBookingTime()} - ${this.state.profile.medicalRecords.name}`;
            let memo = `Thanh toan ${price.formatPrice()} vnd cho dịch vụ dat kham tren ung dung iSofHcare thong qua ${this.getPaymentMethod()}`;

            let voucher = null
            if (this.state.voucher && this.state.voucher.code) {
                voucher = {
                    code: this.state.voucher.code,
                    amount: this.state.voucher.price
                }
                let dataVoucher = await this.confirmVoucher(this.state.voucher, booking.book.id)
                if (!dataVoucher) {
                    this.setState({ isLoading: false }, () => {
                        snackbar.show(constants.voucher.voucher_not_found_or_expired, "danger")
                    })
                    return
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
                this.amount = data.amount;
                this.setState({ isLoading: false, paymentId }, () => {
                    switch (this.state.paymentMethod) {
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
                                return total + parseInt(item.price)
                            }, 0);
                            this.payment(payment_order, vnp_TxnRef, booking, data);

                            break;
                        case 1:
                            this.props.navigation.navigate("paymentVNPay", {
                                urlPayment: s.payment_url,
                                onSuccess: url => {
                                    this.vnPaySuccess(url, booking, data);
                                },
                                onError: url => {
                                    this.vnPayError(url, booking);
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
    vnPayError(url, booking) {
        this.props.navigation.navigate("paymentBookingError", {
            booking,
            service: this.state.service,
            voucher: this.state.voucher
        })
    }
    vnPaySuccess(url, booking, data) {
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
        booking.transactionCode = obj["vnp_TxnRef"];
        let transactionId = data.id;
        if (data.online_transactions && data.online_transactions.length)
            transactionId = data.online_transactions[0].id;

        booking.vnPayDate = obj["vnp_PayDate"];
        if (transactionId != booking.transactionCode) {
            booking.reasonError = "Đơn hàng không tồn tại";
            this.props.navigation.navigate("paymentBookingError", {
                booking,
                service: this.state.service,
                voucher: this.state.voucher
            })
            return;
        }
        if (obj["vnp_Amount"]) {
            obj["vnp_Amount"] = (obj["vnp_Amount"] || 0) / 100;
        }
        if (data.amount || this.amount) {
            let voucher = (this.state.voucher || {}).price || 0
            let amount = (this.amount || data.amount) - voucher;
            if (obj["vnp_Amount"] != amount) {
                booking.amountError = obj["vnp_Amount"];
                booking.reasonError = "Số tiền không hợp lệ";
                this.props.navigation.navigate("paymentBookingError", {
                    booking,
                    service: this.state.service,
                    voucher: this.state.voucher
                })
                return;
            }
        }
        // walletProvider.onlineTransactionPaid(obj["vnp_TxnRef"], this.getPaymentMethod(), obj);
        if (transactionId != booking.transactionCode || obj["vnp_TransactionNo"] == 0 || obj["vnp_ResponseCode"] == 24) {
            this.props.navigation.navigate("paymentBookingError", {
                booking,
                service: this.state.service,
                voucher: this.state.voucher
            })
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
    }

    payment(payment_order, vnp_TxnRef, booking, data) {
        let payooSDK = payoo;
        if (Platform.OS == 'ios') {
            payooSDK = PayooModule;
        }
        payooSDK.initialize(payment_order.shop_id, payment_order.check_sum_key).then(() => {
            payooSDK.pay(this.state.paymentMethod == 5 ? 1 : 0, payment_order, {}).then(x => {
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
                    switch (this.state.paymentMethod) {
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
                                return total + parseInt(item.price)
                            }, 0);
                            this.payment(payment_order, vnp_TxnRef, booking, data);
                            break;
                        case 1:
                            this.props.navigation.navigate("paymentVNPay", {
                                urlPayment: s.payment_url,
                                onSuccess: url => {
                                    this.vnPaySuccess(url, booking, data);
                                },
                                onError: url => {
                                    this.vnPayError(url, booking, data);
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

    // createBooking() {
    //     connectionUtils.isConnected().then(s => {
    //         this.setState({ isLoading: true }, () => {
    //             bookingProvider.detail(this.state.booking.book.id).then(s => {
    //                 this.setState({ isLoading: false }, () => {
    //                     if (s.code == 0 && s.data && s.data.booking) {
    //                         switch (s.data.booking.status) {
    //                             case 3: //đã thanh toán
    //                                 snackbar.show(constants.booking.booking_paid, "danger")
    //                                 break;
    //                             case 4: //payment_last
    //                                 snackbar.show(constants.booking.booking_paid_or_invalid);
    //                                 break;
    //                             default:
    //                                 this.setState({ isLoading: true }, () => {
    //                                     if (this.state.paymentMethod == 2) {
    //                                         this.confirmPayment(this.state.booking, this.state.booking.book.id);
    //                                         return
    //                                     }
    //                                     if (this.state.paymentMethod == 6) {
    //                                         this.confirmPayment(this.state.booking, this.state.booking.book.id, this.state.paymentMethod);
    //                                         return
    //                                     }
    //                                     else {
    //                                         this.getPaymentLink(this.state.booking);
    //                                     }
    //                                 });
    //                         }
    //                     }
    //                 })
    //                 // 
    //             }).catch(e => {
    //                 this.setState({ isLoading: false }, () => {
    //                 });
    //             });

    //         });
    //     }).catch(e => {
    //         snackbar.show(constants.msg.app.not_internet, "danger");
    //     })
    // }
    createBooking() {
        const { booking } = this.state
        booking.hospital = this.state.hospital;
        booking.profile = this.state.profile;
        booking.payment = this.state.paymentMethod;
        console.log('booking: ', booking);
        connectionUtils.isConnected().then(s => {
            this.setState({ isLoading: true }, async () => {
                if (this.state.voucher && this.state.voucher.code) {
                    let dataVoucher = await this.confirmVoucher(this.state.voucher, booking.id)
                    if (!dataVoucher) {
                        this.setState({ isLoading: false }, () => {
                            snackbar.show(constants.voucher.voucher_not_found_or_expired, "danger")
                        })
                        return
                    }
                }
                bookingDoctorProvider.confirmBooking(this.state.booking.id, this.getPaymentMethod(), this.state.voucher).then(res => {
                    console.log('res: ', res);
                    this.setState({ isLoading: false })
                    if (res) {
                        snackbar.show('Đặt khám thành công', 'success')
                        if (this.state.paymentMethod == 6) {
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
                    }else{
                        snackbar.show(constants.msg.booking.booking_err2, "danger");

                    }
                }).catch(err => {
                    console.log('err: ', err);
                    snackbar.show(constants.msg.booking.booking_err2, "danger");
                    this.setState({ isLoading: false })
                });

            });
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })
    }
    componentWillReceiveProps = (props) => {

        if (props && props.navigation && props.navigation.getParam("voucher")) {
            this.setState({
                voucher: props.navigation.getParam("voucher")
            })
        }

    }
    getVoucher = (voucher) => {


        this.setState({ voucher: voucher })
    }
    goToMyVoucher = () => {

        this.props.navigation.navigate('myVoucher', {
            onSelected: this.getVoucher,
            booking: this.state.booking.book,
            voucher: this.state.voucher
        })
    }
    addVoucher = () => {
        return (

            <TouchableOpacity
                style={styles.btnGoToVoucher}
                onPress={this.goToMyVoucher}
            >
                <Text numberOfLines={1}
                    style={styles.txtButtonVoucher}>{this.state.voucher && this.state.voucher.price ? `GIẢM ${this.state.voucher.price.formatPrice()} KHI ĐẶT KHÁM` : constants.booking.add_voucher}</Text>
                <ScaleImage width={10} source={require("@images/new/booking/ic_next.png")} />
            </TouchableOpacity>
        )
    }

    getPriceSecive = () => {
        let priceVoucher = this.state.voucher && this.state.voucher.price ? this.state.voucher.price : 0
        let priceFinal = this.state.service.reduce((start, item) => {
            return start + parseInt(item.price)
        }, 0)
        if (priceFinal < priceVoucher) {
            return 0
        }
        return (priceFinal - priceVoucher).formatPrice()
    }
    selectPaymentmethod = (paymentMethod) => () => {
        this.setState({ paymentMethod })
    }
    render() {

        return (
            <ActivityPanel style={styles.AcPanel} title={constants.title.verification_booking}
                isLoading={this.state.isLoading} >
                <ScrollView keyboardShouldPersistTaps='handled' style={styles.container}>
                    <View style={styles.containerHeader}>
                        <Text style={styles.txtHeader}>{'HỒ SƠ: ' + this.state.profile.medicalRecords.name.toUpperCase()}</Text>
                        {this.state.profile.medicalRecords.phone ?
                            <Text style={styles.colorGray}>SĐT: {this.state.profile.medicalRecords.phone}</Text>
                            :
                            <View></View>}
                    </View>
                    {this.addVoucher()}
                    <View style={styles.viewDetails}>
                        {this.state.serviceType &&
                            <View style={styles.containerServiceType}>
                                <Text style={styles.txtservicesType}>{(this.state.serviceType.name || "").toUpperCase()}</Text>
                                <ScaleImage width={20} source={require("@images/new/booking/ic_tick.png")} />
                            </View>
                        }
                        <View style={styles.view11} >
                            <View style={[styles.view2]}>
                                <ScaleImage style={styles.ic_Location} width={20} source={require("@images/new/hospital/ic_place.png")} />
                                <View>
                                    <Text style={[styles.text5, styles.fontBold]}>{this.state.hospital.hospital.name}</Text>
                                    <Text style={[styles.text5, styles.margin10]}>{constants.booking.address}: <Text>{this.state.hospital.hospital.address}</Text></Text>
                                </View>
                            </View>

                            {/* <View style={styles.view2}>
                                <ScaleImage style={styles.ic_Location} width={20} source={require("@images/new/booking/ic_doctor.png")} />
                                <Text style={[styles.text5]}>Bác sĩ khám: <Text>{this.state.schedule.doctor.name}</Text></Text>
                            </View> */}

                            <View style={[styles.view2]}>
                                <ScaleImage style={styles.ic_Location} width={20} source={require("@images/new/booking/ic_bookingDate2.png")} />
                                <View>
                                    <Text style={[styles.text5, {}]}>{constants.booking.time}</Text>
                                    <Text style={[styles.text5, styles.marginTop10]}><Text
                                        style={styles.txtDateTime}>{this.state.schedule.key.toDateObject().format("HH:mm tt")} - {this.state.bookingDate.format("thu")}</Text> ngày {this.state.bookingDate.format("dd/MM/yyyy")} </Text>
                                </View>
                            </View>

                            {(this.state.reason && this.state.reason.trim()) ?
                                <View style={[styles.view2]}>
                                    <ScaleImage style={[styles.ic_Location, { marginRight: 22 }]} width={17} source={require("@images/new/booking/ic_note.png")} />
                                    <View>
                                        <Text style={styles.text5}>{constants.booking.symptom}:</Text>
                                        <Text style={[styles.text5, styles.fontBold]}>{this.state.reason}</Text>
                                    </View>
                                </View> : null
                            }
                            {this.state.service && this.state.service.length ?
                                <View style={[styles.view2]}>
                                    <ScaleImage style={[styles.ic_Location]} width={20} source={require("@images/new/booking/ic_coin.png")} />
                                    <View>
                                        <Text style={styles.text5}>{constants.booking.services}: </Text>
                                        {
                                            this.state.service.map((item, index) => <View key={index} style={styles.containerListServices}>
                                                <Text style={styles.txtListServices} numberOfLines={1}>{index + 1}. {item.name}</Text>
                                                <Text style={styles.txtPrice}>({parseInt(item.price).formatPrice()}đ)</Text>
                                            </View>
                                            )

                                        }
                                        {this.state.voucher && this.state.voucher.price ? <View style={styles.containerListServices}>
                                            <Text style={styles.txtListServices} numberOfLines={1}> {''}</Text>
                                            <Text style={styles.txtPrice}>(-{parseInt(this.state.voucher.price).formatPrice()}đ)</Text>
                                        </View> : null}

                                    </View>
                                </View> : null
                            }
                            {this.state.service && this.state.service.length ?
                                <View style={[styles.view2]}>
                                    <ScaleImage style={[styles.ic_Location]} width={20} source={require("@images/new/booking/ic_coin.png")} />
                                    <View style={styles.row}>
                                        <Text style={[styles.text5]}>{constants.booking.sum_price}: <Text
                                            style={styles.txtPriceService}
                                            numberOfLines={1}>{this.getPriceSecive()}đ</Text></Text>
                                    </View>
                                </View> : null
                            }
                        </View>
                    </View>

                    <View style={styles.containerTypePayment}>
                        <Text style={styles.txtTypePayment}>{constants.booking.type_payment}</Text>
                        <ScaleImage width={20} source={require("@images/new/booking/ic_tick.png")} />
                    </View>
                    {/* <View style={styles.ckeck}> */}
                    {/* <ScaleImage style={styles.ckecked} height={20} source={require("@images/new/ic_ckecked.png")} /> */}
                    {/* <Text style={styles.ckeckthanhtoan}>Ví ISOFHCARE</Text> */}
                    {/* </View> */}
                    {/* <View>
                        <Text style={styles.sodu}>Số dư hiện tại: 350.000đ</Text>
                    </View> */}
                    {
                        (this.state.service && this.state.service.length) ?
                            <React.Fragment>
                                <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentmethod(6)}>
                                    <View style={styles.containerBtnSelect}>
                                        {this.state.paymentMethod == 6 &&
                                            <View style={styles.isSelected}></View>
                                        }
                                    </View>
                                    <Text style={styles.ckeckthanhtoan}>{constants.payment.direct_transfer}</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentmethod(1)}>
                                    <View style={styles.containerBtnSelect}>
                                        {this.state.paymentMethod == 1 &&
                                            <View style={styles.isSelected}></View>
                                        }
                                    </View>
                                    <Text style={styles.ckeckthanhtoan}>{constants.payment.VNPAY}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentmethod(3)}>
                                    <View style={styles.containerBtnSelect}>
                                        {this.state.paymentMethod == 3 &&
                                            <View style={styles.isSelected}></View>
                                        }
                                    </View>
                                    <Text style={styles.ckeckthanhtoan}>{constants.payment.PAYOO}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentmethod(5)}>
                                    <View style={styles.containerBtnSelect}>
                                        {this.state.paymentMethod == 5 &&
                                            <View style={styles.isSelected}></View>
                                        }
                                    </View>
                                    <Text style={styles.ckeckthanhtoan}>{constants.payment.PAYOO_installment}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentmethod(4)}>
                                    <View style={styles.containerBtnSelect}>
                                        {this.state.paymentMethod == 4 &&
                                            <View style={styles.isSelected}></View>
                                        }
                                    </View>
                                    <Text style={styles.ckeckthanhtoan}>{constants.payment.PAYOO_convenient_shop}</Text>
                                </TouchableOpacity> */}
                            </React.Fragment> : null
                    }
                    <TouchableOpacity style={styles.ckeck} onPress={this.selectPaymentmethod(2)}>
                        <View style={styles.containerBtnSelect}>
                            {this.state.paymentMethod == 2 &&
                                <View style={styles.isSelected}></View>
                            }
                        </View>
                        <Text style={styles.ckeckthanhtoan}>{constants.payment.pay_later}</Text>
                    </TouchableOpacity>
                    <View style={styles.end} />
                </ScrollView>
                <TouchableOpacity style={styles.btn} onPress={this.createBooking.bind(this)}>
                    <Text style={styles.btntext}>{constants.actionSheet.confirm}</Text>
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
    end: { height: 50 },
    txtTypePayment: {
        fontWeight: 'bold',
        color: 'rgb(2,195,154)',
        marginRight: 10
    },
    containerTypePayment: {
        paddingHorizontal: 20,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtPriceService: {
        fontWeight: 'bold',
        marginLeft: 20,
        color: '#d0021b'
    },
    row: { flexDirection: 'row' },
    txtPrice: { color: '#ccc' },
    containerListServices: {
        flexDirection: 'row',
        marginTop: 5
    },
    txtListServices: {
        flex: 1,
        fontWeight: 'bold',
        marginLeft: 20,
        color: '#000'
    },
    txtDateTime: {
        color: 'rgb(106,1,54)',
        fontWeight: 'bold'
    },
    marginTop10: { marginTop: 10 },
    margin10: {
        marginTop: 10
    },
    fontBold: {
        fontWeight: 'bold'
    },
    flexStart: {
    },
    txtservicesType: {
        fontWeight: 'bold',
        color: 'rgb(2,195,154)',
        marginRight: 10
    },
    containerServiceType: {
        paddingHorizontal: 20,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    colorGray: { color: 'gray' },
    txtHeader: {
        fontWeight: 'bold',
        color: '#000'
    },
    containerHeader: {
        paddingHorizontal: 20,
        marginVertical: 20
    },
    isSelected: {
        backgroundColor: 'rgb(2,195,154)',
        width: 10,
        height: 10,
        borderRadius: 5
    },
    containerBtnSelect: {
        width: 20,
        height: 20,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgb(2,195,154)'
    },
    txtButtonVoucher: {
        color: 'rgb(2,195,154)',
        fontSize: 15,
        fontWeight: 'bold',
        paddingRight: 15
    },
    btnGoToVoucher: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 15,
        backgroundColor: '#effbf9'
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
        alignItems: 'center',
        alignItems: 'flex-start'
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
        borderRadius: 6,
        backgroundColor: "#02c39a",
        shadowColor: "rgba(0, 0, 0, 0.21)",
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        width: 250,
        marginVertical: 20,
        alignSelf: 'center'
    },
    btntext: {
        fontSize: 15,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#ffffff",
        padding: 15,
        textAlign: 'center'
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