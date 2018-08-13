import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TextInput, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import drugProvider from '@data-access/drug-provider';
import SearchPanel from '@components/SearchPanel';
import ItemDrug from '@components/drug/ItemDrug';
import realmModel from '@models/realm-models';
const Realm = require('realm');
import historyProvider from '@data-access/history-provider';

class SearchDrugScreen extends Component {
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
            <ActivityPanel style={{ flex: 1 }} title="TRA CỨU THUỐC" showFullScreen={true}>
                <View style={{ flex: 1, padding: 14, position: 'relative' }}>
                    <SearchPanel zIndex={3} searchTypeId={realmModel.DRUG_HISTORY} resultPage="searchDrugResult" ref={ref => this.searchPanel = ref} onFocus={this.searchFocus.bind(this)} placeholder="Tìm kiếm" onSearch={this.onSearch.bind(this)} renderItem={this.renderSearchItem.bind(this)} renderFooter={this.renderFooter.bind(this)} />
                    <Text style={{ marginTop: 23, fontSize: 16, fontWeight: 'bold' }}>Thuốc được tra cứu nhiều</Text>
                    <FlatList
                        onRefresh={this.onRefreshListMost.bind(this)}
                        refreshing={this.state.refreshing_list_most}
                        style={{ flex: 1, marginTop: 10 }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.list_most}
                        ListHeaderComponent={() => !this.state.refreshing_list_most && (!this.state.list_most || this.state.list_most.length == 0) ?
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <Text style={{ fontStyle: 'italic' }}>Hiện tại chưa có thông tin</Text>
                            </View> : null
                        }
                        ListFooterComponent={() => <View style={{ height: 100 }}></View>}
                        renderItem={({ item, index }) =>
                            <ItemDrug drug={item} />
                        }
                    />
                    {
                        this.state.showOverlay ?
                            <TouchableWithoutFeedback onPress={this.overlayClick.bind(this)} style={{}}><View style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: '#37a3ff59'}} /></TouchableWithoutFeedback> : null
                    }
                </View>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(SearchDrugScreen);