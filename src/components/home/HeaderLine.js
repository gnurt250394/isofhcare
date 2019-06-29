import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default class HeaderLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.viewTitle}>
        <View>
          <View style={styles.viewLine}>
          </View>
          <Text style={styles.txTitle}>{this.props.title}</Text>
        </View>
        {this.props.isShowViewAll ? 
        <TouchableOpacity onPress={this.props.onPress} style={{ padding: 5 }}><Text style={styles.txShowAll}>Xem tất cả>></Text></TouchableOpacity> 
        : null}</View>
    );
  }
}
const styles = StyleSheet.create({
  viewLine: {
    height: 2,
    width: 20,
    backgroundColor: '#4BBA7B'
  },
  viewTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,

    marginHorizontal: 10,
  },
  txTitle: { color: '#000', fontWeight: '600', fontSize: 14 },
  txShowAll:{color: '#4BBA7B', fontSize: 12,marginTop: 2, }
})