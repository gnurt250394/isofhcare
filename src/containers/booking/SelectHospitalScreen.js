import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
    View, StyleSheet, Text, TouchableOpacity,
    FlatList, ActivityIndicator, TextInput, Platform,
    PermissionsAndroid
} from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import { Card } from 'native-base';
import hospitalProvider from '@data-access/hospital-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import snackbar from '@utils/snackbar-utils';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import DialogBox from 'react-native-dialogbox';
import constants from '@dhy/strings';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import dataCacheProvider from '@data-access/datacache-provider';
import locationProvider from '@data-access/location-provider';

import clientUtils from '@utils/client-utils';
class SelectHospitalScreen extends Component {
    constructor(props) {
        super(props);

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
                { refreshing: true, page: 1, finish: false, loading: true },
                () => {
                    this.onLoad();
                }
            );
    }
    getCurrentLocation(callAgain) {
        let getLocation = () => {
            return new Promise((resolve, reject) => {
                this.setState({ isLoading: true }, () => {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            this.setState({ isLoading: false }, () => {
                                console.log(position);
                                resolve(position)
                            })
                        });
                },
                    error => {
                        this.setState({ isLoading: false }, () => {
                            console.log(error);
                            reject(e)
                        })
                    },
                    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                );
            });
        }
        getLocation().then(position => {
            if (position) {
                let region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                };
                locationProvider.saveCurrentLocation(position.coords.latitude, position.coords.longitude);
                this.setState({
                    region,
                }, () => {
                    this.props.navigation.replace("selectHospitalByLocation", {
                        region: this.state.region
                    })
                });
            }
        }).catch(x => {
            locationProvider.getCurrentLocationHasSave((s, e) => {
                if (s && s.latitude && s.longitude) {
                    s.latitudeDelta = 0.1;
                    s.longitudeDelta = 0.1;
                    this.setState({
                        region: s,
                    }, () => {
                        console.log("get from lastest location");
                        this.props.navigation.replace("selectHospitalByLocation", {
                            region: this.state.region
                        })
                    });
                } else {
                    if (!callAgain) {
                        console.log("callAgain");
                        this.getCurrentLocation(true);
                    }
                }
            });
        });
    }

    requestLocationPermission() {
        return new Promise((resolve, reject) => {
            try {
                PermissionsAndroid.requestMultiple(
                    [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]
                ).then(granted => {
                    if (
                        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                        &&
                        granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                    )
                        resolve();
                    reject();
                })
            } catch (err) {
                reject();
            }
        });
    }

    getLocation() {
        if (Platform.OS == "ios") {
            this.getCurrentLocation();
        } else {
            this.requestLocationPermission().then(() => {
                LocationServicesDialogBox.checkLocationServicesIsEnabled({
                    message: "<h2 style='color: #0af13e'>Sử dụng vị trí?</h2>Ứng dụng cần quyền truy cập vào vị trí của bạn",
                    ok: "Đồng ý",
                    cancel: "Hủy",
                    enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
                    showDialog: true, // false => Opens the Location access page directly
                    openLocationServices: true, // false => Directly catch method is called if location services are turned off
                    preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
                    preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
                    providerListener: false // true ==> Trigger locationProviderStatusChange listener when the location state changes
                }).then(this.getCurrentLocation.bind(this)).catch(this.getCurrentLocation.bind(this));


                // RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                //     .then(data => {
                //         this.getCurrentLocation.bind(this);
                //     }).catch(err => {
                //         this.getCurrentLocation.bind(this);
                //     });
            }).catch(x => {
                snackbar.show("Ứng dụng cần quyền truy cập vị trí hiện tại của bạn để tìm kiếm địa điểm", "danger");
                return;
            });
        }
    }
    componentDidMount() {
        this.onRefresh();
    }
    onLoadMore() {
        if (!this.state.finish && !this.state.loading)
            this.setState(
                {
                    loadMore: true,
                    refreshing: false,
                    loading: true,
                    page: this.state.page + 1
                },
                () => {
                    this.onLoad()
                }
            );
    }
    onLoad(s) {
        const { page, size } = this.state;
        let stringQuyery = s ? s.trim() : null
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        }, () => {
            hospitalProvider.getBySearch(page, size, stringQuyery).then(s => {
                console.log(s, 'hopspitalllll');
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadMore: false
                }, () => {
                    if (s) {
                        switch (s.code) {
                            case 0:

                                var list = [];
                                var finish = false;
                                if (s.data.data.length == 0) {
                                    finish = true;
                                }
                                if (page != 1) {
                                    list = this.state.data;
                                    list.push.apply(list, s.data.data);
                                }
                                else {
                                    list = s.data.data;
                                }
                                this.setState({
                                    data: [...list],
                                    finish: finish
                                });
                                break;
                        }
                    }
                });
            }).catch(e => {
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadMore: false
                });
            })
        });
    }
    selectHospital(item) {
        let callback = ((this.props.navigation.state || {}).params || {}).onSelected;
        if (callback) {
            callback(item);
            this.props.navigation.pop();
        }
    }
    search() {
        this.setState({ page: 1 }, () => {
            this.onLoad(this.state.keyword);
        })
    }
    getAddress(item) {
        let address = item.hospital.address;
        if (item.zone && item.zone.name)
            address += ", " + item.zone.name;
        if (item.district && item.district.name)
            address += ", " + item.district.name;
        if (item.province && item.province.countryCode)
            address += ", " + item.province.countryCode;
        return address;
    }
    render() {
        return (
            <ActivityPanel
                isLoading={this.state.isLoading}
                style={styles.AcPanel} title="Địa điểm"
                backButton={<TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.props.navigation.pop()}><Text>Hủy</Text></TouchableOpacity>}
                titleStyle={{ marginLeft: 10 }}
                containerStyle={{
                    backgroundColor: "rgb(246, 249, 251)"
                }}
                actionbarStyle={{
                    backgroundColor: '#ffffff',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0, 0, 0, 0.06)'
                }}>
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }} />


                <View style={styles.container}>
                    <TouchableOpacity style={styles.search} onPress={this.getLocation.bind(this)}>
                        <ScaleImage style={styles.aa} width={18} source={require("@images/new/hospital/ic_placeholder.png")} />
                        <Text style={styles.tkdiachi}>Tìm kiếm gần tôi</Text>
                    </TouchableOpacity>
                    <View style={[styles.search, {
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0, 0, 0, 0.06)'
                    }]} >
                        <ScaleImage style={styles.aa} width={18} source={require("@images/new/hospital/ic_search.png")} />
                        <TextInput
                            value={this.state.keyword}
                            onChangeText={s => {
                                this.setState({ keyword: s })
                            }}
                            onSubmitEditing={this.search.bind(this)}
                            returnKeyType='search'
                            style={styles.tkdiachi1} placeholder={"Tìm kiếm…"} underlineColorAndroid={"transparent"} />
                    </View>
                    <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.06)', marginTop: 27 }}></View>
                    <FlatList
                        onRefresh={this.onRefresh.bind(this)}
                        refreshing={this.state.refreshing}
                        style={styles.sc}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        data={this.state.data}
                        onEndReached={this.onLoadMore.bind(this)}
                        onEndReachedThreshold={1}
                        ListHeaderComponent={() =>
                            !this.state.refreshing &&
                                (!this.state.data || this.state.data.length == 0) ? (
                                    <View style={{ alignItems: "center", marginTop: 50 }}>
                                        <Text style={{ fontStyle: "italic" }}>
                                            Không có dữ liệu</Text>
                                    </View>
                                ) : null
                        }
                        ListFooterComponent={() => <View style={{ height: 10 }} />}
                        renderItem={({ item, index }) => {
                            const source = item.medicalRecords && item.medicalRecords.avatar ? { uri: item.medicalRecords.avatar.absoluteUrl() } : require("@images/new/user.png");
                            if (!item.merge) {
                                let address = this.getAddress(item);
                                item.hospital.address = address;
                                item.merge = true;
                            }


                            return <TouchableOpacity style={styles.details} onPress={this.selectHospital.bind(this, item)}>
                                {/* <View style={{ marginLeft: 20, alignItems: 'center', marginTop: 5 }}>
                                    <ScaleImage style={styles.plac} height={21} source={require("@images/new/hospital/ic_place.png")} />
                                    <Text style={styles.bv1}>1km</Text>
                                </View> */}
                                <View style={{ flex: 1, marginLeft: 20 }}>
                                    <Text style={styles.bv} numberOfLines={1}>{item.hospital.name}</Text>
                                    <Text style={styles.bv1} numberOfLines={2}>{item.hospital.address}</Text>
                                </View>
                                <ScaleImage style={styles.help} height={21} source={require("@images/new/hospital/ic_info.png")} />
                            </TouchableOpacity>
                        }}
                    />
                </View>
                {
                    this.state.loadMore ?
                        <View style={{ alignItems: 'center', padding: 10, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                            <ActivityIndicator
                                size={'small'}
                                color={'gray'}
                            />
                        </View> : null
                }
            </ActivityPanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
const styles = StyleSheet.create({
    AcPanel: {

        backgroundColor: 'rgb(246, 249, 251)',
    },
    cancel: {
        marginLeft: 15
    },
    container: {
        flex: 1,
        backgroundColor: 'rgb(246, 249, 251)',
        borderStyle: 'solid',
        paddingTop: 20
    },
    search: {
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.06)',
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    tkdiachi1: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
        marginLeft: 15,
        flex: 1
    },
    city: {
        paddingTop: 15,
        paddingBottom: 15,
        marginLeft: 20,
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#4a4a4a"
    },
    playbtn: {
        position: 'absolute',
        top: 22,
        left: 75
    },

    row: {
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.16)',
        height: 25,
        width: 1,
        position: 'absolute',
        top: 13,
        left: 95

    },
    tk: {
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#8e8e93",
        position: 'absolute',
        top: 16,
        left: 110
    },

    details: {
        flexDirection: 'row',
        paddingVertical: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 0.7,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)'
    },
    sc: {
        backgroundColor: '#FFF', flex: 1
    },
    bv: {
        fontSize: 15,
        fontWeight: "bold",
        letterSpacing: 0,
        color: "#000000",
    },
    bv1: {
        fontSize: 13,
        color: "#00000050",
        marginTop: 9
    },
    help: {
        marginHorizontal: 20,
        marginTop: 5,
        alignItems: 'center'
    },
    aa: {
        marginLeft: 20
    },
    tkdiachi: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#02c39a",
        marginLeft: 15,
    }

})
export default connect(mapStateToProps)(SelectHospitalScreen);