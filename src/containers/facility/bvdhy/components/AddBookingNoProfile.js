import React, { Component } from 'react';
import { Text, TouchableOpacity, TextInput, FlatList, Keyboard } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import dhyCommand from '@dhy/strings'
import { connect } from 'react-redux';
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
import locationProvider from '@dhy/data-access/location-provider';
import snackbar from '@utils/snackbar-utils';
import DateTimePicker from 'mainam-react-native-date-picker';
import {
    StyleSheet,
    Image,
    View,
    Platform
} from 'react-native';

const padding = Platform.select({
    ios: 7,
    android: 2
});
let $this = null;
class AddBookingNoProfile extends Component {
    constructor(props) {
        super(props);
        $this = this;
        this.state = {
            toggleModalCountry: false,
            toggleModalProvince: false,
            toggleModalDistrict: false,
            toggleModalZone: false,
            listCountries: [],
            listProvinces: [],
            listDistrict: [],
            listZone: [],
            listZoneTemp: [],
            newProfile: { gender: 1 },
            toggelDateTimePickerVisible: false,
            isMale: true
        }
        this.selectZone.bind(this);
        this.toggleDatePicker.bind(this);
    }

    createProfile() {
        Keyboard.dismiss();
        var temp = this.state.newProfile;
        if (!temp.fullname || !temp.fullname.trim()) {
            snackbar.show(dhyCommand.msg.booking.please_input_fullname);
            return;
        }
        if (!temp.fullname.isFullName()) {
            snackbar.show(dhyCommand.msg.booking.please_enter_the_correct_fullname_format);
            return;
        }

        if (!temp.phoneNumber || !temp.phoneNumber.trim()) {
            snackbar.show(dhyCommand.msg.booking.please_input_phone_number);
            return;
        }
        if (!temp.phoneNumber.isPhoneNumber()) {
            snackbar.show(dhyCommand.msg.booking.please_enter_the_correct_phone_number_format);
            return;
        }

        if (!temp.bod) {
            snackbar.show(dhyCommand.msg.booking.please_input_dob);
            return;
        }

        if (!temp.country) {
            if (temp.listCountries && temp.listCountries.length > 0) {
                snackbar.show(dhyCommand.msg.booking.please_select_country);
                return;
            }
            temp.country = { hisCountryId: 0 }
            temp.province = { hisProvinceId: 0 }
            temp.district = { id: 0 }
            temp.zone = { hisZoneId: 0 }
        }
        else {
            if (!temp.province) {
                if (temp.listProvincesTemp && temp.listProvincesTemp.length > 0) {
                    snackbar.show(dhyCommand.msg.booking.please_select_province);
                    return;
                }
                temp.province = { hisProvinceId: 0 }
                temp.district = { id: 0 }
                temp.zone = { hisZoneId: 0 }
            } else {
                if (!temp.district) {
                    // if (temp.listDistrictTemp && temp.listDistrictTemp.length > 0) {
                    //     snackbar.show(dhyCommand.msg.booking.please_select_district);
                    //     return;
                    // }
                    temp.district = { id: 0 }
                    temp.zone = { hisZoneId: 0 }
                }
                else {
                    if (!temp.zone) {
                        // if (temp.listZone && temp.listZone.length > 0) {
                        //     snackbar.show(dhyCommand.msg.booking.please_select_zone);
                        //     return;
                        // }
                        temp.zone = { hisZoneId: 0 }
                    }
                }
            }

        }

        if (temp.bod.getAge() <= 6) {
            if (!temp.guardianName || !temp.guardianName.trim()) {
                snackbar.show(dhyCommand.msg.booking.please_input_guardian_fullname);
                return;
            }
            if (!temp.guardianName.isFullName()) {
                snackbar.show(dhyCommand.msg.booking.please_enter_the_correct_guardian_fullname_format);
                return;
            }

            if (!temp.guardianPhoneNumber || !temp.guardianPhoneNumber.trim()) {
                snackbar.show(dhyCommand.msg.booking.please_input_guardian_phone_number);
                return;
            }
            if (!temp.guardianPhoneNumber.isPhoneNumber()) {
                snackbar.show(dhyCommand.msg.booking.please_enter_the_correct_guardian_phone_number_format);
                return;
            }
        }

        return temp;
    }

    selectGender(value) {
        this.setState({
            isMale: value
        })
        this.state.newProfile.gender = value ? 1 : 0;
    }
    _handleDatePickerCancel = () => {
        this.setState(
            {
                toggelDateTimePickerVisible: false
            }
        )
    }
    _handleDatePicked = (date) => {
        this.state.newProfile.bod = date;
        this.setState(
            {
                toggelDateTimePickerVisible: false
            }
        )
    };

    selectCountry(country, reload) {
        if (!this.state.newProfile.country || this.state.newProfile.country.hisCountryId != country.hisCountryId || reload) {
            this.state.newProfile.country = country;
            this.state.newProfile.province = null;
            this.state.newProfile.district = null;
            this.state.newProfile.zone = null;
            this.state.newProfile.listProvincesTemp = [];
            for (var i = 0; i < this.state.listProvinces.length; i++) {
                var item = this.state.listProvinces[i];
                if (item.hisCountryId == this.state.newProfile.country.hisCountryId) {
                    this.state.newProfile.listProvincesTemp.push(item);
                    if (country.name == "Việt Nam" && item.name == "Hà Nội")
                        this.selectProvince(item);
                }
            };
        }
        this.setState({
            toggleModalCountry: false
        })
    }

    selectProvince(province, reload) {

        if (!this.state.newProfile.province || this.state.newProfile.province.hisProvinceId != province.hisProvinceId || reload) {
            this.state.newProfile.province = province;
            this.state.newProfile.district = null;
            this.state.newProfile.zone = null;
            this.state.newProfile.listDistrictTemp = this.state.listDistrict.filter((item) => {
                return this.state.newProfile.province && item.hisProvinceId == this.state.newProfile.province.hisProvinceId
            });
        }
        this.setState({
            toggleModalProvince: false
        })
    }

    selectDistrict(district, reload) {
        if (!this.state.newProfile.district || this.state.newProfile.district.id != district.id || reload) {
            this.state.newProfile.district = district;
            this.state.newProfile.zone = null;
            if (this.state.listZoneTemp[district.id] && this.state.listZoneTemp[district.id].length > 0) {
                this.state.newProfile.listZone = this.state.listZoneTemp[district.id];
            } else {
                locationProvider.getListZone(district.id, (res) => {
                    this.state.listZoneTemp[district.id] = res;
                    this.state.newProfile.listZone = res;
                });
            }
        }
        this.setState({
            toggleModalDistrict: false
        })
    }

    selectZone(zone) {
        this.state.newProfile.zone = zone;
        this.setState({
            toggleModalZone: false
        })
    }
    toggleDatePicker() {
        Keyboard.dismiss();
        try {
            this.setState({
                toggelDateTimePickerVisible: !this.state.toggelDateTimePickerVisible
            })
        } catch (error) {
            console.log(error);
        }
    }
    toggleModalCountry() {
        Keyboard.dismiss();
        this.setState({
            toggleModalCountry: !this.state.toggleModalCountry
        })
    }
    toggleModalProvince() {
        Keyboard.dismiss();
        this.setState({
            toggleModalProvince: !this.state.toggleModalProvince
        })
    }
    toggleModalDistrict() {
        Keyboard.dismiss();
        this.setState({
            toggleModalDistrict: !this.state.toggleModalDistrict
        })
    }
    toggleModalZone() {
        Keyboard.dismiss();
        this.setState({
            toggleModalZone: !this.state.toggleModalZone
        })
    }
    selectVietNam(res) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].name == "Việt Nam")
                this.selectCountry(res[i]);

        }
    }
    componentDidMount() {
        locationProvider.getListCountry((res) => {
            this.state.newProfile.listCountries = res;
            this.selectVietNam(res);
        });
        locationProvider.getListProvince((res) => {
            this.setState({
                listProvinces: res
            },()=>{
                if (this.state.newProfile.country) {
                    this.selectCountry(this.state.newProfile.country, true);
                } else {
                    this.state.newProfile.listProvincesTemp = [];
                }
            })            
        });
        locationProvider.getListDistrict((res) => {
            this.setState({
                listDistrict: res
            }, () => {
                if (this.state.newProfile.province) {
                    this.selectProvince(this.state.newProfile.province, true);
                } else {
                    this.state.newProfile.listDistrictTemp = [];
                }
            })
        });
    }

    renderZone({ item }) {

        return (
            <TouchableOpacity onPress={() => {
                this.click(item)
            }}>
                <Text style={{ padding: 15, fontWeight: 'bold', borderBottomColor: '#0c8c8b', borderBottomWidth: 1 }}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', }}>
                <TextInput
                    autoFocus={true} placeholder="Nhập họ tên" underlineColorAndroid='transparent' style={styles.textinput}
                    onChangeText={(s) => { $this.state.newProfile.fullname = s }}
                />
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <TouchableOpacity onPress={() => {
                        this.selectGender(true);
                    }} >
                        <Image source={this.state.isMale ? require("@images/ic_radio1.png") : require("@images/ic_radio0.png")} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 5, marginRight: 20, fontWeight: 'bold' }}>Nam</Text>
                    <TouchableOpacity onPress={() => {
                        this.selectGender(false);
                    }} >
                        <Image source={this.state.isMale ? require("@images/ic_radio0.png") : require("@images/ic_radio1.png")} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 5, marginRight: 20, fontWeight: 'bold' }}>Nữ</Text>
                </View>
                <TextInput placeholder="Nhập số điện thoại" underlineColorAndroid='transparent' style={styles.textinput}
                    keyboardType='numeric'
                    onChangeText={(s) => { $this.state.newProfile.phoneNumber = s }}
                />
                <TouchableOpacity onPress={() => this.toggleDatePicker()}>
                    <View style={styles.field}>
                        <Text style={{ flex: 1, fontWeight: "bold" }} editable={false}>
                            {this.state.newProfile && this.state.newProfile.bod ? this.state.newProfile.bod.ddmmyyyy() : "Ngày sinh"}
                        </Text>
                        <Image style={{ width: 12, height: 8, marginLeft: 5, position: 'absolute', right: 5 }} source={require('@images/icdropdown.png')} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.toggleModalCountry()}>
                    <View style={styles.field}>
                        <Text style={{ flex: 1, fontWeight: "bold" }} underlineColorAndroid='#0c8c8b' editable={false}>
                            {this.state.newProfile.country ? this.state.newProfile.country.name : "Chọn quốc gia"}
                        </Text>
                        <Image style={{ width: 12, height: 8, marginLeft: 5, position: 'absolute', right: 5 }} source={require('@images/icdropdown.png')} />
                    </View>
                </TouchableOpacity>
                {
                    (!this.state.newProfile.country || this.state.newProfile.country.name == "Việt Nam") ?
                        <View>
                            <TouchableOpacity onPress={() => this.toggleModalProvince()}>
                                <View style={styles.field}>
                                    <Text style={{ flex: 1, fontWeight: "bold" }} underlineColorAndroid='#0c8c8b' editable={false}>
                                        {this.state.newProfile.province ? this.state.newProfile.province.name : "Chọn Tỉnh/Tp"}
                                    </Text>
                                    <Image style={{ width: 12, height: 8, marginLeft: 5, position: 'absolute', right: 5 }} source={require('@images/icdropdown.png')} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleModalDistrict()}>
                                <View style={styles.field}>
                                    <Text style={{ flex: 1, fontWeight: "bold" }} underlineColorAndroid='#0c8c8b' editable={false}>
                                        {this.state.newProfile.district ? this.state.newProfile.district.name : "Chọn Quận/huyện"}
                                    </Text>
                                    <Image style={{ width: 12, height: 8, marginLeft: 5, position: 'absolute', right: 5 }} source={require('@images/icdropdown.png')} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.toggleModalZone()}>
                                <View style={styles.field}>
                                    <Text style={{ flex: 1, fontWeight: "bold" }} underlineColorAndroid='#0c8c8b' editable={false}>
                                        {this.state.newProfile.zone ? this.state.newProfile.zone.name : "Chọn Xã/Phường"}
                                    </Text>
                                    <Image style={{ width: 12, height: 8, marginLeft: 5, position: 'absolute', right: 5 }} source={require('@images/icdropdown.png')} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {
                    (!this.state.newProfile.bod || this.state.newProfile.bod.getAge() <= 6) ? <View >
                        <TextInput placeholder="Nhập họ tên người bảo lãnh" underlineColorAndroid='transparent' style={[styles.textinput, { marginTop: 17 }]}
                            onChangeText={(s) => { $this.state.newProfile.guardianName = s }}
                        />
                        <TextInput placeholder="Nhập số điện thoại người bảo lãnh" underlineColorAndroid='transparent' style={[styles.textinput, { marginTop: 17 }]}
                            keyboardType='numeric'
                            onChangeText={(s) => { $this.state.newProfile.guardianPhoneNumber = s }}
                        />
                    </View> : null
                }

                <Modal isVisible={this.state.toggleModalCountry}
                    onSwipe={() => this.setState({ toggleModalCountry: false })}
                    swipeDirection="left"
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    onBackdropPress={() => this.toggleModalCountry()}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ borderBottomWidth: 2, borderBottomColor: "#0c8c8b", flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ fontWeight: 'bold', padding: 10, flex: 1 }}>
                                Chọn quốc gia
                            </Text>
                            <TouchableOpacity onPress={() => this.toggleModalCountry()}>
                                <View style={{ padding: 10 }}>
                                    <ScaleImage source={require("@images/ic_close.png")} width={15}></ScaleImage>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {!this.state.newProfile.listCountries || this.state.newProfile.listCountries.length == 0 ? <View style={{ flex: 1 }}>
                            <Text style={{ fontStyle: 'italic', textAlign: 'center', padding: 10 }}>Không có quốc gia nào</Text></View> : null}

                        <FlatList
                            keyExtractor={(item, index) => index}
                            data={this.state.newProfile.listCountries}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => { this.selectCountry(item) }}>
                                    <Text style={{ padding: 15, fontWeight: 'bold', borderBottomColor: '#0c8c8b', borderBottomWidth: 1 }}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </Modal>
                <Modal isVisible={this.state.toggleModalProvince}
                    onSwipe={() => this.setState({ toggleModalProvince: false })}
                    swipeDirection="left"
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    onBackdropPress={() => this.toggleModalProvince()}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ borderBottomWidth: 2, borderBottomColor: "#0c8c8b", flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ fontWeight: 'bold', padding: 10, flex: 1 }}>
                                Chọn tỉnh/ tp
                            </Text>
                            <TouchableOpacity onPress={() => this.toggleModalProvince()}>
                                <View style={{ padding: 10 }}>
                                    <ScaleImage source={require("@images/ic_close.png")} width={15}></ScaleImage>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {!this.state.newProfile.listProvincesTemp || this.state.newProfile.listProvincesTemp.length == 0 ? <View style={{ flex: 1 }}>
                            <Text style={{ fontStyle: 'italic', textAlign: 'center', padding: 10 }}>Không có tỉnh nào</Text></View> : null}

                        <FlatList
                            data={this.state.newProfile.listProvincesTemp}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => { this.selectProvince(item) }}>
                                    <Text style={{ padding: 15, fontWeight: 'bold', borderBottomColor: '#0c8c8b', borderBottomWidth: 1 }}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </Modal>
                <Modal isVisible={this.state.toggleModalDistrict}
                    onSwipe={() => this.setState({ toggleModalDistrict: false })}
                    swipeDirection="left"
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    onBackdropPress={() => this.toggleModalDistrict()}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ borderBottomWidth: 2, borderBottomColor: "#0c8c8b", flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ fontWeight: 'bold', padding: 10, flex: 1 }}>
                                Chọn quận/ huyện
                            </Text>
                            <TouchableOpacity onPress={() => this.toggleModalDistrict()}>
                                <View style={{ padding: 10 }}>
                                    <ScaleImage source={require("@images/ic_close.png")} width={15}></ScaleImage>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {!this.state.newProfile.listDistrictTemp || this.state.newProfile.listDistrictTemp.length == 0 ? <View style={{ flex: 1 }}>
                            <Text style={{ fontStyle: 'italic', textAlign: 'center', padding: 10 }}>Không có huyện nào</Text></View> : null}

                        <FlatList
                            data={this.state.newProfile.listDistrictTemp}
                            keyExtractor={(item, index) => index}

                            extraData={this.state}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => { this.selectDistrict(item) }}>
                                    <Text style={{ padding: 15, fontWeight: 'bold', borderBottomColor: '#0c8c8b', borderBottomWidth: 1 }}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </Modal>
                <Modal isVisible={this.state.toggleModalZone}
                    onSwipe={() => this.setState({ toggleModalZone: false })}
                    swipeDirection="left"
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    onBackdropPress={() => this.toggleModalZone()}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ borderBottomWidth: 2, borderBottomColor: "#0c8c8b", flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ fontWeight: 'bold', padding: 10, flex: 1 }}>
                                Chọn xã/ phường
                            </Text>
                            <TouchableOpacity onPress={() => this.toggleModalZone()}>
                                <View style={{ padding: 10 }}>
                                    <ScaleImage source={require("@images/ic_close.png")} width={15}></ScaleImage>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {!this.state.newProfile.listZone || this.state.newProfile.listZone.length == 0 ? <View style={{ flex: 1 }}>
                            <Text style={{ fontStyle: 'italic', textAlign: 'center', padding: 10 }}>Không có xã nào</Text></View> : null}

                        <FlatList
                            data={
                                this.state.newProfile.listZone
                            }
                            extraData={this.state}
                            keyExtractor={(item, index) => index}

                            renderItem={({ item }) => <TouchableOpacity onPress={() => { this.selectZone(item) }}>
                                <Text style={{ padding: 15, fontWeight: 'bold', borderBottomColor: '#0c8c8b', borderBottomWidth: 1 }}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                            }
                        />
                    </View>
                </Modal>
                <DateTimePicker
                    isVisible={this.state.toggelDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._handleDatePickerCancel}
                    maximumDate={new Date()}
                    cancelTextIOS={dhyCommand.cancel}
                    confirmTextIOS={dhyCommand.confirm}
                    date={this.state.newProfile.bod ? this.state.newProfile.bod : new Date()}
                />
            </View>
        )
    };
}
const styles = StyleSheet.create({
    field: {
        flexDirection: 'row', alignItems: 'center', marginTop: 17, borderColor: dhyCommand.colors.primaryColor, borderWidth: 1, padding: 7
    }, textinput:
        { borderColor: dhyCommand.colors.primaryColor, borderWidth: 1, padding: padding, paddingLeft: 7 }
})
export default connect(null, null, null, { withRef: true })(AddBookingNoProfile);