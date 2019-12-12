import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ScaledImage from 'mainam-react-native-scaleimage';
import drugProvider from '@data-access/drug-provider'
import constants from "@resources/strings";
import snackbar from "@utils/snackbar-utils";
import ActivityPanel from "@components/ActivityPanel";
import { connect } from "react-redux";

const devices_width = Dimensions.get('window').width
class InputLocationScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }
    componentDidMount() {
        let dataLocation = this.props.navigation.getParam('dataLocation', null)
        console.log('dataLocation: ', dataLocation);
        let districts = {}
        districts.name = dataLocation && dataLocation.district ? dataLocation.district : ''
        districts.id = dataLocation && dataLocation.districtId ? dataLocation.districtId : ''
        let provinces = {}
        provinces.countryCode = dataLocation && dataLocation.province ? dataLocation.province : ''
        provinces.id = dataLocation && dataLocation.provineId ? dataLocation.provineId : ''
        let zone = {}
        zone.name = dataLocation && dataLocation.zone ? dataLocation.zone : '',
            zone.id = dataLocation && dataLocation.zoneId ? dataLocation.zoneId : ''

        this.setState({
            ownerName: dataLocation && dataLocation.ownerName ? dataLocation.ownerName : '',
            districts: districts,
            ownerId: dataLocation && dataLocation.ownerId ? dataLocation.ownerId : '',
            provinces: provinces,
            telephone: dataLocation && dataLocation.phone ? dataLocation.phone : '',
            textAddition: dataLocation && dataLocation.village ? dataLocation.village : '',
            zone: zone
        })
        console.log(districts, provinces)
    }
    renderAddress = () => {
        let item = this.state.location
        let district = item.district ? item.district : null
        let province = item.province ? item.province : null
        let zone = item.zone ? item.zone : ''
        let village = item.village ? item.village : null
        console.log(district, province, zone, village)
        if (district && province && zone && village) {
            return (`${village}, ${zone}, ${district}, ${province}`)


        }
        else if (district && province && zone) {
            return (`${zone}, ${district}, ${province}`)

        }
        else if (district && province && village) {
            return (`${village}, ${district}, ${province}`)

        }
        else if (district && province) {
            return (`${district},${province},`)

        }

        else if (province && village) {
            return (`${village}, ${province}`)

        }
        else if (province) {
            return (`${province}`)

        }
        else if (village) {
            return (`${village}`)

        } else if (!village && !district && !province && !zone) {
            return ('')
        }
    }
    onAddLocation = () => {
        let { ownerName, districts, provinces, telephone, textAddition, zone } = this.state
        let ownerId = this.props.userApp.currentUser.id
        if (!ownerName) {
            snackbar.show('Họ và tên không được để trống.', 'danger')
            return
        }
        if (!telephone) {
            snackbar.show('Số điện thoại không được để trống.', 'danger')
            return
        }
        if (!telephone.match(/^(\+?84|0|\(\+?84\))[1-9]\d{8,9}$/g)) {
            snackbar.show('Số điện thoại không đúng định dạng.', 'danger')
            return
        }
        if (!provinces) {
            snackbar.show('Bạn chưa chọn Tỉnh/Thành phố.', 'danger')
            return
        }
        if (!districts) {
            snackbar.show('Bạn chưa chọn Quận/Huyện.', 'danger')
            return
        }
        if (!zone) {
            snackbar.show('Bạn chưa chọn Phường/Xã', 'danger')
            return
        }
        let data =
        {
            "district": districts.name,
            "districtId": districts.id,
            "ownerId": ownerId,
            "ownerName": ownerName,
            "phone": telephone,
            "province": provinces.countryCode,
            "provinceId": provinces.id,
            "village": textAddition,
            "zone": zone.name,
            "zoneId": zone.id
        }
        drugProvider.addLocation(data).then(res => {
            if (res) {
                let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
                if (callback) {
                    callback(res.data);
                    this.props.navigation.pop();
                }
            }
        }).catch(e => {
                snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại','danger')
        })
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
            this.setState({ zone, zoneError })
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
    render() {
        return (
            <ActivityPanel
                icBack={require('@images/new/left_arrow_white.png')}
                title={'Nhập địa chỉ'}
                iosBarStyle={'light-content'}
                actionbarStyle={styles.actionbarStyle}
                style={styles.activityPanel}
                containerStyle={styles.container}
                menuButton={<TouchableOpacity style={{ padding: 5 }} onPress={this.onAddLocation}>
                    <Text style={styles.txtSave}>{constants.actionSheet.save}</Text>
                </TouchableOpacity>}
                titleStyle={styles.txTitle}
            >
                <ScaledImage width={devices_width} source={require('@images/new/drug/ic_bg_find_drug.png')}></ScaledImage>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.viewName}>
                        <Text style={styles.txName}>Họ và tên</Text>
                        <TextInput value={this.state.ownerName} onChangeText={text => this.setState({ ownerName: text })} multiline={true} style={styles.inputName} placeholder={'Nhập họ và tên'}></TextInput>
                    </View>
                    <View style={styles.viewName}>
                        <Text style={styles.txName}>Số điện thoại</Text>
                        <TextInput value={this.state.telephone} onChangeText={text => this.setState({ telephone: text })} multiline={true} keyboardType={'numeric'} style={styles.inputName} placeholder={'Nhập số điện thoại'}></TextInput>
                    </View>
                    <TouchableOpacity onPress={this.onSelectProvince} style={styles.viewLocation}>
                        <Text style={styles.txName}>Tỉnh/Thành phố</Text>
                        <View style={styles.viewAddress}>
                            <Text style={styles.inputAdress}>{this.state.provinces && this.state.provinces.countryCode ? this.state.provinces.countryCode : 'Chọn Tỉnh/Thành phố'}</Text>
                            <ScaledImage height={10} source={require('@images/new/drug/ic_btn_location.png')}></ScaledImage>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onSelectDistrict} style={styles.viewLocation}>
                        <Text style={styles.txName}>Quận/Huyện</Text>
                        <View style={styles.viewAddress}>
                            <Text style={styles.inputAdress}>{this.state.districts && this.state.districts.name ? this.state.districts.name : 'Chọn Quận/Huyện'}</Text>
                            <ScaledImage height={10} source={require('@images/new/drug/ic_btn_location.png')}></ScaledImage>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onSelectZone} style={styles.viewLocation}>
                        <Text style={styles.txName}>Phường/Xã</Text>
                        <View style={styles.viewAddress}>
                            <Text style={styles.inputAdress} >{this.state.zone && this.state.zone.name ? this.state.zone.name : 'Chọn Phường/Xã'}</Text>
                            <ScaledImage height={10} source={require('@images/new/drug/ic_btn_location.png')}></ScaledImage>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.viewName}>
                        <Text style={styles.txName}>Địa chỉ</Text>
                        <TextInput value={this.state.textAddition}
                            onChangeText={text => this.setState({ textAddition: text })} multiline={true} style={styles.inputName} placeholder={'Nhập địa chỉ'}></TextInput>
                    </View>
                    <View style={styles.viewBottom}></View>
                </ScrollView>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5'
    },
    viewBottom: {
        height: 50
    },
    viewName: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    txName: {
        fontSize: 16,
        color: '#808080',
        textAlign: 'left'
    },
    inputName: {
        width: '70%',
        minHeight: 48,
        textAlign: 'right',
        color: '#000'
    },
    viewLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        minHeight: 48,
    },
    viewAddress: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '70%',
        padding: 5
    },
    inputAdress: {
        textAlign: 'right',
        color: '#000',
        marginRight: 5,
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
    txTitle: { color: '#fff', marginLeft: 50, fontSize: 18 },

})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
    };
}
export default connect(mapStateToProps)(InputLocationScreen);