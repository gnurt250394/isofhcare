import React, { Component, PropTypes, PureComponent } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Platform } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import Dash from 'mainam-react-native-dash-view';
import bookingProvider from '@data-access/booking-provider';
import hospitalProvider from '@data-access/hospital-provider';
import constants from '@resources/strings';
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
            <View style={styles.viewItem}>
                <View style={styles.viewImage}>
                    <ImageLoad
                        resizeMode="cover"
                        imageStyle={styles.imageStyle}
                        borderRadius={30}
                        customImagePlaceholderDefaultStyle={[styles.avatar, { width: 60, height: 60 }]}
                        placeholderSource={require("@images/new/user.png")}
                        resizeMode="cover"
                        loadingStyle={{ size: 'small', color: 'gray' }}
                        source={source}
                        style={styles.imgLoad}
                        defaultImage={() => {
                            return <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={60} height={60} />
                        }}
                    />
                    <Text style={{ color: '#758289' }}>{item.patientValue}</Text>
                </View>

                <View style={styles.viewListItem}>
                    <View style={styles.viewPatienName}>
                        <View style={styles.viewLineHeight}></View>
                        <View style={styles.viewBettwen}>
                            <View style={styles.viewCircle}>
                                <View style={styles.viewSquarBlue}></View>
                            </View>
                            <Text style={[styles.txPatientName, Platform.OS == 'ios' ? { width: 165 } : {}]}>{item.patientName}</Text>
                        </View>
                    </View>
                    <View style={styles.viewHospitalName}>
                        <View style={styles.viewTxHospital}>
                            <View style={styles.viewBorderCircleRed}>
                                <View style={styles.viewCircleRed}></View>
                            </View>
                            <Text style={styles.txHospitalEntityName}>{item.hospitalEntity.name}</Text>
                        </View>
                    </View>
                    <View style={styles.viewTime}>
                        <ScaleImage resizeMode='cover' source={require("@images/new/ehealth/ic_timer.png")} width={20} tintColor={'#8fa1aa'} />
                        <Text style={styles.txLastTime}>{constants.ehealth.lastTime2}{item.latestTime ? item.latestTime.toDateObject('-').format('dd/MM/yyyy') : ''}</Text>
                    </View>
                </View>
                <View style={styles.txCountTime}>
                    <Text style={styles.txCount}>{item.countTime}</Text>
                    <Text>{constants.ehealth.time}</Text>
                </View>
            </View>
            <View style={styles.borderBottom} />
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
            <ActivityPanel style={styles.container}
                // title="HỒ SƠ Y BẠ GIA ĐÌNH"
                title={<Text>{constants.title.list_profile_ehealth}{'\n'}<Text style={{ fontSize: 12, fontWeight: 'normal' }}>{constants.ehealth.total}{this.state.listData ? this.state.listData.length : 0}{constants.ehealth.member}</Text></Text>}
                icBack={require('@images/new/left_arrow_white.png')}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#22b060"
                actionbarStyle={styles.actionbarStyle}
                titleStyle={styles.titleStyle}
                showFullScreen={true} isLoading={this.state.isLoading}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    onRefresh={this.onRefresh.bind(this)}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={1}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state}
                    data={this.state.listData}
                    ListFooterComponent={() => <View style={styles.viewFooter}></View>}
                    renderItem={({ item, index }) => this.renderItemProfile.call(this, item, index)}
                />
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
    style1: {
        flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 20
    },
    titleStyle:{
        color: '#FFF'
    },
    viewFooter:{ height: 10 },
    container:{ flex: 1 },
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
    },
    viewItem: {
        flexDirection: 'row'
    },
    viewImage: { justifyContent: 'center', width: 100, alignItems: 'center' },
    imageStyle: { borderRadius: 30, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' },
    imgLoad: {
        alignSelf: 'center',
        borderRadius: 30,
        width: 60,
        height: 60
    },
    viewListItem: { flex: 1, borderRightColor: '#c8d1d6', borderRightWidth: 1, paddingVertical: 10 },
    viewPatienName: { position: 'relative' },
    viewLineHeight: { position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, backgroundColor: '#91a3ad', },
    viewBettwen: { flexDirection: 'row', height: 40 },
    viewCircle: { width: 20, height: 20, borderWidth: 1.5, borderColor: '#91a3ad', borderRadius: 10, justifyContent: 'center', alignItems: 'center', left: 0, bottom: 0, backgroundColor: '#FFF' },
    viewSquarBlue: { width: 8, height: 8, backgroundColor: '#7eac39', borderRadius: 4 },
    txPatientName: { marginLeft: 10, color: '#63737a', fontSize: 15 },
    viewHospitalName: { marginTop: -2, paddingRight: 4 },
    viewTxHospital: { flexDirection: 'row', alignItems: 'flex-start' },
    viewBorderCircleRed: { marginTop: 2, width: 20, height: 20, borderWidth: 1.5, borderColor: '#91a3ad', borderRadius: 10, justifyContent: 'center', alignItems: 'center', left: 0, bottom: 0, backgroundColor: '#FFF' },
    viewCircleRed: { width: 8, height: 8, backgroundColor: '#c84242', borderRadius: 4 },
    txHospitalEntityName: { flex: 1, marginLeft: 10, color: '#51626a', fontSize: 15 },
    viewTime: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
    txLastTime: { marginLeft: 10, color: '#045684' },
    txCountTime: { paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', width: 85 },
    txCount: { color: '#f36819', fontSize: 30 },
    borderBottom: { height: 1, backgroundColor: '#00000050' },
    actionbarStyle: {
        backgroundColor: '#22b060',
        borderBottomWidth: 0
    }

});

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(ListProfileScreen);