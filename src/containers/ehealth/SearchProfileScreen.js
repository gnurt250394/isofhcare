import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput } from 'react-native'
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

class SearchProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listService: [],
            listServiceSearch: [],
            searchValue: "",
            refreshing: false,
            dataPatient:this.props.navigation.state.params && this.props.navigation.state.params.dataPatient ? this.props.navigation.state.params.dataPatient : ''
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
    onSearch = () => {
        // var s = this.state.searchValue;
        // var listSearch = this.state.listProfile.filter(function (item) {
        //     return item.deleted == 0 && (item == null || item.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1);
        // });
        // this.setState({ listProfileSearch: listSearch });
        let page = 1
        let size = 10
        let queryString = this.state.searchValue ? this.state.searchValue : ''
        ehealthProvider.search(page, size, queryString).then(s => {
            this.setState({
                refreshing: false
            }, () => {
                if (s.code == 0) {
                    this.setState({
                        listProfileSearch: s.data.data
                    })
                }
            })
        }).catch(e => {
            this.setState({
                listProfileSearch: [],
                refreshing: false
            })
        })
    }
    selectProfile = (item) => {
        console.log(this.props);
        let userId = this.props.userApp.currentUser.id
        let type = constants.key.history.user_ehealth
        let name = ''
        let dataId = item.user.id
        let data = item
        let hospitalId = this.state.dataPatient.hospitalId
        let patientHistoryId = this.state.dataPatient.patientHistoryId
        const { USER_EHEALTH_HISTORY } = realmModel;

        historyProvider.addHistory(userId, USER_EHEALTH_HISTORY, name, dataId, JSON.stringify(data))
        console.log("đâsd",patientHistoryId,hospitalId)
        ehealthProvider.shareWithProfile(dataId,hospitalId,patientHistoryId).then(res => {
            console.log(res,'res')
            if(res.code == 0 && res.data.status == 1){
                snackbar.show('Chia sẻ thành công','success')
                this.props.navigation.pop()
            }else{
                snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại','danger')
            }
            
        }).catch(err => {
            snackbar.show('Có lỗi xảy ra, xin vui lòng thử lại','danger')
            console.log(err)
        })
    }
    renderSearchButton() {
        return (
            <TouchableOpacity onPress={() => this.showSearch()} style={{ padding: 10 }}>
                <ScaleImage source={require("@images/ictimkiem.png")} width={20} />
            </TouchableOpacity>
        );
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
                titleStyle={{ marginRight: 0 }} title={"Chọn hồ sơ"}
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
                            }} returnKeyType="search" onSubmitEditing={() => { this.onSearch }} />
                            <TouchableOpacity onPress={this.onSearch}>
                                <Text style={{ backgroundColor: constants.colors.actionbar_title_color, padding: 7, borderRadius: 20, marginRight: 10, paddingLeft: 15, paddingRight: 15, fontWeight: 'bold', color: '#FFF' }}>{constants.search}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                <View style={{ paddingLeft: 20, paddingVertical: 10, marginTop: 10, backgroundColor: '#fff', borderColor: '#A5A5A5', borderBottomWidth: 0.7 }}><Text style={{ fontSize: 15, color: '#000', }}>Tìm kiếm gần đây</Text></View>
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
                                <Text>Không có hồ sơ chia sẻ gần đây <Text style={{ fontWeight: 'bold', color: constants.colors.actionbar_title_color }}>{this.state.searchValue}</Text></Text>
                            </View> : null
                    }
                    ListFooterComponent={() => <View style={{ height: 10 }} />}
                    data={this.state.listProfileSearch}
                    renderItem={this.renderItem}
                />
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
