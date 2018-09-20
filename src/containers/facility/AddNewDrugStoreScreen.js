import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, Text, FlatList, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import facilityProvider from '@data-access/facility-provider';
import Dash from 'mainam-react-native-dash-view';
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
import imageProvider from '@data-access/image-provider';
import ImagePicker from 'mainam-react-native-select-image';
import snackbar from '@utils/snackbar-utils'
import stringUtils from 'mainam-react-native-string-utils';
import locationProvider from '@data-access/location-provider';

const DEVICE_WIDTH = Dimensions.get("window").width;
class AddNewDrugStoreScreen extends Component {
    constructor(props) {
        super(props)
        let facility = this.props.navigation.getParam("facility", undefined);
        let editMode = facility ? true : false;
        if (!facility)
            facility = {
                facility: {
                    website: "",
                    address: "",
                    phone: "",
                    code: "",
                    pharmacist: ""
                }
            };
        let province = facility.province;
        let imageUris = facility.images;
        if (!imageUris)
            imageUris = [];
        imageUris.forEach((item) => {
            item.uri = item.url ? item.url.absoluteUrl() : "";
        });

        let logo;

        if (facility.facility.logo) {
            logo = {
                uri: facility.facility.logo.absoluteUrl(),
                url: facility.facility.logo
            }
        }

        let place;
        if (facility.facility.latitude && facility.facility.longitude) {
            place = {
                latitude: facility.facility.latitude,
                longitude: facility.facility.longitude
            }
        }

        this.state = {
            imageUris: imageUris,
            website: facility.facility.website,
            phone: facility.facility.phone,
            name: facility.facility.name,
            address: facility.facility.address,
            pharmacist: facility.facility.pharmacist,
            listProvinces: [],
            editMode,
            facility,
            province,
            logo,
            place,
            isGPP: facility.facility.gpp == 1,
            licenseNo: facility.facility.code,
        }
    }
    componentDidMount() {
        locationProvider.getListProvince((s, e) => {
            if (s) {
                for (var i = 0; i < s.length; i++) {
                    if (s[i].name == "Hà Nội") {
                        this.setState({ province: s[i] });
                    }
                }
                this.setState({
                    listProvinces: s
                });
            }
        })
    }

    removeImage(index) {
        var imageUris = this.state.imageUris;
        imageUris.splice(index, 1);
        this.setState({ imageUris });
    }


    openSearchModal() {
        locationProvider.pickLocation((s, e) => {
            if (s) {
                this.setState({ place: s });
            }
        })
    }

    selectImage() {
        if (this.imagePicker) {
            this.imagePicker.open(false, 200, 200, image => {
                let imageUris = this.state.imageUris;
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
                this.setState({ imageUris: [...imageUris] });
            });
        }
    }
    selectLogo() {
        if (this.imagePicker) {
            this.imagePicker.open(true, 200, 200, image => {

                if (this.state.logo && this.state.logo.uri == image.path)
                    return;
                this.setState({
                    logo:
                    {
                        uri: image.path,
                        loading: true
                    }
                }, () => {
                    imageProvider.upload(image.path, (s, e) => {
                        let logo = this.state.logo;
                        if (!logo) {
                            return;
                        }
                        if (s.success && s.data.code == 0 && s.data.data && s.data.data.images && s.data.data.images.length > 0) {
                            if (logo.uri == s.uri) {
                                logo.loading = false;
                                logo.url = s.data.data.images[0].image;
                                logo.thumbnail = s.data.data.images[0].thumbnail;

                                this.setState({
                                    logo
                                });
                            }
                        } else {
                            if (logo.uri == s.uri) {
                                logo.error = true;
                                this.setState({
                                    logo
                                });
                            }
                        }
                    });
                });

            });
        }
    }
    create() {
        if (!this.state.name || this.state.name.trim() == "") {
            snackbar.show('Vui lòng nhập tên nhà thuốc');
            return;
        }
        if (!this.state.licenseNo) {
            snackbar.show("Vui lòng nhập số giấy phép");
            return;
        }
        if (this.state.website && !this.state.website.isUrl()) {
            snackbar.show('Vui lòng nhập đúng định dạng địa chỉ trang web');
            return;
        }
        if (!this.state.phone) {
            snackbar.show('Vui lòng nhập số điện thoại cho nhà thuốc');
            return;
        }
        if (!this.state.phone.isPhoneNumber()) {
            snackbar.show("Vui lòng nhập đúng định dạng số điện thoại");
            return;
        }
        if (!this.state.address || this.state.address.trim() == "") {
            snackbar.show('Vui lòng nhập địa chỉ nhà thuốc');
            return;
        }
        if (!this.state.logo) {
            snackbar.show('Vui lòng chọn logo cho phòng khám');
            return;
        }
        if (this.state.logo.error) {
            snackbar.show('Ảnh logo tải lên bị lỗi, vui lòng chọn lại');
            return;
        }
        if (this.state.logo.loading) {
            snackbar.show('Ảnh logo đang được tải lên, vui lòng chờ');
            return;
        }
        if (this.state.imageUris.length == 0) {
            snackbar.show('Vui lòng chọn ảnh cho nhà thuốc');
            return;
        }
        for (var i = 0; i < this.state.imageUris.length; i++) {
            if (this.state.imageUris[i].loading) {
                snackbar.show('Một số ảnh đang được tải lên. Vui lòng chờ');
                return;
            }
            if (this.state.imageUris[i].error) {
                snackbar.show('Ảnh tải lên bị lỗi, vui lòng kiểm tra lại');
                return;
            }
        }
        if (!this.state.province) {
            snackbar.show("Vui lòng chọn tỉnh của nhà thuốc");
            return;
        }
        if (!this.state.place) {
            snackbar.show("Vui lòng chọn vị trí nhà thuốc trên bản đồ");
            return;
        }

        this.setState({ isLoading: true }, () => {
            let listImageUrl = [];
            this.state.imageUris.forEach((item, index) => {
                listImageUrl.push(item.url);
            });

            if (!this.state.facility.facility.id)
                facilityProvider.createDrugStore(this.state.name.trim(), this.state.website.trim(), this.state.phone.trim(), this.state.address.trim(), this.state.place, this.state.logo.url, listImageUrl, this.state.licenseNo, this.state.pharmacist, this.state.isGPP, this.state.province.id, this.props.userApp.currentUser.id, (s, e) => {
                    this.setState({ isLoading: false });
                    if (s) {
                        switch (s.code) {
                            case 0:
                                this.props.navigation.navigate('myFacility', { facility: s.data });
                                snackbar.show("Thêm nhà thuốc thành công", 'success');
                                break;
                            case 2:
                                snackbar.show("Đã tồn tại nhà thuốc với tên này trên hệ thống", 'danger');
                                break;
                        }
                        return;
                    }
                    snackbar.show("Thêm phòng nhà thuốc thành công", 'danger');
                });
            else
                facilityProvider.updateDrugStore(this.state.facility.facility.id, this.state.name.trim(), this.state.website.trim(), this.state.phone.trim(), this.state.address.trim(), this.state.place, this.state.logo.url, listImageUrl, this.state.licenseNo, this.state.pharmacist, this.state.isGPP, this.state.province.id, (s, e) => {
                    this.setState({ isLoading: false });
                    if (s) {
                        switch (s.code) {
                            case 0:
                                this.props.navigation.navigate('myFacility', { facility: s.data });
                                snackbar.show("Cập nhật nhà thuốc thành công", 'success');
                                break;
                            case 2:
                                snackbar.show("Đã tồn tại nhà thuốc với tên này trên hệ thống", 'danger');
                                break;
                        }
                        return;
                    }
                    snackbar.show("Cập nhật nhà thuốc không thành công", 'danger');
                });
        });
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title={this.state.editMode ? "CHỈNH SỬA NHÀ THUỐC" : "THÊM MỚI NHÀ THUỐC"} showFullScreen={true} isLoading={this.state.isLoading}>
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ padding: 10, flex: 1 }}
                        keyboardShouldPersistTaps="always">
                        <View style={{
                            padding: 10,
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: "#9b9b9b"
                        }}>
                            <TextInput
                                onChangeText={(s) => this.setState({ name: s })}
                                underlineColorAndroid="transparent"
                                style={{
                                    padding: 0
                                }}
                                value={this.state.name}
                                placeholder={"Tên nhà thuốc"}
                            />
                        </View>
                        <View style={{
                            marginTop: 15,
                            padding: 10,
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: "#9b9b9b"
                        }}>
                            <TextInput
                                onChangeText={(s) => this.setState({ licenseNo: s })}
                                underlineColorAndroid="transparent"
                                style={{
                                    padding: 0
                                }}
                                value={this.state.licenseNo}
                                placeholder={"Số giấy phép"}
                            />
                        </View>
                        <View style={{
                            marginTop: 15,
                            padding: 10,
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: "#9b9b9b"
                        }}>
                            <TextInput
                                onChangeText={(s) => this.setState({ pharmacist: s })}
                                underlineColorAndroid="transparent"
                                style={{
                                    padding: 0
                                }}
                                value={this.state.pharmacist}
                                placeholder={"Dược sĩ"}
                            />
                        </View>
                        <View style={{
                            marginTop: 15,
                            padding: 10,
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: "#9b9b9b"
                        }}>
                            <TextInput
                                onChangeText={(s) => this.setState({ website: s })}
                                underlineColorAndroid="transparent"
                                value={this.state.website}
                                style={{
                                    padding: 0
                                }}
                                placeholder={"Website"}
                            />
                        </View>
                        <View style={{
                            marginTop: 15,
                            padding: 10,
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: "#9b9b9b"
                        }}>
                            <TextInput
                                onChangeText={(s) => this.setState({ phone: s })}
                                underlineColorAndroid="transparent"
                                value={this.state.phone}
                                style={{
                                    padding: 0
                                }}
                                placeholder={"Số điện thoại"}
                            />
                        </View>

                        <TouchableOpacity style={{
                            marginTop: 15,
                            padding: 10,
                            borderStyle: "solid",
                            borderWidth: 1,
                            flexDirection: 'row',
                            borderColor: "#9b9b9b"
                        }} onPress={() => { this.setState({ isGPP: !this.state.isGPP }) }}>
                            {this.state.isGPP ?
                                <ScaledImage source={require("@images/ic_check_tick.png")} width={22} /> :
                                <ScaledImage source={require("@images/ic_check.png")} width={22} />
                            }
                            <Text
                                style={{
                                    marginLeft: 3,
                                    padding: 0
                                }}
                            >Tiêu chuẩn GPP</Text>
                        </TouchableOpacity>

                        <View style={{
                            marginTop: 15,
                            padding: 10,
                            borderStyle: "solid",
                            borderWidth: 1,
                            borderColor: "#9b9b9b"
                        }}>
                            <TextInput
                                onChangeText={(s) => this.setState({ address: s })}
                                underlineColorAndroid="transparent"
                                style={{
                                    padding: 0
                                }}
                                placeholder={"Địa chỉ"}
                                value={this.state.address}
                            />
                        </View>
                        <TouchableOpacity onPress={() => this.setState({ toggleProvince: true })} style={{
                            marginTop: 15,
                            padding: 10,
                            borderStyle: "solid",
                            borderWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderColor: "#9b9b9b"
                        }}>
                            {this.state.province ?
                                <Text style={{
                                    fontWeight: 'bold', flex: 1,
                                    padding: 0
                                }}>{this.state.province.name}</Text> :
                                <Text style={{
                                    padding: 0, flex: 1,
                                }}>Chọn Tỉnh/TP</Text>
                            }
                            <ScaledImage height={7} source={require("@images/icdropdown.png")} />
                        </TouchableOpacity>
                        <View style={{
                            marginTop: 15
                        }}>
                            <Text style={{ fontWeight: 'bold' }}>Logo</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                                {
                                    this.state.logo ?
                                        <TouchableOpacity style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1 }}>
                                            <Image source={{ uri: this.state.logo.uri }} resizeMode="cover" style={{ width: 100, height: 100, backgroundColor: '#000' }} />
                                            {
                                                this.state.logo.error ?
                                                    <View style={{ position: 'absolute', left: 30, top: 30 }} >
                                                        <ScaledImage source={require("@images/ic_warning.png")} width={40} />
                                                    </View> :
                                                    this.state.logo.loading ?
                                                        < View style={{ position: 'absolute', left: 30, top: 30, backgroundColor: '#FFF', borderRadius: 20 }} >
                                                            <ScaledImage source={require("@images/loading.gif")} width={40} />
                                                        </View>
                                                        : null
                                            }
                                            <TouchableOpacity onPress={() => { this.setState({ logo: null }) }} style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#FFFFFF70', padding: 1, borderRadius: 5, margin: 2 }} >
                                                <ScaledImage source={require("@images/icclose.png")} width={12} />
                                            </TouchableOpacity>
                                        </TouchableOpacity> :
                                        <TouchableOpacity onPress={this.selectLogo.bind(this)} style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <ScaledImage width={40} source={require("@images/ic_add_image.png")} />
                                            <Text>Thêm ảnh</Text>
                                        </TouchableOpacity>
                                }
                            </View>
                            <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Hình ảnh <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(Tối đa 4 ảnh)</Text></Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                                {
                                    this.state.imageUris.map((item, index) => <TouchableOpacity style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1 }}>
                                        <Image source={{ uri: item.uri }} resizeMode="cover" style={{ width: 100, height: 100, backgroundColor: '#000' }} />
                                        {
                                            item.error ?
                                                <View style={{ position: 'absolute', left: 30, top: 30 }} >
                                                    <ScaledImage source={require("@images/ic_warning.png")} width={40} />
                                                </View> :
                                                item.loading ?
                                                    < View style={{ position: 'absolute', left: 30, top: 30, backgroundColor: '#FFF', borderRadius: 20 }} >
                                                        <ScaledImage source={require("@images/loading.gif")} width={40} />
                                                    </View>
                                                    : null
                                        }
                                        <TouchableOpacity onPress={this.removeImage.bind(this, index)} style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#FFFFFF70', padding: 1, borderRadius: 5, margin: 2 }} >
                                            <ScaledImage source={require("@images/icclose.png")} width={12} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>)
                                }
                                {
                                    !this.state.imageUris || this.state.imageUris.length < 4 ?
                                        <TouchableOpacity onPress={this.selectImage.bind(this)} style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <ScaledImage width={40} source={require("@images/ic_add_image.png")} />
                                            <Text>Thêm ảnh</Text>
                                        </TouchableOpacity> : null
                                }
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={this.openSearchModal.bind(this)}
                            style={{
                                width: 230, padding: 5,
                                marginTop: 12,
                                alignItems: 'center',
                                backgroundColor: "#2f5eac",
                                flexDirection: 'row'
                            }}>
                            <ScaledImage source={require("@images/ic_phongkham1.png")} height={36} style={{ marginRight: 12 }} />
                            <Text style={{
                                width: 161,
                                fontSize: 16,
                                fontWeight: "600",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                color: '#FFF'
                            }}>Đặt vị trí trên bản đồ</Text></TouchableOpacity>
                        {this.state.place ?
                            <ScaledImage uri={"http://maps.google.com/maps/api/staticmap?zoom=15&markers=" + this.state.place.latitude + "," + this.state.place.longitude + "&size=500x200"} width={DEVICE_WIDTH - 20} /> : null
                        }
                        <View style={{ height: 50 }}></View>
                    </ScrollView>
                    <ImagePicker ref={ref => this.imagePicker = ref} />
                    <TouchableOpacity style={{
                        width: 375,
                        margin: 10,
                        maxWidth: DEVICE_WIDTH - 20,
                        height: 51,
                        borderRadius: 4,
                        backgroundColor: "#00977c", alignItems: 'center', justifyContent: 'center'
                    }} onPress={this.create.bind(this)}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: '#FFF'
                        }}>{this.state.editMode ? "CẬP NHẬT" : "THÊM MỚI"}</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    isVisible={this.state.toggleProvince}
                    onBackdropPress={() => this.setState({ toggleProvince: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                                CHỌN TỈNH
                            </Text>
                        </View>
                        <FlatList
                            style={{ padding: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            data={this.state.listProvinces}
                            ListHeaderComponent={() =>
                                !this.state.listProvinces || this.state.listProvinces.length == 0 ?
                                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                                        <Text style={{ fontStyle: 'italic' }}>Không tìm thấy dữ liệu tỉnh thành phố</Text>
                                    </View>
                                    : <Dash style={{ height: 1, width: '100%', flexDirection: 'row' }} dashColor="#00977c" />
                            }
                            ListFooterComponent={() => <View style={{ height: 50 }}></View>}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity onPress={() => { this.setState({ province: item, toggleProvince: false }) }}>
                                    <Text style={{ padding: 10, fontWeight: '300', color: this.state.province == item ? "red" : "black" }}>{item.name}</Text>
                                    <Dash style={{ height: 1, width: '100%', flexDirection: 'row' }} dashColor="#00977c" />
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </Modal>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(AddNewDrugStoreScreen);