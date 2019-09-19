import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import constants from '@resources/strings';
import voucherProvider from '@data-access/voucher-provider'

class DetailVoucherScreen extends Component {
    constructor(props) {
        super(props);
        let item = this.props.navigation.getParam('item') || {}
        let booking = this.props.navigation.getParam('booking') || {}
        this.state = {
            item,
            booking,
            isLoading: false
        };
    }
    confirmVoucher = () => {
        let booking = this.state.booking
        let idBooking = booking && booking.id ? booking.id : null
        let item = this.state.item || {}
        this.setState({ isLoading: true }, () => {
            // voucherProvider.selectVoucher(item.id, idBooking).then(res => {
            //     this.setState({ isLoading: false })
            //     if (res.code == 0) {
                    this.props.navigation.navigate('confirmBooking', { voucher: this.state.item })
            //     } else {
            //         snackbar.show(constants.voucher.voucher_invalid, "danger")
            //     }
            // }).catch(err => {
            //     this.setState({ isLoading: false })
            //     // snackbar.show('','danger')
            // })
        })


    }
    render() {
        const { item } = this.state
        return (
            <ActivityPanel
                title={constants.voucher.info_voucher}
                showFullScreen={true} isLoading={this.state.isLoading}>
                <View style={styles.container}>
                    {/* <Text style={styles.titleInfoVoucher}>{constants.voucher.info_voucher}:</Text> */}
                    <View style={styles.groupInfo}>
                        <Text style={styles.txtTitle}>{constants.voucher.price_voucher}: <Text numberOfLines={2} style={[styles.containerText, { fontWeight: 'bold', fontSize: 16 }]}>GIẢM {item.price.formatPrice()}đ KHI ĐẶT KHÁM</Text></Text>
                        <Text style={styles.txtTitle}>{constants.voucher.expired_voucher}: <Text style={styles.containerText}>{`SỬ DỤNG ĐẾN ${item.endTime.toDateObject('-').format("hh:mm, dd/MM/yyyy")}`}</Text></Text>
                        <Text style={styles.txtTitle}>{constants.voucher.quantity_voucher}:  <Text style={styles.quality}>{`CÒN ${item.quantity} LẦN`}</Text></Text>
                        <TouchableOpacity
                            onPress={this.confirmVoucher}
                            style={[styles.btn]}
                        >
                            <Text style={styles.txtButton}>{constants.voucher.use_now}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ActivityPanel>
        );
    }
}
const styles = StyleSheet.create({
    groupInfo: {
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1
    },
    titleInfoVoucher: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 10
    },
    container2: {
        padding: 10,
        flex: 1,
    },
    txtTitle: {
        fontSize: 15,
        color: '#111',
        paddingVertical: 5
    },

    txtButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },

    quality: {
        color: '#27AE60',
        fontWeight: '500',
        paddingLeft: 10,
    },
    btn: {
        backgroundColor: '#27AE60',
        height: 38,
        width: '55%',
        borderRadius: 7,
        alignSelf: 'center',
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    containerText: {
        // backgroundColor: '#FFFFFF',
        width: '100%',
        color: '#27AE60',
        paddingLeft: 10
    },
});
export default DetailVoucherScreen;
