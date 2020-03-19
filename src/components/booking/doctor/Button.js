import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PixelRatio } from 'react-native';
import ScaleImage from "mainam-react-native-scaleimage";

class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { source, label, style, onPress, textStyle } = this.props
        return (
            <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
                {source && <ScaleImage source={source} height={17} style={{ tintColor: '#fff', marginRight: 5, }} />}
                <Text style={[styles.txtButton, textStyle]}>{label}</Text>
            </TouchableOpacity>
        );
    }
}

export default Button;


const styles = StyleSheet.create({
    txtButton: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: PixelRatio.get() <= 2 ? 12 : 14
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        paddingHorizontal: '10%',
        backgroundColor: '#3161AD',
        borderRadius: 20,
        // flex: 1,
        marginHorizontal: 5
    },
})