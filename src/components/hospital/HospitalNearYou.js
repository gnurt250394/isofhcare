import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ImageBackground, Platform, ActivityIndicator, FlatList } from 'react-native';
import HeaderLine from '@components/home/HeaderLine'
import ScaledImage from 'mainam-react-native-scaleimage';
import locationProvider from '@data-access/location-provider';
import RNLocation from 'react-native-location';
import clientUtils from '@utils/client-utils';
import LocationSwitch from 'mainam-react-native-location-switch';
import constants from '@resources/strings';
import GetLocation from 'react-native-get-location'
import hospitalProvider from '@data-access/hospital-provider';
import HospitalItem from './HospitalItem'
import NavigationService from "@navigators/NavigationService";


class HospitalNearYou extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            refreshing: false,
            size: 10,
            page: 1,
            keyword: "",
            loadMore: false,
            finish: false,
            loading: false,
        }
    }
    onRefresh() {
        if (!this.state.loading)
            this.setState(
                { refreshing: true, page: 1, finish: false, loading: true,  },
                () => {
                    this.onLoad();
                }
            );
    }
    onLoad(s) {
        const { page, size } = this.state;
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        }, () => {
            if (this.state.region) {
                hospitalProvider.getHospitalNear(this.state.region.latitude, this.state.region.longitude).then(s => {
                    this.setState({
                        loading: false,
                        refreshing: false,
                        loadMore: false,
                    }, () => {
                        switch (s.code) {
                            case 500:
                                // alert(JSON.stringify(s));
                                snackbar.show(constants.msg.error_occur, "danger");
                                break;
                            case 0:
                                var list = [];
                                var finish = false;
                                list = s.data.hospitals.slice(0, 10);
                                this.setState({
                                    data: [...list],
                                    finish: finish
                                });
                                break;
                        }
                    });
                }).catch(e => {
                    this.setState({
                        loading: false,
                        refreshing: false,
                        loadMore: false,

                    });
                })
            }
        });
    }
    getCurrentLocation(callAgain) {
        RNLocation.getLatestLocation().then(region => {
            locationProvider.saveCurrentLocation(region.latitude, region.longitude);
            this.setState({
                region
            }, () => {
                this.onRefresh();
            });
        }).catch(() => {
            locationProvider.getCurrentLocationHasSave().then(s => {
                if (s && s.latitude && s.longitude) {
                    s.latitudeDelta = 0.1;
                    s.longitudeDelta = 0.1;
                    this.setState({
                        region: s,
                    }, () => {
                        this.onRefresh();
                    });
                }
            }).catch(e => {
                if (!callAgain) {
                    console.log("callAgain");
                    this.getCurrentLocation(true);
                }
            });
        });
    }

    getLocation = () => {
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
                            region
                        }, () => {
                            this.onRefresh();
                        });
                    }).catch((e) => {
                        locationProvider.getCurrentLocationHasSave().then(s => {
                            if (s && s.latitude && s.longitude) {
                                s.latitudeDelta = 0.1;
                                s.longitudeDelta = 0.1;
                                this.setState({
                                    region: s,
                                }, () => {
                                    this.onRefresh();
                                });
                            } else {
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
            if (Platform.OS == 'android') {
                GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 15000,
                })
                    .then(region => {
                        locationProvider.saveCurrentLocation(region.latitude, region.longitude);
                        this.setState({
                            region
                        }, () => {
                            this.onRefresh();
                        });
                    })
                    .catch(error => {
                        this.onRefresh();
                    });
            }
        }
        else
            LocationSwitch.isLocationEnabled(() => {
                getLocation();
            }, () => {
                Alert.alert(
                    '',
                    constants.booking.location_open,
                    [
                        {
                            text: constants.actionSheet.cancel,
                            onPress: () => console.log('Cancel Pressed'),
                        },
                        {
                            text: constants.actionSheet.accept,
                            onPress: () => {
                                LocationSwitch.enableLocationService(1000, true, () => {
                                    getLocation();
                                }, () => {
                                    this.setState({ locationEnabled: false });
                                });
                            },
                            style: 'default'
                        }],
                    { cancelable: false },
                );
            });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.countReset) {
            locationProvider.getCurrentLocationHasSave().then(s => {
                if (s && s.latitude && s.longitude) {
                    s.latitudeDelta = 0.1;
                    s.longitudeDelta = 0.1;
                    this.setState({
                        region: s,
                    }, () => {
                        this.onRefresh();
                    });
                } else {

                }
            }).catch(e => {
                console.log(e, 'errr')
                this.getLocation()
            });
        }
    }
    onShowInfo = () => {
        NavigationService.navigate('hospitalByLocation')
    }
    componentDidMount() {
        locationProvider.getCurrentLocationHasSave().then(s => {
            if (s && s.latitude && s.longitude) {
                s.latitudeDelta = 0.1;
                s.longitudeDelta = 0.1;
                this.setState({
                    region: s,
                }, () => {
                    this.onRefresh();
                });
            } else {

            }
        }).catch(e => {
            console.log(e, 'errr')

        });
    }
    renderItem = (item, index) => {
        return (
            <HospitalItem isHopitalNear={true} widthImg={180} widthCard={170} index={index} item={item}></HospitalItem>

        )
    }

    render() {
        console.log(this.state.data, 'dataaaaaa');
        return (
            <View style={{ backgroundColor: '#fff' }}>
                <HeaderLine onPress={this.onShowInfo} isShowViewAll={true} title={Dimensions.get("window").width <= 375 ? 'PHÒNG KHÁM,\nBỆNH VIỆN GẦN BẠN' : 'PHÒNG KHÁM, BỆNH VIỆN GẦN BẠN'} />

                {
                    this.state.region ? (

                        this.state.data ? (
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                                data={this.state.data}
                                renderItem={({ item, index }) =>
                                    this.renderItem(item, index)
                                }
                            />
                        ) : (<ActivityIndicator></ActivityIndicator>)

                    ) : (<View style={styles.viewNotLocation}>
                        <ImageBackground style={styles.imgNotLocation} source={require('@images/new/home/ic_img_location.png')}>
                            <View style={styles.viewBtn}>
                                <Text style={styles.txOpenLocation}>Vui lòng bật vị trí để sử dụng tính năng này</Text>
                                <TouchableOpacity  onPress={this.getLocation} style={styles.btnOpenLocation}><ScaledImage height={20} source={require('@images/new/home/ic_location.png')}></ScaledImage><Text style={{ color: '#fff', marginLeft: 5 }}>Bật ngay</Text></TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>)
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    viewNotLocation: {
        backgroundColor: '#fff', paddingHorizontal: 8
    },
    imgNotLocation: { width: "100%", height: 164, justifyContent: 'flex-end' },
    viewBtn: { backgroundColor: 'rgba(0, 0, 0, 0.5)', marginHorizontal: 20, paddingVertical: 10, marginBottom: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
    btnOpenLocation: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: 5, backgroundColor: '#4BBA7B', padding: 5, width: 100, marginTop: 10 },
    txOpenLocation: { color: '#fff', fontStyle: 'italic' }
});
export default HospitalNearYou;