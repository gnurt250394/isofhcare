import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, Text, FlatList, TouchableOpacity, ScrollView, Image, Dimensions, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import facilityProvider from '@data-access/facility-provider';
import Dash from 'mainam-react-native-dash-view';
import Modal from "@components/modal";
import stylemodal from "@styles/modal-style";
import specialistProvider from '@data-access/specialist-provider';
import imageProvider from '@data-access/image-provider';
import ImagePicker from 'mainam-react-native-select-image';
import snackbar from '@utils/snackbar-utils'
import stringUtils from 'mainam-react-native-string-utils';
import locationProvider from '@data-access/location-provider';
import clientUtils from '@utils/client-utils';
import { Card } from 'native-base';
import ImageLoad from 'mainam-react-native-image-loader';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
const DEVICE_WIDTH = Dimensions.get("window").width;
class AddNewClinicScreen extends Component {
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
                    emergencyContact: ""
                }
            };

        let listSpecialist = facility.specialists;
        if (!listSpecialist)
            listSpecialist = [];

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
                longitude: facility.facility.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05
            }
        }


        this.state = {
            listSpecialist,
            listSpecialistSuggesh: [],
            imageUris: imageUris,
            website: facility.facility.website ? facility.facility.website : "",
            phone: facility.facility.phone ? facility.facility.phone : "",
            phone_emergency: facility.facility.emergencyContact ? facility.facility.emergencyContact : "",
            name: facility.facility.name ? facility.facility.name : "",
            address: facility.facility.address ? facility.facility.address : "",
            listProvinces: [],
            editMode,
            facility,
            province,
            logo,
            place
        }

    }
    componentDidMount() {
        specialistProvider.saveAllSpecialist();
        locationProvider.getListProvince((s, e) => {
            if (s) {
                for (var i = 0; i < s.length; i++) {
                    if (s[i].name == "H?? N???i") {
                        this.setState({ province: s[i] });
                    }
                }
                this.setState({
                    listProvinces: s
                });
            }
        })
    }

    onSubmitSpecialist() {
        if (this.state.listSpecialistSuggesh && this.state.listSpecialistSuggesh.length > 0) {
            this.onClickSpecialist(this.state.listSpecialistSuggesh[0]);
            return;
        }
        snackbar.show("Kh??ng t??m th???y chuy??n khoa n??o c?? dung b???n nh???p");
    }
    removeImage(index) {
        var imageUris = this.state.imageUris;
        imageUris.splice(index, 1);
        this.setState({ imageUris });
    }
    removeSpecialist(index) {
        var listSpecialist = this.state.listSpecialist;
        listSpecialist.splice(index, 1);
        this.setState({ listSpecialist });
    }
    onChangeTextSpecialist(s) {
        this.setState({ newSpecialist: s, listSpecialistSuggesh: [] }, () => {
            specialistProvider.search(s, 5, (x) => {
                this.setState({ listSpecialistSuggesh: x });
            })
        });
    }

    openSearchModal() {
        locationProvider.pickLocation(this.state.place, (s, e) => {
            if (s) {
                s.latitudeDelta = 0.05;
                s.longitudeDelta = 0.05;
                this.setState({ place: s });
            }
        })
    }


    onClickSpecialist(item) {
        let temp;
        this.state.listSpecialist.forEach((it, index) => {
            if (it.id == item.id) {
                temp = it;
            }
        });
        var listSpecialist = this.state.listSpecialist;
        if (!temp) {
            listSpecialist.push(item);
        }
        this.setState({ listSpecialist, listSpecialistSuggesh: [], newSpecialist: '' }, () => {
            setTimeout(() => {
                this.inputSpecialist.focus();
            }, 100);
        });
    }
    selectImage() {
        if (this.imagePicker) {
            this.imagePicker.open(false, 200, 200, image => {
                setTimeout(() => {
                    Keyboard.dismiss();
                }, 500);
                let imageUris = this.state.imageUris;
                let temp = null;
                imageUris.forEach((item) => {
                    if (item.uri == image.path)
                        temp = item;
                })
                if (!temp) {
                    imageUris.push({ uri: image.path, loading: true });
                    imageProvider.upload(image.path,image.mime, (s, e) => {
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
                setTimeout(() => {
                    Keyboard.dismiss();
                }, 500);

                if (this.state.logo && this.state.logo.uri == image.path)
                    return;
                this.setState({
                    logo:
                    {
                        uri: image.path,
                        loading: true
                    }
                }, () => {
                    imageProvider.upload(image.path,image.mime, (s, e) => {
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
            snackbar.show('Vui l??ng nh???p t??n ph??ng kh??m');
            return;
        }
        if (!this.state.listSpecialist || this.state.listSpecialist.length == 0) {
            snackbar.show('Vui l??ng ch???n chuy??n khoa cho ph??ng kh??m');
            return;
        }
        if (this.state.website && !this.state.website.isUrl()) {
            snackbar.show('Vui l??ng nh???p ????ng ?????nh d???ng ?????a ch??? trang web');
            return;
        }
        if (!this.state.phone) {
            snackbar.show('Vui l??ng nh???p s??? ??i???n tho???i cho ph??ng kh??m');
            return;
        }
        if (!this.state.phone.isPhoneNumber()) {
            snackbar.show("Vui l??ng nh???p ????ng ?????nh d???ng s??? ??i???n tho???i");
            return;
        }
        if (this.state.phone_emergency && !this.state.phone_emergency.isPhoneNumber()) {
            snackbar.show("Vui l??ng nh???p ????ng ?????nh d???ng s??? ??i???n tho???i c???p c???u");
            return;
        }
        if (!this.state.address || this.state.address.trim() == "") {
            snackbar.show('Vui l??ng nh???p ?????a ch??? ph??ng kh??m');
            return;
        }
        if (!this.state.logo) {
            snackbar.show('Vui l??ng ch???n logo cho ph??ng kh??m');
            return;
        }
        if (this.state.logo.error) {
            snackbar.show('???nh logo t???i l??n b??? l???i, vui l??ng ch???n l???i');
            return;
        }
        if (this.state.logo.loading) {
            snackbar.show('???nh logo ??ang ???????c t???i l??n, vui l??ng ch???');
            return;
        }
        if (this.state.imageUris.length == 0) {
            snackbar.show('Vui l??ng ch???n ???nh cho ph??ng kh??m');
            return;
        }

        for (var i = 0; i < this.state.imageUris.length; i++) {
            if (this.state.imageUris[i].loading) {
                snackbar.show('M???t s??? ???nh ??ang ???????c t???i l??n. Vui l??ng ch???');
                return;
            }
            if (this.state.imageUris[i].error) {
                snackbar.show('???nh t???i l??n b??? l???i, vui l??ng ki???m tra l???i');
                return;
            }
        }
        if (!this.state.province) {
            snackbar.show("Vui l??ng ch???n t???nh c???a ph??ng kh??m");
            return;
        }
        if (!this.state.place) {
            snackbar.show("Vui l??ng ch???n v??? tr?? ph??ng kh??m tr??n b???n ?????");
            return;
        }

        this.setState({ isLoading: true }, () => {
            let listImageUrl = [];
            this.state.imageUris.forEach((item, index) => {
                listImageUrl.push(item.url);
            });
            let listSpecialist = [];
            this.state.listSpecialist.forEach((item) => {
                listSpecialist.push(item.id);
            });
            if (!this.state.facility.facility.id)
                facilityProvider.createClinic(this.state.name.trim(), this.state.website.trim(), this.state.phone.trim(), this.state.phone_emergency.trim(), this.state.address.trim(), this.state.place, this.state.logo.url, listImageUrl, listSpecialist, this.state.province.id, this.props.userApp.currentUser.id, (s, e) => {
                    this.setState({ isLoading: false });
                    if (s) {
                        switch (s.code) {
                            case 0:
                                this.props.navigation.navigate('myFacility', { facility: s.data });
                                snackbar.show("Th??m ph??ng kh??m th??nh c??ng", 'success');
                                break;
                            case 2:
                                snackbar.show("???? t???n t???i ph??ng kh??m v???i t??n n??y tr??n h??? th???ng", 'danger');
                                break;
                        }
                        return;
                    }
                    snackbar.show("Th??m ph??ng kh??m kh??ng th??nh c??ng", 'danger');
                });
            else {
                facilityProvider.updateClinic(this.state.facility.facility.id, this.state.name.trim(), this.state.website.trim(), this.state.phone.trim(), this.state.phone_emergency.trim(), this.state.address.trim(), this.state.place, this.state.logo.url, listImageUrl, listSpecialist, this.state.province.id, (s, e) => {
                    this.setState({ isLoading: false });
                    if (s) {
                        switch (s.code) {
                            case 0:
                                this.props.navigation.navigate('myFacility', { facility: s.data });
                                snackbar.show("C???p nh???t ph??ng kh??m th??nh c??ng", 'success');
                                break;
                            case 2:
                                snackbar.show("???? t???n t???i ph??ng kh??m v???i t??n n??y tr??n h??? th???ng", 'danger');
                                break;
                        }
                        return;
                    }
                    snackbar.show("C???p nh???t ph??ng kh??m kh??ng th??nh c??ng", 'danger');
                });
            }
        });
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title={this.state.editMode ? "CH???NH S???A PH??NG KH??M" : "TH??M M???I PH??NG KH??M"} showFullScreen={true} isLoading={this.state.isLoading}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ padding: 10, flex: 1 }}
                        keyboardShouldPersistTaps="handled">
                        <View style={styles.row}>
                            <TextInput
                                value={this.state.name}
                                onChangeText={(s) => this.setState({ name: s })}
                                underlineColorAndroid="transparent"
                                style={{
                                    padding: 0
                                }}
                                placeholder={"T??n ph??ng kh??m"}
                            />
                        </View>
                        <View>
                            <View style={{
                                marginTop: 15,
                                padding: 10,
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: "#9b9b9b",
                                flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'
                            }}>
                                {this.state.listSpecialist.map((item, index) => <View key={index} style={{
                                    borderRadius: 4,
                                    backgroundColor: "#00977c", position: 'relative',
                                    padding: 6, paddingLeft: 5, margin: 2, maxWidth: 150, flexDirection: 'row', alignItems: 'center'
                                }}>
                                    <Text numberOfLines={1} style={{ color: '#FFF', marginRight: 17 }}>{item.name}</Text>
                                    <TouchableOpacity onPress={this.removeSpecialist.bind(this, index)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0 }}>
                                        <Text style={{ color: '#f8e71c', margin: 5, fontSize: 15, paddingRight: 5 }}>x</Text>
                                    </TouchableOpacity>
                                </View>)}
                                <TextInput ref={(ref) => this.inputSpecialist = ref} value={this.state.newSpecialist} onChangeText={this.onChangeTextSpecialist.bind(this)} onSubmitEditing={this.onSubmitSpecialist.bind(this)} style={{ minWidth: 150, padding: 0, paddingHorizontal: 2, flex: 1 }} numberOfLines={1} underlineColorAndroid="transparent" placeholder="Nh???p chuy??n khoa" />
                            </View>
                        </View>
                        {
                            this.state.listSpecialistSuggesh && this.state.listSpecialistSuggesh.length > 0 ? this.state.listSpecialistSuggesh.map((item, index) =>
                                <TouchableOpacity key={index} onPress={this.onClickSpecialist.bind(this, item)}>
                                    <Text style={{ padding: 10 }}>{item.name}</Text>
                                    <Dash style={{ height: 1, width: '100%', flexDirection: 'row' }} dashColor="#00977c" />
                                </TouchableOpacity>
                            ) : null
                        }
                        <View style={styles.row}>
                            <TextInput
                                value={this.state.website}
                                onChangeText={(s) => this.setState({ website: s })}
                                underlineColorAndroid="transparent"
                                style={{
                                    padding: 0
                                }}
                                placeholder={"Website"}
                            />
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                value={this.state.phone}
                                onChangeText={(s) => this.setState({ phone: s })}
                                underlineColorAndroid="transparent"
                                keyboardType='number-pad'
                                style={{
                                    padding: 0
                                }}
                                placeholder={"S??? ??i???n tho???i"}
                            />
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                value={this.state.phone_emergency}
                                onChangeText={(s) => this.setState({ phone_emergency: s })}
                                underlineColorAndroid="transparent"
                                keyboardType='number-pad'
                                style={{
                                    padding: 0
                                }}
                                placeholder={"S??? ??i???n tho???i c???p c???u"}
                            />
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                onChangeText={(s) => this.setState({ address: s })}
                                underlineColorAndroid="transparent"
                                style={{
                                    padding: 0
                                }}
                                value={this.state.address}
                                placeholder={"?????a ch???"}
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
                                }}>Ch???n T???nh/TP</Text>
                            }
                            <ScaledImage height={7} source={require("@images/ic_dropdown.png")} />
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
                                                <ScaledImage source={require("@images/ic_close.png")} width={12} />
                                            </TouchableOpacity>
                                        </TouchableOpacity> :
                                        <TouchableOpacity onPress={this.selectLogo.bind(this)} style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <ScaledImage width={40} source={require("@images/ic_add_image.png")} />
                                            <Text>Th??m ???nh</Text>
                                        </TouchableOpacity>
                                }
                            </View>
                            <Text style={{ fontWeight: 'bold', marginTop: 20 }}>H??nh ???nh <Text style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(T???i ??a 4 ???nh)</Text></Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                                {
                                    this.state.imageUris.map((item, index) => <TouchableOpacity key={index} style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1 }}>
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
                                            <ScaledImage source={require("@images/ic_close.png")} width={12} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>)
                                }
                                {
                                    !this.state.imageUris || this.state.imageUris.length < 4 ?
                                        <TouchableOpacity onPress={this.selectImage.bind(this)} style={{ margin: 2, width: 100, height: 100, borderColor: '#00000020', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <ScaledImage width={40} source={require("@images/ic_add_image.png")} />
                                            <Text>Th??m ???nh</Text>
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
                            }}>?????t v??? tr?? tr??n b???n ?????</Text></TouchableOpacity>
                        {
                            this.state.place &&
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={{ width: DEVICE_WIDTH - 20, height: (DEVICE_WIDTH - 20) * 200 / 500 }}
                                region={this.state.place}
                            >
                                <Marker
                                    coordinate={this.state.place}>
                                </Marker>
                            </MapView>
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
                        }}>{this.state.editMode ? "C???P NH???T" : "TH??M M???I"}</Text>
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
                                CH???N T???NH
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
                                        <Text style={{ fontStyle: 'italic' }}>Kh??ng t??m th???y d??? li???u t???nh th??nh ph???</Text>
                                    </View>
                                    : null//<Dash style={{ height: 1, width: '100%', flexDirection: 'row' }} dashColor="#00977c" />
                            }
                            ListFooterComponent={() => <View style={{ height: 50 }}></View>}
                            renderItem={({ item, index }) =>
                                <Card>
                                    <TouchableOpacity onPress={() => { this.setState({ province: item, toggleProvince: false }) }}>
                                        <Text style={{ padding: 10, fontWeight: '300', color: this.state.province == item ? "red" : "black" }}>{item.name}</Text>
                                        {/* <Dash style={{ height: 1, width: '100%', flexDirection: 'row' }} dashColor="#00977c" /> */}
                                    </TouchableOpacity>
                                </Card>
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
        userApp: state.auth.userApp
    };
}
const styles = {
    row: {
        marginTop: 15,
        padding: 10,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#9b9b9b"
    }
}
export default connect(mapStateToProps)(AddNewClinicScreen);