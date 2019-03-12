import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import stringUtils from 'mainam-react-native-string-utils';

import specialistProvider from '@data-access/specialist-provider';

class Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    isValid() {
        for (var name in this.refs) {
            if (this.refs[name] && this.refs[name].isValid && !this.refs[name].isValid()) {
                return false;
            }
        }
        return true;
    }
    render() {
        const children = React.Children.map(this.props.children,
            (child, index) => React.cloneElement(child, {
                ref: `child${index}`
            })
        );
        return (
            <View {...this.props}>
                {children}
            </View>
        );
    }
}

export default Form;