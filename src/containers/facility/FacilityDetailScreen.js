import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet, Platform, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import drugProvider from '@data-access/drug-provider';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
const { width, height } = Dimensions.get('window');
import SearchPanel from '@components/SearchPanel';
import realmModel from '@models/realm-models';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';
import { Rating } from 'react-native-ratings';
import PhotoGrid from 'react-native-thumbnail-grid';

import SlidingPanel from 'mainam-react-native-sliding-up-down';
const images = [
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg',
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg',
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg',
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg',
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg',
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg',
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg',
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg',
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg',
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg',
    'https://www.sapo.vn/blog/wp-content/uploads/2017/02/kinh-nghiem-va-dieu-kien-mo-quay-thuoc-tay-2.jpg'
]

class SearchDrugScreen extends Component {
    constructor(props) {
        super(props)
        let keyword = this.props.navigation.getParam('keyword', '');
        if (keyword)
            keyword = keyword.trim();
        else
            keyword = "";


        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            finish: false,
            loading: false,
            keyword,
            width,
            height: height - 75,
            showSearchPanel: true
        }
    }

    onSearchItemClick(item) {
        this.props.navigation.navigate("drugDetailScreen", { drug: item });
        const { DRUG_HISTORY } = realmModel;
        historyProvider.addHistory("", DRUG_HISTORY, item.drug.name, item.drug.id, "");
    }
    renderSearchItem(item, index, keyword) {
        return <TouchableOpacity style={{ padding: 5 }} onPress={this.onSearchItemClick.bind(this, item)}>
            <Text style={{ paddingLeft: 10 }}>{item.drug.name}</Text>
            <View style={{ height: 0.5, backgroundColor: '#00000040', marginTop: 12 }} />
        </TouchableOpacity>
    }
    renderFooter(keyword, data) {
        if (keyword)
            return <TouchableOpacity style={{ padding: 5, paddingLeft: 15, flexDirection: 'row', alignItems: 'center', paddingTop: 10 }} onPress={() => this.props.navigation.navigate("searchDrugResult", { keyword })}>
                <ScaledImage source={require("@images/search/icsearch2.png")} width={15} />
                <Text style={{ paddingLeft: 10, color: 'rgb(74,144,226)' }}>Xem tất cả kết quả tìm kiếm</Text>
            </TouchableOpacity>
        return <View />
    }
    onSearch(s) {
        return new Promise((resolve, reject) => {
            drugProvider.search(s, 1, 5, (s, e) => {
                if (e)
                    reject(e);
                else {
                    if (s && s.code == 0) {
                        resolve(s.data.data);
                    } else {
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
    }
    render() {
        const facility = this.props.navigation.getParam("facility", undefined);
        if (!facility)
            return <View />
        let images = facility.images;
        let image = "undefined";
        try {
            if (images && images.length > 0) {
                image = images[0].url.absoluteUrl();
            }
        } catch (error) {

        }

        var list_images = [];
        try {
            for (var i = 0; i < images.length; i++) {
                list_images.push(images[i].url.absoluteUrl())
            }
        } catch (error) {

        }

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
                            {/* <Marker
                            coordinate={
                                {
                                latitude: 20.9899002,GMAI
                                latitude: 20.9899002,GMAI
                                longitude: 105.7896239
                                }
                            }
                            image={require('@images/ic_signout.png')}
                            /> */}
                        </MapView>

                        {
                            this.state.showSearchPanel ?
                                <View zIndex={3} style={{ padding: 14, position: 'absolute', top: 0, left: 0, right: 0 }}>
                                    <SearchPanel searchTypeId={realmModel.DRUG_HISTORY}
                                        resultPage="searchDrugResult"
                                        ref={ref => this.searchPanel = ref}
                                        onFocus={this.searchFocus.bind(this)}
                                        placeholder="Nhập địa điểm muốn tìm kiếm"
                                        onSearch={this.onSearch.bind(this)}
                                        renderItem={this.renderSearchItem.bind(this)}
                                        renderFooter={this.renderFooter.bind(this)} />
                                </View> : null
                        }
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
                                            style={{ width, height: height - 110, backgroundColor: '#FFF', padding: 10 }}
                                            keyExtractor={(item, index) => index.toString()}
                                            data={this.state.data}
                                        >
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
                                                    <View style={{ flexDirection: 'row', marginTop: 8 }}><TouchableOpacity style={{ marginRight: 5, backgroundColor: 'rgb(47,94,172)', padding: 6, paddingLeft: 14, paddingRight: 14 }}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>Đặt khám</Text></TouchableOpacity><TouchableOpacity style={{ backgroundColor: 'rgb(47,94,172)', padding: 6, paddingLeft: 14, paddingRight: 14 }}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>Đánh giá</Text></TouchableOpacity></View>
                                                </View>
                                                <ImageProgress
                                                    indicator={Progress} resizeMode='cover' style={{ width: 80, height: 80 }} imageStyle={{
                                                        borderTopLeftRadius: 5.3,
                                                        borderBottomLeftRadius: 5.3,
                                                        width: 80, height: 80
                                                    }} source={{ uri: image }}
                                                    defaultImage={() => {
                                                        return <ScaledImage resizeMode='cover' source={require("@images/noimage.jpg")} width={80} height={80} style={{
                                                            borderTopLeftRadius: 5.3,
                                                            borderBottomLeftRadius: 5.3
                                                        }} />
                                                    }} />
                                            </View>
                                            <Text style={{ fontSize: 12, marginTop: 14, marginBottom: 10 }} numberOfLines={2} ellipsizeMode='tail'>Xóm Hải Bình, Nga Hải, Nga Sơn, Thanh Hóa</Text>

                                            <PhotoGrid source={list_images} onPressImage={uri => { }} />
                                            <Text style={{ fontSize: 16, marginTop: 15, textAlign: 'justify', lineHeight: 22, marginBottom: 20 }}>{facility.facility.introduction}</Text>
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
                                <SearchPanel searchTypeId={realmModel.DRUG_HISTORY}
                                    resultPage="searchDrugResult"
                                    ref={ref => this.searchPanel = ref}
                                    onFocus={this.searchFocus.bind(this)}
                                    placeholder="Nhập địa điểm muốn tìm kiếm"
                                    onSearch={this.onSearch.bind(this)}
                                    renderItem={this.renderSearchItem.bind(this)}
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
export default connect(mapStateToProps)(SearchDrugScreen);