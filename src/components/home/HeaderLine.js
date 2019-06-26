import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class HeaderLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.viewTitle}><View>
        <View style={styles.viewLine}>
        </View>
        <Text style={{ color: '#000', fontWeight: '600',fontSize:14 }}>{this.props.title}</Text>
      </View>{this.props.isShowViewAll ? <Text style={{ color: '#4BBA7B',fontSize:12 }}>Xem tất cả>></Text> : null}</View>
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
    alignItems:'center',
    padding: 10,
    marginHorizontal: 10,
  },
})