import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import LinearGradient from 'react-native-linear-gradient'
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import stringUtils from 'mainam-react-native-string-utils'
import constants from '@resources/strings';
import snackbar from '@utils/snackbar-utils';

const { width } = Dimensions.get('window')
class ItemListVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    getLabelButton = (item) => {
        if (item.status) {
            return 'DÙNG SAU'
        }
        return 'SỬ DỤNG NGAY'
    }
    getColor = (item) => {

        if (item.status) {
            return ['rgba(230, 51, 51, 0.70)', 'rgba(230, 51, 51, 0.90)', 'rgba(230, 51, 51, 1)']
        }
        return ['rgb(255, 214, 51)', 'rgb(204, 163, 0)', 'rgb(179, 143, 0)']

    }
    defaultImage = () => {
        const icSupport = require("@images/new/booking/ic_checked.png");
        return (
            <ScaleImage source={icSupport} width={100} />
        );
    }
    onDisable = () => {
        snackbar.show(constants.voucher.voucher_not_avalrible, "danger")

    }
    render() {
        const icSupport = require("@images/new/booking/ic_checked.png");
        const { item, onPress, onPressLater } = this.props
        return (
            <TouchableOpacity
                onPress={this.props.active ? onPress : this.onDisable}
                disabled={!this.props.active}
                style={styles.containerItem}>
                <View style={[styles.groupItem, this.props.active ? { backgroundColor: item.type == 1 ? '#3161AD' : '#F07300', } : { backgroundColor: item.type == 1 ? '#3161AD60' : '#F0730060' }]}>
                    <View style={[styles.viewOther, styles.topRight]} />
                    <View style={[styles.viewOther, styles.topLeft]} />
                    <View style={[styles.viewOther, styles.bottomRight]} />
                    <View style={[styles.viewOther, styles.bottomLeft]} />
                    <View style={[styles.viewOther, styles.bottomScale]} />
                    <View style={[styles.viewOther, styles.topScale]} />

                    {/**line dots left */}
                    <View style={styles.lineDot} />
                    <View style={{
                        paddingLeft: 20,
                    }}>
                        <Text numberOfLines={2}
                            style={[styles.containerText, styles.txtPriceVoucher, !this.props.active ? { color: '#EEEEEE' } : {}]}>GIẢM <Text style={{
                                fontStyle: 'italic'
                            }}>{item.price.formatPrice()}đ </Text> KHI ĐẶT KHÁM</Text>
                        <Text style={[styles.containerText, !this.props.active ? { color: '#EEEEEE' } : {}]}>{`Hạn sử dụng: ${item.endTime.toDateObject('-').format("HH:mm, dd/MM/yyyy")}`}</Text>
                        <Text numberOfLines={1} style={[styles.quality, !this.props.active ? { color: '#EEEEEE' } : {}]}>{`CÒN ${item.type == 0 ? item.quantity - item.counter : item.type == 2 ? item.quantity : item.count} LẦN`}</Text>
                    </View>
                </View>
                {item.status ?
                    <ScaleImage source={icSupport} style={styles.imgChecked} width={16} />
                    :
                    <View style={styles.unChecked} />
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    unChecked: {
        backgroundColor: '#fff',
        height: 16,
        width: 16,
        borderRadius: 8,
        borderColor: '#444',
        borderWidth: 1,
        marginRight: 5
    },
    imgChecked: {
        resizeMode: "contain",
        marginRight: 5
    },
    lineDot: {
        borderColor: '#fff',
        width: 0.5,
        height: '90%',
        borderWidth: 1,
        borderRadius: 1,
        borderStyle: 'dashed',
    },
    topScale: {
        top: -6,
        left: '20%',
        transform: [{ scaleX: 1.3 }]
    },
    bottomScale: {
        bottom: -6,
        left: '20%',
        transform: [{ scaleX: 1.3 }]
    },
    bottomLeft: {
        bottom: -5,
        left: -5,
    },
    bottomRight: {
        bottom: -5,
        right: -5,
    },
    topLeft: {
        top: -5,
        left: -5,
    },
    topRight: {
        top: -5,
        right: -5,
    },
    viewOther: {
        backgroundColor: '#fff',
        position: 'absolute',
        height: 10,
        width: 10,
        borderRadius: 5
    },
    groupItem: {
        padding: 10,
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        height: '90%',
    },
    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    txtPriceVoucher: { fontWeight: 'bold', fontSize: 16 },
    quality: {
        color: '#fff',
        fontWeight: '500',
        paddingVertical: 3,
        paddingTop: 7,
        // transform: [{ rotate: '-15deg' }]
    },

    containerText: {
        paddingVertical: 4,
        marginBottom: 7,
        color: '#fff'
    },
})

export default ItemListVoucher;
