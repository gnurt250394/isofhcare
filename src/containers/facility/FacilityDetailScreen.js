import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { Text, View, TextInput, TouchableWithoutFeedback, TouchableOpacity, Dimensions, StyleSheet, Platform, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import locationProvider from '@data-access/location-provider';
import historyProvider from '@data-access/history-provider';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
const { width, height } = Dimensions.get('window');
import SearchPanel from '@components/SearchPanel';
import realmModel from '@models/realm-models';
import PhotoGrid from 'react-native-thumbnail-grid';
import snackbar from '@utils/snackbar-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import Modal from "react-native-modal";
import stylemodal from "@styles/modal-style";
import constants from '@resources/strings';
import facilityProvider from '@data-access/facility-provider';
import firebaseUtils from '@utils/firebase-utils';

import Rating from '@components/Rating';

import SlidingPanel from 'mainam-react-native-sliding-up-down';
import { Card, Button } from 'native-base';
class FacilityDetailScreen extends Component {
    constructor(props) {
        super(props)
        const facility = this.props.navigation.getParam("facility", undefined);
        this.state = {
            facility,
            region:
            {
                latitude: facility ? facility.facility.latitude : 1,
                longitude: facility ? facility.facility.longitude : 1,
                longitudeDelta: 0.1,
                latitudeDelta: 0.1
            },
            width,
            height: height - 75,
            showSearchPanel: true,
        };
        this.showFacility(facility);
    }
    showFacility(facility) {
        try {
            var images = facility.images;
            var list_images = [];
            try {
                for (var i = 0; i < images.length; i++) {
                    let url = images[i].url.absoluteUrl();
                    if (url && url.indexOf("blob:") != 0) {
                        list_images.push(images[i].url.absoluteUrl())
                    }
                }
            } catch (error) {

            }
            this.setState({
                list_images,
                facility,
                region:
                {
                    latitude: facility ? facility.facility.latitude : 0,
                    longitude: facility ? facility.facility.longitude : 0,
                    longitudeDelta: 0.1,
                    latitudeDelta: 0.1
                }
            });
        } catch (error) {
            alert(JSON.stringify(error));
        }

    }
    edit(facility) {
        if (facility.facility.type == 2) {
            this.props.navigation.navigate("addNewClinic", { facility: facility });
        }
        else {
            if (facility.facility.type == 8) {
                this.props.navigation.navigate("addNewDrugStore", { facility: facility });
            }
        }
    }

    chat(facility) {
        if (!this.props.userApp.isLogin) {
            snackbar.show(constants.msg.user.please_login, "danger");
            return;
        }
        if (facility && facility.facility)
            this.setState({ isLoading: true }, () => {
                let user = this.props.userApp.currentUser;
                firebaseUtils.connect(user.id, user.name, user.avatar, {}).then(x => {
                    firebaseUtils.connect("facility_" + facility.facility.id, facility.facility.name, facility.facility.logo, {}).then(x => {
                        firebaseUtils.createGroup(["facility_" + facility.facility.id, this.props.userApp.currentUser.id], "", "").then(x => {
                            this.setState({ isLoading: false });
                            if (x && x.groupId) {
                                this.props.navigation.navigate("chat", x)
                            }
                        }).catch(x => {
                            this.setState({ isLoading: false });
                            snackbar.show(constants.msg.chat.cannot_make_chat_with_this_user, "danger");
                        });
                    }).catch(x => {
                        this.setState({ isLoading: false });
                        snackbar.show(constants.msg.chat.cannot_make_chat_with_this_user, "danger");
                    });
                }).catch(x => {
                    this.setState({ isLoading: false });
                    snackbar.show(constants.msg.chat.cannot_make_chat_with_this_user, "danger");
                })
            });
    }

    onSearchItemClick(item) {
        locationProvider.getByPlaceId(item.placeID, (s, e) => {
            if (s) {
                try {
                    const { LOCATION_HISTORY } = realmModel;
                    historyProvider.addHistory("", LOCATION_HISTORY, s.name, s.name, JSON.stringify(s));
                    this.props.navigation.navigate("searchFacilityByLocation", { location: s });
                } catch (error) {

                }
            }
            else {
                snackbar.show("Không tìm thấy thông tin của địa điểm này");
            }
        });
    }
    renderSearchItem(item, index, keyword) {
        return <TouchableOpacity style={{ padding: 5 }} onPress={this.onSearchItemClick.bind(this, item)}>
            <Text style={{ paddingLeft: 10 }}>{item.primaryText}</Text>
            <Text style={{ paddingLeft: 10, fontSize: 12, marginTop: 10, color: '#00000050' }}>{item.secondaryText}</Text>
            <View style={{ height: 0.5, backgroundColor: '#00000040', marginTop: 12 }} />
        </TouchableOpacity>
    }
    renderFooter(keyword, data) {
        return <View />
    }
    onSearch(text) {
        return new Promise((resolve, reject) => {
            locationProvider.searchPlace(text, (s, e) => {
                if (e)
                    reject(e);
                else {
                    if (s)
                        resolve(s);
                    else {
                        reject([]);
                    }
                }
            });
        });
    }
    searchFocus() {
        this.setState({ showOverlay: true });
    }
    overlayClick() {
        if (this.searchPanel) {
            this.searchPanel.getWrappedInstance().clear();
        }
        this.setState({ showOverlay: false });
    }
    onExpand(isExpand, sliderPosition) {
        this.setState({ showSearchPanel: !isExpand })
    }
    componentDidMount() {
        const facility = this.props.navigation.getParam("facility", undefined);
        if (!facility) {
            this.props.navigation.pop();
            return;
        }
        this.mapRef.fitToElements(true);
    }
    onPressItemLocation(item) {
        this.props.navigation.navigate("searchFacilityByLocation", { location: item });
    }

    renderItemHistory(item, index) {
        var data = JSON.parse(item.data);
        return <TouchableOpacity style={{ padding: 5 }} onPress={() => { this.onPressItemLocation(data) }}>
            <View style={{ flexDirection: 'row' }}>
                <ScaledImage source={require("@images/search/time-left.png")} width={15} style={{ marginTop: 2 }} />
                <View>
                    <Text style={{ marginLeft: 5 }}>{data.name}</Text>
                    <Text style={{ marginLeft: 5, fontSize: 12, marginTop: 10, color: '#00000050' }}>{data.address}</Text>
                </View>
            </View>
            <View style={{ height: 0.5, backgroundColor: '#00000040', marginTop: 12 }} />
        </TouchableOpacity>
    }
    photoViewer(uri) {
        try {
            if (!this.state.list_images || this.state.list_images.length == 0) {
                snackbar.show("Không có ảnh nào");
                return;
            }
            var index = this.state.list_images.indexOf(uri);
            if (index == -1)
                index = 0;
            this.props.navigation.navigate("photoViewer", { urls: this.state.list_images, index });

        } catch (error) {
        }
    }
    showRating() {
        this.setState({ toggleRating: true }, () => {
            this.rating2.setCurrentRating(this.state.currentRating ? this.state.currentRating : 0);
        });
    }
    setRate() {
        let val = this.rating2.getCurrentRating();
        if (val == 0) {
            snackbar.show(constants.msg.facility.please_select_value_for_rating, "danger");
            return;
        } else {
            this.setState({ currentRating: val, toggleRating: false, isLoading: true }, () => {
                setTimeout(() => {
                    facilityProvider.review(this.state.facility.facility.id, val, (s, e) => {
                        this.setState({ isLoading: false });
                        if (s) {
                            this.showFacility(s.data);
                            snackbar.show(constants.msg.facility.rating_facility_success, "success");
                        }
                        else {
                            this.showRating();
                            snackbar.show(constants.msg.facility.rating_facility_not_success, "danger");
                        }
                    });
                }, 500);
            });
        }
    }
    render() {
        let facility = this.state.facility;
        let image = this.state.facility.facility.logo;
        if (!image)
            image = ".";
        else {
            image = image.absoluteUrl();
        }


        return (
            <ActivityPanel ref={(ref) => this.activity = ref} style={{ flex: 1 }} title="CHỌN ĐỊA ĐIỂM TÌM KIẾM" showFullScreen={true} isLoading={this.state.isLoading}>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <MapView
                            showsMyLocationButton={true}
                            ref={(ref) => { this.mapRef = ref }}
                            provider={PROVIDER_GOOGLE}
                            style={{ width: '100%', height: this.state.height - (!this.state.showOverlay ? (Platform.OS == 'ios' ? 100 : 120) : 0) }}
                            showsUserLocation={true}
                            region={this.state.region}
                        >
                            <Marker
                                id={"Location"}
                                coordinate={this.state.region}>
                                <ScaledImage source={
                                    this.state.facility.facility.type == 2 ? require("@images/ic_phongkham.png") :
                                        this.state.facility.facility.type == 8 ? require("@images/ic_nhathuoc.png") :
                                            this.state.facility.facility.type == 1 ? require("@images/ic_hospital.png") :
                                                require("@images/ic_trungtamyte.png")} width={20} />
                            </Marker>
                        </MapView>
                        {
                            !this.state.showOverlay ? <SlidingPanel
                                zIndex={2}
                                onExpand={this.onExpand.bind(this)}
                                visible={true}
                                AnimationSpeed={400}
                                allowDragging={false}
                                headerLayoutHeight={205}
                                headerLayout={() =>
                                    <View zIndex={10} style={{ marginTop: Platform.OS == 'ios' ? 72 : 52, alignItems: 'center', width }}>
                                        <ScaledImage source={require("@images/facility/icdrag.png")} height={29} zIndex={5} />
                                        <ScrollView
                                            style={{ width, height: height - 110, backgroundColor: '#FFF', padding: 10 }}>
                                            <View {...this.props} style={[{ marginTop: 0, flexDirection: 'row' }, this.props.style]}>
                                                <View style={{ flex: 1, marginRight: 10 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontWeight: 'bold', flex: 1 }} numberOfLines={2} ellipsizeMode='tail'>{facility.facility.name}</Text>
                                                        {
                                                            (facility.facility.type == 2 || facility.facility.type == 8) && facility.facility.approval == 0 && facility.user && this.props.userApp.isLogin && this.props.userApp.currentUser.id == facility.user.id ?
                                                                <TouchableOpacity onPress={this.edit.bind(this, facility)}>
                                                                    <ScaledImage source={require("@images/edit.png")} width={20}></ScaledImage>
                                                                </TouchableOpacity> :
                                                                null
                                                        }
                                                    </View>
                                                    <Rating readonly={true} count={5} value={this.state.facility.facility.review} starWidth={13} style={{ marginTop: 8 }} />
                                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                                        <TouchableOpacity onPress={() => snackbar.show("Chức năng đang phát triển")} style={{ marginRight: 5, backgroundColor: 'rgb(47,94,172)', padding: 6, paddingLeft: 14, paddingRight: 14 }}>
                                                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Đặt khám</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={this.showRating.bind(this)} style={{ backgroundColor: 'rgb(47,94,172)', padding: 6, paddingLeft: 14, paddingRight: 14 }}>
                                                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Mua thuốc</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <ImageLoad
                                                    resizeMode="cover"
                                                    placeholderSource={require("@images/noimage.jpg")}
                                                    style={{ width: 80, height: 80 }}
                                                    loadingStyle={{ size: 'small', color: 'gray' }}
                                                    source={{ uri: image }}
                                                />
                                            </View>
                                            <Text style={{ fontSize: 12, marginTop: 14, marginBottom: 10 }} numberOfLines={2} ellipsizeMode='tail'>{facility.facility.address}</Text>

                                            <PhotoGrid source={this.state.list_images} onPressImage={(e, uri) => { this.photoViewer(uri) }} />
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    {
                                                        facility.facility.website ?
                                                            <TouchableOpacity style={{ padding: 10, flexDirection: 'row' }} onPress={() => Linking.openURL(facility.facility.website)}>
                                                                <ScaledImage source={require("@images/web.png")} width={15} style={{ marginRight: 5 }} />
                                                                <Text style={{ color: '#23429b' }}>{facility.facility.website}</Text>
                                                            </TouchableOpacity> : null
                                                    }
                                                    {
                                                        facility.facility.phone ?
                                                            <TouchableOpacity style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => Linking.openURL("tel:" + facility.facility.phone)}>
                                                                <ScaledImage source={require("@images/ic_phone.png")} width={15} style={{ marginRight: 5 }} />
                                                                <Text style={{ color: '(rgb,35,66,155)', fontWeight: 'bold' }}>{facility.facility.phone}</Text>
                                                            </TouchableOpacity> : null
                                                    }
                                                </View>
                                                <Button style={{
                                                    padding: 2,
                                                    paddingLeft: 10,
                                                    paddingRight: 10,
                                                    backgroundColor: '#FFF',
                                                    borderWidth: 1,
                                                    borderColor: "#2f5eac"
                                                }} onPress={this.chat.bind(this, facility)}>
                                                    <ScaledImage source={require("@images/ic_chat.png")} height={21} style={{ marginRight: 5 }} />
                                                    <Text>Nhắn tin</Text>
                                                </Button>
                                            </View>
                                            <Text style={{ padding: 10, fontSize: 16, marginTop: 5, textAlign: 'justify', lineHeight: 22, marginBottom: 20, color: '#9b9b9b' }}>{facility.facility.introduction}</Text>
                                        </ScrollView>
                                    </View>
                                }
                                slidingPanelLayout={() =>
                                    <View>

                                    </View>
                                }
                            /> : null
                        }
                    </View>
                    {
                        this.state.showOverlay ?
                            <TouchableWithoutFeedback onPress={this.overlayClick.bind(this)} style={{}}><View style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: '#37a3ff59' }} /></TouchableWithoutFeedback> : null
                    }
                    {
                        this.state.showSearchPanel ?
                            <View style={{ padding: 14, position: 'absolute', top: 0, left: 0, right: 0 }}>
                                <SearchPanel searchTypeId={realmModel.LOCATION_HISTORY}
                                    ref={ref => this.searchPanel = ref}
                                    onFocus={this.searchFocus.bind(this)}
                                    placeholder="Nhập địa điểm muốn tìm kiếm"
                                    onSearch={this.onSearch.bind(this)}
                                    renderItem={this.renderSearchItem.bind(this)}
                                    renderItemHistory={this.renderItemHistory.bind(this)}
                                    renderFooter={this.renderFooter.bind(this)} />
                            </View> : null
                    }
                </View>
                <Modal
                    isVisible={this.state.toggleRating}
                    onBackdropPress={() => this.setState({ toggleRating: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    style={stylemodal.container}>
                    <Card style={{ backgroundColor: '#fff', width: 250, height: 200, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                                ĐÁNH GIÁ
                            </Text>
                        </View>
                        <Rating
                            ref={(ref) => { this.rating2 = ref }}
                            style={{ marginTop: 8 }}
                            count={5}
                            starWidth={40}

                        />
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <Button onPress={() => this.setState({ toggleRating: false })} light><Text style={{ paddingHorizontal: 10, minWidth: 80, textAlign: 'center' }}>Huỷ</Text></Button>
                            <Button onPress={this.setRate.bind(this)} primary style={{ marginLeft: 5 }}><Text style={{ paddingHorizontal: 10, minWidth: 80, textAlign: 'center', fontWeight: 'bold', color: '#FFF' }}>Gửi</Text></Button>
                        </View>
                    </Card>
                </Modal>
            </ActivityPanel >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    headerLayoutStyle: {
        width,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slidingPanelLayoutStyle: {
        width,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commonTextStyle: {
        color: 'white',
        fontSize: 18,
    },
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(FacilityDetailScreen);