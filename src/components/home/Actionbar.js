import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Text } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import ShoppingCart from '@components/home/ShoppingCart';
import { connect } from "react-redux";
import { DrawerActions } from 'react-navigation';
class ActionBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.containner}>
                <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} style={styles.button_menu}>
                    <ScaledImage source={require("@images/new/home/ic_menu.png")} width={30} />
                </TouchableOpacity>
                <View style={styles.search_panel}>
                    <TextInput style={styles.search_field} underlineColorAndroid='transparent' placeholderTextColor="#EEEEEE" placeholder="Tìm kiếm" />
                    <TouchableOpacity style={styles.ic_search}>
                        <ScaledImage source={require("@images/new/home/ic_search.png")} width={15} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button_filter}>
                    <Text style={styles.filter_text} >Bộ lọc</Text>
                    <TouchableOpacity style={styles.ic_search}>
                        <ScaledImage source={require("@images/new/home/ic_next.png")} width={8} />
                    </TouchableOpacity>
                </TouchableOpacity>
                <ShoppingCart />
            </View >
        );
    }
}
const styles = StyleSheet.create({
    containner: {
        backgroundColor: '#02C39A',
        alignItems: 'center',
        height: 60,
        flexDirection: 'row',
    },
    button_menu: {
        paddingHorizontal: 10,
    },
    search_field: {
        padding: 0, flex: 1,
        color: '#02C39A'
    },
    search_panel: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        padding: 2,
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 5,
    },
    ic_search: {
        padding: 5
    },
    button_filter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFB800',
        borderRadius: 5,
        marginLeft: 10,
        paddingLeft: 8
    },
    filter_text: {
        color: '#fff',
        marginRight: 2,
        fontWeight: 'bold',
    }
});
function mapStateToProps(state) {
    return {
        navigation: state.navigation
    };
}
export default connect(mapStateToProps)(ActionBar);