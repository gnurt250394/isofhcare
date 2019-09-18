import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import { Text, StatusBar, TouchableOpacity, TextInput, FlatList, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import constants from '../res/strings'
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
    onClickItemHistory = (keyword) => () => {
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
        if (this.state.keyword) {

        }
        else {
            historyProvider.getListHistory("", searchTypeId, this.getListHistoryCallback.bind(this));
        }
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
    setValue(text) {
        if (this.searchInput)
            this.searchInput.blur();
        this.setState({
            keyword: text,
            showSuggesh: false,
            data: [],
            history: []
        });
        if (this.props.onSearch) {
            this.props.onSearch(text).then((data) => {
                this.setState({ data })
            }).catch((e) => {
                this.setState({ data: [] })
            });
        }
    }
    keyExtractor = (item, index) => index.toString()
    renderItemHistory = ({ item, index }) => {
        return (
            this.props.renderItemHistory ?
                this.props.renderItemHistory(item, index) :
                <TouchableOpacity style={styles.buttonItemSearch} onPress={this.onClickItemHistory(item.name)}>
                    <View style={styles.containerItemSearch}>
                        <ScaledImage source={require("@images/search/time-left.png")} width={15} />
                        <Text style={styles.txtSearchItem}>{item.name}</Text>
                    </View>
                    <View style={styles.end} />
                </TouchableOpacity>
        )
    }
    render() {
        return (
            <View {...this.props}>
                <View style={styles.containerSearch}>
                    <TextInput
                        numberOfLines={1}
                        onFocus={this.onFocus.bind(this)}
                        ref={ref => this.searchInput = ref}
                        placeholder={this.props.placeholder ? this.props.placeholder : "Tìm kiếm"}
                        style={styles.inputSearch}
                        returnKeyType="search"
                        underlineColorAndroid="transparent"
                        onSubmitEditing={this.search.bind(this)}
                        onChangeText={this.onChangeText.bind(this)}
                        value={this.state.keyword} />
                    {
                        this.state.keyword ?
                            <TouchableOpacity style={styles.buttonClose} onPress={this.clear.bind(this)}>
                                <ScaledImage
                                    width={12}
                                    style={styles.imageClose} source={require("@images/ic_close.png")} />
                            </TouchableOpacity> : <ScaledImage width={20} style={{ margin: 10 }} source={require("@images/ic_timkiem.png")} />
                    }
                </View>
                {
                    (this.state.history && this.state.history.length > 0 && !this.state.keyword) || (this.state.keyword && this.state.showSuggesh) ?
                        <View style={styles.containerListItem}>
                            {
                                (this.state.keyword) ?
                                    this.state.data && this.state.data.length != 0 ?
                                        <FlatList
                                            style={styles.flatlist}
                                            keyExtractor={this.keyExtractor}
                                            extraData={this.state}
                                            data={this.state.data}
                                            ListFooterComponent={this.renderFooter.bind(this)}
                                            renderItem={this.renderItem.bind(this)}
                                        /> :
                                        <Text style={styles.txtnotFound}>Không tìm thấy kết quả nào</Text>
                                    : this.state.history && this.state.history.length > 0 ?
                                        <FlatList
                                            style={styles.flatlist}
                                            keyExtractor={this.keyExtractor}
                                            extraData={this.state}
                                            data={this.state.history}
                                            renderItem={this.renderItemHistory}
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
export default connect(mapStateToProps, null, null, { forwardRef: true })(SearchPanel);

const styles = StyleSheet.create({
    txtnotFound: {
        textAlign: 'center',
        margin: 10
    },
    txtSearchItem: {
        marginLeft: 5
    },
    buttonItemSearch: { padding: 5 },
    containerItemSearch: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    end: {
        height: 0.5,
        backgroundColor: '#00000040',
        marginTop: 12
    },
    flatlist: {
        zIndex: 1010,
        marginTop: 10
    },
    containerListItem: {
        borderColor: 'rgba(151,151,151,0.55)',
        paddingTop: 50,
        right: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: '#FFF',
        zIndex: 1000,
        borderRadius: 6,
        borderWidth: 1,
        margin: 3,
        padding: 10
    },
    imageClose: {
        margin: 4
    },
    buttonClose: { padding: 10 },
    inputSearch: {
        flexDirection: 'row',
        flex: 1,
        padding: 8,
        fontSize: 14,
        overflow: 'hidden',
        flexWrap: 'nowrap'
    },
    containerSearch: {
        borderColor: 'rgba(151,151,151,0.55)',
        borderRadius: 5,
        borderWidth: 1.5,
        zIndex: 1001,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        margin: 3,
        backgroundColor: '#FFF'
    },
})