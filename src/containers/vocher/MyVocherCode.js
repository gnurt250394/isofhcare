import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import voucherProvider from '@data-access/voucher-provider'
import ItemListVoucher from '@components/voucher/ItemListVoucher';
import snackbar from '@utils/snackbar-utils';

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
        let idBooking = this.props.idBooking 
        voucherProvider.selectVoucher(item.id,idBooking).then(res => {
            if(res.code == 0){
                this.props.onPress && this.props.onPress(item)
            }else{
                snackbar.show("Mã Voucher không tồn tại","danger")
            }
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