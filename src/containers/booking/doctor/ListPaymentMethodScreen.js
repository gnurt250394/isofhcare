import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList,TouchableOpacity } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import constants from '@resources/strings'

class ListPaymentMethodScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                { id: 1, value: 1, name: 'VNPAY' },
                { id: 2, value: 2, name: 'Thanh toán sau tại CSYT' },
                { id: 3, value: 3, name: 'PAYOO' },
                { id: 4, value: 4, name: 'PAYOO - cửa hàng tiện ích' },
                { id: 5, value: 5, name: 'PAYOO - trả góp 0%' },
                { id: 6, value: 6, name: 'Chuyển khoản trực tiếp' },
            ]
        };
    }
    onSelected = (item) => () => {
        let onItemSelected = ((this.props.navigation.state || {}).params || {}).onItemSelected
        this.props.navigation.pop()
        onItemSelected && onItemSelected(item.value)
    }
    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={this.onSelected(item)}
                style={styles.containerItem}>
                <Text style={styles.txtItem}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => `${item.id || index}`
    render() {
        const { data } = this.state
        return (
            <ActivityPanel title={constants.booking.select_payment_method}
                isLoading={this.state.isLoading} >
                <FlatList
                    data={data}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                />
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    txtItem: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700'
    },
    containerItem: {
        paddingVertical: 15,
        borderBottomWidth: 0.7,
        borderBottomColor: '#ccc',
        paddingLeft: 10,
    },
})
export default ListPaymentMethodScreen;
