import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, ActivityIndicator, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import ActivityPanel from '@components/ActivityPanel'
import serviceTypeProvider from '@data-access/service-type-provider';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import dataCacheProvider from '@data-access/datacache-provider';
import stringUtils from 'mainam-react-native-string-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import ehealthProvider from '@data-access/ehealth-provider';
import historyProvider from '@data-access/history-provider';
import realmModel from '@models/realm-models';
import Modal from '@components/modal';
class SearchProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listService: [],
            listServiceSearch: [],
            searchValue: "",
            refreshing: false,
            dataPatient: this.props.navigation.state.params && this.props.navigation.state.params.dataPatient ? this.props.navigation.state.params.dataPatient : '',
            size: 10,
            page: 1,
            finish: false,
            loading: false,
            status: '',
            isSearch: false

        }
    }
    componentDidMount() {
        this.onRefresh()
    }
    selectServiceType(serviceType) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(serviceType);
            this.props.navigation.pop();
        }
    }
    onRefresh = () => {
        let userId = this.props.userApp.currentUser.id
        let type = constants.key.history.user_ehealth
        const { USER_EHEALTH_HISTORY } = realmModel;

        historyProvider.getListHistory(userId, USER_EHEALTH_HISTORY, this.getListHistoryCallback.bind(this));

    }
    getListHistoryCallback(data) {
        try {
            //     console.log(data);
            //   for(let i = 0; i< data.length;i++){
            //       console.log(data[i],'dataaaaaaa');
            //   }
            let arr = data.map(item => JSON.parse(item.data));
            console.log(arr);
            this.setState({
                listProfileSearch: arr
            })
        } catch (error) {
            console.log(error, 'error');
            this.setState({
                listProfileSearch: []
            });
        }
    }
    showSearch() {
        this.setState({
            showSearch: !this.state.showSearch,
            searchValue: ""
        })
    }
    searchTextChange(s) {
        this.setState({ searchValue: s });
    }
    onRefreshList = () => {
        console.log('onRefreshList')
        if (!this.state.loading)
            this.setState(
                { refreshing: true, page: 1, finish: false, loading: true, isSearch: true },
                () => {
                    this.onSearch();
                }
            );
    }

    onSearch = () => {
        // var s = this.state.searchValue;
        // var listSearch = this.state.listProfile.filter(function (item) {
        //     return item.deleted == 0 && (item == null || item.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1);
        // });
        // this.setState({ listProfileSearch: listSearch });
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        });
        let queryString = this.state.searchValue ? this.state.searchValue.trim().toLowerCase().unsignText().split(' ').join('') : ''
        console.log(queryString)
        ehealthProvider.search(page, size, queryString).then(s => {
            this.setState({
                refreshing: false,
                loading: false,
                loadMore: false
            }, () => {
                if (s) {
                    switch (s.code) {
                        case 0:
                            var list = [];
                            var finish = false;
                            if (s.data.data.length == 0) {
                                finish = true;
                            }
                            if (page != 1) {
                                list = this.state.listProfileSearch;
                                list.push.apply(list, s.data.data);
                            } else {
                                list = s.data.data;
                            }
                            this.setState({
                                listProfileSearch: [...list],
                                finish: finish
                            });
                            break;
                    }
                }
            })
        }).catch(e => {
            this.setState({
                listProfileSearch: [],
                loading: false,
                refreshing: false,
                loadMore: false
            })
        })

    }
    selectProfile = (item) => {
        let userId = this.props.userApp.currentUser.id;
        let dataId = item.user.id;
        const { USER_EHEALTH_HISTORY } = realmModel;
        historyProvider.addHistory(userId, USER_EHEALTH_HISTORY, name, dataId, JSON.stringify(item))

        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(item);
            this.props.navigation.pop();
        }
    }
    renderSearchButton() {
        return (
            <TouchableOpacity onPress={() => this.showSearch()} style={{ padding: 10 }}>
                <ScaleImage source={require("@images/ictimkiem.png")} width={20} />
            </TouchableOpacity>
        );
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState(
                {
                    loadMore: true,
                    refreshing: false,
                    loading: true,
                    page: this.state.page + 1
                },
                () => {
                    this.onSearch(this.state.page);
                }
            )

    }
    renderItem = ({ item }) => {
        const icSupport = require("@images/new/user.png");
        return (
            <TouchableOpacity onPress={() => this.selectProfile(item)}>
                <View style={styles.viewItem}>
                    <View style={styles.viewList}>
                        <View style={styles.viewImage}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={styles.imageStyle}
                                borderRadius={20}
                                customImagePlaceholderDefaultStyle={styles.imageCustom}
                                placeholderSource={icSupport}
                                style={styles.image}
                                resizeMode="cover"
                                loadingStyle={{ size: "small", color: "gray" }}
                                source={item.user.avatar
                                    ? { uri: item.user.avatar.absoluteUrl() }
                                    : icSupport}
                                defaultImage={() => {
                                    return (
                                        <ScaledImage
                                            resizeMode="cover"
                                            source={icSupport}
                                            width={30}
                                            style={styles.scaledImage}
                                        />
                                    );
                                }}
                            />
                            <Text style={styles.textName}>
                                {item.user.name}
                            </Text>
                        </View>
                        <ScaleImage height={15} source={require('@images/new/booking/ic_next.png')}></ScaleImage>
                    </View>
                </View>
            </TouchableOpacity>)
    }
    render() {
        return (
            <ActivityPanel
                backButton={<TouchableOpacity style={styles.activity} onPress={() => this.props.navigation.pop()}><Text>{constants.ehealth.cancel}</Text></TouchableOpacity>}
                titleStyle={styles.titleStyle} title={constants.title.search_profile}
                isLoading={this.state.isLoading} menuButton={this.renderSearchButton()} showFullScreen={true}
            >
                {
                    this.state.showSearch ?
                        <View style={styles.viewSearch}>
                            <TextInput autoFocus={true} style={styles.textInput} placeholderTextColor='#dddddd' underlineColorAndroid="transparent" placeholder={constants.ehealth.inputKeyword} onChangeText={(s) => {
                                this.searchTextChange(s);
                            }} returnKeyType="search" onSubmitEditing={this.onRefreshList} />
                            <TouchableOpacity onPress={this.onRefreshList}>
                                <Text style={styles.txSearch}>{constants.search}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {
                    !this.state.searchValue && !this.state.isSearch ? (
                        <View style={styles.viewTxSearch}><Text style={styles.txtSearch}>{constants.ehealth.lastSearch}</Text></View>

                    ) : null
                }
                <FlatList
                    style={styles.flatList}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    ListHeaderComponent={() =>
                        !this.state.refreshing &&
                            (!this.state.listProfileSearch || this.state.listProfileSearch.length == 0) ?
                            <View style={styles.viewHeader}>
                                <ScaleImage source={require("@images/empty_result.png")} width={120} />
                                <Text style={styles.txErr}>{this.state.searchValue ? constants.ehealth.not_result_for_keyword : constants.ehealth.not_result_for_last_search}<Text style={{ fontWeight: 'bold', color: constants.colors.actionbar_title_color }}>{this.state.searchValue}</Text></Text>
                            </View> : null
                    }
                    onEndReached={this.state.isSearch ? this.onLoadMore.bind(this) : {}}
                    onEndReachedThreshold={this.state.isSearch ? 1 : -1}
                    ListFooterComponent={() => <View style={styles.viewFooter} />}
                    data={this.state.listProfileSearch}
                    renderItem={this.renderItem}
                />
                {
                    this.state.loadMore ?
                        <View style={styles.viewLoading}>
                            <ActivityIndicator
                                size={'small'}
                                color={'gray'}
                            />
                        </View> : null
                }

            </ActivityPanel>
        )
    }
}
const styles = StyleSheet.create({
    viewSearch: {
        justifyContent: 'space-between',
        elevation: 5,
        height: 55,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: constants.colors.actionbar_color,
        flexDirection: 'row'
    },
    textInput: { flex: 1, color: constants.colors.actionbar_title_color, padding: 10 },
    viewItem: { marginBottom: 2, backgroundColor: '#FFF', padding: 20, flexDirection: 'column', borderBottomColor: '#A5A5A5', borderBottomWidth: 0.7 },
    viewList: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    imageStyle: { borderRadius: 15, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' },
    viewImage: { flexDirection: 'row', alignItems: 'center' },
    imageCustom: {
        width: 30,
        height: 30,
        alignSelf: "center"
    },
    image: { width: 30, height: 30 },
    scaledImage: { width: 30, height: 30 },
    textName: { fontWeight: '200', fontSize: 15, marginLeft: 10 },
    activity: { paddingLeft: 20 },
    titleStyle: { marginRight: 0 },
    txSearch: { backgroundColor: constants.colors.actionbar_title_color, padding: 7, borderRadius: 20, marginRight: 10, paddingLeft: 15, paddingRight: 15, fontWeight: 'bold', color: '#FFF' },
    viewTxSearch: { paddingLeft: 20, paddingVertical: 10, marginTop: 10, backgroundColor: '#fff', borderColor: '#A5A5A5', borderBottomWidth: 0.7 },
    txtSearch: { fontSize: 15, color: '#000', },
    flatList: { flex: 1, backgroundColor: '#FFF' },
    viewHeader: { width: '100%', marginTop: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    txErr: { textAlign: 'center' },
    viewLoading: { alignItems: 'center', padding: 10, position: 'absolute', bottom: 0, left: 0, right: 0 },
    viewFooter: { height: 10 }

})
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth

    };
}

export default connect(mapStateToProps)(SearchProfileScreen);
