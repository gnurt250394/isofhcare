import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import {
    View, StyleSheet, Text, TouchableOpacity,
    FlatList, ActivityIndicator, TextInput, Platform,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import hospitalProvider from '@data-access/hospital-provider';
import ImageLoad from 'mainam-react-native-image-loader';
import snackbar from '@utils/snackbar-utils';
import DialogBox from 'react-native-dialogbox';
import locationProvider from '@data-access/location-provider';
import RNLocation from 'react-native-location';
import clientUtils from '@utils/client-utils';
import LocationSwitch from 'mainam-react-native-location-switch';
import constants from '@resources/strings';
import GetLocation from 'react-native-get-location'

class SelectLocationEhealthScreen extends Component {
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
                enableHighAccuracy: false,
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
            }
        }).catch(e => {
            this.onRefresh();
        });
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
    onLoad() {
        const { page, size } = this.state;
        let stringQuyery = this.state.keyword ? this.state.keyword.trim() : ""
        this.setState({
            loading: true,
            refreshing: page == 1,
            loadMore: page != 1
        }, () => {
            let promise = null;
            if (this.state.region) {
                promise = hospitalProvider.getByLocation(page, size, this.state.region.latitude, this.state.region.longitude, stringQuyery, -1, 1);
            }
            else {
                promise = hospitalProvider.getByLocation(page, size, 190, 190, stringQuyery, -1, 1);
            };
            promise.then(s => {
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadMore: false
                }, () => {
                    switch (s.code) {
                        case 500:
                            // alert(JSON.stringify(s));
                            snackbar.show(constants.msg.error_occur, "danger");
                            break;
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
        this.props.navigation.navigate('addNewEhealth', { hospital: item })
    }
    search() {
        this.setState({ page: 1 }, () => {
            this.onLoad();
        })
    }
    onChangeText = state => value => {
        this.setState({ [state]: value })
    }
    keyExtractor = (item, index) => index.toString()
    headerComponent = () => {
        return (
            !this.state.refreshing &&
                (!this.state.data || this.state.data.length == 0) ? (
                    <View style={styles.containerNoneData}>
                        <Text style={styles.txtNoneData}>
                            {constants.none_data}</Text>
                    </View>
                ) : null
        )
    }
    footerComponent = () => <View style={{ height: 10 }} />
    renderItem = ({ item, index }) => {
        const source = item.medicalRecords && item.medicalRecords.avatar ? { uri: item.medicalRecords.avatar.absoluteUrl() } : require("@images/new/user.png");
        return <TouchableOpacity style={styles.details} onPress={this.selectHospital.bind(this, item)}>
            {this.state.region &&
                < View style={styles.containerKM}>
                    <ScaleImage style={styles.plac} height={21} source={require("@images/new/hospital/ic_place.png")} />
                    <Text style={styles.bv1}>{(Math.round(item.hospital.distance * 100) / 100).toFixed(2)} km</Text>
                </View>
            }
            <View style={styles.containerInfo}>
                <Text style={styles.bv} numberOfLines={2}>{item.hospital.name}</Text>
                <Text style={styles.bv1} numberOfLines={2}>{item.hospital.address}</Text>
            </View>
            <ScaleImage style={styles.help} height={21} source={require("@images/new/hospital/ic_info.png")} />
        </TouchableOpacity>
    }

    render() {
        return (
            <ActivityPanel
                title={constants.title.select_hospital}
                style={styles.container}
            >
                <DialogBox ref={dialogbox => { this.dialogbox = dialogbox }} />

                <View style={styles.container}>
                    <TouchableOpacity style={styles.search} onPress={this.getLocation.bind(this)}>
                        <ScaleImage style={styles.aa} width={18} source={require("@images/new/hospital/ic_placeholder.png")} />
                        <Text style={styles.tkdiachi}>{constants.booking.location_around}</Text>
                    </TouchableOpacity>
                    <View style={[styles.search, styles.containerSearch]} >
                        <ScaleImage style={styles.aa} width={18} source={require("@images/new/hospital/ic_search.png")} />
                        <TextInput
                            value={this.state.keyword}
                            onChangeText={this.onChangeText('keyword')}
                            onSubmitEditing={this.search.bind(this)}
                            returnKeyType='search'
                            style={styles.tkdiachi1} placeholder={constants.search + '???'} underlineColorAndroid={"transparent"} />
                    </View>
                    <View style={styles.lineHeader}></View>
                    <FlatList
                        onRefresh={this.onRefresh.bind(this)}
                        refreshing={this.state.refreshing}
                        style={styles.sc}
                        keyExtractor={this.keyExtractor}
                        extraData={this.state}
                        data={this.state.data}
                        onEndReached={this.onLoadMore.bind(this)}
                        onEndReachedThreshold={1}
                        ListHeaderComponent={this.headerComponent}
                        ListFooterComponent={this.footerComponent}
                        renderItem={this.renderItem}
                    />
                </View>
                {
                    this.state.loadMore ?
                        <View style={styles.loading}>
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
        userApp: state.auth.userApp
    };
}
const styles = StyleSheet.create({
    loading: {
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    containerInfo: {
        flex: 1,
        marginLeft: 20
    },
    containerKM: {
        marginLeft: 20,
        alignItems: 'center',
        marginTop: 5
    },
    txtNoneData: { fontStyle: "italic" },
    containerNoneData: { alignItems: "center", marginTop: 50 },
    lineHeader: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        marginTop: 27
    },
    containerSearch: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)'
    },
    AcPanel: {

        backgroundColor: 'rgb(246, 249, 251)',
    },
    cancel: {
        marginLeft: 15
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f5f9',
        borderStyle: 'solid',
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
export default connect(mapStateToProps)(SelectLocationEhealthScreen);