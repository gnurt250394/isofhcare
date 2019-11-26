import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
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
class SelectAddressScreen extends Component {
    constructor(props) {
        super(props);
        let provinces = this.props.navigation.getParam('provinces')
        let districts = this.props.navigation.getParam('districts')
        let zone = this.props.navigation.getParam('zone')
        let address = this.props.navigation.getParam('address')
        this.state = {
            isLoading: false,
            provinces,
            districts,
            zone,
            address
        };
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
            snackbar.show('Bạn chưa chọn Tỉnh/Thành phố')
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
            this.setState({ zone, zoneError })
        } else {
            this.setState({ zone, zoneError });
        }
    }
    onSelectZone = () => {
        if (!this.state.provinces) {
            snackbar.show("Bạn chưa chọn Tỉnh/Thành phố")
            return
        }
        if (!this.state.districts) {
            snackbar.show("Bạn chưa chọn Quận/Huyện")
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
    onChangeText = type => text => {
        this.setState({ [type]: text });
    };

    onCreateProfile = () => {
        const { provinces, districts, zone, address } = this.state
        Keyboard.dismiss();

        if (!provinces) {
            snackbar.show("Bạn chưa chọn Tỉnh/Thành phố")
            return
        }
        if (!districts) {
            snackbar.show("Bạn chưa chọn Quận/Huyện")
            return
        }
        if (!zone) {
            snackbar.show("Bạn chưa chọn Xã/Phường")
            return
        }
        let onSelected = this.props.navigation.getParam('onSelected')
        this.props.navigation.pop()
        if (onSelected) onSelected(provinces, districts, zone, address)


    }
    render() {
        const { isLoading } = this.state
        return (
            <ActivityPanel
                title={'Nhập địa chỉ'}
                isLoading={isLoading}
                menuButton={<TouchableOpacity
                    onPress={this.onCreateProfile}
                    style={styles.buttonSave}>
                    <Text style={styles.txtSave}>Lưu</Text>
                </TouchableOpacity>}
                titleStyle={styles.titleStyle}
                containerStyle={{
                    backgroundColor: '#E5E5E5',
                }}
            >
                <Form ref={ref => (this.form = ref)} style={[{ flex: 1 }]}>
                    <Field style={[styles.mucdichkham,]}>
                        <Text style={styles.mdk}>{'Tỉnh/Thành phố'}</Text>
                        <Field>
                            <TextField
                                hideError={true}
                                onPress={this.onSelectProvince}
                                editable={false}
                                multiline={true}
                                inputStyle={[
                                    styles.ktq, { minHeight: 41 }, this.state.provinces && this.state.provinces.countryCode ? {} : { color: '#8d8d8d' }
                                ]}
                                errorStyle={styles.errorStyle}
                                value={this.state.provinces && this.state.provinces.countryCode ? this.state.provinces.countryCode : 'Tỉnh/Thành phố'}
                                autoCapitalize={"none"}
                                // underlineColorAndroid="transparent"
                                autoCorrect={false}
                            />
                        </Field>

                    </Field>

                    <Field style={[styles.mucdichkham,]}>
                        <Text style={styles.mdk}>Quận/Huyện</Text>
                        <Field>
                            <TextField
                                hideError={true}

                                multiline={true}
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
                    <Field style={[styles.mucdichkham,]}>
                        <Text style={styles.mdk}>Xã/Phường</Text>
                        <Field>
                            <TextField
                                hideError={true}
                                multiline={true}
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

                    <Field style={[styles.mucdichkham,]}>
                        <Text style={styles.mdk}>Địa chỉ</Text>
                        <TextField
                            hideError={true}
                            onValidate={(valid, messages) => {
                                if (valid) {
                                    this.setState({ addressError: "" });
                                } else {
                                    this.setState({ addressError: messages });
                                }
                            }}
                            placeholder={'Nhập địa chỉ'}
                            // multiline={true}
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
                </Form>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
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
    mucdichkham: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        backgroundColor: '#FFF',
        borderBottomColor: '#BBB',
        borderBottomWidth: 0.6,
    },
    mdk: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000",
    },

    ktq: {
        fontSize: 12,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000",
        paddingHorizontal: 10,
        minHeight: 41,
        textAlign: 'right'

    },
    errorStyle: {
        color: "red",
        marginLeft: 13
    },
});
export default connect()(SelectAddressScreen);
