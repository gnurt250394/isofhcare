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
        let specialist = this.props.navigation.state.params.specialist;
        let serviceType = this.props.navigation.state.params.serviceType;
        if (!hospital) {
            this.props.navigation.pop();
            snackbar.show("Vui lòng chọn địa điểm khám", "danger");
        }
        if (!specialist) {
            this.props.navigation.pop();
            snackbar.show("Vui lòng chọn yêu cầu", "danger");
        }
        this.state = {
            listService: [],
            listServiceSearch: [],
            searchValue: "",
            refreshing: false,
            hospital: hospital || { hospital: {} },
            specialist,
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
            callback(service.service);
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
                        console.log(s, 'ssssssssssss');

                        switch (s.code) {
                            case 0:
                                let specialists = s.data.services.map(item => item.specialist);
                                specialists = [].concat.apply([], specialists);
                                let a = [];
                                specialists.forEach(item => {
                                    if (!a.find(item2 => item2.id == item.id))
                                        a.push(item);
                                });

                                this.setState({
                                    listService: s.data.services,
                                    specialists: specialists || []
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
        var listSearch = this.state.listService.filter(function (item) {
            return s == null || item.service.name && item.service.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1;
        });
        this.setState({ listServiceSearch: listSearch });
    }
    renderSearchButton() {
        return (
            <TouchableOpacity onPress={() => this.showSearch()} style={{ padding: 10 }}>
                <ScaleImage source={require("@images/ictimkiem.png")} width={20} />
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <ActivityPanel
                backButton={<TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.props.navigation.pop()}><Text>Hủy</Text></TouchableOpacity>}
                title={"Dịch vụ"}
                isLoading={this.state.isLoading}
                menuButton={<TouchableOpacity style={styles.menu} onPress={() =>
                    this.props.navigation.navigate('filter', {
                        listSelected: this.state.listSpecialist,
                        specialists: this.state.specialists,
                        onSelected: items => {
                            this.setState({ listSelected: items })
                        }
                    })
                }><ScaleImage style={styles.img} height={20} source={require("@images/new/booking/ic_filter.png")} /></TouchableOpacity>}
                titleStyle={{ marginLeft: 50 }}
                showFullScreen={true}
            >

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', borderTopWidth: 0.5, borderStyle: "solid", borderBottomWidth: 0.5, borderColor: 'rgba(0,0,0,0.26)', backgroundColor: '#fff', paddingHorizontal: 10 }}>
                    <TextInput
                        autoFocus={true} style={{ flex: 1, color: '#8e8e93', padding: 10 }} placeholderTextColor='#dddddd' underlineColorAndroid="transparent" placeholder={"Tìm kiếm..."} onChangeText={(s) => {
                            this.searchTextChange(s);
                        }} returnKeyType="search" onSubmitEditing={() => { this.onSearch() }} />
                    <TouchableOpacity style={{ marginRight: -2 }} onPress={() => this.onSearch()}><ScaleImage source={require('@images/new/hospital/ic_search.png')} height={16}></ScaleImage></TouchableOpacity>
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
                                <Text>Không tìm thấy dịch vụ nào phù hợp <Text style={{ fontWeight: 'bold', color: constants.colors.actionbar_title_color }}>{this.state.searchValue}</Text></Text>
                            </View> : null
                    }
                    ListFooterComponent={() => <View style={{ height: 10 }} />}
                    data={this.state.listServiceSearch}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={this.selectService.bind(this, item)}>
                            <View style={{ marginBottom: 2, backgroundColor: '#FFF', padding: 20, flexDirection: 'column', borderBottomColor: '#00000011', borderBottomWidth: 0.7 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontWeight: 'bold' }}>
                                        {item.service.name}
                                    </Text>
                                    <Text>{item.service.price.formatPrice() + 'đ'}</Text>
                                </View>
                                <Text>
                                    {item.service.describe}
                                </Text>
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
        userApp: state.userApp,
        booking: state.dhyBooking
    };
}

export default connect(mapStateToProps)(SelectServiceScreen);
