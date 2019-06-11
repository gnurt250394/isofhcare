import React, { Component, PropTypes, PureComponent } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Platform } from 'react-native';
import { connect } from 'react-redux';
import ScaledImage from 'mainam-react-native-scaleimage';
import Dash from 'mainam-react-native-dash-view';
import bookingProvider from '@data-access/booking-provider';
import hospitalProvider from '@data-access/hospital-provider';
import constants from '@resources/strings';
import constants2 from '@ehealth/daihocy/resources/strings';
import dateUtils from 'mainam-react-native-date-utils';
import profileProvider from '@data-access/profile-provider';
import snackbar from '@utils/snackbar-utils';
import ImageLoad from 'mainam-react-native-image-loader';
import ehealthProvider from '@data-access/ehealth-provider';

class ListProfileScreen extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            listData: [],
            loading: false,
            hospitals: [],
            loadFirstTime: true
        };
    }
    componentDidMount() {
        this.onRefresh();
    }
    onPress = (item) => {
        this.props.dispatch({ type: constants.action.action_select_patient_group_ehealth, value: item })
        this.props.navigation.navigate('viewInMonth');
    }
    renderItemProfile(item, index) {
        const source = this.props.userApp.currentUser.avatar ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() } : require("@images/new/user.png");
        return <TouchableOpacity style={{}} onPress={() => this.onPress(item)}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ justifyContent: 'center', padding: 10 }}>
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={{ borderRadius: 30, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' }}
                        borderRadius={30}
                        customImagePlaceholderDefaultStyle={[styles.avatar, { width: 60, height: 60 }]}
                        placeholderSource={require("@images/new/user.png")}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={{
                            alignSelf: 'center',
                            borderRadius: 30,
                            width: 60,
                            height: 60
                        }}
                        defaultImage={() => {
                            return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={60} height={60} />
                        }}
                    />
                    <Text style={{ color: '#758289' }}>{item.patientValue}</Text>
                </View>

                <View style={{ flex: 1, borderRightColor: '#c8d1d6', borderRightWidth: 1, paddingVertical: 10 }}>
                    <View style={{ marginHorizontal: 10, position: 'relative', paddingHorizontal: 30 }}>
                        <View style={{ position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, backgroundColor: '#91a3ad', }}></View>
                        <View style={{ width: 20, height: 20, borderWidth: 1.5, borderColor: '#91a3ad', borderRadius: 10, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, top: 0, backgroundColor: '#FFF' }}>
                            <View style={{ width: 8, height: 8, backgroundColor: '#7eac39', borderRadius: 4 }}></View>
                        </View>
                        <View style={{ width: 20, height: 20, borderWidth: 1.5, borderColor: '#91a3ad', borderRadius: 10, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, bottom: 0, backgroundColor: '#FFF' }}>
                            <View style={{ width: 8, height: 8, backgroundColor: '#c84242', borderRadius: 4 }}></View>
                        </View>
                        <Text style={{ fontWeight: 'bold', color: '#63737a' }}>{item.patientName}</Text>
                        {Platform.OS == 'ios' ? <View style={{height:10}}></View> : <View/>}
                        <Text style={{ marginTop: 10,color:'#51626a' }}>{item.hospitalEntity.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10, alignItems: 'center' }}>
                        <ScaleImage resizeMode='cover' source={require("@images/new/ehealth/ic_time.png")} width={20} tintColor={'#8fa1aa'} />
                        <Text style={{ marginLeft: 5, color: '#045684' }}>Gần nhất: {item.latestTime ? item.latestTime.toDateObject('-').format('dd/MM/yyyy') : ''}</Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#f36819', fontSize: 30 }}>{item.countTime}</Text>
                    <Text>lần</Text>
                </View>
            </View>
            <View style={{ height: 1, backgroundColor: '#00000050' }} />
        </TouchableOpacity>
    }
    onRefresh() {
        if (!this.state.loading)
            this.setState(
                { refreshing: true, loading: true },
                () => {
                    this.onLoad();
                }
            );
    }
    onLoad() {
        ehealthProvider.getGroupPatient(this.props.ehealth.hospital.hospital.id).then(res => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
            }, () => {
                if (res.code == 0) {
                    this.setState({
                        listData: res.data,
                        finish: true
                    })
                }
            });
        }).catch(e => {
            this.setState({
                loading: false,
                refreshing: false,
                loadMore: false
            });
        });
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} 
            // title="HỒ SƠ Y BẠ GIA ĐÌNH"
            title = {<Text>HỒ SƠ Y BẠ GIA ĐÌNH{'\n'}<Text style={{fontSize:12,fontWeight:'normal'}}>Tổng: {this.state.listData ? this.state.listData.length : 0} thành viên</Text></Text>}
                icBack={require('@images/new/left_arrow_white.png')}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#22b060"
                actionbarStyle={{
                    backgroundColor: '#22b060',
                    borderBottomWidth: 0
                }}
                titleStyle={{
                    color: '#FFF'
                }}

                showFullScreen={true} isLoading={this.state.isLoading}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    onRefresh={this.onRefresh.bind(this)}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={1}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.listData}
                    ListFooterComponent={() => <View style={{ height: 10 }}></View>}
                    renderItem={({ item, index }) => this.renderItemProfile.call(this, item, index)}
                />
            </ActivityPanel >
        );
    }
}

const styles = StyleSheet.create({
    style1: {
        flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 20
    },
    text1: {
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000"
    },
    hospital_selected: {
        alignItems: 'center',
        height: 105,
        width: 105,
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 3,
        borderColor: '#02c39a',
        borderRadius: 6,
        margin: 5
    },
    hospital: {
        alignItems: 'center',
        height: 105,
        width: 105,
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: 6,
        margin: 5
    },
    item_ehealth: {
        position: 'relative',
        left: 20, right: 30
    },
    item_ehealth2: {
        backgroundColor: '#f8fcf4',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(155, 155, 155, 0.47)',
        borderRadius: 6,
        marginTop: 10,
        marginLeft: 45,
        padding: 12,
    },
    dash: { width: 2, flexDirection: 'column', position: 'absolute', top: 0, left: 10, bottom: 0 },
    item_cycle: { width: 10, height: 10, backgroundColor: '#02c39a', borderRadius: 5, position: 'absolute', left: 6, top: '50%', marginTop: -5 },
    hospital_text: { alignItems: 'flex-end', textAlign: 'center', margin: 5, fontSize: 13 },
    avatar: {
        alignSelf: 'center',
        borderRadius: 25,
        width: 45,
        height: 45
    }
});

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(ListProfileScreen);