import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Platform, AppState, PermissionsAndroid } from 'react-native';
import ActivityPanel from "@components/ActivityPanel";
import MapView, { Marker, Polyline } from 'react-native-maps';
import locationProvider from '@data-access/location-provider';
import LocationSwitch from 'mainam-react-native-location-switch';
import GetLocation from 'react-native-get-location'
import RNLocation from 'react-native-location';
import constants from '@resources/strings';
import bookingSpecialistProvider from '@data-access/booking-specialist-provider';
const mode = 'driving'; // 'walking';
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
class MaphospitalScreen extends Component {
    constructor(props) {
        super(props);
        let item = this.props.navigation.getParam('item') || {}
        this.state = {
            item,
            MARKERS: null,
            origin: '0,0',
            destination: item.hospital && item.hospital.contact && item.hospital.contact.address || '',
            destMarker: '',
            startMarker: '',
            imageloaded: false,
            isLoading: true,
            appState: AppState.currentState,
        };
    }
    getCurrentLocation(callAgain) {
        RNLocation.getLatestLocation().then(region => {
            locationProvider.saveCurrentLocation(region.latitude, region.longitude);
            this.setState({
                origin: `${region.latitude},${region.longitude}`
            }, () => {
                this.getRoutePoints(this.state.origin, this.state.destination)
            });
        }).catch(() => {
            locationProvider.getCurrentLocationHasSave().then(s => {
                if (s && s.latitude && s.longitude) {
                    s.latitudeDelta = 0.1;
                    s.longitudeDelta = 0.1;
                    this.setState({
                        origin: `${s.latitude},${s.longitude}`
                    }, () => {
                        this.getRoutePoints(this.state.origin, this.state.destination)
                    });
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
                            origin: `${region.latitude},${region.longitude}`
                        }, () => {
                            this.getRoutePoints(this.state.origin, this.state.destination)
                        });
                    }).catch((e) => {
                        locationProvider.getCurrentLocationHasSave().then(s => {
                            if (s && s.latitude && s.longitude) {
                                s.latitudeDelta = 0.1;
                                s.longitudeDelta = 0.1;
                                this.setState({
                                    origin: `${s.latitude},${s.longitude}`
                                }, () => {
                                    this.getRoutePoints(this.state.origin, this.state.destination)
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
                enableHighAccuracy: true,
                timeout: 15000,
            })
                .then(region => {
                    console.log('region: ', region);
                    locationProvider.saveCurrentLocation(region.latitude, region.longitude);
                    this.setState({
                        origin: `${region.latitude},${region.longitude}`
                    }, () => {
                        this.getRoutePoints(this.state.origin, this.state.destination);
                    });
                })
                .catch(async (error) => {
                    const { code, message } = error
                    // if(code =='UNAUTHORIZED'){
                        GetLocation.openGpsSettings()
                    // }
                    console.log('message: ', message);
                    console.log('code: ', code);
                });
        }
        else {
            try {
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
            } catch (error) {
            }
        }

    }
    getRoutePoints(origin, destination) {
        bookingSpecialistProvider.getLocationDirection(origin, destination, mode)
            .then(res => {
                if (res && res.routes && res.routes.length) {
                    var cortemp = this.decode(res.routes[0].overview_polyline.points)
                    var length = cortemp.length - 1;

                    var tempMARKERS = [];
                    tempMARKERS.push(cortemp[0]);
                    tempMARKERS.push(cortemp[length]);

                    this.setState({
                        coords: cortemp,
                        MARKERS: tempMARKERS,
                        destMarker: cortemp[length],
                        startMarker: cortemp[0],
                    });

                }
            }).catch(e => { console.warn(e) });
    }


    decode(t, e) {
        for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) {
            a = null, h = 0, i = 0;
            do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
            n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0;
            do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
            o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c])
        }
        return d = d.map(function (t) {
            return {
                latitude: t[0],
                longitude: t[1]
            }
        })
    }



    fitAllMarkers() {
        const temMark = this.state.MARKERS;
        this.setState({ isLoading: false });
        if (this.mapRef == null) {
            console.log("map is null")
        } else {
            console.log("temMark : " + JSON.stringify(temMark));
            this.mapRef.fitToCoordinates(temMark, {
                edgePadding: DEFAULT_PADDING,
                animated: true,
            });
        }
    }
   
    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            this.getLocation()

            console.log('App has come to the foreground!');
        }
        this.setState({ appState: nextAppState });
    };
    componentDidMount() {
            this.getLocation()
        AppState.addEventListener('change', this._handleAppStateChange);

    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    render() {
        return (
            <ActivityPanel
                title={this.state.item.hospital.name}
                isLoading={this.state.isLoading}
            >
                <View style={styles.container}>
                    {
                        (this.state.coords != null) ?
                            <MapView
                                ref={ref => { this.mapRef = ref; }}
                                style={styles.map}
                                onLayout={() => this.fitAllMarkers()}>

                                <Polyline
                                    coordinates={this.state.coords}
                                    strokeWidth={4}
                                    strokeColor={"red"}
                                />

                                <Marker
                                    key={1}
                                    coordinate={this.state.startMarker}
                                    image={require('@images/ic_maker.png')}
                                />

                                <Marker
                                    key={2}
                                    image={require('@images/ic_maker.png')}
                                    coordinate={this.state.destMarker}
                                >
                                </Marker>
                            </MapView> : null
                    }
                </View>
            </ActivityPanel>
        );
    }
}

export default MaphospitalScreen;


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});