import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScaleImage from "mainam-react-native-scaleimage";

class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { source, label, style, onPress } = this.props
        return (
            <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
                <ScaleImage source={source} width={17} style={{ tintColor: '#fff' }} />
                <Text style={[styles.txtButton]}>{label}</Text>
            </TouchableOpacity>
        );
    }
}

export default Button;


const styles = StyleSheet.create({
    txtButton: {
        color: '#fff',
        fontWeight: 'bold',
        paddingLeft: 6
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        paddingHorizontal: 8,
        backgroundColor: '#3161AD',
        borderRadius: 20,
        flex: 1
    },
})