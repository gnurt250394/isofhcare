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

class CreateProfileScreen extends Component {
    constructor() {
        super();
        this.state = {
            isGender: false,
            genderUser: [{ gender: "Nam", value: 1 }, { gender: "Nữ", value: 0 }],
            toggelDateTimePickerVisible: false,
            valueGender: 2,
            txGender: '',
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
                            valueGender: 1,
                            txGender: 'Nam'
                        });
                    return;
                case 1:
                    this.setState(
                        {
                            valueGender: 0,
                            txGender: 'Nữ'
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
        if (this.state.weight && isNaN(this.state.weight)) {
            this.setState({
                weightError: 'Cân nặng không hợp lệ'
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
                        let gender = this.state.gender
                        let height = this.state.height
                        let weight = this.state.weight ? parseFloat(this.state.weight).toFixed(1) : ''
                        let phone = this.state.phone
                        // let address = this.state.address
                        let idProvince = this.state.provinces ? this.state.provinces.id : ''
                        let idDistrics =  this.state.districts ? this.state.districts.id : ''
                        let idZone = this.state.zone ? this.state.zone.id : ''
                        // parseFloat(item.distance).toFixed(1)
                        let data = {
                            "name": name,
                            "dob": this.state.dob ? this.state.dob.format('yyyy-MM-dd') + ' 00:00:00' : null,
                            "gender": gender ? gender : null,
                            "height": height ? Number(height) : null,
                            "weight": weight ? Number(weight) : null,
                            "phone": phone,
                            // "address": address ? address : null
                        }
                        profileProvider.createProfile(data,idProvince,idDistrics,idZone).then(res => {
                            console.log(res)
                            if (res.code == 0) {
                                this.props.navigation.navigate('listProfile', { reset: this.state.reset + 1 })
                                snackbar.show('Thêm thành viên thành công', 'success')
                            }
                            else { snackbar.show('Thêm thành viên không thành công', 'danger') }
                        }).catch(err => {
                            snackbar.show('Thêm thành viên không thành công', 'danger')
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
            this.setState({ districts, districtsError })
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
            snackbar.show('Bạn chưa chọn Tỉnh/Thành phố')
        }
    }
    selectprovinces(provinces) {
        let provincesError = provinces ? "" : this.state.provincesError;
        if (!provinces || !this.state.provinces || provinces.id != this.state.provinces.id) {
            this.setState({ provinces, provincesError })
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
            this.setState({ zone, zoneError })
        } else {
            this.setState({ zone, zoneError });
        }
    }
    onSelectZone = () => {
        if(!this.state.provinces.id){
            snackbar.show("Bạn chưa chọn Tỉnh/Thành phố")
        }
        if(!this.state.districts.id){
            snackbar.show("Bạn chưa chọn Quận/Huyện")
        }
        if(this.state.provinces.id  && this.state.districts.id){
            this.props.navigation.navigate('selectZone', {
                onSelected: this.selectZone.bind(this),
                id: this.state.districts.id
            })
            return
        }

    }
    renderItem = ({ item }) => {
        return (
            <View style={{ margin: 5, borderRadius: 1, borderColor: '#A4A4A4', padding: 5 }}>
                <Text style={{ color: '#4BBA7B', textAlign: 'left' }}>{item.countryCode}</Text>
            </View>
        )
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
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingVertical: 5 }}>
                    <View style={styles.container}>
                        <Text style={styles.txTitle}>THÊM THÀNH VIÊN MỚI</Text>
                        <Form ref={ref => (this.form = ref)} style={[{ flex: 1 }]}>
                            <Field style={[styles.mucdichkham, Platform.OS == "ios" ? { paddingVertical: 12, } : {}]}>
                                <Text style={styles.mdk}>{constants.fullname}</Text>
                                <TextField
                                    hideError={true}
                                    onValidate={(valid, messages) => {
                                        if (valid) {
                                            this.setState({ nameError: "" });
                                        } else {
                                            this.setState({ nameError: messages });
                                        }
                                    }}
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
                                    multiline={true}
                                    inputStyle={[
                                        styles.ktq,
                                    ]}
                                    errorStyle={styles.errorStyle}
                                    onChangeText={this.onChangeText("name")}
                                    value={this.state.name}
                                    autoCapitalize={"none"}
                                    returnKeyType={"next"}
                                    // underlineColorAndroid="transparent"
                                    autoCorrect={false}
                                />
                            </Field>
                            <Text style={[styles.errorStyle]}>{this.state.nameError}</Text>



                            <Field

                                style={[styles.mucdichkham, { flexDirection: 'row' }]}
                            >
                                <Field style={{ width: '60%' }}>
                                    <Text style={styles.mdk}>{'Ngày tháng năm sinh'}</Text>

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
                                        ) => (
                                                <Text style={[styles.ktq, { paddingVertical: 12 }]}>{value ? (value) : ('Ngày tháng năm sinh')}</Text>
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
                                        returnKeyType={"next"}
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
                                    <Text style={styles.mdk}>{constants.gender}</Text>
                                    <Text style={[styles.ktq, { paddingVertical: 12 }]}>
                                        {!this.state.txGender
                                            ? constants.select_gender
                                            : this.state.txGender}
                                    </Text>
                                </TouchableOpacity>
                            </Field>
                            <Text style={[styles.errorStyle]}>{this.state.valid}</Text>
                            <Field style={[styles.mucdichkham, { flexDirection: 'row' }, Platform.OS == "ios" ? { paddingVertical: 12, } : {}]}>
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
                                                    number: 'Chiều cao không hợp lệ',
                                                }
                                            }}
                                            placeholder={'Chiều cao'}
                                            multiline={true}
                                            inputStyle={[
                                                styles.ktq,
                                            ]}
                                            errorStyle={styles.errorStyle}
                                            onChangeText={this.onChangeText("height")}
                                            value={this.state.height}
                                            autoCapitalize={"none"}
                                            returnKeyType={"next"}
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
                                            onValidate={(valid, messages) => {
                                                if (valid) {
                                                    this.setState({ weightError: "" });
                                                } else {
                                                    this.setState({ weightError: messages });
                                                }
                                            }}
                                            // validate={{
                                            //     rules: {
                                            //         number: true,
                                            //     },
                                            //     messages: {
                                            //         number: 'Cân nặng không hợp lệ',
                                            //     }
                                            // }}
                                            placeholder={'Cân nặng'}
                                            multiline={true}
                                            inputStyle={[
                                                styles.ktq,
                                            ]}
                                            errorStyle={styles.errorStyle}
                                            onChangeText={this.onChangeText("weight")}
                                            value={this.state.weight}
                                            autoCapitalize={"none"}
                                            returnKeyType={"next"}
                                            // underlineColorAndroid="transparent"
                                            autoCorrect={false}
                                        />
                                    </Field>
                                    <Text style={[styles.errorStyle]}>{this.state.weightError}</Text>

                                </Field>
                            </Field>
                            <Field style={[styles.mucdichkham, Platform.OS == "ios" ? { paddingVertical: 12, } : {}]}>
                                <Text style={styles.mdk}>{'Số điện thoại'}</Text>
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
                                    placeholder={'Số điện thoại'}
                                    multiline={true}
                                    inputStyle={[
                                        styles.ktq,
                                    ]}
                                    errorStyle={styles.errorStyle}
                                    onChangeText={this.onChangeText("phone")}
                                    value={this.state.phone}
                                    autoCapitalize={"none"}
                                    returnKeyType={"next"}
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
                                    returnKeyType={"next"}
                                    // underlineColorAndroid="transparent"
                                    autoCorrect={false}
                                />
                            </Field>
                            <Text style={[styles.errorStyle]}>{this.state.addressError}</Text> */}
                            <Field style={[styles.mucdichkham, { flexDirection: 'row' }, Platform.OS == "ios" ? { paddingVertical: 12, } : {}]}>
                                <Field style={{ flex: 1 }}>
                                <Text style={styles.mdk}>{'Địa chỉ'}</Text>
                                    <Field>
                                        <TextField
                                            hideError={true}
                                            onPress={this.onSelectProvince}
                                            placeholder={'Tỉnh/Thành phố'}
                                            editable={false}
                                            multiline={true}
                                            inputStyle={[
                                                styles.ktq,
                                            ]}
                                            errorStyle={styles.errorStyle}
                                            value={this.state.provinces && this.state.provinces.countryCode ? this.state.provinces.countryCode : ''}
                                            autoCapitalize={"none"}
                                            returnKeyType={"next"}
                                            // underlineColorAndroid="transparent"
                                            autoCorrect={false}
                                        />
                                    </Field>

                                </Field>

                                <Field style={{ flex: 1 }}>
                                <Text style={styles.mdk}></Text>
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
                                            placeholder={'Quận/Huyện'}
                                            multiline={true}
                                            inputStyle={[
                                                styles.ktq,
                                            ]}
                                            onPress={this.onSelectDistrict}
                                            editable={false}
                                            errorStyle={styles.errorStyle}
                                            value={this.state.districts && this.state.districts.name ? this.state.districts.name : ''}
                                            autoCapitalize={"none"}
                                            returnKeyType={"next"}
                                            // underlineColorAndroid="transparent"
                                            autoCorrect={false}
                                        />
                                    </Field>
                                </Field>
                                <Field style={{ flex: 1 }}>
                                <Text style={styles.mdk}></Text>
                                    <Field>
                                        <TextField
                                            hideError={true}
                                            placeholder={'Xã phường'}
                                            multiline={true}
                                            onPress = {this.onSelectZone}
                                            editable={false}
                                            inputStyle={[
                                                styles.ktq,
                                            ]}
                                            errorStyle={styles.errorStyle}
                                            value={this.state.zone && this.state.zone.name ? this.state.zone.name : ''}
                                            autoCapitalize={"none"}
                                            returnKeyType={"next"}
                                            // underlineColorAndroid="transparent"
                                            autoCorrect={false}
                                        />
                                    </Field>
                                </Field>
                            </Field>
                            <Field style={[styles.mucdichkham, this.state.type == "FAMILY" ? {} : { marginTop: 10 }, Platform.OS == "ios" ? { paddingVertical: 12, } : {}]}>
                            <Text style={styles.mdk}></Text>                             
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
                                    placeholder={'Thôn/Xóm, số nhà'}
                                    multiline={true}
                                    inputStyle={[
                                        styles.ktq,
                                    ]}
                                    errorStyle={styles.errorStyle}
                                    onChangeText={this.onChangeText("address")}
                                    value={this.state.address}
                                    autoCapitalize={"none"}
                                    returnKeyType={"next"}
                                    // underlineColorAndroid="transparent"
                                    autoCorrect={false}
                                />
                            </Field>
                            <Text style={[styles.errorStyle]}>{this.state.addressError}</Text>
                        </Form>
                        <View style={styles.viewBtn}>
                            <TouchableOpacity onPress={this.onCreateProfile} style={styles.btnDone}><Text style={styles.txDone}>Lưu</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.pop()} style={styles.btnReject}><Text style={styles.txDone}>Hủy</Text></TouchableOpacity>
                        </View>
                    </View>


                </ScrollView>
                <ImagePicker ref={ref => (this.imagePicker = ref)} />
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
                {Platform.OS == "ios" && <KeyboardSpacer />}
            </View>
        );
    }

}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
const styles = StyleSheet.create({
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
    mucdichkham: {
        flex: 1
        // borderStyle: "solid",
        // borderWidth: 1,
        // borderColor: '#4BBA7B',
        // borderRadius:5,

    },
    txTitle: { fontSize: 16, color: '#4BBA7B', textAlign: 'center', fontWeight: '600', marginTop: 40, marginBottom: 10 },
    mdk: {
        marginLeft: 12,
        flex: 1,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",

    },
    ktq: {
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#8e8e93",
        backgroundColor: '#F2F2F2',
        borderColor: '#4BBA7B',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 10

    },
    container: {
        // borderStyle: "solid",
        marginVertical: 20,
        paddingHorizontal: 20,
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
        marginTop: 10,
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
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(CreateProfileScreen);
