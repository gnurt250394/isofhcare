import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput } from 'react-native'
import { connect } from 'react-redux';
import ActivityPanel from '@components/ActivityPanel'
import specialistProvider from '@data-access/specialist-provider';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
class SelectSpecialistScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialist: [],
            listSpecialistSearch: [],
            searchValue: "",
            refreshing: false,
        }
    }
    componentDidMount() {
        this.onRefresh();
    }
    selectSpecilist(specialist) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(specialist);
            this.props.navigation.pop();
        }
    }


    onRefresh = () => {
        this.setState({ refreshing: true }, () => {
            specialistProvider.getAll().then(s => {
                this.setState({
                    refreshing: false
                }, () => {
                    if (s) {
                        this.setState({
                            listSpecialist: s
                        }, () => {
                            this.onSearch();
                        });
                    }
                })
            }).catch(e => {
                this.setState({
                    listSpecialist: [],
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
        var listSearch = this.state.listSpecialist.filter(function (item) {
            return s == null || item.name && item.name.trim().toLowerCase().unsignText().indexOf(s.trim().toLowerCase().unsignText()) != -1;
        });
        this.setState({ listSpecialistSearch: listSearch });
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
                titleStyle={{ marginRight: 0 }} title={"Chọn chuyên khoa"}
                isLoading={this.state.isLoading} menuButton={this.renderSearchButton()} style={{ backgroundColor: '#e5fafe' }} showFullScreen={true}
                containerStyle={{
                    backgroundColor: "#f7f9fb"
                }} actionbarStyle={{
                    backgroundColor: '#ffffff',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0, 0, 0, 0.06)'
                }}>
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
                            }} returnKeyType="search" onSubmitEditing={() => { this.onSearch() }} />
                            <TouchableOpacity onPress={() => this.onSearch()}>
                                <Text style={{ backgroundColor: constants.colors.actionbar_title_color, padding: 7, borderRadius: 20, marginRight: 10, paddingLeft: 15, paddingRight: 15, fontWeight: 'bold', color: '#FFF' }}>{constants.search}</Text>
                            </TouchableOpacity>
                        </View>
                        : null

                }

                <FlatList
                    style={{ flex: 1, backgroundColor: '#FFF' }}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    ListHeaderComponent={() =>
                        !this.state.refreshing &&
                            (!this.state.listSpecialistSearch || this.state.listSpecialistSearch.length == 0) ?
                            <View style={{ width: '100%', marginTop: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                                <ScaleImage source={require("@images/empty_result.png")} width={120} />
                                <Text>Không tìm thấy chuyên khoa nào phù hợp <Text style={{ fontWeight: 'bold', color: constants.colors.actionbar_title_color }}>{this.state.searchValue}</Text></Text>
                            </View> : null
                    }
                    ListFooterComponent={() => <View style={{ height: 10 }} />}
                    data={this.state.listSpecialistSearch}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={this.selectSpecilist.bind(this, item)}>
                            <View style={{ marginBottom: 2, backgroundColor: '#FFF', padding: 20, flexDirection: 'column', borderBottomColor: '#00000011', borderBottomWidth: 0.7 }}>
                                <Text style={{ fontWeight: 'bold' }}>
                                    {item.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                />


            </ActivityPanel >
        )
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.dhyBooking
    };
}

export default connect(mapStateToProps)(SelectSpecialistScreen);
