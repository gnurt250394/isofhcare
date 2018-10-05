import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import constants from '@resources/strings';
import ActivityPanel from '@components/ActivityPanel';
import DoctorTime from '@components/booking/DoctorTime';
import { connect } from 'react-redux';
import userProvider from '@data-access/user-provider';
import Dimensions from 'Dimensions';
import banner from '@images/booking/booking_banner.png'
import doctorProvider from '@data-access/booking-doctor-provider';
// import { Actions } from 'react-native-router-flux';
import ScaleImage from 'mainam-react-native-scaleimage';
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';
// const Actions;
class BookingScreen extends Component {
    Actions
    constructor(props) {
        super(props);
        $this = this;
        this.state = {
            listDoctor: [],
            listDoctorSearch: [],
            searchValue: "",
            refreshing: false,
        }
        this.onRefresh = this.onRefresh.bind(this);

    }
    viewScheduleDoctor(item) {
        this.props.dispatch({
            type: constants.action.action_select_booking_doctor, value: item
        })
        Actions.viewScheduleDoctor();
    }
    componentDidMount() {
        this.onRefresh();
    }

    onRefresh = () => {
        this.setState({ refreshing: true }, () => {
            if (this.props.booking.specialist) {
                doctorProvider.getListDoctorBySpecialistDepartment(this.props.booking.specialist.id, this.props.booking.currentDepartment.id, (res) => {
                    this.setState({
                        listDoctor: res,
                        refreshing: false,
                    });
                    this.onSearch();
                });
            } else {
                doctorProvider.getListDoctorByDepartment(this.props.booking.currentDepartment.id, (res) => {
                    this.setState({
                        listDoctor: res,
                        refreshing: false,
                    });
                    this.onSearch();
                });
            }
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
        var listSearch = this.state.listDoctor.filter(function (item) {
            var name = item.academicRankShortName + " " + item.fullname;
            return s == null || name.toLowerCase().indexOf(s.toLowerCase()) != -1;
        });
        this.setState({ listDoctorSearch: listSearch });
    }
    renderSearchButton() {
        return (
            <TouchableOpacity onPress={() => this.showSearch()}>
                <ScaleImage source={require("@images/ic_search.png")} width={20} />
            </TouchableOpacity>
        );
    }

    renderFooter = () => {
        if (this.state.listDoctor && this.state.listDoctor.length > 0)
            return null;

        return (
            <View>
                <Text style={{ padding: 10, textAlign: 'center', fontStyle: 'italic' }}>{constants.msg.app.pull_to_reload_app}</Text>
            </View>
        );
    };
    render() {
        return (
            <ActivityPanel style={{ flex: 1, }} title={this.state.showSearch ? constants.find_doctor : (this.props.booking.specialist ? this.props.booking.specialist.name : this.props.booking.currentDepartment ? this.props.booking.currentDepartment.name : "")} isLoading={this.state.isLoading} menuButton={this.renderSearchButton()} style={{ backgroundColor: '#e5fafe' }} >
                {
                    this.state.showSearch ?
                        <View style={{
                            justifyContent: 'space-between',
                            elevation: 5,
                            height: 55,
                            justifyContent: 'center', alignItems: 'center',
                            backgroundColor: constants.colors.actionbar_color, flexDirection: 'row'
                        }}>
                            <TextInput autoFocus={true} style={{ flex: 1, color: '#FFF', padding: 10 }} placeholderTextColor='#dddddd' underlineColorAndroid="transparent" placeholder={"Nhập từ khóa tìm kiếm"} onChangeText={(s) => {
                                this.searchTextChange(s);
                            }}
                                returnKeyType="search" onSubmitEditing={() => { this.onSearch() }} />
                            <TouchableOpacity onPress={() => this.onSearch()}>
                                <Text style={{ backgroundColor: '#006ac6', padding: 7, borderRadius: 20, marginRight: 10, paddingLeft: 15, paddingRight: 15, fontWeight: 'bold', color: '#FFF' }}>{constants.search}</Text>
                            </TouchableOpacity>
                        </View>
                        : null

                }

                <View style={{ backgroundColor: "#e7fbff", flex: 1 }}>
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.listDoctorSearch}
                        ListFooterComponent={this.renderFooter}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => { this.viewScheduleDoctor(item) }}>
                                <View style={{ marginBottom: 3, backgroundColor: '#FFF', padding: 10, flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                        <ImageProgress
                                            indicator={Progress} resizeMode='cover' imageStyle={{ borderRadius: 30, borderWidth: 0.5, borderColor: constants.colors.primaryColor }} style={{ width: 60, height: 60 }} source={{ uri: item.avatar ? item.avatar : "undefined" }}
                                            defaultImage={() => {
                                                return (<ScaleImage source={require("@images/doctor.png")} width={60} />)
                                            }} />
                                        <View style={{ flex: 1, marginLeft: 10, flexDirection: 'column' }}>
                                            <Text style={{ fontWeight: 'bold' }}>
                                                {item.academicRankShortName} {item.fullname}
                                            </Text>
                                            <Text style={{ color: '#aeacad', marginTop: 5 }}>
                                                {((item.position ? item.position + " " : "") + (item.award ? item.award : "")).trim()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                </View>

            </ActivityPanel>
        )
    }
}

const styles = StyleSheet.create({
    tabContainer: { flexDirection: 'row', height: 60, backgroundColor: '#000' },
    tabItem: { flex: 1, backgroundColor: '#FFF', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    tabImage: {
        width: 21, height: 21, marginBottom: 5, marginTop: 10
    },
    tabText: {
        fontSize: 12
    }

});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps)(BookingScreen);