/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { Text, View } from 'react-native';
import dateUtils from 'mainam-react-native-date-utils';

export default class DateMessage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={{ marginTop: 15, backgroundColor: '#acacac', padding: 5, borderRadius: 15, marginBottom: 5, width: 200 }}>
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight:'bold' }}>
                        {this.props.message.createdAt.toDateObject().format("dd/MM/yyyy")}
                    </Text>
                </View>
            </View>
        );
    }
}