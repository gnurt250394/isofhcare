import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import voucherProvider from '@data-access/voucher-provider'
import ItemListVoucher from '@components/voucher/ItemListVoucher';

class MyVocherCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            page: 1,
            size: 10,
            data: []
        };
    }


    comfirmVoucher = (item) => () => {
        voucherProvider.selectVoucher(item.code).then(res => {
            this.props.onPress && this.props.onPress(item)
        }).catch(err => {

        })
    }
    onRefresh = () => this.setState({ refreshing: true }, this.getListVoucher)

    getListVoucher = () => {
        voucherProvider.getListVoucher().then(res => {
            switch (res.code) {
                case 0: this.setState({ refreshing: false, data: res.data })
                    break;
                default: this.setState({ refreshing: false })
                    break;
            }

            //    console.log('res: ', res);
            //    this.formatData(res.data)
        }).catch(err => {
            console.log('err: ', err.response);
            this.setState({ refreshing: false })
        })

    }

    componentDidMount = () => {
        this.getListVoucher()
    };

    renderItem = ({ item, index }) => {
        return (
            <ItemListVoucher item={item} onPress={this.comfirmVoucher(item)} />
        )
    }
    loadMore = () => {
        const { page, size, data } = this.state
        if (data.length >= size * page) {
            this.setState(preState => {
                return { page: preState.page + 1 }
            }, this.getListVoucher)
        }
    }
    listEmpty = () => !this.state.refreshing && <Text style={styles.none_data}>Hiện tại chưa có dữ liệu</Text>
    keyExtractor = (item, index) => index.toString()
    render() {
        return (
            <FlatList
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                onRefresh={this.onRefresh}
                refreshing={this.state.refreshing}
                ListEmptyComponent={this.listEmpty}
                onEndReached={this.loadMore}
                onEndReachedThreshold={1}
            />
        );
    }
}

export default MyVocherCode;




const styles = StyleSheet.create({
    none_data: {
        fontStyle: 'italic',
        marginTop: 30,
        alignSelf: 'center',
        fontSize: 16
    },
})