import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
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
import imageProvider from "@data-access/image-provider";
import connectionUtils from "@utils/connection-utils";
import dateUtils from 'mainam-react-native-date-utils';
import NavigationService from "@navigators/NavigationService";

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        let id = this.props.navigation.getParam('id', null)

        this.state = {
            id,
            dataProfile: {}
        };
    }
    componentDidMount() {
        this.onGetData()

    }
    onGetData = () => {
        let id = this.state.id
        this.setState({
            isLoading: true
        }, () => {
            if (id) {
                profileProvider.getDetailsMedical(id).then(res => {

                    if (res && res.code == 0) {

                        if (res.data?.medicalRecords?.hospitalName && res.data?.medicalRecords?.value) {
                            this.setState({
                                fromHis: true,
                                dataProfile: res.data,
                                isLoading: false
                            }, () => {
                                this.renderAddress()
                            })
                        } else {
                            this.setState({
                                fromHis: false,
                                dataProfile: res.data,
                                isLoading: false

                            }, () => {
                                this.renderAddress()
                            })
                        }

                    } else {
                        this.setState({
                            isLoading: false
                        })
                    }
                }).catch(err => {
                    this.setState({
                        isLoading: false
                    })

                })
            }
        })
    }
    defaultImage = () => {
        return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.onGetData()
        }
    }
    renderRelation = () => {

        switch (this.state.relationshipType) {
            case 'DAD':
                this.setState({
                    relationShip: {
                        id: 1,
                        name: 'Cha',
                        type: 'DAD'
                    }
                })
                break
            case 'MOTHER':
                this.setState({
                    relationShip: {
                        id: 2,
                        name: 'Mẹ',
                        type: 'MOTHER'
                    }
                })
                break
            case 'BOY':
                this.setState({
                    relationShip: {
                        id: 3,
                        name: 'Con trai',
                        type: 'BOY'
                    }
                })
                break
            case 'DAUGHTER':
                this.setState({
                    relationShip: {
                        id: 4,
                        name: 'Con gái',
                        type: 'DAUGHTER'
                    }
                })
                break
            case 'GRANDSON':
                this.setState({
                    relationShip: {
                        id: 5,
                        name: 'Cháu trai',
                        type: 'GRANDSON'
                    }
                })
                break
            case 'NIECE':
                this.setState({
                    relationShip: {
                        id: 6,
                        name: 'Cháu gái',
                        type: 'NIECE'
                    }
                })
                break
            case 'GRANDFATHER':
                this.setState({
                    relationShip: {
                        id: 7,
                        name: 'Ông',
                        type: 'GRANDFATHER'
                    }
                })
                break
            case 'GRANDMOTHER':
                this.setState({
                    relationShip: {
                        id: 8,
                        name: 'Bà',
                        type: 'GRANDMOTHER'
                    }
                })
                break
            case 'WIFE':
                this.setState({
                    relationShip: {
                        id: 9,
                        name: 'Vợ',
                        type: 'WIFE'
                    }
                })
                break
            case 'HUSBAND':
                this.setState({
                    relationShip: {
                        id: 10,
                        name: 'Chồng',
                        type: 'HUSBAND'
                    }
                })
                break
            case 'OTHER':
                this.setState({
                    relationShip: {
                        id: 11,
                        name: 'Khác',
                        type: 'OTHER'
                    }
                })
                break
        }
    }


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
    onSelectRelationShip = () => {
        this.props.navigation.navigate('selectRelationship', {
            onSelected: this.selectRelationShip.bind(this),
            gender: this.state.gender
            // id: this.state.relationShip.id
        })

    }
    onChangeText = type => text => {
        this.setState({ [type]: text });
    };
    selectRelationShip = (relationShip) => {
        let relationShipError = relationShip ? "" : this.state.relationShipError;
        if (!relationShip || !this.state.relationShip || relationShip.id != this.state.relationShip.id) {
            this.setState({ relationShip, relationShipError })
        } else {
            this.setState({ relationShip, relationShipError });
        }
    }
    selectImage = () => {
        if (this.imagePicker) {
            this.imagePicker.open(true, 200, 200, image => {


                this.setState({ isLoading: true }, () => {
                    imageProvider
                        .upload(image.path, image.mime)
                        .then(s => {
                            this.setState({ avatar: { uri: s.data.data.images[0].thumbnail.absoluteUrl(), isLoading: false } })
                            // this.setState({ isLoading: false }, () => {
                            //     if (s && s.data.code == 0) {
                            //         let user = objectUtils.clone(this.props.userApp.currentUser);
                            //         user.avatar = s.data.data.images[0].thumbnail;
                            //         this.setState({ isLoading: true }, () => {
                            //             userProvider
                            //                 .update(this.props.userApp.currentUser.id, user)
                            //                 .then(s => {
                            //                     this.setState({ isLoading: false }, () => { });
                            //                     if (s.code == 0) {
                            //                         var user = s.data.user;
                            //                         let current = this.props.userApp.currentUser;
                            //                         user.bookingNumberHospital = current.bookingNumberHospital;
                            //                         user.bookingStatus = current.bookingStatus;
                            //                         this.props.dispatch(redux.userLogin(user));
                            //                     } else {
                            //                         snackbar.show(
                            //                             "Cập nhật ảnh đại diện không thành công",
                            //                             "danger"
                            //                         );
                            //                     }
                            //                 })
                            //                 .catch(e => {
                            //                     this.setState({ isLoading: false }, () => { });
                            //                     snackbar.show(
                            //                         "Cập nhật ảnh đại diện không thành công",
                            //                         "danger"
                            //                     );
                            //                 });
                            //         });
                            //     }
                            // });
                        })
                        .catch(e => {

                            this.setState({ isLoading: false }, () => { });
                            snackbar.show("Upload ảnh không thành công", "danger");
                        });
                });
            });
        }
    }
    onSelectProvince = () => {
        const { provinces, districts, zone, address } = this.state
        this.props.navigation.navigate("selectAddress", {
            onSelected: this.selectprovinces.bind(this),
            provinces, districts, zone, address
        });
    }
    selectprovinces(provinces, districts, zone, address) {

        this.setState({ provinces, districts, zone, address })

    }

    onCreateProfile = () => {
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
                            'name': this.state.name,
                            "dob": this.state.dob ? this.state.dob.format('yyyy-MM-dd') + ' 00:00:00' : null,
                            "gender": this.state.gender ? this.state.gender : null,
                            "height": this.state.height ? Number(this.state.height) : 0,
                            "weight": this.state.weight ? Number(parseFloat(this.state.weight).toFixed(1)) : 0,
                            "phone": this.state.phone,
                            "provinceId": this.state.provinces ? this.state.provinces.id.toString() : null,
                            "districtId": this.state.districts ? this.state.districts.id.toString() : null,
                            "zoneId": this.state.zone ? this.state.zone.id.toString() : null,
                            "village": this.state.address ? this.state.address : ' ',
                            "relationshipType": this.state.relationShip && this.state.relationShip.type ? this.state.relationShip.type : (this.state.relationshipType || null)
                        }
                        profileProvider.updateProfile(id, data).then(res => {
                            switch (res.code) {
                                case 0:
                                    NavigationService.navigate('profile', { id: res.data.medicalRecords.id })
                                    snackbar.show('Cập nhật hồ sơ thành công', "success");
                                    break
                                case 1:
                                    snackbar.show('Bạn không có quyền chỉnh sửa hồ sơ này', "danger");
                                    break
                                case 2:
                                    snackbar.show('Bạn đang không đăng nhập với ứng dụng bệnh nhân', "danger");
                                    break
                            }
                        }).catch(err => {

                        })
                    });
            }
            ).catch(e => {
                snackbar.show(constants.msg.app.not_internet, "danger");
            });
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
    renderAddress = () => {
        let dataLocaotion = this.state.dataProfile

        let district = dataLocaotion.district ? dataLocaotion.district.name : null
        let province = dataLocaotion.province ? dataLocaotion.province.countryCode : null
        let zone = dataLocaotion.zone ? dataLocaotion.zone.name : ''
        let village = dataLocaotion.medicalRecords.village && dataLocaotion.medicalRecords.village != ' ' ? dataLocaotion.medicalRecords.village : null

        if (district && province && zone && village) {
            this.setState({
                location: `${village}\n${zone}\n${district}\n${province}`
            })

        }
        else if (district && province && zone) {
            this.setState({
                location: `${zone}\n${district}\n${province}`
            })

        }
        else if (district && province && village) {
            this.setState({
                location: `${village}\n${district}\n${province}`
            })

        }
        else if (district && province) {
            this.setState({
                location: `${district}\n${province}`
            })

        }

        else if (province && village) {
            this.setState({
                location: `${village}\n${province}`
            })

        }
        else if (province) {
            this.setState({
                location: `${province}`
            })

        }
        else if (village) {

            this.setState({
                location: `${village}`
            })

        } else if (!village && !district && !province && !zone) {
            this.setState({
                location: null
            })
        }
    }
    onEdit(isEdit) {
        debugger
        if (isEdit) {
            this.onGetData()
        }
    }
    onEditProfile = () => {

        if (this.props.userApp.currentUser.accountSource == 'VENDOR') {
            this.props.navigation.replace('editProfileUsername', {
                dataOld: this.state.dataProfile,
                // onEdit: this.onEdit.bind(this)
            })
        }
        else
            this.props.navigation.navigate('createProfile', {
                dataOld: this.state.dataProfile,
                onEdit: this.onEdit.bind(this)
            })
    }
    renderEdit = () => {
        let phoneProfile = this.state.dataProfile?.medicalRecords?.phone

        let alreadyHaveAccount = this.state.dataProfile?.medicalRecords?.alreadyHaveAccount

        let phone = this.props.userApp.currentUser.phone
        if (this.state.dataProfile?.medicalRecords?.hospitalName && this.state.dataProfile?.medicalRecords?.value) {
            return null
        }
        else if (phoneProfile && phoneProfile == phone || !alreadyHaveAccount) {
            return (
                <TouchableOpacity
                    onPress={this.onEditProfile}
                    style={styles.buttonSave}>
                    <Text style={styles.txtSave}>Sửa</Text>
                </TouchableOpacity>
            )
        }
    }
    render() {
        const { dataProfile, avatar, isLoading, location } = this.state


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
        let age = dataProfile?.medicalRecords?.dob ? new Date().getFullYear() - dataProfile?.medicalRecords?.dob?.toDateObject('-').getFullYear() : null
        let gender = dataProfile?.medicalRecords?.gender == 0 ? 'Nữ' : dataProfile?.medicalRecords?.gender == 1 ? 'Nam' : null
        return (
            <ActivityPanel
                title={'Chi tiết hồ sơ'}
                isLoading={isLoading}
                menuButton={this.renderEdit()}
                containerStyle={{ backgroundColor: '#f8f8f8' }}
                titleStyle={styles.titleStyle}

            >

                <ScrollView>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}><View
                            // onPress={this.selectImage}
                            style={styles.buttonAvatar}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={styles.borderImage}
                                borderRadius={40}
                                customImagePlaceholderDefaultStyle={[styles.avatar, styles.placeHolderImage]}
                                placeholderSource={dataProfile?.medicalRecords?.avatar ? { uri: dataProfile?.medicalRecords?.avatar } : require("@images/new/user.png")}
                                resizeMode="cover"
                                loadingStyle={{ size: 'small', color: 'gray' }}
                                source={{ uri: dataProfile.medicalRecords && dataProfile.medicalRecords.avatar ? dataProfile.medicalRecords.avatar.absoluteUrl() : '' || '' }}
                                style={styles.image}
                                defaultImage={this.defaultImage}
                            />
                            {/* <ScaledImage source={require('@images/new/profile/ic_camera.png')} height={18} style={styles.icCamera} /> */}
                        </View>
                            <View style={{ marginLeft: 20 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>{dataProfile?.medicalRecords?.name || ''}</Text>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#075BB5' }}>{dataProfile?.medicalRecords?.dob?.toDateObject('-').format('dd/MM/yyyy') || ''} - {age ? age + ' tuổi' : age == 0 ? '1 tuổi' : ''}</Text>

                            </View>
                        </View>
                        {/* <View style={styles.containerScan}>
                                <View style={styles.groupScan}>
                                    <Text style={styles.txtScan}>QUÉT CMND </Text>
                                    <Text style={styles.txtOr}> hoặc </Text>
                                    <Text style={styles.txtScan}>QUÉT BẢO HIỂM Y TẾ</Text>
                                </View>
                                <Text style={styles.txtOr}>Để điền thông tin nhanh hơn!</Text>
                            </View> */}
                        <Form ref={ref => (this.form = ref)}>

                            {gender ? <Field style={[styles.containerField,
                            ]}>
                                <Text style={styles.txLabel}>Giới tính</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        errorStyle={styles.err}
                                        multiline={true}
                                        // onPress={this.onShowGender}
                                        inputStyle={[styles.input]}
                                        value={gender}
                                        autoCapitalize={"none"}
                                        editable={false}
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field> : <Field></Field>}

                            {this.state.location ? <Field style={[styles.containerField, {
                                marginTop: 10,
                                borderTopColor: '#00000011',
                                borderTopWidth: 1
                            }]}>
                                <Text style={styles.txLabel}>Địa chỉ</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        inputStyle={[styles.input]}
                                        value={this.state.location}
                                        autoCapitalize={"none"}
                                        editable={false}
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field> : <Field></Field>}
                            {dataProfile?.medicalRecords?.nation?.name ? <Field style={[styles.containerField]}>
                                <Text style={styles.txLabel}>Dân tộc</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        onChangeText={this.onChangeText("address")}
                                        inputStyle={[styles.input]}
                                        value={dataProfile?.medicalRecords?.nation?.name || ''}
                                        autoCapitalize={"none"}
                                        editable={false}
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field> : <Field></Field>}
                            {dataProfile && dataProfile.country && dataProfile.country.name ? <Field style={[styles.containerField]}>
                                <Text style={styles.txLabel}>Quốc tịch</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        onChangeText={this.onChangeText("address")}
                                        inputStyle={[styles.input]}
                                        value={dataProfile?.country?.name || ''}
                                        autoCapitalize={"none"}
                                        editable={false}
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field> : <Field></Field>}
                            {dataProfile?.medicalRecords?.job?.name ? <Field style={[styles.containerField]}>
                                <Text style={styles.txLabel}>Nghề nghiệp</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        onChangeText={this.onChangeText("address")}
                                        inputStyle={[styles.input]}
                                        value={dataProfile?.medicalRecords?.job?.name || ''}
                                        autoCapitalize={"none"}
                                        editable={false}
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field> : <Field></Field>}
                            {dataProfile?.medicalRecords?.hospitalName ? <Field style={[styles.containerField]}>
                                <Text style={styles.txLabel}>Cơ sở y tế</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        onChangeText={this.onChangeText("address")}
                                        inputStyle={[styles.input]}
                                        value={dataProfile?.medicalRecords?.hospitalName || ''}
                                        autoCapitalize={"none"}
                                        editable={false}
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field> : <Field></Field>}
                            {dataProfile?.medicalRecords?.value ? <Field style={[styles.containerField]}>
                                <Text style={styles.txLabel}>Mã bệnh nhân</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        onChangeText={this.onChangeText("address")}
                                        inputStyle={[styles.input]}
                                        value={dataProfile?.medicalRecords?.value || ''}
                                        autoCapitalize={"none"}
                                        editable={false}
                                        autoCorrect={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field> : <Field></Field>}
                            {/* <Field style={[styles.containerField]}>
                                <Text style={styles.txLabel}>Nghề nghiệp</Text>
                                <Field style={{ flex: 1 }}>
                                    <TextField
                                        multiline={true}
                                        onChangeText={this.onChangeText("address")}
                                        inputStyle={[styles.input]}
                                        value={this.state.address}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                        editable={false}
                                    >
                                    </TextField>
                                </Field>
                            </Field> */}
                            {age && age < 14 || age == 0 ?
                                <Field>
                                    {dataProfile && dataProfile.medicalRecords && dataProfile.medicalRecords.guardianName ? <Field style={[styles.containerField, {
                                        marginTop: 10,
                                        borderTopColor: '#00000011',
                                        borderTopWidth: 1
                                    }]}>
                                        <Text style={styles.txLabel}>Người bảo lãnh</Text>
                                        <Field style={{ flex: 1 }}>
                                            <TextField
                                                multiline={true}
                                                editable={false}
                                                inputStyle={[styles.input]}
                                                errorStyle={styles.err}
                                                value={dataProfile?.medicalRecords?.guardianName || ''}
                                                autoCapitalize={"none"}
                                                autoCorrect={false}
                                            >

                                            </TextField>
                                        </Field>
                                    </Field> : <Field></Field>}
                                    {dataProfile && dataProfile.medicalRecords && dataProfile.medicalRecords.guardianPhone ? <Field style={[styles.containerField]}>
                                        <Text style={styles.txLabel}>SĐT người bảo lãnh</Text>
                                        <Field style={{ flex: 1 }}>
                                            <TextField
                                                multiline={true}
                                                editable={false}
                                                inputStyle={[styles.input]}
                                                errorStyle={styles.err}
                                                value={dataProfile?.medicalRecords?.guardianPhone || ''}
                                                autoCapitalize={"none"}
                                                autoCorrect={false}
                                            >

                                            </TextField>
                                        </Field>
                                    </Field> : <Field></Field>}
                                    {dataProfile && dataProfile.medicalRecords && dataProfile.medicalRecords.guardianPassport ? <Field style={[styles.containerField,]}>
                                        <Text style={styles.txLabel}>CMTND/ HC người bảo lãnh</Text>
                                        <Field style={{ flex: 1 }}>
                                            <TextField
                                                multiline={true}
                                                editable={false}
                                                inputStyle={[styles.input]}
                                                errorStyle={styles.err}
                                                value={dataProfile?.medicalRecords?.guardianPassport || ''}
                                                autoCapitalize={"none"}
                                                autoCorrect={false}
                                            >

                                            </TextField>
                                        </Field>
                                    </Field> : <Field></Field>}
                                </Field>
                                : <Field>
                                    {dataProfile && dataProfile.medicalRecords && dataProfile.medicalRecords.phone ? <Field style={[styles.containerField]}>
                                        <Text style={styles.txLabel}>Số điện thoại</Text>
                                        <Field style={{ flex: 1 }}>
                                            <TextField
                                                multiline={true}
                                                editable={false}
                                                inputStyle={[styles.input]}
                                                errorStyle={styles.err}
                                                value={dataProfile?.medicalRecords?.phone || ''}
                                                autoCapitalize={"none"}
                                                autoCorrect={false}
                                            >

                                            </TextField>
                                        </Field>
                                    </Field> : <Field></Field>}
                                    {dataProfile && dataProfile.medicalRecords && dataProfile.medicalRecords.passport ? <Field style={[styles.containerField,]}>
                                        <Text style={styles.txLabel}>Số CMND</Text>
                                        <Field style={{ flex: 1 }}>
                                            <TextField
                                                multiline={true}
                                                editable={false}
                                                inputStyle={[styles.input]}
                                                errorStyle={styles.err}
                                                value={dataProfile?.medicalRecords?.passport || ''}
                                                autoCapitalize={"none"}
                                                autoCorrect={false}
                                            >

                                            </TextField>
                                        </Field>
                                    </Field> : <Field></Field>}
                                </Field>}
                            {/** Địa chỉ */}
                        </Form>
                    </View>
                </ScrollView>
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
                            }
                        );
                    }}
                    onCancel={() => {
                        this.setState({ toggelDateTimePickerVisible: false });
                    }}
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
export default connect(mapStateToProps)(ProfileScreen);


const styles = StyleSheet.create({
    errorStyle: {
        color: "red",
        marginLeft: 13
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
    input: {
        textAlign: 'right',
        color: '#000',
        fontWeight: 'bold',
        minHeight: 40,
        textAlign: 'right',
        paddingRight: 10,
        color: '#000',
        fontWeight: 'bold',
        paddingLeft: 60,
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
    },
    placeHolderImage: { width: 80, height: 80, borderRadius: 40 },
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
        position: 'absolute', left: 10, fontSize: 14
    },
    buttonSave: {
        paddingVertical: 10,
        paddingRight: 20,
    },
    err: { fontSize: 14, color: 'red', position: 'absolute', bottom: -5, right: 10, fontStyle: 'italic' },
    txtError: {
        color: 'red',
        paddingLeft: 10,
        paddingTop: 8,
        fontStyle: 'italic'
    },
    scaledImage: {
        position: "absolute",
        bottom: 0,
        right: 0
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
        borderRadius: 40,
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
})