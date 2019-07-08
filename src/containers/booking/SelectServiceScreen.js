import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import ActivityPanel from '@components/ActivityPanel'
import serviceProvider from '@data-access/service-provider';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';

class SelectServiceScreen extends Component {
    constructor(props) {
        super(props);
        let hospital = this.props.navigation.state.params.hospital;
        let serviceType = this.props.navigation.state.params.serviceType;
        this.listServicesSelected = this.props.navigation.state.params.listServicesSelected || [];
        if (!hospital) {
            this.props.navigation.pop();
            snackbar.show("Vui lòng chọn địa điểm khám", "danger");
        }
        if (!serviceType) {
            this.props.navigation.pop();
            snackbar.show("Vui lòng chọn yêu cầu", "danger");
        }
        this.state = {
            listService: [],
            listServiceSearch: [],
            searchValue: "",
            refreshing: false,
            hospital: hospital || { hospital: {} },
            serviceType,
            listSpecialist: [],
            specialists: []
        }
    }
    componentDidMount() {
        this.onRefresh();
    }
    selectService(service) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(service.service, service.specialist && service.specialist.length > 0 ? service.specialist[0] : {});
            this.props.navigation.pop();
        }
    }


    onRefresh = () => {
        let serviceType = this.state.serviceType ? this.state.serviceType.id : ''
        let specialist = "";//this.state.specialist ? this.state.specialist.id : ''
        this.setState({ refreshing: true }, () => {
            serviceProvider.getAll(this.state.hospital.hospital.id, specialist, serviceType).then(s => {
                this.setState({
                    refreshing: false
                }, () => {
                    if (s) {
                        switch (s.code) {
                            case 0:
                                 let listService = s.data.data.sort(function(a,b){
                                        return new Date(a.service.createdDate) - new Date(b.service.createdDate);
                                      });
                                this.setState({
                                    listService: listService
                                }, () => {
                                    this.onSearch();
                                });
                        }
                    }
                })
            }).catch(e => {
                this.setState({
                    listService: [],
                    refreshing: false
                })
            })
        });
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
    onSearch() {
        var s = this.state.searchValue;
        var listSearch = this.state.listService.filter(item => {
            return s == null || item.service.name && item.service.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1;
        });
        listSearch = listSearch.map(item => {
            item.checked = this.listServicesSelected.find(item2 => item2.service.id == item.service.id);
            return item;
        })

        this.setState({ listServiceSearch: listSearch });
    }
    renderSearchButton() {
        return (
            <TouchableOpacity onPress={() => this.showSearch()} style={{ padding: 10 }}>
                <ScaleImage source={require("@images/ictimkiem.png")} width={20} />
            </TouchableOpacity>
        );
    }
    onPressItem1(item) {
        let x = this.listServicesSelected.find(item2 => item2.service.id == item.service.id);
        if (x) {
            item.checked = false;
            let index = this.listServicesSelected.indexOf(x);
            this.listServicesSelected.splice(index, 1);
        } else {
            item.checked = true;
            this.listServicesSelected.push(item);
        }


        // debugger;
        // item.checked = !item.checked
        this.setState({
            listServiceSearch: [...this.state.listServiceSearch]
        })
        // this.selectService.bind(this, item)
    }
    ok = () => {
        // let listChecked = this.state.listServiceSearch.filter(item => item.checked);
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(this.listServicesSelected);
            this.props.navigation.pop();
        }
    }
 
    render() {
        return (
            <ActivityPanel
                backButton={<TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.props.navigation.pop()}><Text>Hủy</Text></TouchableOpacity>}
                title={constants.title.service}
                isLoading={this.state.isLoading}
                menuButton={<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {this.renderSearchButton()}
                </View>}
                titleStyle={{ marginLeft: 50 }}
                showFullScreen={true}
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
                            <TextInput autoFocus={true} style={{ flex: 1, color: constants.colors.actionbar_title_color, padding: 10 }} placeholderTextColor='#dddddd' underlineColorAndroid="transparent" placeholder={constants.ehealth.inputKeyword} onChangeText={(s) => {
                                this.searchTextChange(s);
                            }} returnKeyType="search" onSubmitEditing={() => { this.onSearch() }} />
                            <TouchableOpacity onPress={() => this.onSearch()}>
                                <Text style={{ backgroundColor: constants.colors.actionbar_title_color, padding: 7, borderRadius: 20, marginRight: 10, paddingLeft: 15, paddingRight: 15, fontWeight: 'bold', color: '#FFF' }}>{constants.search}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
                <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, backgroundColor: '#FFF' }}>
                    <TouchableOpacity style={{ alignSelf: 'flex-end', paddingVertical: 15, marginRight: 20, flexDirection: 'row' }} onPress={this.ok}><ScaleImage source={require("@images/new/ic_question_check_specialist.png")} width={20} /><Text style={{ color: "#02c39a", fontWeight: 'bold', marginLeft: 10 }}>Xong</Text></TouchableOpacity>
                </View>
                <FlatList
                    style={{ flex: 1, backgroundColor: '#FFF' }}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    ListHeaderComponent={() =>
                        !this.state.refreshing &&
                            (!this.state.listServiceSearch || this.state.listServiceSearch.length == 0) ?
                            <View style={{ width: '100%', marginTop: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                                <ScaleImage source={require("@images/empty_result.png")} width={120} />
                                <Text>{constants.none_service}<Text style={{ fontWeight: 'bold', color: constants.colors.actionbar_title_color }}>{this.state.searchValue}</Text></Text>
                            </View> : null
                    }
                    ListFooterComponent={() => <View style={{ height: 10 }} />}
                    data={this.state.listServiceSearch}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={this.onPressItem1.bind(this, item)}>
                            <View style={[{ marginBottom: 2, padding: 20, flexDirection: 'column', borderBottomColor: '#00000011', borderBottomWidth: 0.7 }, item.checked ? { backgroundColor: 'rgba(240, 243, 189, 0.2)' } : { backgroundColor: '#FFF' }]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontWeight: 'bold', flex: 1}}>
                                        {item.service.name}
                                    </Text>
                                    {item.checked &&
                                        <ScaleImage source={require("@images/new/ic_verified.png")} width={20} />
                                    }
                                    {/* <Text>{item.service.price.formatPrice() + 'đ'}</Text> */}
                                </View>
                                {/* <Text numberOfLines={2}>
                                    {item.service.describe}
                                </Text> */}
                            </View>
                        </TouchableOpacity>
                    }
                />


            </ActivityPanel>
        )
    }
}

const styles = StyleSheet.create({
    menu: {
        padding: 5,
        paddingRight: 15
    },
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}

export default connect(mapStateToProps)(SelectServiceScreen);
