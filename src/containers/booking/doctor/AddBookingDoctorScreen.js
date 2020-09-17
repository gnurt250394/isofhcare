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
import profileProvider from '@data-access/profile-provider'
import objectUtils from '@utils/object-utils';
import { logEventFB } from '@utils/facebook-utils';

class AddBookingDoctorScreen extends Component {
    constructor(props) {
        super(props);
        let profileDoctor = this.props.navigation.getParam('profileDoctor', {})
        let bookingDate = this.props.navigation.getParam('bookingDate', {})
        let schedule = this.props.navigation.getParam('schedule', {})
        let hospital = this.props.navigation.getParam('hospital', {})
        let isOnline = this.props.navigation.getParam('isOnline', false)



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
            detailSchedule: this.props.navigation.getParam('detailSchedule', {}),
            isOnline
        }
        this.isChecking = true
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
                profileProvider.getListProfile().then(s => {
                    switch (s.code) {
                        case 0:
                            if (s.data && s.data && s.data.length != 0) {

                                let data = s.data;
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
                    compressImageMaxWidth: 1500,
                    compressImageMaxHeight: 1500
                }).then(images => {
                    let listImages = [];
                    if (images.length)
                        listImages = [...images];
                    else
                        listImages.push(images);
                    let imageUris = this.state.imageUris;
                    listImages.forEach(image => {
                        if (imageUris.length >= 5) {
                            snackbar.show('Chỉ cho phép tối đa 5 ảnh', 'danger')
                            return;
                        }
                        let temp = null;
                        imageUris.forEach((item) => {
                            if (item.uri == image.path)
                                temp = item;
                        })
                        if (!temp) {
                            imageUris.push({ uri: image.path, loading: true });
                            imageProvider.upload(image.path, image.mime, (s, e) => {
                                if (s.success) {
                                    if (s && s.data.length > 0) {
                                        let imageUris = this.state.imageUris;
                                        imageUris.forEach((item) => {
                                            if (item.uri == s.uri) {
                                                item.loading = false;
                                                item.url = s.data[0].fileDownloadUri;
                                                item.thumbnail = s.data[0].fileDownloadUri;
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
                }).catch(err => {
                    if (err) {
                        snackbar.show('Định dạng ảnh không được hỗ trợ hoặc ảnh đã bị hỏng vui lòng chọn ảnh khác', 'danger')
                    }
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

        let value = 0
        if (item?.promotion && this.disablePromotion(item.promotion)) {
            if (item?.promotion?.type == "PERCENT") {
                value = (item.monetaryAmount.value - (item.monetaryAmount.value * (item.promotion.value / 100) || 0))
            } else {

                value = ((item?.monetaryAmount?.value - item?.promotion?.value) || 0)

            }
        } else {
            value = item?.monetaryAmount?.value
        }

        if (value < 0) {
            return 0
        }
        return value
    }

    createBooking() {
        let { paymentMethod } = this.state
        let date = new Date(this.state.schedule.date).format("yyyy-MM-dd")
        let { reason, voucher, detailSchedule, profile, schedule, profileDoctor } = this.state


        if (!this.props.userApp.isLogin) {
            this.props.navigation.replace("login", {
                nextScreen: {
                    screen: "addBookingDoctor", param: {
                        profileDoctor: this.state.profileDoctor,
                        bookingDate: this.state.bookingDate,
                        detailSchedule: this.state.detailSchedule,
                        schedule: this.state.schedule,
                        isOnline: this.state.isOnline
                    }
                }
            });

            return
        }
        if (!this.state.profile) {
            this.setState({ profileError: 'Bạn chưa chọn người tới khám' })
            return
        }
        for (var i = 0; i < this.state.imageUris.length; i++) {
            if (this.state.imageUris[i].loading) {
                snackbar.show(constants.msg.booking.image_loading, 'danger');
                return;
            }
            if (this.state.imageUris[i].error) {
                snackbar.show(constants.msg.booking.image_load_err, 'danger');
                return;
            }
        }
        var images = [];
        this.state.imageUris.forEach((item) => {
            images.push(item.url);
        });
        let img = images ? images : ''
        let discount = voucher && voucher.price ? voucher.price : 0
        let patitent = profile && profile.medicalRecords
        let services = [{
            serviceId: detailSchedule?.medicalService?.id || '',
            name: detailSchedule?.medicalService?.name || '',
            price: detailSchedule?.medicalService?.monetaryAmount?.value || 0,
            isOnline: this.state.isOnline,
            promotionTitle: detailSchedule?.medicalService?.promotion && this.disablePromotion(detailSchedule?.medicalService?.promotion) ? detailSchedule?.medicalService?.promotion?.title : null,
            promotionType: detailSchedule?.medicalService?.promotion && this.disablePromotion(detailSchedule?.medicalService?.promotion) ? detailSchedule?.medicalService?.promotion?.type : null,
            promotionValue: detailSchedule?.medicalService?.promotion && this.disablePromotion(detailSchedule?.medicalService?.promotion) ? detailSchedule?.medicalService?.promotion?.value : null
        }]
        detailSchedule.medicalService
        let idUser = this.props.userApp.currentUser.id
        if (this.isChecking) {
            this.isChecking = false
            connectionUtils.isConnected().then(s => {
                this.setState({ isLoading: true }, () => {
                    bookingDoctorProvider.create(
                        date,
                        reason,
                        // discount,
                        detailSchedule.doctor,
                        profileDoctor.hospital,
                        services,
                        patitent,
                        // this.getPaymentMethod(),
                        detailSchedule.id,
                        schedule.time,
                        detailSchedule.room,
                        idUser,
                        img,
                        detailSchedule.blockTime
                    ).then(s => {
                        this.setState({ isLoading: false }, () => {
                            if (s && s.reference) {
                                logEventFB("Đặt khám bác sĩ")
                                this.isChecking = true
                                s.payment = this.state.paymentMethod
                                // snackbar.show('Đặt khám thành công', 'success')
                                this.props.navigation.navigate("confirmBookingDoctor", {
                                    // navigate: {
                                    //     screen: "createBookingDoctorSuccess",
                                    //     params: {
                                    detailSchedule,
                                    voucher: this.state.voucher,
                                    booking: s,
                                    bookingDate: this.state.bookingDate,
                                    isOnline: this.state.isOnline
                                    // }
                                    // }
                                });
                            }
                        })
                        // 
                    }).catch(e => {
                        this.isChecking = true
                        this.setState({ isLoading: false });

                        if (e.response && e.response.data.error == 'Locked') {
                            snackbar.show(e.response.data.message, 'danger')
                        } else if (e.response && typeof e.response.data == 'string') {
                            snackbar.show(e.response.data, 'danger')
                        }
                        else {
                            snackbar.show('Đặt khám không thành công', 'danger')
                        }
                    });

                });
            }).catch(e => {
                this.isChecking = true
                snackbar.show(constants.msg.app.not_internet, "danger");
            })
        }

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
        this.setState({ profileError: '' })
        if (!this.props.userApp.isLogin) {
            this.props.navigation.navigate("login", {
                nextScreen: {
                    screen: "selectProfile", param: {
                        onSelected: this.selectProfile.bind(this),
                        profile: this.state.profile
                    }
                }
            });
            return
        }
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
                <Text style={{ textAlign: 'left', color: '#000', fontWeight: 'bold', paddingRight: 10, }}>{(new Date(this.state.schedule.date)).format("dd/MM/yyyy")}</Text>
                <Text style={{ textAlign: 'left', color: '#02c39a', fontWeight: 'bold' }}>{this.state.schedule.time}</Text>
            </View>
        return <Text style={{ textAlign: 'left' }}>Chọn ngày và giờ</Text>;
    }

    getPrice = () => {
        const { detailSchedule } = this.state

        let priceVoucher = this.state.voucher && this.state.voucher.price ? this.state.voucher.price : 0
        let services = detailSchedule.medicalService || {}
        let price = services && services.monetaryAmount && services.monetaryAmount.value ? services.monetaryAmount.value : 0
        if (priceVoucher > price) {
            return 0
        }
        return (price - priceVoucher).formatPrice()

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
            booking: this.state.hospital,
            voucher: this.state.voucher
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
    renderPromotion = (promotion) => {
        let text = ''
        if (promotion.type == "PERCENT") {
            text = promotion.value + '%'
        } else {
            text = promotion.value.formatPrice() + 'đ'
        }
        return text
    }
    promotion = (service) => {
        if (service && service.promotion && this.disablePromotion(service.promotion))
            return (
                <View style={styles.containerService} >
                    <View style={styles.flexRow}>
                        <ScaleImage style={styles.image} height={17} source={require("@images/new/booking/ic_sale.png")} />
                        <View style={styles.groupService}>
                            <Text >Khuyến mại</Text>
                            <View style={styles.containerPrice}>
                                <Text style={styles.txtService} ></Text>
                                <Text style={styles.txtPrice}>Giảm {this.renderPromotion(service.promotion)} </Text>
                            </View>

                        </View>
                    </View>


                </View>
            )
        else
            return null
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
    renderAcademic = (academicDegree) => {
        if (academicDegree) {
            switch (academicDegree) {
                case 'BS': return 'BS. '
                case 'ThS': return 'ThS. '
                case 'TS': return 'TS. '
                case 'PGS': return 'PGS. '
                case 'GS': return 'GS. '
                case 'BSCKI': return 'BSCKI. '
                case 'BSCKII': return 'BSCKII. '
                case 'GSTS': return 'GS.TS. '
                case 'PGSTS': return 'PGS.TS. '
                case 'ThsBS': return 'ThS.BS. '
                case 'ThsBSCKII': return 'ThS.BSCKII. '
                case 'TSBS': return 'TS.BS. '
                default: return ''
            }
        }
        else {
            return ''
        }
    }
    render() {

        let minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        // minDate.setDate(minDate.getDate());
        const { profileDoctor, profile, hospital, detailSchedule, isOnline } = this.state
        const services = hospital.services || []
        return (
            <ActivityPanel title={isOnline ? "Thông tin lịch gọi" : "Thông tin đặt khám"}
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
                        {
                            this.state.profileError ?
                                <Text style={styles.errorStyle}>{this.state.profileError}</Text>
                                : null
                        }
                        <ViewHeader
                            source={require("@images/new/booking/ic_serviceType.png")}
                            name={profileDoctor ? objectUtils.renderAcademic(profileDoctor.academicDegree) + profileDoctor.name : null}
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
                        {this.promotion(detailSchedule.medicalService)}
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
                        {/**Voucher */}
                        {/* <TouchableOpacity
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
                        </TouchableOpacity> */}
                        {/** sum Price */}
                        {/* <View style={styles.containerPriveVoucher}>
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
                            <View style={styles.containerVoucher}>
                                <Text style={styles.txtSumPrice}>Tổng tiền</Text>
                                <Text style={styles.sumPrice}>{this.getPrice()}đ</Text>
                            </View>
                        </View> */}
                        {/** Payment Method */}
                        {/* <View>
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
                        </View> */}

                        {/* <SelectPaymentDoctor service={services} ref={ref => this = ref} /> */}
                        {/* <Text style={styles.txtHelper}>Nếu số tiền thanh toán trước cao hơn thực tế, quý khách sẽ nhận lại tiền thừa tại CSYT khám bệnh</Text> */}
                    </KeyboardAwareScrollView>
                    <View style={styles.btn}>
                        <TouchableOpacity onPress={this.createBooking.bind(this)} style={[styles.button, this.state.allowBooking ? { backgroundColor: "#02c39a" } : {}]}>
                            <Text style={styles.datkham}>{isOnline ? "Đặt lịch" : 'Đặt lịch'}</Text>
                        </TouchableOpacity>
                    </View>


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
    containerPriveVoucher: {
        paddingHorizontal: 10,
        backgroundColor: 'rgba(225,225,225,0.3)',
        paddingVertical: 20,
    },
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
        marginHorizontal: 20,
        paddingBottom: 10
    },
    errorStyle: {
        color: 'red',
        paddingVertical: 5,
        marginLeft: 25,
        marginRight: 25,
        fontStyle: 'italic'
    },
});

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(AddBookingDoctorScreen);