import React, { Component, PropTypes } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput } from 'react-native'
import { connect } from 'react-redux';
import ActivityPanel from '@components/ActivityPanel'
import serviceProvider from '@dhy/data-access/booking-service-provider';
// import { Actions } from 'react-native-router-flux';
import constants from '@resources/strings';
import ScaleImage from 'mainam-react-native-scaleimage';
let $this;
class SelectSpecialistScreen extends Component {
    Actions
    constructor(props) {
        super(props);
        $this = this;
        this.state = {
            listService: [],
            listServiceSearch: [],
            searchValue: "",
            refreshing: false,
        }
        this.onRefresh = this.onRefresh.bind(this);

    }
    componentDidMount() {
        this.onRefresh();
    }
    selectSpecialist(item) {
        this.props.dispatch({
            type: constants.action.action_select_booking_specialist, value: item
        })
        Actions.selectDoctor();
    }


    onRefresh = () => {
        this.setState({ refreshing: true }, () => {
            serviceProvider.getListSpecialistByDepartment(this.props.booking.currentDepartment.id, (res) => {
                console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")
                console.log(JSON.stringify(res))
                console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")
                this.setState({
                    listService: res,
                    refreshing: false
                })
                this.onSearch();
            });
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
            return s == null || item.name && item.name.toLowerCase().indexOf(s.toLowerCase()) != -1;
        });

        console.log("=======================================================")
        console.log(JSON.stringify(listSearch))
        console.log("=======================================================")
        this.setState({ listServiceSearch: listSearch });
    }
    renderSearchButton() {
        return (
            <TouchableOpacity onPress={() => this.showSearch()}>
                <ScaleImage source={require("@images/ic_search.png")} width={20} />
            </TouchableOpacity>
        );
    }

    renderFooter = () => {
        if (this.state.listService && this.state.listService.length > 0)
            return null;

        return (
            <View>
                <Text style={{ padding: 10, textAlign: 'center', fontStyle: 'italic' }}>{constants.msg.app.pull_to_reload_app}</Text>
            </View>
        );
    };
    render() {
        return (
            <ActivityPanel title={this.state.showSearch ? constants.find_category : (this.props.booking.currentDepartment ? this.props.booking.currentDepartment.name : "")} isLoading={this.state.isLoading} menuButton={this.renderSearchButton()} style={{ backgroundColor: '#e5fafe' }} >
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
                            <TextInput autoFocus={true} style={{ flex: 1, color: '#FFF', padding: 10 }} placeholderTextColor='#dddddd' underlineColorAndroid="transparent" placeholder={"Nhập từ khóa tìm kiếm"} onChangeText={(s) => {
                                this.searchTextChange(s);
                            }} returnKeyType="search" onSubmitEditing={() => { this.onSearch() }} />
                            <TouchableOpacity onPress={() => this.onSearch()}>
                                <Text style={{ backgroundColor: '#006ac6', padding: 7, borderRadius: 20, marginRight: 10, paddingLeft: 15, paddingRight: 15, fontWeight: 'bold', color: '#FFF' }}>{constants.search}</Text>
                            </TouchableOpacity>
                        </View>
                        : null

                }

                {
                    this.state.listServiceSearch.length > 0 ?
                        <FlatList
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            ListFooterComponent={this.renderFooter}
                            data={this.state.listServiceSearch}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => {
                                    this.selectSpecialist(item);

                                }}>
                                    <View style={{ marginBottom: 2, backgroundColor: '#FFF', padding: 20, flexDirection: 'column', borderBottomColor: '#e5fafe', borderBottomWidth: 2 }}>
                                        <Text style={{ fontWeight: 'bold' }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        />
                        : <View style={{width:'100%', height:'100%', backgroundColor:'#fff', justifyContent:'center', alignItems:'center'}}>
                            <ScaleImage source={require("@images/empty_result.png")} width={120} />
                            <Text>Không tìm thấy chuyên khoa <Text style={{fontWeight:'bold', color:'#006ac6'}}>{this.state.searchValue}</Text></Text>
                        </View>
                }


            </ActivityPanel >
        )
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}

export default connect(mapStateToProps)(SelectSpecialistScreen);
