import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import { Text, StatusBar, TouchableOpacity, TextInput, FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import constants from '@resources/strings'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Activity from 'mainam-react-native-activity-panel';
import ActionBar from '@components/Actionbar';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import realmModel from '@models/realm-models';
import historyProvider from '@data-access/history-provider';



class SearchPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            keyword: ""
        }
    }
    search() {
        try {
            if (this.props.resultPage) {
                this.props.navigation.navigate(this.props.resultPage, { keyword: this.state.keyword })
            }
        } catch (error) {

        }
    }
    onClickItemHistory(keyword) {
        this.setState({ keyword }, () => {
            this.search();
        })
    }

    onFocus() {
        this.setState({ showSuggesh: true }, () => {
            if (this.props.onFocus)
                this.props.onFocus(this);
        })
        const { searchTypeId } = this.props;
        historyProvider.getListHistory("", searchTypeId, this.getListHistoryCallback.bind(this));
    }
    getListHistoryCallback(data) {
        try {
            this.setState({
                history: data ? data : []
            });
        } catch (error) {
            this.setState({
                history: []
            });
        }
    }
    clear() {
        if (this.searchInput)
            this.searchInput.blur();
        this.setState({
            keyword: "",
            showSuggesh: false,
            data: [],
            history: []
        });

    }
    onChangeText(s) {
        this.setState({ keyword: s });
        if (s) {
            this.setState({ showHistory: true }, () => {
                if (this.props.onSearch) {
                    this.props.onSearch(s).then((data) => {
                        this.setState({ data })
                    }).catch((e) => {
                        this.setState({ data: [] })
                    });
                }
            });
        }
        else {
            this.setState({ data: [] });
        }
    }
    renderFooter() {
        if (this.props.renderFooter)
            return this.props.renderFooter(this.state.keyword, this.state.data);
        return <View />
    }
    renderItem({ item, index }) {
        if (this.props.renderItem) {
            return this.props.renderItem(item, index, this.state.keyword);
        }
        return <View />;
    }
    render() {
        return (
            <View {...this.props}>
                <View style={{ borderColor: 'rgba(151,151,151,0.55)', borderRadius: 5, borderWidth: 1.5, zIndex: 1001, flexDirection: 'row', alignItems: 'center', paddingLeft: 10, margin: 3, backgroundColor: '#FFF' }}>
                    <TextInput numberOfLines={1} place onFocus={this.onFocus.bind(this)} ref={ref => this.searchInput = ref} placeholder={this.props.placeholder ? this.props.placeholder : "Tìm kiếm"} style={{ flexDirection: 'row', flex: 1, padding: 8, fontSize: 14, overflow: 'hidden', flexWrap: 'nowrap' }} returnKeyType="search" underlineColorAndroid="transparent" onSubmitEditing={this.search.bind(this)} onChangeText={this.onChangeText.bind(this)} value={this.state.keyword} />
                    {
                        this.state.keyword ?
                            <TouchableOpacity style={{ padding: 10 }} onPress={this.clear.bind(this)}>
                                <ScaledImage width={12} style={{ margin: 4 }} source={require("@images/icclose.png")} />
                            </TouchableOpacity> : <ScaledImage width={20} style={{ margin: 10 }} source={require("@images/ictimkiem.png")} />
                    }
                </View>
                {
                    (this.state.history && this.state.history.length > 0 && !this.state.keyword) || this.state.keyword ?
                        <View style={{ borderColor: 'rgba(151,151,151,0.55)', paddingTop: 50, right: 0, left: 0, position: 'absolute', backgroundColor: '#FFF', zIndex: 1000, borderRadius: 6, borderWidth: 1, margin: 3, padding: 10 }}>
                            {
                                (this.state.keyword) ?
                                    this.state.data && this.state.data.length != 0 ?
                                        <FlatList
                                            style={{ zIndex: 1010, marginTop: 10 }}
                                            keyExtractor={(item, index) => index.toString()}
                                            extraData={this.state}
                                            data={this.state.data}
                                            ListFooterComponent={this.renderFooter.bind(this)}
                                            renderItem={this.renderItem.bind(this)}
                                        /> :
                                        <Text style={{ textAlign: 'center', margin: 10 }}>Không tìm thấy kết quả nào</Text>
                                    : this.state.history && this.state.history.length > 0 ?
                                        <FlatList
                                            style={{ zIndex: 1011, marginTop: 10 }}
                                            keyExtractor={(item, index) => index.toString()}
                                            extraData={this.state}
                                            data={this.state.history}
                                            renderItem={({ item, index }) =>
                                                <TouchableOpacity style={{ padding: 5 }} onPress={() => { this.onClickItemHistory(item.name) }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <ScaledImage source={require("@images/search/time-left.png")} width={15} />
                                                        <Text style={{ marginLeft: 5 }}>{item.name}</Text>
                                                    </View>
                                                    <View style={{ height: 0.5, backgroundColor: '#00000040', marginTop: 12 }} />
                                                </TouchableOpacity>
                                            }
                                        /> : null
                            }

                        </View> : null

                }

            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        navigation: state.navigation
    }
}
export default connect(mapStateToProps, null, null, { withRef: true })(SearchPanel);