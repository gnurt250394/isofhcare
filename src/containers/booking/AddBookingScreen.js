import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import ImagePicker from 'mainam-react-native-select-image';
import imageProvider from '@data-access/image-provider';
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
const DEVICE_HEIGHT = Dimensions.get('window').height;
import DateTimePicker from 'mainam-react-native-date-picker';
import KeyboardSpacer from "react-native-keyboard-spacer";
import snackbar from '@utils/snackbar-utils';
import dateUtils from "mainam-react-native-date-utils";
import stringUtils from "mainam-react-native-string-utils";
import ImageLoad from 'mainam-react-native-image-loader';
import Form from "mainam-react-native-form-validate/Form";
import TextField from "mainam-react-native-form-validate/TextField";
import specialistProvider from '@data-access/specialist-provider'
import dataCacheProvider from '@data-access/datacache-provider';
import constants from '@resources/strings';
import medicalRecordProvider from '@data-access/medical-record-provider';
import serviceTypeProvider from '@data-access/service-type-provider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BookingTimePicker from '@components/booking/BookingTimePicker';
import bookingProvider from '@data-access/booking-provider';
import serviceProvider from '@data-access/service-provider';

import scheduleProvider from '@data-access/schedule-provider';
class AddBookingScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            colorButton: 'red',
            imageUris: [],
            allowBooking: false,
            contact: 2,
            listServicesSelected: []
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
        // dataCacheProvider.read(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_SERVICE_TYPE, (s, e) => {
        //     if (s) {
        //         this.setState({ serviceType: s }, () => {
        //             serviceTypeProvider.getAll().then(s => {
        //                 if (s) {
        //                     let _default = s.find(item => item.status == 1);
        //                     this.setState({ serviceType: _default });
        //                     dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_SERVICE_TYPE, _default);
        //                 }
        //             });
        //         })
        //     } else {
        //         serviceTypeProvider.getAll().then(s => {
        //             if (s) {
        //                 let _default = s.find(item => item.status == 1);
        //                 this.setState({ serviceType: _default });
        //                 dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_SERVICE_TYPE, _default);
        //             }
        //         });
        //     }
        // });

        // dataCacheProvider.read(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_SPECIALIST, (s, e) => {
        //     console.log(s, 'specialist');
        //     if (s) {
        //         this.setState({ specialist: s })
        //     } else {
        //         specialistProvider.getAll().then(s => {
        //             if (s) {
        //                 let specialist = s[0]
        //                 this.setState({ specialist: specialist })
        //             }
        //         });
        //     }
        // })
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
    selectServiceType(serviceType) {
        let serviceTypeError = serviceType ? "" : this.state.serviceTypeError;
        if (!serviceType || !this.state.serviceType || serviceType.id != this.state.serviceType.id) {
            this.setState({ serviceType, listServicesSelected: [], allowBooking: true, serviceTypeError })
        } else {
            this.setState({ serviceType, allowBooking: true, serviceTypeError: "", serviceTypeError });
        }
    }
    selectHospital = () => {
        connectionUtils.isConnected().then(s => {
            this.props.navigation.navigate("selectHospital", {
                hospital: this.state.hospital,
                onSelected: (hospital) => {
                    let hospitalError = hospital ? "" : this.state.hospitalError;

                    if (!hospital || !this.state.hospital || hospital.hospital.id != this.state.hospital.hospital.id) {
                        this.setState({ hospital, listServicesSelected: [], serviceType: null, schedules: [], allowBooking: true, hospitalError })
                    } else {
                        this.setState({ hospital, allowBooking: true, hospitalError });
                    }

                }
            })
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        });
    }

    selectService(services) {
        this.setState({ listServicesSelected: services });
    }

    addBooking() {
        Keyboard.dismiss();
        if (!this.state.allowBooking)
            return;

        let error = false;

        if (this.state.contact) {
            this.setState({ contactError: "" })
        } else {
            this.setState({ contactError: constants.msg.booking.contact_not_null })
            error = true;
        }
        if (this.state.profile) {
            this.setState({ profileError: "" })
        } else {
            this.setState({ profileError: constants.msg.booking.profile_not_null })
            error = true;
        }
        if (this.state.serviceType) {
            this.setState({ serviceTypeError: "" })
        } else {
            this.setState({ serviceTypeError: constants.msg.booking.require_not_null })
            error = true;
        }
        // if (this.state.listServicesSelected && this.state.listServicesSelected.length) {
        //     this.setState({ serviceError: "" })
        // } else {
        //     this.setState({ serviceError: constants.msg.booking.service_not_null })
        //     error = true;
        // }
        if (this.state.bookingDate) {
            this.setState({ bookingError: "" })
        } else {
            this.setState({ bookingError: constants.msg.booking.date_booking_not_null })
            error = true;
        }
        if (this.state.hospital) {
            this.setState({ hospitalError: "" })
        } else {
            this.setState({ hospitalError: constants.msg.booking.location_not_null })
            error = true;
        }

        if (this.state.schedule) {
            this.setState({ scheduleError: "" })
        } else {
            this.setState({ scheduleError: constants.msg.booking.schedule_not_null })
            error = true;
        }

        let validForm = this.form.isValid();
        if (!error && validForm) {
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
            var images = "";
            this.state.imageUris.forEach((item) => {
                if (images)
                    images += ",";
                images += item.url;
            });
            let reason = this.state.reason ? this.state.reason : ''
            let img = images ? images : ''



            connectionUtils.isConnected().then(s => {
                this.setState({ isLoading: true }, () => {
                    console.log(this.state.schedule.time);
                    let serviceIds = this.state.listServicesSelected.map(item => item.service.id).join(",");
                    let bookingDate = this.state.bookingDate.format("yyyy-MM-dd") + " " + this.state.schedule.label + ":00";
                    bookingProvider.create(
                        this.state.hospital.hospital.id,
                        this.state.profile.medicalRecords.id,
                        this.state.serviceType.id,
                        serviceIds,
                        bookingDate,
                        reason,
                        img
                    ).then(s => {
                        this.setState({ isLoading: false }, () => {
                            if (s) {
                                switch (s.code) {
                                    case 0:
                                        dataCacheProvider.save(this.props.userApp.currentUser.id, constants.key.storage.LASTEST_PROFILE, this.state.profile);
                                        this.props.navigation.navigate("confirmBooking", {
                                            serviceType: this.state.serviceType,
                                            service: this.state.listServicesSelected,
                                            profile: this.state.profile,
                                            hospital: this.state.hospital,
                                            bookingDate: this.state.bookingDate,
                                            schedule: this.state.schedule,
                                            reason: reason,
                                            images: img,
                                            contact: this.state.contact,
                                            booking: s.data
                                        });
                                        break;
                                    case 1:
                                        this.setState({ isLoading: false }, () => {
                                            snackbar.show(constants.msg.booking.booking_must_equal_datetime, "danger");
                                        });
                                        break;
                                    case 2:
                                        this.setState({ isLoading: false }, () => {
                                            snackbar.show(constants.msg.booking.full_slot_on_this_time, "danger");
                                        });
                                        break;
                                    case 401:
                                        this.setState({ isLoading: false }, () => {
                                            snackbar.show(constants.msg.booking.booking_must_login, "danger");
                                            this.props.navigation.navigate("login"
                                                // , {
                                                //     nextScreen: {
                                                //         screen: "confirmBooking", params: this.props.navigation.state.params
                                                //     }
                                                // }
                                            );
                                        });
                                        break;
                                    default:
                                        this.setState({ isLoading: false }, () => {
                                            snackbar.show(constants.msg.booking.booking_err, "danger");
                                        });
                                        break;
                                }
                            }
                        });
                    }).catch(e => {
                        this.setState({ isLoading: false }, () => {
                        });
                    })
                });
            }).catch(e => {
                snackbar.show(constants.msg.app.not_internet, "danger");
            })





            // this.props.navigation.navigate("selectTime", {
            //     profile: this.state.profile,
            //     hospital: this.state.hospital,
            //     specialist: this.state.specialist,
            //     serviceType: this.state.serviceType ? this.state.serviceType : '',
            //     bookingDate: this.state.bookingDate,
            //     reason: reason,
            //     img,
            //     contact: this.state.contact
            // });
        }
    }
    onTimePickerChange(schedule) {
        if (schedule)
            this.setState({ schedule, scheduleError: "" });
        else {
            this.setState({ schedule });
        }
    }
    render() {
        let avatar = ((this.state.profile || {}).medicalRecords || {}).avatar;
        const source = avatar ? { uri: avatar.absoluteUrl() } : require("@images/new/user.png");
        let minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        // minDate.setDate(minDate.getDate());

        return (<ActivityPanel title="Đặt Khám"
            isLoading={this.state.isLoading}
            menuButton={<TouchableOpacity style={styles.menu} onPress={() => snackbar.show(constants.msg.app.in_development)}><ScaleImage style={styles.img} height={20} source={require("@images/new/booking/ic_info.png")} /></TouchableOpacity>}
            titleStyle={{ marginLeft: 50 }}>

            <KeyboardAwareScrollView>
                <View style={styles.article}>
                    <TouchableOpacity style={styles.name} onPress={() => {
                        connectionUtils.isConnected().then(s => {
                            this.props.navigation.navigate("selectProfile", {
                                onSelected: this.selectProfile.bind(this),
                                profile: this.state.profile
                            });
                        }).catch(e => {
                            snackbar.show(constants.msg.app.not_internet, "danger");
                        });
                    }}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', padding: 10, paddingBottom: this.state.profileError ? 0 : 10
                        }}>
                            {this.state.profile ?
                                <View style={{ flexDirection: 'row', height: 38, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ImageLoad
                                        resizeMode="cover"
                                        imageStyle={{ borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' }}
                                        borderRadius={20}
                                        customImagePlaceholderDefaultStyle={[styles.avatar, { width: 40, height: 40 }]}
                                        placeholderSource={require("@images/new/user.png")}
                                        resizeMode="cover"
                                        loadingStyle={{ size: 'small', color: 'gray' }}
                                        source={source}
                                        style={{
                                            alignSelf: 'center',
                                            borderRadius: 20,
                                            width: 40,
                                            height: 40
                                        }}
                                        defaultImage={() => {
                                            return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
                                        }}
                                    />
                                    <Text style={styles.txtname}>{this.state.profile.medicalRecords.name}</Text>
                                </View> :
                                <View style={{ flexDirection: 'row', height: 38, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 38, height: 38, borderRadius: 19, borderColor: 'rgba(151, 151, 151, 0.29)', borderWidth: 0.5 }}>
                                        <ScaleImage source={require("@images/new/profile/ic_profile.png")} width={20} />
                                    </View>
                                    <Text style={styles.txtname}>{constants.booking.select_profile}</Text>
                                </View>
                            }

                            <ScaleImage style={styles.img} height={10} source={require("@images/new/booking/ic_next.png")} />
                        </View>
                        {
                            this.state.profileError ?
                                <Text style={[styles.errorStyle]}>{this.state.profileError}</Text> : null
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.article}>
                    <TouchableOpacity style={styles.mucdichkham} onPress={this.selectHospital}>
                        <ScaleImage style={styles.imgIc} width={18} source={require("@images/new/booking/ic_placeholder.png")} />
                        <Text style={styles.mdk}>{constants.booking.location}</Text>
                        <Text numberOfLines={1} style={styles.ktq}>{this.state.hospital ? this.state.hospital.hospital.name : constants.booking.select_location}</Text>
                        <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                    </TouchableOpacity>
                    {
                        this.state.hospitalError ?
                            <Text style={[styles.errorStyle]}>{this.state.hospitalError}</Text> : null
                    }
                    <View style={styles.border}></View>
                    <TouchableOpacity style={styles.mucdichkham} onPress={() => {
                        if (!this.state.hospital) {
                            snackbar.show(constants.msg.booking.please_select_location, "danger");
                            return;
                        }
                        connectionUtils.isConnected().then(s => {
                            this.props.navigation.navigate("selectServiceType", {
                                hospital: this.state.hospital,
                                onSelected: this.selectServiceType.bind(this)
                            });
                        }).catch(e => {
                            snackbar.show(constants.msg.app.not_internet, "danger");
                        });
                    }}
                    >
                        <ScaleImage style={styles.imgIc} width={18} source={require("@images/new/booking/ic_serviceType.png")} />
                        <Text style={styles.mdk}>{constants.booking.require}</Text>
                        <Text numberOfLines={1} style={styles.ktq}>{this.state.serviceType ? this.state.serviceType.name : constants.booking.select_require}</Text>
                        <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                    </TouchableOpacity>
                    {
                        this.state.serviceTypeError ?
                            <Text style={[styles.errorStyle]}>{this.state.serviceTypeError}</Text> : null
                    }
                    <View style={styles.border}></View>

                    <TouchableOpacity style={[styles.mucdichkham, { alignItems: 'flex-start' }]} onPress={() => {
                        if (!this.state.hospital) {
                            snackbar.show(constants.msg.booking.please_select_location, "danger");
                            return;
                        }
                        this.props.navigation.navigate("selectService", {
                            hospital: this.state.hospital,
                            serviceType: this.state.serviceType,
                            listServicesSelected: this.state.listServicesSelected,
                            onSelected: this.selectService.bind(this)
                        })
                    }}>
                        <ScaleImage style={styles.imgIc} height={15} source={require("@images/new/booking/ic_specialist.png")} />
                        <Text style={styles.mdk}>{constants.booking.service}</Text>
                        {/* <Text>{JSON.stringify(this.state.listServicesSelected)}</Text> */}
                        {this.state.listServicesSelected && this.state.listServicesSelected.length ?
                            <View style={{ flex: 1 }}>
                                {
                                    this.state.listServicesSelected.map((item, index) => <Text style={{ marginHorizontal: 10, marginBottom: 5, alignSelf: 'flex-end' }} numberOfLines={1} key={index}>{item.service.name}</Text>)
                                }
                                {/* <Text numberOfLines={1} style={styles.ktq}>{this.state.service.name}</Text> */}
                                {/* <Text numberOfLines={1} style={styles.ktq}>{this.state.service.price.formatPrice() + 'đ'}</Text> */}
                            </View> :
                            <Text numberOfLines={1} style={styles.ktq}>{constants.booking.select_service}</Text>
                        }

                        <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                    </TouchableOpacity>
                    {/* {
                        this.state.serviceError ?
                            <Text style={[styles.errorStyle]}>{this.state.serviceError}</Text> : null
                    } */}
                    <View style={styles.border}></View>
                    <TouchableOpacity style={styles.mucdichkham} onPress={() => {
                        this.setState({ toggelDateTimePickerVisible: true })
                    }}>
                        <ScaleImage style={styles.imgIc} height={18} source={require("@images/new/booking/ic_bookingDate.png")} />
                        <Text style={styles.mdk}>{constants.booking.date_booking}</Text>
                        <Text style={styles.ktq}>{this.state.date ? this.state.date : constants.booking.select_date_booking}</Text>
                        <ScaleImage style={styles.imgmdk} height={10} source={require("@images/new/booking/ic_next.png")} />
                    </TouchableOpacity>
                    {
                        this.state.bookingError ?
                            <Text style={[styles.errorStyle]}>{this.state.bookingError}</Text> : null
                    }
                    <View style={styles.border}></View>
                    <View style={styles.mucdichkham}>
                        <ScaleImage style={styles.imgIc} width={18} source={require("@images/new/booking/ic_bookingTime.png")} />
                        <Text style={styles.mdk}>{constants.booking.select_time_booking}</Text>
                    </View>
                    {/* <View style={[styles.mucdichkham, { paddingHorizontal: 20 }]}>
                        <Text style={{ fontSize: 14, color: '#8e8e93' }}>{constants.booking.select_time_note}</Text>
                    </View> */}
                    <BookingTimePicker onChange={this.onTimePickerChange.bind(this)} />
                    {
                        this.state.scheduleError ?
                            <Text style={[styles.errorStyle]}>{this.state.scheduleError}</Text> : null
                    }
                </View>
                <View style={styles.article}>
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
                        this.state.imageUris.map((item, index) => <View key={index} style={{ margin: 2, width: 88, height: 88, position: 'relative' }}>
                            <View style={{ marginTop: 8, width: 80, height: 80 }}>
                                <Image source={{ uri: item.uri }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: 8 }} />
                                {
                                    item.error ?
                                        <View style={{ position: 'absolute', left: 20, top: 20 }} >
                                            <ScaleImage source={require("@images/ic_warning.png")} width={40} />
                                        </View> :
                                        item.loading ?
                                            < View style={{ position: 'absolute', left: 20, top: 20, backgroundColor: '#FFF', borderRadius: 20 }} >
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
                <Text style={styles.des}>{constants.booking.simptom_note}</Text>
            </KeyboardAwareScrollView>

            <View style={styles.btn}>
                <TouchableOpacity onPress={this.addBooking.bind(this)} style={[styles.button, this.state.allowBooking ? { backgroundColor: "#02c39a" } : {}]}><Text style={styles.datkham}>Đặt khám</Text></TouchableOpacity>
            </View>
            <ImagePicker ref={ref => this.imagePicker = ref} />

            <DateTimePicker
                isVisible={this.state.toggelDateTimePickerVisible}
                onConfirm={newDate => {
                    if (newDate && this.state.bookingDate && newDate.ddmmyyyy() == this.state.bookingDate.ddmmyyyy())
                        return;
                    this.setState({
                        bookingDate: newDate,
                        date: newDate.format("thu, dd tháng MM").replaceAll(" 0", " "),
                        toggelDateTimePickerVisible: false,
                        allowBooking: true,
                        serviceError: "",
                        scheduleError: ""
                    });
                }}
                onCancel={() => {
                    this.setState({ toggelDateTimePickerVisible: false })
                }}
                minimumDate={minDate}
                cancelTextIOS={constants.actionSheet.cancel2}
                confirmTextIOS={constants.actionSheet.confirm}
                date={this.state.bookingDate || minDate}
            />

        </ActivityPanel>);
    }
}

const styles = StyleSheet.create({
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
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
        flex: 1,
        marginLeft: 10
    },
    img: {
        marginRight: 5

    },
    article: {
        marginTop: 12,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.06)",

    },
    mucdichkham: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    mdk: {
        marginLeft: 12,
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"

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
    border: {
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.06)",
        marginLeft: 15
    },
    imgIc: {
        marginLeft: 10
    },
    imgmdk: {
        marginRight: 5
    },
    lienlac: {
        padding: 20,
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
        textAlign: 'center'
    },
    phoneSMS: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contact_selected:
    {
        backgroundColor: '#FFF',
        borderColor: '#02c39a', borderWidth: 1,
        height: 40
    },
    contact_normal:
    {
        backgroundColor: '#FFF',
        borderColor: 'rgba(0, 0, 0, 0.06)', borderWidth: 1,
        height: 40
    },
    contact_text_selected:
    {
        color: '#02c39a'
    },
    contact_text_normal:
    {
        color: 'rgb(142, 142, 147)'
    },
    gach: {
        borderStyle: "solid",
        borderWidth: 0.7,
        borderColor: "rgba(0, 0, 0, 0.06)",
        height: 25,
        alignItems: 'center'
    },

    phone: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

    },
    sms: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

    },
    dt: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a"
    },
    tinnhan: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
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
    des: {
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0.2,
        color: "#4a4a4a",
        padding: 25
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
    imgPhone: {
        marginRight: 10
    },
    list_image: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginHorizontal: 20 },
    errorStyle: {
        color: 'red',
        marginTop: 10,
        marginLeft: 25,
        marginRight: 25
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(AddBookingScreen);