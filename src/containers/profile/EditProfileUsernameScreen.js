import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import ScaledImage from "mainam-react-native-scaleimage";
import ImageLoad from 'mainam-react-native-image-loader';
import constants from '@resources/strings';
import profileProvider from '@data-access/profile-provider'
import DateTimePicker from "mainam-react-native-date-picker";
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import ActionSheet from 'react-native-actionsheet'
import snackbar from "@utils/snackbar-utils";
import ImagePicker from "mainam-react-native-select-image";
import connectionUtils from "@utils/connection-utils";
import dateUtils from "mainam-react-native-date-utils";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "@components/modal";
import NavigationService from "@navigators/NavigationService";

class EditProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReset: 1,
            isLoading: false,
            image: null,
            isVisible: false
        }
    }


    componentDidMount() {


        let dataOld = this.props.navigation.getParam('dataOld', null)

        if (dataOld) {
            let dataProfile = dataOld.medicalRecords || {}

            let country = dataOld?.country || null
            let badInfo = this.props.navigation.getParam('badInfo', false)
            let dataLocaotion = {
                districts: dataOld?.district || {},
                provinces: dataOld?.province || {},
                zone: dataOld?.zone || {},
                address: dataOld?.medicalRecords?.village || '',
            }

            this.setState({
                avatar: dataProfile && dataProfile.avatar ? dataProfile.avatar : null,
                imagePath: dataProfile && dataProfile.avatar ? dataProfile.avatar : '',
                name: dataProfile && dataProfile.name ? dataProfile.name : '',
                date: dataProfile && dataProfile.dob ? dataProfile.dob.toDateObject('-').format('dd/MM/yyyy') : (''),
                txGender: dataProfile && dataProfile.gender == 1 ? 'Nam' : 'Nữ',
                valueGender: dataProfile && dataProfile.gender ? dataProfile.gender : dataProfile.gender == 0 ? 0 : null,
                dobOld: dataProfile && dataProfile.dob ? dataProfile.dob : '',
                height: dataProfile && dataProfile.height ? dataProfile.height.toString() : '',
                weight: dataProfile && dataProfile.weight ? dataProfile.weight.toString() : '',
                relationshipType: dataProfile && dataProfile.relationshipType ? dataProfile.relationshipType : '',
                profileNo: dataProfile && dataProfile.profileNo ? dataProfile.profileNo : '',
                id: dataProfile && dataProfile.id || null,
                dob: dataProfile && dataProfile.dob ? dataProfile.dob.toDateObject('-') : '',
                phone: dataProfile && dataProfile.phone,
                guardianPassport: dataProfile?.guardianPassport || '',
                guardianName: dataProfile?.guardianName || '',
                guardianPhone: dataProfile?.guardianPhone || '',
                userPassport: dataProfile?.passport || '',
                nations: dataProfile?.nation || null,
                jobs: dataProfile?.job || null,
                status: dataProfile?.status || 0,
                country,
                dataLocaotion,
                isEdit: true,
                badInfo,
                havePhone: dataProfile && dataProfile.phone ? true : false,
                haveGuardianPhone: dataProfile && dataProfile.guardianPhone ? true : false
            }, () => {
                this.renderAddress()
                // this.onLoadDefault(dataProfile?.nation || null, dataProfile?.job || null, dataOld?.country || null)
            }, () => {

            });
        } else {
            this.onLoadDefault(null, null, null)
        }
    }
    onLoadDefault = (nations, jobs, country) => {
        if (!nations) {
            locationProvider.getAllNations().then(res => {
                if (res && res.length) {
                    this.setState({
                        nations: res[0]
                    })
                }
            }).catch(err => {

            })
        }
        if (!jobs) {
            locationProvider.getAllJobs().then(res => {
                if (res && res.length) {
                    this.setState({
                        jobs: res[0]
                    })
                }
            }).catch(err => {

            })
        }
        if (!country) {
            locationProvider.getAllCountry().then(s => {


                if (s.code == 0 && s.data.countries.length) {
                    let dataDefault = s.data.countries.filter(obj => obj.code == 'Vi')

                    if (dataDefault.length) {
                        this.setState({
                            country: dataDefault[0]
                        })
                    }
                }
            }).catch(e => {
                this.setState({
                    data: [],
                })
            })
        }
    }
    defaultImage = () => {
        return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
    }
    onSendConfirm = () => {
        profileProvider.sendConfirmProfile(this.state.id).then(res => {

            this.setState({
                isVisible: false
            })
            if (res.code == 0) {
                NavigationService.navigate('shareDataProfile', { id: res.data.shareRecord.id, shareId: res.data.record.id, })

            } else {
                this.setState({
                    isVisible: false,
                    id: null
                })
                snackbar.show(constants.msg.notification.error_retry, 'danger')

            }
        }).catch(err => {

            this.setState({
                isVisible: false,
                id: null
            })
            snackbar.show(constants.msg.notification.error_retry, 'danger')
        })
    }
    renderAddress = () => {
        let dataLocaotion = this.state.dataLocaotion
        let district = dataLocaotion.districts ? dataLocaotion.districts.name : null
        let province = dataLocaotion.provinces ? dataLocaotion.provinces.countryCode : null
        let zone = dataLocaotion.zone ? dataLocaotion.zone.name : ''
        let village = dataLocaotion.address ? dataLocaotion.address : null

        if (district && province && zone && village) {
            this.setState({
                location: `${village}\n${zone}\n${district}\n${province}`
            }, () => {
                if (this.state.isSave) {
                    this.form.isValid()
                }
            })

        }
        else if (district && province && zone) {
            this.setState({
                location: `${zone}\n${district}\n${province}`
            }, () => {
                if (this.state.isSave) {
                    this.form.isValid()
                }
            })

        }
        else if (district && province && village) {
            this.setState({
                location: `${village}\n${district}\n${province}`
            }, () => {
                if (this.state.isSave) {
                    this.form.isValid()
                }

            })

        }
        else if (district && province) {
            this.setState({
                location: `${district}\n${province}`
            }, () => {
                if (this.state.isSave) {
                    this.form.isValid()
                }
            })

        }

        else if (province && village) {
            this.setState({
                location: `${village}\n${province}`
            }, () => {
                if (this.state.isSave) {
                    this.form.isValid()
                }

            })


        }
        else if (province) {
            this.setState({
                location: `${province}`
            }, () => {
                if (this.state.isSave) {
                    this.form.isValid()
                }

            })

        }
        else if (village) {

            this.setState({
                location: `${village}`
            }, () => {
                if (this.state.isSave) {
                    this.form.isValid()
                }

            })

        } else if (!village && !district && !province && !zone) {
            this.setState({
                location: null
            })
        }
    }
    // componentDidMount = () => {
    //     // this.renderRelation()
    // };

    onShowGender = () => {
        this.actionSheetGender.show();

    };
    onSetGender = index => {
        try {
            switch (index) {
                case 0:
                    this.setState(
                        {
                            valueGender: '1',
                            txGender: 'Nam',
                            relationShip: null
                        }, () => {
                            if (this.state.isSave) {
                                this.form.isValid()
                            }
                        });
                    return;
                case 1:
                    this.setState(
                        {
                            valueGender: '0',
                            txGender: 'Nữ',
                            relationShip: null
                        }, () => {
                            if (this.state.isSave) {
                                this.form.isValid()
                            }
                        });
                    return;
            }
        } catch (error) {

        }

    };
    onChangeText = type => text => {

        this.setState({ [type]: text }, () => {
            if (this.state.isSave) {
                this.form.isValid()
            }
        });
    };
    onCloseModal = () => {
        this.setState({
            isVisible: false,
            id: null
        })
    }
    onCreateProfile = () => {
        let dataOld = this.props.navigation.getParam('dataOld', null)
        this.setState({ isSave: true }, () => {
            Keyboard.dismiss();
            if (!this.form.isValid()) {
                return;
            }
            connectionUtils
                .isConnected()
                .then(s => {
                    this.setState(
                        {
                            isLoading: true
                        },
                        () => {
                            let id = this.state.id
                            let data = {
                                phone: this.state.phone
                            }
                            if (id) {
                                profileProvider.fillPhone(data).then(res => {

                                    this.setState({
                                        isLoading: false
                                    })

                                    switch (res.code) {
                                        case 0:
                                            this.props.navigation.replace('verifyPhone', { verify: 4, dataOld, phone: this.state.phone })
                                            break
                                        case 8:
                                            snackbar.show('Số điện thoại đã tồn tại', "danger");
                                            break
                                        case 2:
                                            snackbar.show('Bạn đang không đăng nhập với ứng dụng bệnh nhân', "danger");
                                            break
                                        default:
                                            snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại', "danger");
                                            break
                                    }
                                }).catch(err => {
                                    this.setState({
                                        isLoading: false
                                    })
                                })
                            }
                        });
                }
                ).catch(e => {
                    snackbar.show(constants.msg.app.not_internet, "danger");
                });
        })

    }
    renderDob = (value) => {
        if (value) {
            let dateParam = value.split(/[\s/:]/)
            let date = new Date(dateParam[2], dateParam[1], dateParam[0])
            return value + `- ${date.getAge()} tuổi`
        } else {
            return 'Chọn ngày sinh'
        }
    }
    onSelectNations = () => {
        this.props.navigation.navigate('selectNations', {
            onSelected: this.selectNations.bind(this),

        })
    }
    onSelectJobs = () => {
        this.props.navigation.navigate('getJobs', {
            onSelected: this.selectJobs.bind(this),

        })
    }
    _replaceSpace(str) {
        if (str)
            return str.replace(/\u0020/, '\u00a0')
    }
    render() {
        const { avatar, isLoading } = this.state
        let age = this.state.dob ? new Date().getFullYear() - this.state.dob.getFullYear() : null
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

        return (
            <ActivityPanel
                title={this.state.isEdit ? this.state.badInfo ? 'Hoàn thành hồ sơ' : 'Chỉnh sửa hồ sơ' : 'Thêm mới hồ sơ'}
                isLoading={isLoading}
                menuButton={<TouchableOpacity
                    onPress={this.onCreateProfile}
                    style={styles.buttonSave}>
                    <Text style={styles.txtSave}>Lưu</Text>
                </TouchableOpacity>}
                containerStyle={{ backgroundColor: '#f8f8f8' }}
                titleStyle={styles.titleStyle}

            >

                <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
                    <View style={styles.container}>
                        {this.state.badInfo ? <View style={styles.groupTitle}>
                            <Text style={[styles.txtTitle1, { fontSize: 14 }]}>Hoàn thiện hồ sơ trước khi thêm thành viên !</Text>
                            {/* <Text style={styles.txtTitle2}>Hồ sơ được sử dụng để đặt khám do đó chỉ có thể sửa hồ sơ tại nơi khám.</Text> */}
                        </View> : <View style={styles.groupTitle}>
                                <Text style={styles.txtTitle1}>Vui lòng nhập thông tin chính xác!</Text>
                                <Text style={styles.txtTitle2}>Hồ sơ được sử dụng để đặt khám do đó chỉ có thể sửa hồ sơ tại nơi khám.</Text>
                            </View>}
                        <TouchableOpacity
                            disabled
                            // onPress={this.selectImage}
                            style={styles.buttonAvatar}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={styles.borderImage}
                                borderRadius={40}
                                customImagePlaceholderDefaultStyle={[styles.avatar, styles.placeHolderImage]}
                                placeholderSource={avatar ? { uri: avatar.absoluteUrl() } : require("@images/new/user.png")}
                                resizeMode="cover"
                                loadingStyle={{ size: 'small', color: 'gray' }}
                                source={{ uri: avatar ? avatar.absoluteUrl() : '' || '' }}
                                style={styles.image}
                                defaultImage={this.defaultImage}
                            />
                            <ScaledImage source={require('@images/new/profile/ic_camera.png')} height={18} style={styles.icCamera} />
                        </TouchableOpacity>
                        {/* <View style={styles.containerScan}>
                                <View style={styles.groupScan}>
                                    <Text style={styles.txtScan}>QUÉT CMND </Text>
                                    <Text style={styles.txtOr}> hoặc </Text>
                                    <Text style={styles.txtScan}>QUÉT BẢO HIỂM Y TẾ</Text>
                                </View>
                                <Text style={styles.txtOr}>Để điền thông tin nhanh hơn!</Text>
                            </View> */}
                        <Form ref={ref => (this.form = ref)}>
                            {/** Văn bằng chuyên môn */}
                            <Field style={[styles.containerField, {
                                borderTopColor: '#00000011',
                                borderTopWidth: 1
                            }]}>
                                <Text style={styles.txLabel}>Họ và tên</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        errorStyle={[styles.err,]}
                                        placeholder={'Nhập họ và tên'}
                                        multiline={true}
                                        inputStyle={[styles.input]}
                                        onChangeText={this.onChangeText("name")}
                                        value={this._replaceSpace(this.state.name)}
                                        autoCapitalize={"none"}
                                        editable={!this.state.id}
                                        autoCorrect={false}
                                    >

                                    </TextField>
                                </Field>
                                {!this.state.id && <ScaledImage height={10} source={require("@images/new/account/ic_next.png")} /> || <Field></Field>}
                            </Field>
                            {/** Học vị */}
                            <Field style={[styles.containerField]}>
                                <Text style={styles.txLabel}>Ngày sinh</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        dateFormat={"dd/MM/yyyy"}
                                        errorStyle={styles.err}
                                        splitDate={"/"}
                                        editable={false}
                                        inputStyle={[styles.input]}
                                        placeholder="Chọn ngày sinh"
                                        value={this.state.date}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field>

                            <Field style={[styles.containerField,
                            ]}>
                                <Text style={styles.txLabel}>Giới tính</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        errorStyle={styles.err}
                                        multiline={true}
                                        editable={false}
                                        inputStyle={[styles.input]}
                                        placeholder="Chọn giới tính"
                                        value={!this.state.valueGender && this.state.valueGender !== 0 ? '' : this.state.valueGender == 0 ? 'Nữ' : 'Nam'}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field>

                            {/**Giới tính */}


                            {/** Ngày sinh */}

                            {/*** Số điện thoại*/}
                            {/* <Field style={[styles.containerField, {
                                marginTop: 10,
                                borderTopColor: '#00000011',
                                borderTopWidth: 1
                            }]}>
                                <Text style={styles.txLabel}>Số điện thoại</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        editable={false}
                                        inputStyle={[styles.input]}
                                        placeholder="Số điện thoại"
                                        errorStyle={styles.err}
                                        value={this.props.userApp.currentUser.phone}
                                        autoCapitalize={"none"}
                                        autoCorrect={false}
                                    >

                                    </TextField>
                                </Field>
                                <ScaledImage height={10} source={require("@images/new/account/ic_next.png")} />
                            </Field> */}
                            {/** Tỉnh thành phố */}
                            <Field style={[styles.containerField, styles.containerFix]}>
                                <Text style={styles.txLabel}>Địa chỉ</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        errorStyle={[styles.err]}
                                        editable={false}
                                        inputStyle={[styles.input]}
                                        placeholder="Nhập địa chỉ"
                                        value={this.state.location ? this.state.location : ''}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field>
                            {/** Quận huyện */}
                            <Field style={[styles.containerField]}>
                                <Text style={styles.txLabel}>Dân tộc</Text>
                                <Field style={{ flex: 1, }}>
                                    <TextField
                                        multiline={true}
                                        editable={false}
                                        inputStyle={[styles.input, { textAlignVertical: 'top' }]}
                                        placeholder="Chọn dân tộc"
                                        value={this.state.nations && this.state.nations.name ? this.state.nations.name : ''}
                                        autoCapitalize={"none"}
                                        errorStyle={styles.err}
                                        // validate={{
                                        //     rules: {
                                        //         required: true,
                                        //     },
                                        //     messages: {
                                        //         required: "Dân tộc không được để trống",
                                        //     }
                                        // }}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field>
                            {/** Tỉnh thành phố */}
                            <Field style={[styles.containerField]}>
                                <Text style={styles.txLabel}>Quốc tịch</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        editable={false}
                                        inputStyle={[styles.input]}
                                        placeholder="Chọn quốc tịch"
                                        errorStyle={styles.err}
                                        value={this.state.country && this.state.country ? this.state.country.name : ''}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field>
                            <Field style={[styles.containerField]}>
                                <Text style={styles.txLabel}>Nghề nghiệp</Text>
                                <Field style={{ flex: 1, }}>
                                    <TextField
                                        multiline={true}
                                        editable={false}
                                        inputStyle={[styles.input, { textAlignVertical: 'top' }]}
                                        placeholder="Chọn nghề nghiệp"
                                        value={this.state.jobs && this.state.jobs.name ? this.state.jobs.name : ''}
                                        autoCapitalize={"none"}
                                        errorStyle={styles.err}
                                        // validate={{
                                        //     rules: {
                                        //         required: true,
                                        //     },
                                        //     messages: {
                                        //         required: "Dân tộc không được để trống",
                                        //     }
                                        // }}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field>
                            {/** Địa chỉ */}
                            {age && age < 14 || age == 0 ? <Field>
                                <Field style={[styles.containerField, { marginTop: 10 }]}>
                                    <Text style={styles.txLabel}>Người bảo lãnh</Text>
                                    <Field style={{ flex: 1 }}>
                                        <TextField
                                            multiline={true}
                                            onChangeText={this.onChangeText("guardianName")}
                                            inputStyle={[styles.input]}
                                            placeholder="Nhập người bảo lãnh"
                                            errorStyle={styles.err}
                                            editable={false}
                                            value={this._replaceSpace(this.state.guardianName)}
                                            autoCapitalize={"none"}
                                            // underlineColorAndroid="transparent"
                                            autoCorrect={false}
                                        >
                                        </TextField>
                                    </Field>
                                </Field>
                                <Field style={[styles.containerField]}>
                                    <Text style={styles.txLabel}>SĐT người bảo lãnh</Text>
                                    <Field style={{ flex: 1 }}>
                                        <TextField
                                            multiline={true}
                                            onChangeText={this.onChangeText("guardianPhone")}
                                            inputStyle={[styles.input]}
                                            placeholder="Nhập SĐT người bảo lãnh"
                                            value={this.state.guardianPhone}
                                            autoCapitalize={"none"}
                                            keyboardType={'numeric'}
                                            errorStyle={styles.err}
                                            maxLength={10}
                                            numberOfLines={1}
                                            autoFocus={true}
                                            editable={!this.state.haveGuardianPhone}
                                            autoCorrect={false}
                                        >
                                        </TextField>
                                    </Field>
                                </Field>
                                <Field style={[styles.containerField]}>
                                    <Text style={styles.txLabel}>{`CMTND/HC\nngười bảo lãnh`}</Text>
                                    <Field style={{ flex: 1, alignItems: 'flex-end', flexWrap: 'nowrap' }}>
                                        <TextField
                                            multiline={true}
                                            onChangeText={this.onChangeText("guardianPassport")}
                                            inputStyle={[styles.input, { flexWrap: 'nowrap', minWidth: '120%' }]}
                                            placeholder={`Nhập CMTND/HC người bảo lãnh`}
                                            value={this.state.guardianPassport}
                                            errorStyle={[styles.err,]}

                                            autoCapitalize={"none"}
                                            editable={false}
                                            numberOfLines={1}
                                            // underlineColorAndroid="transparent"
                                            autoCorrect={false}
                                        >
                                        </TextField>
                                    </Field>
                                </Field>
                            </Field> : <Field>
                                    <Field style={[styles.containerField, { marginTop: 10 }]}>
                                        <Text style={styles.txLabel}>Số điện thoại</Text>
                                        <Field style={{ flex: 1 }}>
                                            <TextField
                                                multiline={true}
                                                onChangeText={this.onChangeText("phone")}
                                                inputStyle={[styles.input]}
                                                placeholder="Nhập số điện thoại"
                                                value={this.state.phone}
                                                errorStyle={styles.err}
                                                editable={!this.state.havePhone}
                                                maxLength={10}
                                                autoCapitalize={"none"}
                                                ref={(ref) => this.phone = ref}
                                                validate={{
                                                    rules: {
                                                        required: true,
                                                        phone: true
                                                    },
                                                    messages: {
                                                        required: "Số điện thoại không được để trống",
                                                    }
                                                }}
                                                // underlineColorAndroid="transparent"
                                                autoCorrect={false}
                                                keyboardType={'numeric'}
                                            >
                                            </TextField>
                                        </Field>
                                        {!this.state.id && <ScaledImage height={10} source={require("@images/new/account/ic_next.png")} /> || <Field></Field>}
                                    </Field>
                                    <Field style={[styles.containerField]}>
                                        <Text style={styles.txLabel}>Số CMND</Text>
                                        <Field style={{ flex: 1, }}>
                                            <TextField
                                                multiline={true}
                                                onChangeText={this.onChangeText("userPassport")}
                                                inputStyle={[styles.input,]}
                                                placeholder="Nhập số CMND"
                                                value={this.state.userPassport}
                                                errorStyle={[styles.err, { flexWrap: 'nowrap' }]}

                                                autoCapitalize={"none"}
                                                editable={false}
                                                // underlineColorAndroid="transparent"
                                                autoCorrect={false}
                                                keyboardType={'numeric'}

                                            >
                                            </TextField>
                                        </Field>
                                    </Field>
                                </Field>}
                        </Form>
                    </View>
                </KeyboardAwareScrollView>
                <DateTimePicker
                    isVisible={this.state.toggelDateTimePickerVisible}
                    onConfirm={newDate => {

                        this.setState(
                            {
                                dob: newDate,
                                date: newDate.format("dd/MM/yyyy"),
                                toggelDateTimePickerVisible: false
                            },
                            () => {
                                if (this.state.isSave) {
                                    this.form.isValid()
                                }
                            }
                        );
                    }}
                    onCancel={() => {
                        this.setState({ toggelDateTimePickerVisible: false });
                    }}
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
                        <Text style={styles.txNumber}>HMUH Care đã tìm thấy tài khoản sở hữu số điện thoại {this.state.phone ? this.state.phone : ''} trên hệ thống.</Text>
                        <Text style={styles.txDetails}>Vui lòng <Text style={styles.txSend}>GỬI</Text> và <Text style={styles.txSend}>ĐỢI XÁC NHẬN</Text> mối quan hệ với chủ tài khoản trên. Mọi thông tin thành viên gia đình sẽ lấy theo tài khoản sẵn có.</Text>
                        <TouchableOpacity onPress={this.onSendConfirm} style={styles.btnConfirm}><Text style={styles.txConfirm}>Gửi xác nhận</Text></TouchableOpacity>
                    </View>
                </Modal>
                <ImagePicker ref={ref => (this.imagePicker = ref)} />
            </ActivityPanel>
        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp
    };
}
export default connect(mapStateToProps)(EditProfileScreen);


const styles = StyleSheet.create({
    errorStyle: {
        color: "red",
        marginLeft: 13
    },
    fixMargin: {
        marginTop: -10
    },
    containerFix: {
        marginTop: 10,
        borderTopColor: '#00000011',
        borderTopWidth: 1,
        paddingVertical: 10
    },
    errFix: {
        bottom: -10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end'
    },
    groupScan: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerScan: {
        backgroundColor: '#FF8A00',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtTitle2: {
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    txtTitle1: {
        textAlign: 'center',
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    groupTitle: {
        width: '100%',
        backgroundColor: '#FFF',
        paddingVertical: 15,
        // borderBottomWidth: 0.6,
        // borderBottomColor:'#BBB',
        elevation: 1,
        shadowColor: '#BBB',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.7
    },
    container: {
        flex: 1,
        paddingBottom: 40,
    },
    containerAddress: {
        marginTop: 15,
        borderTopColor: '#BBB',
        borderTopWidth: 0.7
    },
    txtValue: {
        paddingRight: 10,
        paddingVertical: 13,
        color: '#000',
        fontWeight: 'bold',
        paddingLeft: 20,
        textAlign: 'right'
    },

    txtLabel: {
        paddingRight: 10,
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 0.7,
        borderBottomColor: '#BBB',
        backgroundColor: '#FFF',
    },
    txtOr: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    txtScan: {
        color: '#FFF',
        fontWeight: 'bold',
        paddingVertical: 7,
        textDecorationLine: 'underline'
    },
    icCamera: {
        position: 'absolute',
        bottom: 20,
        right: 4,
    },
    buttonAvatar: {
        paddingVertical: 20,
        width: 80,
        alignSelf: 'center'
    },
    buttonSave: {
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    txtSave: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    titleStyle: {
        paddingLeft: 50,
        fontSize: 16
    },
    placeHolderImage: { width: 80, height: 80 },
    image: {
        alignSelf: 'center',
        borderRadius: 40,
        width: 80,
        height: 80
    },
    borderImage: {
        borderRadius: 40,
        borderWidth: 0.5,
        borderColor: 'rgba(151, 151, 151, 0.29)'
    },
    txtSave: {
        color: '#FFF'
    },
    txLabel: {
        left: 10, fontSize: 14,
    },
    buttonSave: {
        paddingVertical: 10,
        paddingRight: 20,
    },
    err: { fontSize: 12, color: 'red', position: 'absolute', bottom: -5, right: 10, width: '120%', fontStyle: 'italic', flexWrap: 'nowrap', textAlign: 'right' },
    txtError: {
        color: 'red',
        paddingLeft: 10,
        paddingTop: 8,
        fontStyle: 'italic',
        flexWrap: 'nowrap',
    },
    scaledImage: {
        position: "absolute",
        bottom: 0,
        right: 0
    },
    input: {
        minHeight: 40,
        textAlign: 'right',
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10,
        color: '#000',
        fontWeight: 'bold',
        paddingLeft: 20,
        flex: 1 / 2,
        textAlignVertical: 'top',
        marginTop: 20,
        flexWrap: 'nowrap'
    },
    containerField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomColor: '#00000011',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        flex: 1,
        flexWrap: 'nowrap',
        backgroundColor: '#fff'
        // borderTopColor: '#00000011',
        // borderTopWidth: 1
    },
    viewCurrentUser: {
        flexDirection: "row",
        alignItems: "center",
        borderTopColor: "#00000011",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#00000011',
        paddingVertical: 20,
        paddingLeft: 25,
        paddingRight: 15,
        backgroundColor: '#fff'
    },
    txUserName: {
        color: "#000000",
        fontSize: 18,
        fontWeight: 'bold'
    },
    viewInfo: {
        flex: 1,
        marginLeft: 20
    },
    txViewProfile: {
        color: 'gray',
        marginTop: 5
    },
    btnImage: {
        position: "relative"
    },
    imageStyle: {
        borderRadius: 35,
        borderWidth: 0.5,
        borderColor: 'rgba(151, 151, 151, 0.29)'
    },
    customImagePlace: {
        width: 70,
        height: 70,
        alignSelf: "center"
    },
    styleImgLoad: {
        width: 70,
        height: 70,
        alignSelf: "center"
    },
    viewPopup: { backgroundColor: '#fff', marginHorizontal: 20, paddingHorizontal: 20, paddingVertical: 40, borderRadius: 5, alignItems: 'center' },
    txSend: {
        color: '#3161ad',
        fontSize: 14,
        fontWeight: 'bold'
    },
    txTitle: { color: '#fff', marginLeft: 50, fontSize: 16 },
    btnConfirm: {
        padding: 10,
        backgroundColor: '#3161ad',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    txConfirm: {
        color: '#fff',
        fontSize: 14
    }
})