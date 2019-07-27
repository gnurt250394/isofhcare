import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Text } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';

class ShoppingCart extends Component {
    constructor(props) {
        super(props)
    }



    render() {
        return (
            <View style={styles.containner}>
                <TouchableOpacity style={styles.button_menu}>
                    <ScaledImage source={require("@images/new/home/ic_shopingcart.png")} width={30} />
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    containner: {
    },
    button_menu: {
        paddingHorizontal: 10,
    }
});
export default ShoppingCart;