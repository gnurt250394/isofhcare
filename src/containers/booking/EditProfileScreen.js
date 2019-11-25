import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Keyboard } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import medicalRecordProvider from '@data-access/medical-record-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import clientUtils from '@utils/client-utils';
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
import userProvider from "@data-access/user-provider";
import connectionUtils from "@utils/connection-utils";

class EditProfileScreen extends Component {
    constructor(props) {
        super(props);
        let data = this.props.navigation.getParam('item', {})
        let dataProfile = data.medicalRecords
        let country = data.country
        let district = data.district
        let province = data.province
        let zone = data.zone
        this.state = {
            item: data,
            avatar: data.medicalRecords && data.medicalRecords.avatar ? { uri: data.medicalRecords.avatar.absoluteUrl() } : require("@images/new/user.png"),
            name: dataProfile && dataProfile.name ? dataProfile.name : '',
            date: dataProfile && dataProfile.dob ? dataProfile.dob.toDateObject('-').format('dd/MM/yyyy') : (''),
            txGender: dataProfile && dataProfile.gender == 1 ? 'Nam' : 'Nữ',
            gender: dataProfile && dataProfile.gender ? dataProfile.gender : 0,
            dobOld: dataProfile && dataProfile.dob ? dataProfile.dob : '',
            height: dataProfile && dataProfile.height ? dataProfile.height.toString() : '',
            weight: dataProfile && dataProfile.weight ? dataProfile.weight.toString() : '',
            address: dataProfile && dataProfile.village && dataProfile.village != ' ' ? dataProfile.village : '',
            relationshipType: dataProfile && dataProfile.relationshipType ? dataProfile.relationshipType : '',
            profileNo: dataProfile && dataProfile.profileNo ? dataProfile.profileNo : '',
            id: dataProfile && dataProfile.id,
            dob: dataProfile && dataProfile.dob ? dataProfile.dob.toDateObject('-') : '',
            phone: dataProfile && dataProfile.phone,
            data: dataProfile ? dataProfile : {},
            country,
            districts: district,
            provinces: province,
            zone,
            isReset: 1,
            isLoading: false,
            image: null
        };
    }
    defaultImage = () => {
        return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
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
    componentDidMount = () => {
        this.renderRelation()
    };

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
                        .upload(image.path)
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
    renderAddress = () => {
        const { provinces, districts, zone } = this.state
        let value = ''
        let address = this.state.address ? this.state.address + ' - ' : ''
        if (provinces && districts && zone) {
            value = address + ' ' + zone.name + ' - ' + districts.name + ' - ' + provinces.countryCode
        }
        return value
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
    render() {
        const { item, avatar, isLoading } = this.state


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
                title={constants.title.edit_profile}
                isLoading={isLoading}
                menuButton={<TouchableOpacity
                    onPress={this.onCreateProfile}
                    style={styles.buttonSave}>
                    <Text style={styles.txtSave}>Lưu</Text>
                </TouchableOpacity>}
                titleStyle={styles.titleStyle}

            >

                <ScrollView>
                    <View style={styles.container}>
                        <Form ref={ref => (this.form = ref)} style={[{ flex: 1 }]}>
                            <View style={styles.groupTitle}>
                                <Text style={styles.txtTitle1}>Vui lòng hoàn thành hồ sơ trước khi đặt khám!</Text>
                                <Text style={styles.txtTitle2}>Thông tin hồ sơ của bạn được sử dụng để đăng ký khám tại cơ sở y tế, chúng tôi đảm bảo tính bảo mật thông tin của khách hàng.</Text>
                            </View>
                            <TouchableOpacity
                                onPress={this.selectImage}
                                style={styles.buttonAvatar}>
                                <ImageLoad
                                    resizeMode="cover"
                                    imageStyle={styles.borderImage}
                                    borderRadius={40}
                                    customImagePlaceholderDefaultStyle={[styles.avatar, styles.placeHolderImage]}
                                    placeholderSource={require("@images/new/user.png")}
                                    resizeMode="cover"
                                    loadingStyle={{ size: 'small', color: 'gray' }}
                                    source={avatar}
                                    style={styles.image}
                                    defaultImage={this.defaultImage}
                                />
                                <ScaleImage source={require('@images/new/profile/ic_camera.png')} height={18} style={styles.icCamera} />
                            </TouchableOpacity>
                            <View style={styles.containerScan}>
                                <View style={styles.groupScan}>
                                    <Text style={styles.txtScan}>QUÉT CMND </Text>
                                    <Text style={styles.txtOr}> hoặc </Text>
                                    <Text style={styles.txtScan}>QUÉT BẢO HIỂM Y TẾ</Text>
                                </View>
                                <Text style={styles.txtOr}>Để điền thông tin nhanh hơn!</Text>
                            </View>
                            <View style={styles.containerInput}>
                                <Text style={styles.txtLabel}>Họ và tên</Text>
                                <TextInput placeholder="Nhập họ tên" style={styles.input} value={this.state.name} />
                            </View>
                            <View style={styles.containerInput}>
                                <Text>Ngày sinh</Text>
                                <TextField
                                    // value={this.state.date || ""}
                                    onPress={() =>
                                        this.setState({ toggelDateTimePickerVisible: true })
                                    }
                                    dateFormat={"dd/MM/yyyy"}
                                    splitDate={"/"}
                                    editable={false}
                                    getComponent={(
                                        value,
                                        onChangeText,
                                        onFocus,
                                        onBlur,
                                        isError
                                    ) => {

                                        return (
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>
                                                <Text style={[styles.txtValue]}>{this.renderDob(value)}</Text>
                                                <ScaleImage source={require('@images/new/booking/ic_next.png')} height={12} />
                                            </View>
                                        )
                                    }}
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
                                // style={{
                                //     flex: 1
                                // }}
                                />
                            </View>
                            <View style={styles.containerInput}>
                                <Text>Giới tính</Text>
                                <TouchableOpacity
                                    style={[
                                        {
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }
                                    ]}
                                    onPress={this.onShowGender}
                                >
                                    <Text style={[styles.txtValue]}>
                                        {this.state.txGender || 'Chọn giới tính'}
                                    </Text>
                                    <ScaleImage source={require('@images/new/booking/ic_next.png')} height={12} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.containerInput,
                            styles.containerAddress]}>
                                <Text style={styles.txtLabel}>Địa chỉ</Text>
                                <Field style={styles.row}>
                                    <TextField
                                        hideError={true}
                                        onPress={this.onSelectProvince}
                                        editable={false}
                                        multiline={true}
                                        inputStyle={[
                                            styles.txtValue, { minHeight: 41 }, this.state.provinces && this.state.provinces.countryCode ? {} : { color: '#8d8d8d' }
                                        ]}
                                        errorStyle={styles.errorStyle}
                                        value={this.renderAddress() ? this.renderAddress() : 'Nhập địa chỉ'}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    />
                                    <ScaleImage source={require('@images/new/booking/ic_next.png')} height={12} />
                                </Field>
                            </View>
                            <View style={styles.containerInput}>
                                <Text style={styles.txtLabel}>Dân tộc</Text>
                                <Field style={styles.row}>
                                    <TextField
                                        hideError={true}
                                        onPress={this.onSelectProvince}
                                        editable={false}
                                        multiline={true}
                                        inputStyle={[
                                            styles.txtValue, { minHeight: 41 }, this.state.provinces && this.state.provinces.countryCode ? {} : { color: '#8d8d8d' }
                                        ]}
                                        errorStyle={styles.errorStyle}
                                        value={this.state.provinces && this.state.provinces.countryCode ? this.state.provinces.countryCode : 'Tỉnh/Thành phố'}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    />
                                    <ScaleImage source={require('@images/new/booking/ic_next.png')} height={12} />
                                </Field>
                            </View>
                            <View style={styles.containerInput}>
                                <Text style={styles.txtLabel}>Quốc tịch</Text>
                                <Field style={styles.row}>
                                    <TextField
                                        hideError={true}
                                        onPress={this.onSelectProvince}
                                        editable={false}
                                        multiline={true}
                                        inputStyle={[
                                            styles.txtValue, { minHeight: 41 }, this.state.provinces && this.state.provinces.countryCode ? {} : { color: '#8d8d8d' }
                                        ]}
                                        errorStyle={styles.errorStyle}
                                        value={this.state.provinces && this.state.provinces.countryCode ? this.state.provinces.countryCode : 'Tỉnh/Thành phố'}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    />
                                    <ScaleImage source={require('@images/new/booking/ic_next.png')} height={12} />
                                </Field>
                            </View>
                            <View style={styles.containerInput}>
                                <Text style={styles.txtLabel}>Nghề nghiệp</Text>
                                <Field style={styles.row}>
                                    <TextField
                                        hideError={true}
                                        onPress={this.onSelectProvince}
                                        editable={false}
                                        multiline={true}
                                        inputStyle={[
                                            styles.txtValue, { minHeight: 41 }, this.state.provinces && this.state.provinces.countryCode ? {} : { color: '#8d8d8d' }
                                        ]}
                                        errorStyle={styles.errorStyle}
                                        value={this.state.provinces && this.state.provinces.countryCode ? this.state.provinces.countryCode : 'Tỉnh/Thành phố'}
                                        autoCapitalize={"none"}
                                        // underlineColorAndroid="transparent"
                                        autoCorrect={false}
                                    />
                                    <ScaleImage source={require('@images/new/booking/ic_next.png')} height={12} />
                                </Field>
                            </View>
                            {
                                this.state.data.status !== 1 ?
                                    <View style={styles.containerInput}>
                                        <Text style={styles.txtLabel}>Quan hệ với người đại diện gia đình</Text>
                                        <Field style={styles.row}>
                                            <TextField
                                                hideError={true}
                                                multiline={true}
                                                onPress={this.onSelectRelationShip}
                                                editable={false}
                                                inputStyle={[
                                                    styles.txtValue, { minHeight: 41 }, this.state.relationShip && this.state.relationShip.name ? {color:'#00BA99'} : { color: '#8d8d8d' }
                                                ]}
                                                errorStyle={styles.errorStyle}
                                                value={this.state.relationShip && this.state.relationShip.name ? this.state.relationShip.name : 'Quan hệ'}
                                                autoCapitalize={"none"}
                                                // underlineColorAndroid="transparent"
                                                autoCorrect={false}
                                            />
                                            <ScaleImage source={require('@images/new/booking/ic_next.png')} height={12} />
                                        </Field>
                                    </View>
                                    :
                                    <Field></Field>
                            }

                            <View style={[styles.containerInput,
                            styles.containerAddress]}>
                                <Text style={styles.txtLabel}>Số điện thoại</Text>
                                <View>
                                    <Field >
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
                                                    required: "Số điện thoại không được bỏ trống",
                                                    phone: "SĐT không hợp lệ"
                                                }
                                            }}
                                            keyboardType="numeric"
                                            placeholder={'Số điện thoại'}
                                            multiline={true}
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
                                    {this.state.phoneError && <Text style={[styles.errorStyle]}>{this.state.phoneError}</Text>}
                                </View>
                            </View>
                            <View style={styles.containerInput}>
                                <Text style={styles.txtLabel}>Số CMTND</Text>
                                <TextInput placeholder="Nhập số CMTND" style={styles.input} keyboardType="numeric" />
                            </View>
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
                <ImagePicker ref={ref => (this.imagePicker = ref)} />
            </ActivityPanel>
        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(EditProfileScreen);


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
        fontWeight: 'bold'
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
})