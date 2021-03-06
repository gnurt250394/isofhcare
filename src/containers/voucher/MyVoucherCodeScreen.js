import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import voucherProvider from '@data-access/voucher-provider'
import ItemListVoucher from '@components/voucher/ItemListVoucher';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';

class MyVoucherCodeScreen extends Component {
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
        let booking = this.props.booking
        let idBooking = booking && booking.id ? booking.id : null
        let services = booking && booking.services ? booking.services : []
        let priceServices = services.reduce((total, item) => {
            return total + parseInt(item.price)
        }, 0)
        // if (priceServices < item.price) {
        //     snackbar.show(constants.voucher.money_not_bigger_sum_price, 'danger')
        //     return
        // }
        if (item.quantity == 0) {
            snackbar.show(constants.voucher.please_select_other_package, 'danger')
            return
        }
        item.status = true
        // voucherProvider.selectVoucher(item.id, idBooking).then(res => {
        //     if (res.code == 0) {
        this.props.onPress && this.props.onPress(item)
        //     } else {
        //         snackbar.show(constants.voucher.voucher_invalid, "danger")
        //     }
        // }).catch(err => {
        //     // snackbar.show('','danger')
        // })
    }
    onRefresh = () => this.setState({ refreshing: true }, this.getListVoucher)
    duplicateArray(arr) {
        var obj = {}
        var result = [];
        let newArr = [...arr]
        newArr.forEach((item) => {
            var id = item["id"];
            if (obj[id]) {
                obj[id].count++;
            } else {
                obj[id] = {
                    count: 1,
                    ...item
                }
                result.push(obj[id]);
            }
        });
        return result
    }

    getListVoucher = () => {
        voucherProvider.getListVoucher().then(res => {

            switch (res.code) {
                case 0:
                    let voucher = this.props.voucher
                    let data = res.data
                    let arr = this.duplicateArray(data)

                    if (voucher) {
                        arr.forEach(e => {
                            if (e.id == voucher.id) {
                                e.status = voucher.status
                            }
                        })
                    }

                    this.setState({ refreshing: false, data: arr })
                    break;
                default: this.setState({ refreshing: false })
                    break;
            }
        }).catch(err => {

            this.setState({ refreshing: false })
        })

    }

    componentDidMount = () => {
        this.getListVoucher()
    };
    onPressLater = () => {
        let item = {}
        item.status = false
        this.props.onPress && this.props.onPress(item)

    }
    renderItem = ({ item, index }) => {
        return (
            <ItemListVoucher item={item} onPress={this.comfirmVoucher(item)} onPressLater={this.onPressLater} />
        )
    }

    listEmpty = () => !this.state.refreshing && <Text style={styles.none_data}>{constants.not_found}</Text>
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

export default MyVoucherCodeScreen;




const styles = StyleSheet.create({
    none_data: {
        fontStyle: 'italic',
        marginTop: 30,
        alignSelf: 'center',
        fontSize: 16
    }  
})