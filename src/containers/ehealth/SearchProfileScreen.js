import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native'
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
import connectionUtils from '@utils/connection-utils';
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
            status: ''

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
                { refreshing: true, page: 1, finish: false, loading: true },
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
        console.log(this.props);
        connectionUtils.isConnected().then(s => {
            let userId = this.props.userApp.currentUser.id
            let type = constants.key.history.user_ehealth
            let name = ''
            let dataId = item.user.id
            let data = item
            let hospitalId = this.state.dataPatient.hospitalId
            let patientHistoryId = this.state.dataPatient.patientHistoryId
            const { USER_EHEALTH_HISTORY } = realmModel;

            historyProvider.addHistory(userId, USER_EHEALTH_HISTORY, name, dataId, JSON.stringify(data))
            ehealthProvider.shareWithProfile(dataId, hospitalId, patientHistoryId).then(res => {
                if (res.code == 0 && res.data.status == 1) {
                    this.setState({
                        status: 1,
                        isVisible: true
                    })
                } else {
                    this.setState({
                        status: 2,
                        isVisible: true
                    })
                }

            }).catch(err => {
                this.setState({
                    status: 2,
                    isVisible: true
                })
                console.log(err)
            })
        }).catch(e => {
            snackbar.show(constants.msg.app.not_internet, "danger");
        })
    }
    renderTextContent = () => {
        switch (this.state.status) {
            case 1: return (
                <Text style={{ textAlign: 'center', marginVertical: 20, marginHorizontal: 10, fontSize: 18 }}>{'Đã chia sẻ Y bạ thành công!'}</Text>
            )
            case 2: return (
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}><ScaleImage height={20} source={require('@images/new/ehealth/ic_warning.png')}></ScaleImage><Text style={{ textAlign: 'center', marginVertical: 20, marginHorizontal: 10, fontSize: 18 }}>{'Chưa chia sẻ được!'}</Text></View>
            )
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
                <View style={{ marginBottom: 2, backgroundColor: '#FFF', padding: 20, flexDirection: 'column', borderBottomColor: '#A5A5A5', borderBottomWidth: 0.7 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ImageLoad
                                resizeMode="cover"
                                imageStyle={{ borderRadius: 15, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' }}
                                borderRadius={20}
                                customImagePlaceholderDefaultStyle={{
                                    width: 30,
                                    height: 30,
                                    alignSelf: "center"
                                }}
                                placeholderSource={icSupport}
                                style={{ width: 30, height: 30 }}
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
                                            style={{ width: 30, height: 30 }}
                                        />
                                    );
                                }}
                            />
                            <Text style={{ fontWeight: '200', fontSize: 15, marginLeft: 10 }}>
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
                backButton={<TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.props.navigation.pop()}><Text>Hủy</Text></TouchableOpacity>}
                titleStyle={{ marginRight: 0 }} title={constants.title.search_profile}
                isLoading={this.state.isLoading} menuButton={this.renderSearchButton()} showFullScreen={true}
            >
                {
                    this.state.showSearch ?
                        <View style={{
                            justifyContent: 'space-between',
                            elevation: 5,
                            height: 55,
                            justifyContent: 'center', alignItems: 'center',
                            backgroundColor: constants.colors.actionbar_color,
                            flexDirection: 'row'
                        }}>
                            <TextInput autoFocus={true} style={{ flex: 1, color: constants.colors.actionbar_title_color, padding: 10 }} placeholderTextColor='#dddddd' underlineColorAndroid="transparent" placeholder={"Nhập từ khóa tìm kiếm"} onChangeText={(s) => {
                                this.searchTextChange(s);
                            }} returnKeyType="search" onSubmitEditing={this.onRefreshList} />
                            <TouchableOpacity onPress={this.onRefreshList}>
                                <Text style={{ backgroundColor: constants.colors.actionbar_title_color, padding: 7, borderRadius: 20, marginRight: 10, paddingLeft: 15, paddingRight: 15, fontWeight: 'bold', color: '#FFF' }}>{constants.search}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                {
                    !this.state.searchValue ? (
                        <View style={{ paddingLeft: 20, paddingVertical: 10, marginTop: 10, backgroundColor: '#fff', borderColor: '#A5A5A5', borderBottomWidth: 0.7 }}><Text style={{ fontSize: 15, color: '#000', }}>Tìm kiếm gần đây</Text></View>

                    ) : null
                }
                <FlatList
                    style={{ flex: 1, backgroundColor: '#FFF' }}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    ListHeaderComponent={() =>
                        !this.state.refreshing &&
                            (!this.state.listProfileSearch || this.state.listProfileSearch.length == 0) ?
                            <View style={{ width: '100%', marginTop: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                                <ScaleImage source={require("@images/empty_result.png")} width={120} />
                                <Text style={{ textAlign: 'center' }}>{this.state.searchValue ? 'Không có kết quả nào cho hồ sơ ' : 'Không có hồ sơ chia sẻ gần đây '}<Text style={{ fontWeight: 'bold', color: constants.colors.actionbar_title_color }}>{this.state.searchValue}</Text></Text>
                            </View> : null
                    }
                    onEndReached={this.state.searchValue ? this.onLoadMore.bind(this) : {}}
                    onEndReachedThreshold={this.state.searchValue ? 1 : -1}
                    ListFooterComponent={() => <View style={{ height: 10 }} />}
                    data={this.state.listProfileSearch}
                    renderItem={this.renderItem}
                />
                {
                    this.state.loadMore ?
                        <View style={{ alignItems: 'center', padding: 10, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                            <ActivityIndicator
                                size={'small'}
                                color={'gray'}
                            />
                        </View> : null
                }
                <Modal
                    isVisible={this.state.isVisible}
                    onBackdropPress={() => this.setState({ isVisible: false })}
                    backdropOpacity={0.5}
                    animationInTiming={500}
                    animationOutTiming={500}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                >
                    <View style={{ backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 60, borderRadius: 5 }}>
                        <Text style={{ fontSize: 22, color: '#27AE60', textAlign: 'center', marginTop: 10, marginHorizontal: 20 }}>Thông báo</Text>
                        {this.renderTextContent()}
                        <TouchableOpacity onPress={() => {
                            this.setState({ isVisible: false })
                            this.props.navigation.pop()
                        }}
                            style={{ justifyContent: 'center', alignItems: 'center', height: 41, backgroundColor: '#878787', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}><Text style={{ color: '#fff' }}>OK, XONG</Text></TouchableOpacity>
                    </View>
                </Modal>
            </ActivityPanel>
        )
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth

    };
}

export default connect(mapStateToProps)(SearchProfileScreen);
