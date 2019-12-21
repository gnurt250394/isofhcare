import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView, Animated, Alert } from 'react-native';
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
            infoDoctor: {},
            page: 0,
            size: 20,
            refreshing: false,
            item: {},
            type: '',
            tabIndex,
            tabSelect: true,
            latitude: 0,
            longitude: 0
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

    componentDidMount = () => {
        this.getData()
        // setTimeout(()=>{
        //     this.setState({ data, isLoading: false, refreshing: false })

        // },1000)
    };
    getData = () => {
        const { page, size } = this.state


        bookingDoctorProvider.getListDoctor(page, size).then(res => {
            this.setState({ isLoading: false, refreshing: false })
            if (res && res.length > 0) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        }).catch(err => {
            this.formatData([])
            this.setState({ isLoading: false, refreshing: false })

        })
    }
    formatData = (data) => {
        if (data.length == 0) {
            if (this.state.page == 0) {
                this.setState({ data })
            }
        } else {
            if (this.state.page == 0) {
                this.setState({ data })
            } else {
                this.setState(preState => {
                    return { data: [...preState.data, ...data] }
                })
            }
        }
    }
    loadMore = () => {
        const { page, size, data, keyword } = this.state
        if (data.length >= (page + 1) * size) {
            this.setState(preState => {
                return {
                    page: preState.page + 1
                }
            }, () => {
                switch (this.state.type) {
                    case TYPE.SEARCH:
                        this.search()
                        break;
                    case TYPE.HOSPITAL:
                        this.getDoctorHospitals()
                        break;
                    case TYPE.SPECIALIST:
                        this.getDoctorSpecialists()
                        break;
                    default:
                        this.getData()
                        break;
                }
            })
        }
    }
    goDetailDoctor = (item) => () => {
        this.props.navigation.navigate('detailsDoctor', {
            item
        })
    }
    addBookingDoctor = (item) => () => {
        this.props.navigation.navigate('selectTimeDoctor', {
            item,
            isNotHaveSchedule: true
        })
    }
    goToAdvisory = () => {
        this.props.navigation.navigate("listQuestion");
    }

    onChangeText = (state) => (value) => {
        this.setState({ [state]: value })
        if (value.length == 0) {
            this.getData()
        }
    }
    search = async () => {
        try {
            let { keyword, page, size } = this.state

            let res = await bookingDoctorProvider.searchDoctor(keyword, 'en', page + 1, size)
            this.setState({ refreshing: false })
            if (res && res.length > 0) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        } catch (error) {
            this.formatData([])
            this.setState({ refreshing: false })

        }

    }
    onSearch = () => {
        this.setState({
            page: 0,
            refreshing: true,
            type: TYPE.SEARCH
        }, this.search)
    }
    onRefress = () => {
        this.setState({
            page: 0,
            refreshing: true,
            keyword: '',
            item: {},
            type: ''
        }, this.getData)
    }
    keyExtractor = (item, index) => index.toString()
    listEmpty = () => !this.state.isLoading && <Text style={styles.none_data}>Không có dữ liệu</Text>


    backPress = () => this.props.navigation && this.props.navigation.pop()
    renderHeader = () => {
        return (
            <View style={[styles.containerHeader,]}
            >
                <ActionBar
                    actionbarTextColor={[{ color: constants.colors.actionbar_title_color }]}
                    backButtonClick={this.backPress}
                    title={constants.title.select_doctor}
                    icBack={require('@images/new/left_arrow_white.png')}
                    titleStyle={[styles.titleStyle]}
                    actionbarStyle={[{ backgroundColor: constants.colors.actionbar_color }, styles.actionbarStyle]}
                />
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
            </View>
        )
    }
    getCurrentLocation(callAgain) {
        RNLocation.getLatestLocation().then(region => {
            locationProvider.saveCurrentLocation(region.latitude, region.longitude);
            this.setState({
                latitude: region.latitude,
                longitude: region.longitude
            }, this.onRefress);
        }).catch(() => {
            locationProvider.getCurrentLocationHasSave().then(s => {
                if (s && s.latitude && s.longitude) {
                    s.latitudeDelta = 0.1;
                    s.longitudeDelta = 0.1;
                    this.setState({
                        latitude: region.latitude,
                        longitude: region.longitude
                    }, this.onRefress);
                }
            }).catch(e => {
                if (!callAgain) {
                    this.getCurrentLocation(true);
                }
            });
        });
    }

    getLocation() {
        let getLocation = () => {
            RNLocation.requestPermission({
                ios: 'whenInUse', // or 'always'
                android: {
                    detail: 'coarse', // or 'fine'
                    rationale: {
                        title: constants.booking.location_premmission,
                        message: constants.booking.location_premission_content,
                        buttonPositive: constants.actionSheet.accept,
                        buttonNegative: constants.actionSheet.cancel
                    }
                }
            }).then(granted => {
                if (granted) {
                    RNLocation.getLatestLocation().then(region => {
                        locationProvider.saveCurrentLocation(region.latitude, region.longitude);
                        this.setState({
                            latitude: region.latitude,
                            longitude: region.longitude
                        }, this.onRefress);
                    }).catch((e) => {
                        locationProvider.getCurrentLocationHasSave().then(s => {
                            if (s && s.latitude && s.longitude) {
                                s.latitudeDelta = 0.1;
                                s.longitudeDelta = 0.1;
                                this.setState({
                                    latitude: region.latitude,
                                    longitude: region.longitude
                                }, this.onRefress);
                            }
                        }).catch(e => {
                            if (!callAgain) {
                                console.log("callAgain");
                                this.getCurrentLocation(true);
                            }
                        });
                    });
                }
            });
        }

        if (Platform.OS == 'android') {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 15000,
            })
                .then(region => {
                    console.log('region: ', region);
                    locationProvider.saveCurrentLocation(region.latitude, region.longitude);
                    this.setState({
                        latitude: region.latitude,
                        longitude: region.longitude
                    }, this.onRefress);
                })
                .catch((error) => {
                    const { code, message } = error
                    if (code == 'UNAVAILABLE') {
                        this.requestPermission()
                    }
                });
        }
        else {
            try {
                LocationSwitch.isLocationEnabled(() => {
                    getLocation();
                }, this.requestPermission);
            } catch (error) {
            }
        }

    }
    requestPermission = () => {
        LocationSwitch.enableLocationService(1000, true, () => {
            this.setState({ isLoading: true }, this.getLocation);
        }, () => {
            this.setState({ locationEnabled: false });
        });
    }
    getListLocation = () => {
        this.getLocation()
    }
    render() {
        const { refreshing, data } = this.state
        return (
            <ActivityPanel
                actionbar={this.renderHeader}
                isLoading={this.state.isLoading}>

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
                        ref={viewPager => {
                            this.viewPager = viewPager;
                        }}
                        onPageScroll={this.onPageScroll}>
                        <View style={[styles.flex, { paddingTop: 10, }]}>
                            <ListDoctorOfSpecialistScreen />
                        </View>
                        <View style={[styles.flex, { paddingTop: 10, }]}>
                            <ListHospitalOfSpecialistScreen />
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
        backgroundColor: '#27c8ad'
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