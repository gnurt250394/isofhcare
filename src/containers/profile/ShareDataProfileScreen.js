import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {CheckBox} from 'native-base'
export default class ShareDataProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
      <CheckBox checked={this.state.checked} color="#02C39A"></CheckBox>
      </View>
    );
  }
}
