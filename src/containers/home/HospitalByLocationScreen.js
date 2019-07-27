import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions,TouchableOpacity,SafeAreaView,StatusBar,Platform } from 'react-native';
import hospitalProvider from '@data-access/hospital-provider'
import HospitalItem from '@components/hospital/HospitalItem'
import HeaderLine from '@components/home/HeaderLine'
import Actionbar from '@components/home/Actionbar';
import NavigationService from "@navigators/NavigationService";
import ScaledImage from 'mainam-react-native-scaleimage';
import locationProvider from '@data-access/location-provider';
import RNLocation from 'react-native-location';
import clientUtils from '@utils/client-utils';
import LocationSwitch from 'mainam-react-native-location-switch';
import constants from '@resources/strings';
import GetLocation from 'react-native-get-location'
export default class HospitalByLocationScreen extends Component {
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
            disable:false
        }
    }
    onRefresh() {
        if (!this.state.loading)
            this.setState(
                { refreshing: true, page: 1, finish: false, loading: true,disable:true },
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
         if(this.state.region){
            hospitalProvider.getHospitalNear(this.state.region.latitude, this.state.region.longitude).then(s => {
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadMore: false,
                    disable:false
                }, () => {
                    switch (s.code) {
                        case 500:
                            // alert(JSON.stringify(s));
                            snackbar.show(constants.msg.error_occur, "danger");
                            break;
                        case 0:
                            var list = [];
                            var finish = false;
                            list = s.data.hospitals
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
                    disable:false

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
                            }else{
                               
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
            this.onRefresh()
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
            }else{
               
            }
        }).catch(e => {
            console.log(e,'errr')
            this.getLocation()
        });
    }
    getWidth = () => {
        let width = Dimensions.get("window").width;
        return width / 2 - 10;
    }
    renderItem = (item, index) => {
        return (
            <HospitalItem isHopitalNear={true} widthImg={this.getWidth()} index={item.index} item={item}></HospitalItem>

        )
    }
    
    render() {
        return (
            <SafeAreaView style={styles.container}
            >
            <StatusBar barStyle = {Platform.OS == 'ios'?'dark-content':'light-content'} backgroundColor={'#4BBA7B'}></StatusBar>
                <Actionbar />
                <HeaderLine onPress={this.onShowInfo} isShowViewAll={false} title={'PHÒNG KHÁM, BỆNH VIỆN GẦN BẠN'} />
                <View style={styles.viewFlatList}>
                    <FlatList
                        style={{ flex: 1 }}
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        numColumns={2}
                        onRefresh = {this.getLocation}
                        refreshing = {this.state.refreshing}
                        renderItem={({ item, index }) =>
                                    this.renderItem(item, index)
                                }                        // ListFooterComponent={() =>
                        //     <View style={{ height: 200 }}>

                        //     </View>
                        // }
                        showsVerticalScrollIndicator={false}

                    >

                    </FlatList>
                </View>
            <View style={styles.viewBtn}>
                <TouchableOpacity onPress = {() => NavigationService.pop()} style = {styles.btnBack}>
                    <Text style={styles.txBtn}>Trở lại</Text>
                </TouchableOpacity>
            </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    btnBack:{
        width:115,
        height:30,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:"#4BBA7B",
        marginRight: 10,
        borderRadius: 5,
    },
    container:{ flex: 1,backgroundColor:'#fff', },
    viewFlatList:{ alignItems: 'center', width: '100%',flex:1 },
    viewBtn:{height:50,alignItems:'flex-end',backgroundColor:'#fff',justifyContent:'center'},
    txBtn:{color:'#fff',textAlign:'center'}
})
