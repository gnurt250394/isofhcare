import React, { Component } from 'react';
// import { Actions } from 'react-native-router-flux';
import Dimensions from 'Dimensions';
import { Text, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import constants from '@dhy/strings'
import { connect } from 'react-redux';

import {
    StyleSheet,
    Image,
    View
} from 'react-native';

import ic_back from '@images/ic_back.png';

class AddBookingHasProfile extends Component {
    Actions;
    viewProfile() {
        Actions.detailProfile();
    }
    render() {
        return (
            <TouchableOpacity onPress={() => { this.viewProfile() }}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <Text style={{ padding: 10, borderColor: constants.colors.primaryColor, borderWidth: 1, margin: 3, fontWeight: 'bold', color: constants.colors.primaryColor }} >
                        {this.props.booking.profile ? this.props.booking.profile.profile.name.toUpperCase() : ""}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}
function mapStateToProps(state) {
    return {
        booking: state.booking
    }
}

export default connect(mapStateToProps)(AddBookingHasProfile);
