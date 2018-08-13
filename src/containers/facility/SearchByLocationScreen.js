import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import drugProvider from '@data-access/drug-provider';
import ItemDrug from '@components/drug/ItemDrug';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
const { width, height } = Dimensions.get('window');
import SearchPanel from '@components/SearchPanel';
import realmModel from '@models/realm-models';

import SlidingPanel from 'mainam-react-native-sliding-up-down';
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
    componentDidMount() {
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
        drugProvider.search(this.state.keyword, page, size, (s, e) => {
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
    onExpand(isExpand,sliderPosition)
    {
        this.setState({ showSearchPanel: !isExpand })
    }
    render() {
        return (
            <ActivityPanel ref={(ref) => this.activity = ref} style={{ flex: 1 }} title="CHỌN ĐỊA ĐIỂM TÌM KIẾM">

                <View style={styles.container}>

                    <View style={{ width: '100%', height: this.state.height - 120, position: 'relative' }}>
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
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{ width: '100%', height: this.state.height - 120 }}
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
                    </View>

                    <SlidingPanel
                        onExpand={this.onExpand.bind(this)}
                        visible={true}
                        AnimationSpeed={400}
                        allowDragging={false}
                        headerLayoutHeight={205}
                        headerLayout={() =>
                            <View style={{ marginTop: 52, alignItems: 'center', width }}>
                                <ScaledImage source={require("@images/facility/icdrag.png")} height={30} />
                                <FlatList
                                    onRefresh={this.onRefresh.bind(this)}
                                    refreshing={this.state.refreshing}
                                    onEndReached={this.onLoadMore.bind(this)}
                                    onEndReachedThreshold={1}
                                    style={{ width, height: height - 110, backgroundColor: '#FFF', marginTop: 5 }}
                                    keyExtractor={(item, index) => index.toString()}
                                    extraData={this.state}
                                    data={this.state.data}
                                    ListHeaderComponent={() => !this.state.refreshing && (!this.state.data || this.state.data.length == 0) ?
                                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                                            <ScaledImage source={require("@images/search/noresult.png")} width={136} />
                                            <TouchableOpacity onPress={() => { this.setState({ keyword: "" }, this.onRefresh) }}>
                                                <Text style={{ marginTop: 20, padding: 20, textAlign: 'center', lineHeight: 30 }}>Chúng tôi không tìm thấy kết quả nào phù hợp, bạn có thể xem thêm <Text style={{ color: "#000", fontWeight: 'bold' }}>CSYT Hàng đầu</Text></Text>
                                            </TouchableOpacity>

                                        </View> : null
                                    }
                                    ListFooterComponent={() => <View style={{ height: 50 }}></View>}
                                    renderItem={({ item, index }) =>
                                        <ItemDrug drug={item} />
                                    }
                                />
                            </View>
                        }
                        slidingPanelLayout={() =>
                            <View>

                            </View>
                        }
                    />
                </View>

                {/* <View style={{ flex: 1, padding: 14 }}>
                    <View style={{ flex: 1 }}>
                        {
                            this.state.keyword ?
                                <Text style={{ marginTop: 13, fontSize: 14 }}>Kết quả tìm kiếm "<Text style={{ fontWeight: 'bold' }}>{this.state.keyword.length > 50 ? this.state.keyword.substring(0, 49) + "..." : this.state.keyword}</Text>"</Text> :
                                null
                        }
                        
                    </View>
                </View>
                {
                    this.state.loadMore ?
                        <View style={{ alignItems: 'center', padding: 10 }}>
                            <ScaledImage width={20} source={require("@images/loading2.gif")} />
                        </View> : null
                } */}
                {
                    this.state.showOverlay ?
                        <TouchableWithoutFeedback onPress={this.overlayClick.bind(this)} style={{}}><View style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: '#37a3ff59' }} /></TouchableWithoutFeedback> : null
                }
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