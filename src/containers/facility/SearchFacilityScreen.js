import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import drugProvider from '@data-access/drug-provider';
import SearchPanel from '@components/SearchPanel';
import ItemDrug from '@components/drug/ItemDrug';
import realmModel from '@models/realm-models';
const Realm = require('realm');
import historyProvider from '@data-access/history-provider';
import TopSearch from '@components/department/TopSearch';
import TopFacility from '@components/facility/TopFacility';

class SearchFacilityScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page_list_most: 1,
            size_list_most: 20,
            list_most: [],
            refreshing_list_most: true
        }
    }
    componentDidMount() {
        this.onRefreshListMost();
    }

    onRefreshListMost() {
        if (!this.state.loading_list_most)
            this.setState({ refreshing_list_most: true, page_list_most: 1, loading_list_most: true }, () => {
                this.onLoadListMost();
            });
    }
    onLoadListMost() {
        const { page_list_most, size_list_most } = this.state;
        this.setState({
            loading_list_most: true
        })
        drugProvider.search("", page_list_most, size_list_most, (s, e) => {
            this.setState({
                loading_list_most: false,
                refreshing_list_most: false
            });
            if (s) {
                switch (s.code) {
                    case 0:
                        var list = s.data.data;
                        this.setState({
                            list_most: [...list]
                        });
                        break;
                }
            }
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

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="TÌM KIẾM CSYT">
                <View style={{ flex: 1, padding: 14 }}>
                    <SearchPanel searchTypeId={realmModel.FACILITY_HISTORY} resultPage="searchFacilityResult" ref={ref => this.searchPanel = ref} onFocus={this.searchFocus.bind(this)} placeholder="Nhập tên chuyên khoa/ CSYT hoặc nhà thuốc" onSearch={this.onSearch.bind(this)} renderItem={this.renderSearchItem.bind(this)} renderFooter={this.renderFooter.bind(this)} />
                    <ScrollView>
                        <TouchableOpacity style={{ position: 'relative', marginTop: 20 }} onPress={() => { this.props.navigation.navigate("searchFacilityByLocation") }}>
                            <ScaledImage source={require("@images/facility/vitri.png")} width={Dimensions.get('window').width - 28} height={115} style={{ zIndex: 1000 }} />
                            <View style={{ flexDirection: 'row', zIndex: 1001, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                <ScaledImage source={require("@images/facility/icMap.png")} width={73} height={82} />
                                <View style={{ marginTop: -10, marginLeft: 30 }}>
                                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Xem ngay</Text>
                                    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Các CSYT gần bạn</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={{ flex: 1 }}>
                            <TopSearch />
                            <TopFacility />
                        </View>
                    </ScrollView>
                </View>
                {
                    this.state.showOverlay ?
                        <TouchableWithoutFeedback onPress={this.overlayClick.bind(this)} style={{}}><View style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: '#37a3ff59' }} /></TouchableWithoutFeedback> : null
                }
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(SearchFacilityScreen);