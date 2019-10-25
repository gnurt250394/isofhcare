import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import NavigationService from "@navigators/NavigationService";

export default class HeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  onBack = () => {
    NavigationService.pop()
  }
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableOpacity style={styles.btn} onPress={this.onBack}><ScaledImage source={require('@images/new/account/ic_back.png')} height={20}></ScaledImage></TouchableOpacity>
        <ScaledImage source={require('@images/new/account/ic_login_isc.png')} height={80}></ScaledImage>
        <View></View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  btn: { padding: 5 }
})