/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, PropTypes} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import dateUtils from 'mainam-react-native-date-utils';

export default class DateMessage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerDate}>
          <Text style={styles.txtDate}>
            {this.props.message?.createdAt
              ?.toDateObject?.()
              .format('dd/MM/yyyy')}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txtDate: {
    color: '#00000040',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  containerDate: {
    marginTop: 15,
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 15,
    marginBottom: 5,
    width: 200,
  },
  container: {alignItems: 'center'},
});
