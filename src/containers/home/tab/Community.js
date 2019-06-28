import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Chức năng đang phát triển </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        alignItems:'center',
        justifyContent: 'center',
    },
    text:{
        fontSize:20,
        fontWeight: 'bold',
        color:'#4BBA7B',
        fontStyle: 'italic',

    }
})
