import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView, Animated, Alert, Platform } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import StarRating from 'react-native-star-rating';
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import ItemDoctor from '@components/booking/doctor/ItemDoctor';
import ScaleImage from "mainam-react-native-scaleimage";
import Carousel, { Pagination } from 'react-native-snap-carousel'
import LinearGradient from 'react-native-linear-gradient'
import ActionBar from '@components/Actionbar';
import constants from '@resources/strings'
import bookingDoctorProvider from '@data-access/booking-doctor-provider'
import { IndicatorViewPager } from "mainam-react-native-viewpager";
import ListDoctorOfSpecialistScreen from './ListDoctorOfSpecialistScreen';
import ListHospitalOfSpecialistScreen from './ListHospitalOfSpecialistScreen';
import locationProvider from '@data-access/location-provider';
import LocationSwitch from 'mainam-react-native-location-switch';
import GetLocation from 'react-native-get-location'
import RNLocation from 'react-native-location';
import locationUtils from '@utils/location-utils';
const { width, height } = Dimensions.get('window')
const TYPE = {
    SEARCH: 'SEARCH',
    HOSPITAL: 'HOSPITAL',
    DOCTOR: 'DOCTOR'
}
class TabDoctorAndHospitalScreen extends Component {
    constructor(props) {
        super(props);
        let tabIndex = 0;
        this.state = {
            isLoading: true,
            data: [],
            keyword: '',
            page: 0,
            size: 20,
            refreshing: false,
            item: {},
            type: '',
            tabIndex,
            tabSelect: true,
            latitude: 0,
            longitude: 0,
            item: this.props.navigation.getParam('item') || {}
        };
    }
    onSetPage = (page) => () => {
        if (this.viewPager) this.viewPager.setPage(page);
    }

    swipe(targetIndex) {
        if (this.viewPager) this.viewPager.setPage(targetIndex);

    }
    onPageScroll = (e) => {
        var tabIndex = e.position;
        var offset = e.offset * 100;
        if (tabIndex == -1 || (tabIndex == 1 && offset > 0)) return;
        this.setState({
            tabSelect: tabIndex == 0
        });
    }



    onChangeText = (state) => (value) => {
        this.setState({ [state]: value })
        if (!value) {
            this.setState({ type: '' })
        }
    }

    onSearch = () => {
        console.log(this.lisDoctor)
        if (!this.state.keyword) {
            return
        }
        this.setState({ type: TYPE.SEARCH })
    }
    onRefress = () => {
        this.setState({ type: '', keyword: '' })
    }



    getListLocation = () => {
        locationUtils.getLocation().then(region => {
            console.log('region: ', region);
            this.setState({
                latitude: region.latitude,
                longitude: region.longitude
            }, this.onRefress);
        }).catch(err => {
            console.log('err: ', err);

        })
    }
    render() {
        const { refreshing, data } = this.state
        return (
            <ActivityPanel
                transparent={true}
                title={constants.title.select_doctor}
                isLoading={this.state.isLoading}>
                <View style={styles.groupSearch}>
                    <TextInput
                        value={this.state.keyword}
                        onChangeText={this.onChangeText('keyword')}
                        onSubmitEditing={this.onSearch}
                        returnKeyType='search'
                        style={styles.inputSearch}
                        placeholder={"Tìm kiếm bác sĩ, chuyên khoa hoặc cơ sở y tế"}
                        underlineColorAndroid={"transparent"} />
                    {
                        this.state.type == TYPE.SEARCH ?
                            <TouchableOpacity style={[styles.buttonSearch, { borderLeftColor: '#BBB', borderLeftWidth: 0.7 }]} onPress={this.onRefress}>
                                <ScaleImage source={require('@images/ic_close.png')} height={16} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={[styles.buttonSearch,]} onPress={this.onSearch}>
                                <ScaleImage source={require('@images/new/hospital/ic_search.png')} height={16} />
                            </TouchableOpacity>

                    }

                </View>
                <View style={styles.container}>
                    <View style={styles.containerTab}>
                        <View style={styles.groupTab}>
                            <TouchableOpacity
                                onPress={this.onSetPage(0)}
                                style={[styles.buttonTab, this.state.tabSelect ? { borderBottomWidth: 2, } : {}]}>
                                <Text style={[styles.txtButtonTab, this.state.tabSelect ? { color: "#3161AD" } : {}]}>BÁC SĨ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.onSetPage(1)}
                                style={[styles.buttonTab, this.state.tabSelect ? {} : { borderBottomWidth: 2 }]}>
                                <Text style={[styles.txtButtonTab, this.state.tabSelect ? {} : { color: '#3161AD' }]}>CƠ SỞ Y TẾ</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={this.getListLocation}
                            style={styles.buttonLocation}>
                            <ScaleImage source={require('@images/ic_location.png')} height={20} style={styles.iconLocation} />
                            <Text style={styles.txtLocation}>Gần tôi</Text>
                        </TouchableOpacity>
                    </View>
                    <IndicatorViewPager style={styles.flex}
                        ref={viewPager => this.viewPager = viewPager}
                        onPageScroll={this.onPageScroll}>
                        <View style={[styles.flex, { paddingTop: 10, }]}>
                            <ListDoctorOfSpecialistScreen
                                item={this.state.item}
                                onRef={ref => this.lisDoctor = ref}
                                type={this.state.type}
                                keyword={this.state.keyword}
                                self={this} />
                        </View>
                        <View style={[styles.flex, { paddingTop: 10, }]}>
                            <ListHospitalOfSpecialistScreen
                                onRef={ref => this.listHospital = ref}
                                type={this.state.type}
                                keyword={this.state.keyword}
                                item={this.state.item}
                                self={this} />
                        </View>
                    </IndicatorViewPager>

                </View>
            </ActivityPanel >
        );
    }
}

export default TabDoctorAndHospitalScreen;


const styles = StyleSheet.create({
    flex: { flex: 1 },
    txtButtonTab: {
        fontWeight: 'bold'
    },
    buttonTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        paddingVertical: 10,
        borderBottomColor: '#3161AD'
    },
    buttonLocation: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconLocation: {
        tintColor: '#00A3FF'
    },
    txtLocation: {
        color: '#00A3FF',
        paddingLeft: 5,
        paddingRight: 10,
    },
    groupTab: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%'
    },
    containerTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderBottomColor: '#BBB',
        borderBottomWidth: 0.6,
    },
    container: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flex: 1
    },
    containerFilte: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
    },
    txtFilter: {
        color: '#FFF',
        textDecorationLine: 'underline',
        paddingRight: 20,
        paddingBottom: 15,
        fontWeight: '700'
    },
    containerHeader: {
        // position: 'absolute',
        zIndex: 100,
        left: 0,
        right: 0,
        // backgroundColor: '#27c8ad'
    },
    actionbarStyle: {
        backgroundColor: '#27c8ad',
        borderBottomWidth: 0
    },
    titleStyle: {
        color: '#FFF',
        marginLeft: 10
    },
    backgroundHeader: {
        backgroundColor: '#27c8ad',
        height: 100,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0
    },
    flex: {
        flex: 1
    },
    linear: {
        width: '100%',
        height: height / 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonSearch: {
        marginRight: -2,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    inputSearch: {
        flex: 1,
        height: 41,
        marginLeft: -10,
        fontWeight: 'bold',
        paddingLeft: 9,
        color: '#000'
    },
    groupSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 7,
        borderTopWidth: 0.5,
        height: 41,
        borderStyle: "solid",
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.26)',
        backgroundColor: '#fff',
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 7
    },
    none_data: {
        fontStyle: 'italic',
        marginTop: '50%',
        alignSelf: 'center',
        fontSize: 17
    },
    Specialist: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111111',
        width: '40%',
        paddingLeft: 10
    },
    between: {
        backgroundColor: '#02c39a',
        height: 1,
        marginVertical: 9,
        width: '100%',
        alignSelf: 'center'
    },




    groupProfile: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },

})