import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';

class ListHospitalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listHospital: this.props.navigation.getParam('listHospital', [])
        };
    }
    onSelected = (item) => () => {
        let onItemSelected = ((this.props.navigation.state || {}).params || {}).onItemSelected
        this.props.navigation.pop()
        onItemSelected && onItemSelected(item)
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
        const { listHospital } = this.state
        return (
            <ActivityPanel title="Chọn cơ sở y tế"
                isLoading={this.state.isLoading} >
                <FlatList
                    data={listHospital}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                />
            </ActivityPanel>
        );
    }
}

export default ListHospitalScreen;


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