import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Platform, AppState, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import ActivityPanel from "@components/ActivityPanel";
import MapView, { Marker, Polyline, LocalTile, Callout } from 'react-native-maps';
import locationProvider from '@data-access/location-provider';
import LocationSwitch from 'mainam-react-native-location-switch';
import GetLocation from 'react-native-get-location'
import RNLocation from 'react-native-location';
import constants from '@resources/strings';
import bookingSpecialistProvider from '@data-access/booking-specialist-provider';
import ScaledImage from 'mainam-react-native-scaleimage';
import locationUtils from '@utils/location-utils';
import WebView from 'react-native-webview'
const { width, height } = Dimensions.get('window');
const mode = 'driving'; // 'walking';
const LATITUDE_DELTA = 0.0922;
const ASPECT_RATIO = width / height;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };
class MaphospitalScreen extends Component {
    constructor(props) {
        super(props);
        let item = this.props.navigation.getParam('item') || {}
        this.state = {
            item,
            initialRegion: {
                latitude: 21.046469,
                longitude: 105.7871942,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            MARKERS: null,
            origin: '',
            destination: item.contact && item.contact.address || '',
            destMarker: '',
            startMarker: '',
            imageloaded: false,
            isLoading: true,
            appState: AppState.currentState,
            detailRouters: null
        };
    }

    getLocation = () => {
        this.setState({ isLoading: true }, () => {
            locationUtils.getLocation().then(region => {
                console.log('region: ', region);
                this.setState({
                    origin: `${region.latitude},${region.longitude}`,
                }, this.getRoutePoints);
            }).catch(err => {
                    this.setState({ isLoading: false })
                console.log('err: ', err);
                // locationUtils.requestPermission().then((region) => {
                //     this.getLocation()
                // }).catch(err => {
                //     this.setState({ isLoading: false })
                // })
            })

        })

    }

    getRoutePoints() {
        bookingSpecialistProvider.getLocationDirection(this.state.origin, this.state.destination, mode)
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
                        isLoading: false,
                        detailRouters: res.routes[0].legs[0]
                    });

                }
            }).catch(e => {
                console.warn(e)
                this.setState({ isLoading: false })
            });
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


    renderItem = ({ item, index }) => {
        return (
            <WebView
                key={index}
                source={{ html: '<!DOCTYPE html><html><body> <div style="font-size:40px">' + item.html_instructions + '</div><script>window.location.hash="1";document.title = document.height;</script></body></html>' }}
                startInLoadingState={true}
                automaticallyAdjustContentInsets={false}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                style={{
                    padding: 40
                }}
            />
        )
    }
    keyExtractor = (item, index) => `${index}`
    fitAllMarkers() {
        const temMark = this.state.MARKERS;
        this.setState({ isLoading: false });
        if (this.mapRef == null || !temMark) {
            console.log("map is null")
        } else {
            console.log("temMark : " + JSON.stringify(temMark));
            this.mapRef.fitToCoordinates(temMark, {
                edgePadding: DEFAULT_PADDING,
                animated: true,
            });
        }
    }


    componentDidMount() {
        this.getLocation()
    }
    render() {
        return (
            <ActivityPanel
                title={this.state.item.name}
            // isLoading={this.state.isLoading}
            >
                <View style={styles.container}>
                    {
                        this.state.coords ?
                            <MapView
                                ref={ref => { this.mapRef = ref; }}
                                style={styles.map}
                                loadingEnabled
                                onLayout={() => this.fitAllMarkers()}
                            >
                                {
                                    this.state.coords ?
                                        <Polyline
                                            coordinates={this.state.coords}
                                            strokeWidth={4}
                                            strokeColor={"red"}
                                        /> : null
                                }
                                {this.state.startMarker ?
                                    <Marker
                                        key={1}
                                        coordinate={this.state.startMarker}
                                    // image={require('@images/ic_maker.png')}
                                    >
                                    </Marker> : null
                                }
                                {this.state.destMarker ?
                                    <Marker
                                        key={2}
                                        title="aaa"
                                        // image={require('@images/ic_maker.png')}
                                        coordinate={this.state.destMarker}
                                    >
                                        <Callout >
                                            <Text style={{
                                                color: '#00BA99'
                                            }}>{this.state.item.name}</Text>
                                        </Callout>
                                    </Marker> : null
                                }

                            </MapView>
                            :
                            <View style={styles.container}>
                                <MapView
                                    // initialRegion={this.state.initialRegion}
                                    style={styles.map}
                                />

                                <TouchableOpacity
                                    onPress={this.getLocation}
                                    style={[styles.buttonLocation, { bottom: 30, }]}>
                                    {this.state.isLoading ?
                                        <ActivityIndicator color="#FFF" size="small" /> :
                                        <ScaledImage source={require('@images/ic_destination.png')} height={20} />
                                    }
                                </TouchableOpacity>
                            </View>
                    }
                    {this.state.detailRouters ?
                        // <ScrollView >
                        <View style={styles.containerMaptext}>
                            <Text><Text style={{ color: 'red' }}>{this.state.detailRouters?.duration?.text}</Text> ({this.state.detailRouters?.distance?.text})</Text>
                            <Text style={{ color: '#bbb', paddingVertical: 10 }}>Điểm bắt đầu: <Text style={{ color: '#3161AD' }}>{this.state.detailRouters.start_address}</Text></Text>
                            <Text style={{ color: '#bbb', }}>Điểm cuối: <Text style={{ color: '#3161AD' }}>{this.state.detailRouters.end_address}</Text></Text>

                            {/* {this.state.detailRouters.steps.map((item, index) => {
                                    return this.renderItem({ item, index })
                                })} */}
                        </View>
                        // </ScrollView>
                        : null
                    }
                    {/* <TouchableOpacity style={[styles.buttonLocation, {
                        bottom: 80,
                    }]}>
                        <ScaledImage source={require('@images/ic_position.png')} height={20} />
                    </TouchableOpacity> */}

                </View>
            </ActivityPanel>
        );
    }
}

export default MaphospitalScreen;


const styles = StyleSheet.create({
    containerMaptext: {
        padding: 10,
        backgroundColor: '#FFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.6,
        margin: 10,
        elevation:2,
        borderRadius: 5
    },
    buttonLocation: {
        backgroundColor: '#00CBA7',
        padding: 10,
        borderRadius: 20,
        right: 10,
        elevation: 3,
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6

    },
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