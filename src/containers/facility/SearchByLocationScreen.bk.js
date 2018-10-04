import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import facilityProvider from '@data-access/facility-provider';
import ItemFacility2 from '@components/facility/ItemFacility2';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
const { width, height } = Dimensions.get('window');
import SearchPanel from '@components/SearchPanel';
import realmModel from '@models/realm-models';
import locationProvider from '@data-access/location-provider';
import historyProvider from '@data-access/history-provider';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import snackbar from '@utils/snackbar-utils';
import SlidingPanel from 'mainam-react-native-sliding-up-down';
class SearchByLocastionScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            finish: false,
            loading: false,
            width,
            height: height - 75,
            showSearchPanel: true
        }
    }
    getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => {
                resolve(position)
            }
                , e => {
                    reject(e)
                });
        });
    }
    componentWillReceiveProps(nextProps) {
        try {
            let s = nextProps.navigation.getParam('location', undefined);
            if (s) {
                s.longitudeDelta = 0.1;
                s.latitudeDelta = 0.1;
                this.setState({ region: s, showOverlay: false }, () => {
                    if (this.searchPanel) {
                        this.searchPanel.getWrappedInstance().setValue(s.name);
                    }
                    this.onRefresh();
                });
            }
        } catch (error) {

        }
    }
    getLocation() {
        this.getCurrentLocation().then(position => {
            if (position) {
                locationProvider.saveCurrentLocation(position.coords.latitude, position.coords.longitude);
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    },
                }, () => {
                    this.onRefresh();
                });
            }
        });
    }
    componentWillMount() {
        locationProvider.getCurrentLocationHasSave((s, e) => {
            if (s && s.latitude && s.longitude) {
                s.latitudeDelta = 0.1;
                s.longitudeDelta = 0.1;
                this.setState({
                    region: s,
                });
            }
        });
    }
    componentDidMount() {
        if (Platform.OS == "ios") {
            this.getLocation();
        } else {
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                .then(data => {
                    setTimeout(this.getLocation.bind(this), 1000);
                }).catch(err => {
                });
        }
        if (this.state.region)
            this.onRefresh();
    }

    onRefresh() {
        if (!this.state.loading)
            this.setState({ refreshing: true, page: 1, finish: false, loading: true }, () => {
                this.onLoad();
            });
    }
    onLoad() {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        })
        facilityProvider.searchByLatLon(this.state.region.latitude, this.state.region.longitude, page, size, (s, e) => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
            });
            if (s) {
                switch (s.code) {
                    case 0:
                        var list = [];
                        var finish = false;
                        if (s.data.data.length == 0) {
                            finish = true;
                        }
                        if (page != 1) {
                            list = this.state.data;
                            list.push.apply(list, s.data.data);
                        }
                        else {
                            list = s.data.data;
                        }
                        this.setState({
                            data: [...list],
                            finish: finish
                        });
                        break;
                }
            }
        });
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState({ loadMore: true, refreshing: false, loading: true, page: this.state.page + 1 }, () => {
                this.onLoad(this.state.page)
            });
    }
    onSearchItemClick(item) {
        locationProvider.getByPlaceId(item.placeID, (s, e) => {
            if (s) {
                try {
                    const { LOCATION_HISTORY } = realmModel;
                    historyProvider.addHistory("", LOCATION_HISTORY, s.name, s.name, JSON.stringify(s));
                    s.longitudeDelta = 0.1;
                    s.latitudeDelta = 0.1;
                    this.setState({ region: s, showOverlay: false }, () => {
                        if (this.searchPanel) {
                            this.searchPanel.getWrappedInstance().setValue(s.name);
                        }
                        this.onRefresh();
                    });
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
    onPressItemLocation(item) {
        if (this.searchPanel)
            this.searchPanel.getWrappedInstance().setValue(item.name);
        this.setState({ showOverlay: false });

        if (item.latitude && item.longitude) {
            item.longitudeDelta = 0.1;
            item.latitudeDelta = 0.1;
            this.setState({ region: item });
        }
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
    render() {
        return (
            <ActivityPanel ref={(ref) => this.activity = ref} style={{ flex: 1 }} title="CHỌN ĐỊA ĐIỂM TÌM KIẾM" showFullScreen={true}>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{ width: '100%', height: this.state.height - (!this.state.showOverlay ? (Platform.OS == 'ios' ? 100 : 120) : 0) }}
                            showsUserLocation={true}
                            region={this.state.region}
                        >
                            {
                                this.state.region ?
                                    <Marker coordinate={this.state.region}>
                                        <ScaledImage source={require("@images/navigation.png")} width={30} />
                                    </Marker> : null
                            }

                            {
                                this.state.data.map((item, index) => <Marker key={index}
                                    coordinate={{
                                        latitude: item.facility.latitude,
                                        longitude: item.facility.longitude
                                    }}>
                                    <ScaledImage source={
                                        item.facility.type == 2 ? require("@images/ic_phongkham.png") :
                                            item.facility.type == 8 ? require("@images/ic_nhathuoc.png") :
                                                item.facility.type == 1 ? require("@images/ic_hospital.png") :
                                                    require("@images/ic_trungtamyte.png")} width={20} />
                                </Marker>)
                            }
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
                                        <FlatList
                                            onRefresh={this.onRefresh.bind(this)}
                                            refreshing={this.state.refreshing}
                                            onEndReached={this.onLoadMore.bind(this)}
                                            onEndReachedThreshold={1}
                                            style={{ width, height: height - 110, backgroundColor: '#FFF' }}
                                            keyExtractor={(item, index) => index.toString()}
                                            extraData={this.state}
                                            data={this.state.data}
                                            ListHeaderComponent={() => !this.state.refreshing && (!this.state.data || this.state.data.length == 0) ?
                                                <View style={{ alignItems: 'center', marginTop: 50 }}>
                                                    <ScaledImage source={require("@images/search/noresult.png")} width={136} />
                                                    <TouchableOpacity>
                                                        <Text style={{ marginTop: 20, padding: 20, textAlign: 'center', lineHeight: 30 }}>Chúng tôi không tìm thấy kết quả nào phù hợp</Text>
                                                    </TouchableOpacity>

                                                </View> : null
                                            }
                                            ListFooterComponent={() => <View style={{ height: 50 }}></View>}
                                            renderItem={({ item, index }) =>
                                                <ItemFacility2 facility={item} />
                                            }
                                        />
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
                                    renderItemHistory={this.renderItemHistory.bind(this)} />
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
export default connect(mapStateToProps)(SearchByLocastionScreen);