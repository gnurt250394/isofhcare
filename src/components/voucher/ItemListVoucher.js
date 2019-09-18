import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import LinearGradient from 'react-native-linear-gradient'
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import stringUtils from 'mainam-react-native-string-utils' 
import constants from '@resources/strings';
class ItemListVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    getLabelButton = (type) => {
        switch (type) {
            case 1: return 'SỬ DỤNG NGAY'
            case 2: return ' DÙNG SAU'
            default: return ''
        }
    }
    getColor = (type) => {
        switch (type) {
            case 2: return ['rgba(230, 51, 51, 0.70)', 'rgba(230, 51, 51, 0.90)', 'rgba(230, 51, 51, 1)']
            case 1: return ['rgb(255, 214, 51)', 'rgb(204, 163, 0)', 'rgb(179, 143, 0)']
            default: return ''
        }
    }
    defaultImage = () => {
        const icSupport = require("@images/new/user.png");
        return (
            <ScaleImage source={icSupport} width={100} />
        );
    }
    render() {
        const icSupport = require("@images/new/user.png");
        const { item, onPress } = this.props
        return (
            <View style={{ padding: 10 }}>
                <Card style={styles.containerItem} >
                    <ImageLoad
                        source={icSupport}
                        imageStyle={styles.imageStyle}
                        borderRadius={50}
                        customImagePlaceholderDefaultStyle={styles.customImagePlace}
                        style={styles.styleImgLoad}
                        resizeMode="cover"
                        placeholderSource={icSupport}
                        loadingStyle={{ size: "small", color: "gray" }}
                        defaultImage={this.defaultImage}
                    />
                    <View style={styles.container}>
                        <Text numberOfLines={2} style={[styles.containerText, { fontWeight: 'bold', fontSize: 16 }]}>GIẢM {item.price.formatPrice()}đ KHI ĐẶT KHÁM</Text>
                        <Text style={styles.containerText}>{`HẠN SỬ DỤNG ĐẾN ${item.endTime.toDateObject('-').format("hh:mm, dd/MM/yyyy")}`}</Text>
                        <View style={styles.containerRow}>
                            <Text style={styles.quality}>{`CÒN ${item.quantity} LẦN`}</Text>
                            <LinearGradient
                                colors={['rgb(255, 214, 51)', 'rgb(204, 163, 0)', 'rgb(179, 143, 0)']}
                                locations={[0, 0.7, 1]}
                                style={styles.btn}>
                                <TouchableOpacity
                                    onPress={onPress}
                                    style={[styles.button]}
                                >
                                    <Text style={styles.txtButton}>{constants.voucher.use_now}</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    customImagePlace:{
        height:100,
        width:100,
        borderRadius:50
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    styleImgLoad: {
        width: 100,
        height: 100,
        paddingRight: 5
    },
    shadow: {
        elevation: 3,
        shadowColor: '#111111',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 2
    },
    txtButton: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15
    },
    quality: {
        color: '#27AE60',
        fontWeight: '500',
        paddingVertical: 3
    },
    btn: {
        backgroundColor: '#27AE60',
        height: 38,
        width: '55%',
        borderRadius: 7,
    },
    containerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    container: {
        flex: 1
    },
    containerItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF'
    },
    containerText: {
        padding: 4,
        // backgroundColor: '#FFFFFF',
        width: '100%',
        marginBottom: 10,
        color: '#27AE60'
    },
})

export default ItemListVoucher;
