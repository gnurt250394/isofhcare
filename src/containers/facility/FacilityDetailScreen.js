import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet, Platform, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import locationProvider from '@data-access/location-provider';
import historyProvider from '@data-access/history-provider';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
const { width, height } = Dimensions.get('window');
import SearchPanel from '@components/SearchPanel';
import realmModel from '@models/realm-models';
import { Rating } from 'react-native-ratings';
import PhotoGrid from 'react-native-thumbnail-grid';
import snackbar from '@utils/snackbar-utils';
import ImageLoad from 'mainam-react-native-image-loader';


import SlidingPanel from 'mainam-react-native-sliding-up-down';
class FacilityDetailScreen extends Component {
    constructor(props) {
        super(props)
        const facility = this.props.navigation.getParam("facility", undefined);
        var images = facility.images;
        var list_images = [];
        try {
            for (var i = 0; i < images.length; i++) {
                list_images.push(images[i].url.absoluteUrl())
            }
        } catch (error) {

        }
        this.state = {
            list_images,
            width,
            height: height - 75,
            showSearchPanel: true,
            facility,
            region:
            {
                latitude: facility ? facility.facility.latitude : 0,
                longitude: facility ? facility.facility.longitude : 0,
                longitudeDelta: 0.1,
                latitudeDelta: 0.1
            }
        }
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
        this.rating.setCurrentRating(facility.facility.review);
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
    render() {
        const facility = this.props.navigation.getParam("facility", undefined);
        if (!facility)
            return <View />

        let image = facility.facility.logo;
        if (!image)
            image = ".";
        else {
            image = image.absoluteUrl();
        }


        return (
            <ActivityPanel ref={(ref) => this.activity = ref} style={{ flex: 1 }} title="CHỌN ĐỊA ĐIỂM TÌM KIẾM" showFullScreen={true}>
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
                                            <View {...this.props} style={[{
                                                marginTop: 0,
                                                flexDirection: 'row',
                                            }, this.props.style]}
                                                onPress={() => { this.props.navigation.navigate("facilityDetailScreen", { facility }) }}
                                            >
                                                <View style={{ flex: 1, marginRight: 10 }}>
                                                    <Text style={{ fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode='tail'>{facility.facility.name}</Text>
                                                    <Rating
                                                        ref={(ref) => { this.rating = ref }}
                                                        style={{ marginTop: 8 }}
                                                        ratingCount={5}
                                                        imageSize={13}
                                                        readonly
                                                    />
                                                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                                        <TouchableOpacity onPress={() => snackbar.show("Chức năng đang phát triển")} style={{ marginRight: 5, backgroundColor: 'rgb(47,94,172)', padding: 6, paddingLeft: 14, paddingRight: 14 }}>
                                                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Đặt khám</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => snackbar.show("Chức năng đang phát triển")} style={{ backgroundColor: 'rgb(47,94,172)', padding: 6, paddingLeft: 14, paddingRight: 14 }}>
                                                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Đánh giá</Text>
                                                        </TouchableOpacity></View>
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