/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { View, ScrollView, KeyboardAvoidingView, Text, StatusBar, TouchableOpacity, Image, Platform, Keyboard } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      }
    };
  }
  getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        resolve(position)
      }
        , e => {
          reject(e)
        });
    });
  }
  componentDidMount() {
    if (Platform.OS == "ios") {
      this.getCurrentLocation().then(position => {
        if (position) {
          this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            },
          });
        }
      });
    } else {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
        .then(data => {
          setTimeout(() => {
            this.getCurrentLocation().then(position => {
              if (position) {
                this.setState({
                  region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.003,
                  },
                });
              }
            });
          }, 1000);
        }).catch(err => {
        });
    }



  }

  render() {
    const { region } = this.props;
    console.log(region);

    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: '100%', height: '100%' }}
        showsUserLocation={true}
        region={this.state.region}
      >
        {/* <Marker
          coordinate={
            {
              latitude: 20.9899002,
              longitude: 105.7896239
            }
          }
          image={require('@images/ic_signout.png')}
        /> */}
      </MapView>
    );
  }
}