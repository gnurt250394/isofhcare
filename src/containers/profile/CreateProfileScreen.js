import React, { Component, } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Keyboard,
    Text,
    TouchableOpacity,
    Platform,
    FlatList
} from "react-native";
import { connect } from "react-redux";
import ImagePicker from "mainam-react-native-select-image";
import DateTimePicker from "mainam-react-native-date-picker";
import connectionUtils from "@utils/connection-utils";
import snackbar from "@utils/snackbar-utils";
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import dateUtils from "mainam-react-native-date-utils";
import constants from "@resources/strings";
import KeyboardSpacer from "react-native-keyboard-spacer";
import ActionSheet from 'react-native-actionsheet'
import profileProvider from '@data-access/profile-provider'
import locationProvider from '@data-access/location-provider';
import Modal from "@components/modal";
import NavigationService from "@navigators/NavigationService";
import ActivityPanel from "@components/ActivityPanel";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
class CreateProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGender: false,
            genderUser: [{ gender: "Nam", value: 1 }, { gender: "Nữ", value: 0 }],
            toggelDateTimePickerVisible: false,
            valueGender: '1',
            txGender: 'Nam',
            name: '',
            email: "",
            dob: "",
            imgLocal: "",
            date: "",
            image: "",
            imageUris: [],
            valid: '',
            isDataNull: '',
            status: 2,
            reset: 1,
        };
    }

    onChangeText = type => text => {
        this.setState({ [type]: text });
    };
    setDate(newDate) {
        this.setState({ dob: newDate, date: newDate.format("dd/MM/yyyy") }, () => {
        });
    }
    onShowGender = () => {
        this.actionSheetGender.show();

    };
    showLoading(loading, callback) {
        if (this.props.showLoading) {
            this.props.showLoading(loading, callback);
        } else {
            callback;
        }
    }
    onSetGender = index => {
        try {
            switch (index) {
                case 0:
                    this.setState(
                        {
                            valueGender: '1',
                            txGender: 'Nam',
                            relationShip: null
                        });
                    return;
                case 1:
                    this.setState(
                        {
                            valueGender: '0',
                            txGender: 'Nữ',
                            relationShip: null
                        });
                    return;
            }
        } catch (error) {

        }

    };
    onCreateProfile = () => {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        if (this.state.weight && isNaN(this.state.weight) || this.state.weight && Number(this.state.weight) < 0) {
            this.setState({
                weightError: constants.msg.user.weight_invalid
            })
            return
        }
        if (this.state.height && isNaN(this.state.height) || this.state.height && Number(this.state.height) < 0) {
            this.setState({
                heightError: constants.msg.user.height_invalid
            })
            return
        }
        connectionUtils
            .isConnected()
            .then(s => {
                this.setState(
                    {
                        isLoading: true
                    },
                    () => {
                        let name = this.state.name
                        let dob = this.state.dob
                        let gender = this.state.valueGender
                        let height = this.state.height
                        let weight = this.state.weight ? parseFloat(this.state.weight).toFixed(1) : ''
                        let phone = this.state.phone
                        // let address = this.state.address
                        let idProvince = this.state.provinces ? this.state.provinces.id : null
                        let idDistrics = this.state.districts ? this.state.districts.id : null
                        let idZone = this.state.zone ? this.state.zone.id : null
                        let village = this.state.address ? this.state.address : null
                        // parseFloat(item.distance).toFixed(1)
                        let data = {
                            "name": name,
                            "dob": this.state.dob ? this.state.dob.format('yyyy-MM-dd') + ' 00:00:00' : null,
                            "gender": gender ? gender : null,
                            "height": height ? Number(height) : 0,
                            "weight": weight ? Number(weight) : 0,
                            "phone": phone,
                            "provinceId": idProvince,
                            "districtId": idDistrics,
                            "zoneId": idZone,
                            "village": village,
                            "relationshipType": null
                        }
                        profileProvider.createProfile(data).then(res => {
                            console.log(res.code, 'dasdasd');
                            let onCreate = this.props.navigation.state.params && this.props.navigation.state.params.onCreate ? this.props.navigation.state.params.onCreate : null
                            switch (res.code) {
                                case 0:
                                    switch (res.data.TYPE) {
                                        case 'PHONE_VALID':
                                            if (onCreate) {
                                                let callback = ((this.props.navigation.state || {}).params || {}).onCreate;
                                                if (callback) {
                                                    callback(false);
                                                    this.props.navigation.pop();
                                                }
                                            } else {
                                                NavigationService.navigate('listProfileUser', { reset: this.state.reset + 1 })
                                            }
                                            snackbar.show(constants.msg.user.add_member_success, 'success')
                                            break
                                        case 'NOT_EXIST_ACCOUNT':
                                            NavigationService.navigate('verifyPhone', {
                                                id: res.data.medicalRecords.id,
                                                verify: 3
                                            })
                                            break
                                        case 'EXIST_ACCOUNT':
                                            this.setState({
                                                phone: phone,
                                                id: res.data.medicalRecords.id,
                                                isVisible: true
                                            })
                                            break
                                    }
                                    break
                                case 1:
                                    snackbar.show(constants.msg.user.not_permission_edit_file, "danger");
                                    break
                                case 2:
                                    snackbar.show(constants.msg.user.not_login_with_app_patient, "danger");
                                    break
                                case 3:
                                    snackbar.show(constants.msg.user.fullname_not_null, "danger");
                                    break
                                case 4:
                                    snackbar.show(constants.msg.user.phone_not_null, "danger");
                                    break
                                case 5:
                                    snackbar.show(constants.msg.user.phone_invalid, "danger");
                                    break
                                case 6:
                                    snackbar.show(constants.msg.user.gender_not_null, "danger");
                                    break
                                case 7:
                                    snackbar.show(constants.msg.user.relationShip_not_null, "danger");
                                    break
                                case 8:
                                    snackbar.show(constants.msg.user.phone_exits_in_list_profile, "danger");
                                    break
                            }
                        }).catch(err => {
                            snackbar.show(constants.msg.user.add_member_fail, 'danger')
                            console.log(err);
                        })
                    });
            }
            ).catch(e => {
                snackbar.show(constants.msg.app.not_internet, "danger");
            });
    }
    selectDistrict = (districts) => {
        let districtsError = districts ? "" : this.state.districtsError;
        if (!districts || !this.state.districts || districts.id != this.state.districts.id) {
            this.setState({ districts, districtsError, zone: null }, () => {
                this.onSelectZone()
            })
        } else {
            this.setState({ districts, districtsError });
        }
    }
    onSelectDistrict = () => {
        if (this.state.provinces) {
            this.props.navigation.navigate('selectDistrict', {
                onSelected: this.selectDistrict.bind(this),
                id: this.state.provinces.id
            })
        } else {
            snackbar.show(constants.msg.user.please_select_address)
        }
    }
    selectprovinces(provinces) {
        let provincesError = provinces ? "" : this.state.provincesError;
        if (!provinces || !this.state.provinces || provinces.id != this.state.provinces.id) {
            this.setState({ provinces, provincesError, districts: null, zone: null }, () => {
                this.onSelectDistrict()
            })

        } else {
            this.setState({ provinces, provincesError });
        }
    }
    onSelectProvince = () => {
        this.props.navigation.navigate("selectProvince", { onSelected: this.selectprovinces.bind(this) });
    }
    selectZone = (zone) => {
        let zoneError = zone ? "" : this.state.zoneError;
        if (!zone || !this.state.zone || zone.id != this.state.zone.id) {
            this.setState({ zone, zoneError }, () => {

            })
        } else {
            this.setState({ zone, zoneError });
        }
    }
    onSelectZone = () => {
        if (!this.state.provinces) {
            snackbar.show(constants.msg.user.please_select_address)
            return
        }
        if (!this.state.districts) {
            snackbar.show(constants.msg.user.please_select_district)
            return
        }
        if (this.state.provinces.id && this.state.districts.id) {
            this.props.navigation.navigate('selectZone', {
                onSelected: this.selectZone.bind(this),
                id: this.state.districts.id
            })
            return
        }

    }
    // selectRelationShip = (relationShip) => {
    //     let relationShipError = relationShip ? "" : this.state.relationShipError;
    //     if (!relationShip || !this.state.relationShip || relationShip.id != this.state.relationShip.id) {
    //         this.setState({ relationShip, relationShipError, relationErr: '' })
    //     } else {
    //         this.setState({ relationShip, relationShipError, relationErr: '' });
    //     }
    // }
    onCloseModal = () => {
        this.setState({
            isVisible: false
        })
    }
    onSelectRelationShip = () => {
        NavigationService.navigate('selectRelationship', {
            onSelected: this.selectRelationShip.bind(this),
            gender: this.state.valueGender
            // id: this.state.relationShip.id
        })

    }
    onSendConfirm = () => {
        profileProvider.sendConfirmProfile(this.state.id).then(res => {
            this.setState({
                isVisible: false
            })
            if (res.code == 0) {
                NavigationService.navigate('shareDataProfile', { id: res.data.shareRecord.id, shareId: res.data.record.id, })

            } else {
                snackbar.show(constants.msg.notification.error_retry, 'danger')

            }
        }).catch(err => {
            this.setState({
                isVisible: false
            })
            snackbar.show(constants.msg.notification.error_retry, 'danger')
        })
    }
    renderItem = ({ item }) => {
        return (
            <View style={styles.containerItem}>
                <Text style={styles.txtCountryCode}>{item.countryCode}</Text>
            </View>
        )
    }
    onValidateName = (valid, messages) => {
        if (valid) {
            this.setState({ nameError: "" });
        } else {
            this.setState({ nameError: messages });
        }
    }
    onSelectDate = () => this.setState({ toggelDateTimePickerVisible: true })
    onConfirmDate = newDate => {
        this.setState(
            {
                dob: newDate,
                date: newDate.format("dd/MM/yyyy"),
                toggelDateTimePickerVisible: false
            },
            () => {
            }
        );
    }
    onCancelDate = () => {
        this.setState({ toggelDateTimePickerVisible: false });
    }
    render() {
        let maxDate = new Date();
        maxDate = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth(),
            maxDate.getDate()
        );
        let minDate = new Date();
        minDate = new Date(
            maxDate.getFullYear() - 150,
            maxDate.getMonth(),
            maxDate.getDate()
        );
        const icSupport = require("@images/new/user.png");
        const source = this.state.imgLocal
            ? { uri: this.state.imgLocal.absoluteUrl() }
            : icSupport;

        return (
            <ActivityPanel
                icBack={require('@images/new/left_arrow_white.png')}
                title={constants.title.add_new_member}
                iosBarStyle={'light-content'}
                actionbarStyle={styles.actionbarStyle}
                style={styles.activityPanel}
                menuButton={<TouchableOpacity style={{ padding: 5 }} onPress={this.onCreateProfile}>
                    <Text style={styles.txtSave}>{constants.actionSheet.save}</Text>
                </TouchableOpacity>}
                titleStyle={styles.txTitle}
            >
                <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' enableResetScrollToCoords={false} extraHeight={100}>
                    <View style={styles.container}>
                        <Form ref={ref => (this.form = ref)} style={[styles.flex]}>
                            <Field style={[styles.mucdichkham,]}>
                                <Text style={styles.mdk}>{constants.fullname} <Text style={{ color: 'red' }}>(*)</Text></Text>
                                <TextField
                                    hideError={true}
                                    onValidate={this.onValidateName}
                                    validate={{
                                        rules: {
                                            required: true,
                                            minlength: 1,
                                            maxlength: 255
                                        },
                                        messages: {
                                            required: constants.msg.user.fullname_not_null,
                                            maxlength: constants.msg.user.text_without_255,
                                        }
                                    }}
                                    placeholder={constants.msg.user.input_name}
                                    inputStyle={[
                                        styles.ktq,
                                    ]}
                                    errorStyle={styles.errorStyle}
                                    onChangeText={this.onChangeText("name")}
                                    value={this.state.name}
                                    autoCapitalize={"none"}
                                    // underlineColorAndroid="transparent"
                                    autoCorrect={false}
                                />
                            </Field>
                            <Text style={[styles.errorStyle]}>{this.state.nameError}</Text>
                            <Field

                                style={[styles.mucdichkham, { flexDirection: 'row' }]}
                            >
                                <Field style={{ width: '60%' }}>
                                    <Text style={styles.mdk}>{constants.dob}</Text>

                                    <TextField
                                        // value={this.state.date || ""}
                                        onPress={this.onSelectDate}
                                        dateFormat={"dd/MM/yyyy"}
                                        splitDate={"/"}
                                        editable={false}
                                        getComponent={(
                                            value,
                                            onChangeText,
                                            onFocus,
                                            onBlur,
                                            isError
                                        ) => (
                                                <Text style={[styles.ktq, { paddingVertical: 12 }]}>{value ? (value) : (constants.dob)}</Text>
                                            )}
                                        // onChangeText={s => {
                                        //   this.setState({ date: s });
                                        // }}
                                        value={this.state.date}
                                        errorStyle={styles.errorStyle}
                                        hideError={true}
                                        onValidate={(valid, messages) => {
                                            if (valid) {
                                                this.setState({ nameError: "" });
                                            } else {
                                                messages ?
                                                    (this.setState({ valid: constants.msg.app.dob_must_lesser_150, isMin: false })) : (this.setState({ isMin: true }));
                                            }
                                        }}
                                        validate={{
                                            rules: {
                                                max: maxDate,
                                                min: minDate
                                            },
                                            messages: {
                                                max: false,
                                                min: true
                                            }
                                        }}
                                        hideError={true}
                                        onValidate={(valid, messages) => {
                                            if (valid) {
                                                this.setState({ dateError: "", });
                                            } else {
                                                this.setState({ isMin: messages });
                                            }
                                        }}
                                        autoCapitalize={"none"}
                                        autoCorrect={false}
                                        style={{
                                            flex: 1
                                        }}
                                    />
                                </Field>
                                <TouchableOpacity
                                    style={[
                                        styles.mucdichkham,
                                    ]}
                                    onPress={this.onShowGender}
                                >
                                    <Text style={styles.mdk}>{constants.gender} <Text style={{ color: 'red' }}>(*)</Text></Text>
                                    <Text style={[styles.ktq, { paddingVertical: 12 }]}>
                                        {this.state.txGender}
                                    </Text>
                                </TouchableOpacity>
                            </Field>
                            <Text style={[styles.errorStyle]}>{this.state.valid}</Text>
                            <Field style={[styles.mucdichkham, { flexDirection: 'row' },]}>
                                <Field style={{ width: '60%' }}>
                                    <Field>
                                        <Text style={styles.mdk}>{'Chiều cao (cm)'}</Text>
                                        <TextField
                                            hideError={true}
                                            onValidate={(valid, messages) => {
                                                if (valid) {
                                                    this.setState({ heightError: "" });
                                                } else {
                                                    this.setState({ heightError: messages });
                                                }
                                            }}
                                            validate={{
                                                rules: {
                                                    number: true
                                                },
                                                messages: {
                                                    number: constants.msg.user.height_invalid,
                                                }
                                            }}
                                            placeholder={'Chiều cao'}
                                            inputStyle={[
                                                styles.ktq,
                                            ]}
                                            keyboardType="numeric"
                                            errorStyle={styles.errorStyle}
                                            onChangeText={this.onChangeText("height")}
                                            value={this.state.height}
                                            autoCapitalize={"none"}
                                            // underlineColorAndroid="transparent"
                                            autoCorrect={false}
                                        />
                                    </Field>
                                    <Text style={[styles.errorStyle]}>{this.state.heightError}</Text>
                                </Field>
                                <Field style={{ flex: 1 }}>
                                    <Field>
                                        <Text style={styles.mdk}>{'Cân nặng (kg)'}</Text>
                                        <TextField
                                            hideError={true}
                                            placeholder={'Cân nặng'}
                                            inputStyle={[
                                                styles.ktq,
                                            ]}
                                            keyboardType="numeric"
                                            errorStyle={styles.errorStyle}
                                            onChangeText={this.onChangeText("weight")}
                                            value={this.state.weight}
                                            autoCapitalize={"none"}
                                            // underlineColorAndroid="transparent"
                                            autoCorrect={false}
                                        />
                                    </Field>
                                    <Text style={[styles.errorStyle]}>{this.state.weightError}</Text>
                                </Field>
                            </Field>
                            <Field style={[styles.mucdichkham,]}>
                                <Text style={styles.mdk}>{constants.phone}  <Text style={{ color: 'red' }}>(*)</Text></Text>
                                <TextField
                                    hideError={true}
                                    onValidate={(valid, messages) => {
                                        if (valid) {
                                            this.setState({ phoneError: "" });
                                        } else {
                                            this.setState({ phoneError: messages });
                                        }
                                    }}
                                    validate={{
                                        rules: {
                                            required: true,
                                            phone: true
                                        },
                                        messages: {
                                            required: constants.msg.user.phone_not_null,
                                            phone: constants.msg.user.phone_invalid
                                        }
                                    }}
                                    keyboardType="numeric"
                                    placeholder={constants.phone}
                                    inputStyle={[
                                        styles.ktq,
                                    ]}
                                    errorStyle={styles.errorStyle}
                                    onChangeText={this.onChangeText("phone")}
                                    value={this.state.phone}
                                    autoCapitalize={"none"}
                                    // underlineColorAndroid="transparent"
                                    autoCorrect={false}
                                />
                            </Field>
                            <Text style={[styles.errorStyle]}>{this.state.phoneError}</Text>
                            {/* <Field style={[styles.mucdichkham, Platform.OS == "ios" ? { paddingVertical: 12, } : {}]}>
                                <Text style={styles.mdk}>{'Địa chỉ'}</Text>
                                <TextField
                                    hideError={true}
                                    onValidate={(valid, messages) => {
                                        if (valid) {
                                            this.setState({ addressError: "" });
                                        } else {
                                            this.setState({ addressError: messages });
                                        }
                                    }}
                                    validate={{
                                        rules: {
                                            maxlength: 255
                                        },
                                        messages: {
                                            required: constants.msg.user.fullname_not_null,
                                            maxlength: constants.msg.user.text_without_255,
                                        }
                                    }}
                                    placeholder={'Địa chỉ'}
                                    multiline={true}
                                    inputStyle={[
                                        styles.ktq,
                                    ]}
                                    errorStyle={styles.errorStyle}
                                    onChangeText={this.onChangeText("address")}
                                    value={this.state.address}
                                    autoCapitalize={"none"}
                                    // underlineColorAndroid="transparent"
                                    autoCorrect={false}
                                />
                            </Field>
                            <Text style={[styles.errorStyle]}>{this.state.addressError}</Text> */}
                            <Field style={[styles.mucdichkham,]}>
                                <Text style={styles.mdk}>{constants.province}</Text>
                                <Field>
                                    <TextField
                                        hideError={true}
                                        onPress={this.onSelectProvince}
                                        editable={false}
                                        inputStyle={[
                                            styles.ktq, { minHeight: 41 }, this.state.provinces && this.state.provinces.countryCode ? {} : { color: '#8d8d8d' }
                                        ]}
                                        errorStyle={styles.errorStyle}
                                        value={this.state.provinces && this.state.provinces.countryCode ? this.state.provinces.countryCode : constants.province}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    />
                                </Field>

                            </Field>

                            <Field style={[styles.mucdichkham, { marginTop: 10 },]}>
                                <Text style={styles.mdk}>Quận/Huyện</Text>
                                <Field>
                                    <TextField
                                        hideError={true}
                                        // validate={{
                                        //     rules: {
                                        //         number: true,
                                        //     },
                                        //     messages: {
                                        //         number: 'Cân nặng không hợp lệ',
                                        //     }
                                        // }}
                                        inputStyle={[
                                            styles.ktq, this.state.districts && this.state.districts.name ? {} : { color: '#8d8d8d' }, { minHeight: 41 }
                                        ]}
                                        onPress={this.onSelectDistrict}
                                        editable={false}
                                        errorStyle={styles.errorStyle}
                                        value={this.state.districts && this.state.districts.name ? this.state.districts.name : 'Quận/Huyện'}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    />
                                </Field>
                            </Field>
                            <Field style={[styles.mucdichkham, { marginTop: 10 },]}>
                                <Text style={styles.mdk}>{'Xã/Phường'}</Text>
                                <Field>
                                    <TextField
                                        hideError={true}
                                        onPress={this.onSelectZone}
                                        editable={false}
                                        inputStyle={[
                                            styles.ktq, { minHeight: 41 }, this.state.zone && this.state.zone.name ? {} : { color: '#8d8d8d' }
                                        ]}
                                        errorStyle={styles.errorStyle}
                                        value={this.state.zone && this.state.zone.name ? this.state.zone.name : 'Xã/Phường'}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    />
                                </Field>
                            </Field>
                            <Field style={[styles.mucdichkham, this.state.type == "FAMILY" ? {} : { marginTop: 10 },]}>
                                <Text style={styles.mdk}>Thôn/Xóm/Số nhà</Text>
                                <TextField
                                    hideError={true}
                                    placeholder={'Thôn/Xóm/Số nhà'}
                                    inputStyle={[
                                        styles.ktq,
                                    ]}
                                    errorStyle={styles.errorStyle}
                                    onChangeText={this.onChangeText("address")}
                                    value={this.state.address}
                                    autoCapitalize={"none"}
                                    // underlineColorAndroid="transparent"
                                    autoCorrect={false}
                                />
                            </Field>
                            <Text style={[styles.errorStyle]}>{this.state.addressError}</Text>
                            {/* <Field style={{ flex: 1 }}>
                                <Text style={styles.mdk}>Quan hệ <Text style={{ color: 'red' }}>(*)</Text></Text>
                                <Field>
                                    <TextField
                                        hideError={true}
                                        multiline={true}
                                        onPress={this.onSelectRelationShip}
                                        editable={false}
                                        inputStyle={[
                                            styles.ktq, { minHeight: 41 }, this.state.relationShip && this.state.relationShip.name ? {} : { color: '#8d8d8d' }
                                        ]}
                                        errorStyle={styles.errorStyle}
                                        value={this.state.relationShip && this.state.relationShip.name ? this.state.relationShip.name : 'Quan hệ'}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    />
                                </Field>
                                <Text style={[styles.errorStyle]}>{this.state.relationErr}</Text>
                            </Field> */}
                        </Form>
                    </View>
                </KeyboardAwareScrollView>
                <ImagePicker ref={ref => (this.imagePicker = ref)} />
                <DateTimePicker
                    isVisible={this.state.toggelDateTimePickerVisible}
                    onConfirm={this.onConfirmDate}
                    onCancel={this.onCancelDate}
                    date={new Date()}
                    minimumDate={minDate}
                    maximumDate={new Date()}
                    cancelTextIOS={constants.actionSheet.cancel2}
                    confirmTextIOS={constants.actionSheet.confirm}
                    date={this.state.dob || new Date()}
                />
                <ActionSheet
                    ref={o => this.actionSheetGender = o}
                    options={[constants.actionSheet.male, constants.actionSheet.female, constants.actionSheet.cancel]}
                    cancelButtonIndex={2}
                    // destructiveButtonIndex={1}
                    onPress={this.onSetGender}
                />
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={this.onCloseModal}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={styles.viewModal}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <View style={styles.viewPopup}>
                        <Text style={styles.txNumber}>ISOFHCARE đã tìm thấy tài khoản sở hữu số điện thoại {this.state.phone ? this.state.phone : ''} trên hệ thống.</Text>
                        <Text style={styles.txDetails}>Vui lòng <Text style={styles.txSend}>GỬI</Text> và <Text style={styles.txSend}>ĐỢI XÁC NHẬN</Text> mối quan hệ với chủ tài khoản trên. Mọi thông tin thành viên gia đình sẽ lấy theo tài khoản sẵn có.</Text>
                        <TouchableOpacity onPress={this.onSendConfirm} style={styles.btnConfirm}><Text style={styles.txConfirm}>Gửi xác nhận</Text></TouchableOpacity>
                    </View>
                </Modal>
                {Platform.OS == "ios" && <KeyboardSpacer />}
            </ActivityPanel>
        );
    }

}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    scroll: {
        flex: 1,
        paddingVertical: 5
    },
    txtSave: {
        color: '#fff',
        marginRight: 25,
        fontSize: 14,
        fontWeight: '800'
    },
    activityPanel: {
        flex: 1,
        backgroundColor: '#fff'
    },
    txtCountryCode: {
        color: '#02C39A',
        textAlign: 'left'
    },
    containerItem: {
        margin: 5,
        borderRadius: 1,
        borderColor: '#A4A4A4',
        padding: 5
    },
    AcPanel: {
        flex: 1,
        backgroundColor: "rgb(247,249,251)"
    },
    imgIc: {
        marginLeft: 10
    },
    imgmdk: {
        marginRight: 5
    },
    txNumber: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#000',
        textAlign: 'center'
    },
    mucdichkham: {
        flex: 1
        // borderStyle: "solid",
        // borderWidth: 1,
        // borderColor: '#02C39A',
        // borderRadius:5,

    },
    viewPopup: { backgroundColor: '#fff', marginHorizontal: 20, paddingHorizontal: 20, paddingVertical: 40, borderRadius: 5, alignItems: 'center' },
    txSend: {
        color: '#02C39A',
        fontSize: 14,
        fontWeight: 'bold'
    },
    txTitle: { color: '#fff', marginLeft: 50, fontSize: 16 },
    mdk: {
        marginLeft: 12,
        flex: 1,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",

    },
    txDetails: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center'
    },
    ktq: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        backgroundColor: '#F2F2F2',
        borderColor: '#02C39A',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginHorizontal: 10,
        minHeight: 41,
        justifyContent: 'center',
        color: '#000'
    },
    container: {
        // borderStyle: "solid",
        marginVertical: 20,
        paddingHorizontal: 10,
        flex: 1

        // borderColor: "rgba(0, 0, 0, 0.07)"
    },

    btnhuy: {
        fontSize: 18,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
        marginLeft: 10
    },
    header: { alignItems: "center" },
    avatar: {
        alignItems: "center",
        paddingTop: 20,
        width: 70
    },
    add: {
        position: "absolute"
    },
    viewImgUpload: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    ViewRow: {},
    textho1: {
        fontSize: 17,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"
    },
    txInput: {
        alignItems: "flex-end",
        width: "50%",
        height: 41,
        color: "#8e8e93"
    },
    view2: {
        backgroundColor: "rgb(255,255,255)",
        top: 40,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.06)"
    },
    next: {
        position: "absolute",
        top: 17,
        right: 25
    },
    view3: {
        backgroundColor: "rgb(255,255,255)",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.06)",

        top: 60
    },

    textbot: {
        marginLeft: 15
        // fontSize: 15,
        // fontWeight: "normal",
        // fontStyle: "normal",
        // letterSpacing: 0.2,
        // color: "#4a4a4a",
        // position: "relative",
        // top: 70,
        // padding: 10
    },
    btnmenu: {
        fontSize: 18,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#0a7ffe",
        marginRight: 10
    },
    ic_icon: {
        position: "absolute",
        bottom: 0,
        right: 8
    },
    errorStyle: {
        color: "red",
        marginLeft: 13
    },
    textInputStyle: {
        color: "#53657B",
        height: 45,
    },
    labelStyle: { color: '#53657B', fontSize: 16, marginBottom: 10, marginLeft: 50 },
    btnDone: { justifyContent: 'center', alignItems: 'center', height: 30, width: 78, backgroundColor: '#359A60', borderRadius: 5, },
    btnReject: { justifyContent: 'center', alignItems: 'center', height: 30, width: 78, marginLeft: 10, borderRadius: 5, backgroundColor: '#FFB800', },
    viewBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    txDone: { color: '#fff' },
    btnConfirm: {
        padding: 5,
        backgroundColor: '#359A60',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    txConfirm: {
        color: '#fff',
        fontSize: 14
    }
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(CreateProfileScreen);
