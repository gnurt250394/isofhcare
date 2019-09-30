import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import LinearGradient from 'react-native-linear-gradient'
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import stringUtils from 'mainam-react-native-string-utils'
import constants from '@resources/strings';
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
        const icSupport = require("@images/new/user.png");
        return (
            <ScaleImage source={icSupport} width={100} />
        );
    }
    render() {
        const icSupport = require("@images/new/user.png");
        const { item, onPress, onPressLater } = this.props
        return (
            <View style={{ padding: 10 }}>

                <Card style={styles.containerItem} >
                    {/* <ImageBackground source={require('@images/new/profile/img_cover_profile.png')} style={styles.containerImageBackground}
                        imageStyle={{ borderRadius: 5 }}
                    > */}
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
                        <Text numberOfLines={2}
                            style={[styles.containerText, styles.txtPriceVoucher]}>GIẢM <Text style={{
                                fontStyle: 'italic'
                            }}>{item.price.formatPrice()}đ</Text> KHI ĐẶT KHÁM</Text>
                        <Text style={styles.containerText}>{`HẠN SỬ DỤNG ĐẾN ${item.endTime.toDateObject('-').format("HH:mm, dd/MM/yyyy")}`}</Text>
                        <View style={styles.containerRow}>
                            <Text numberOfLines={1} style={styles.quality}>{`CÒN ${item.type == 0 ? item.quantity - item.counter : item.count} LẦN`}</Text>
                            <LinearGradient
                                colors={this.getColor(item)}
                                locations={[0, 0.7, 1]}
                                style={styles.btn}>
                                <TouchableOpacity
                                    onPress={item.status ? onPressLater : onPress}
                                    style={[styles.button]}
                                >
                                    <Text style={styles.txtButton}>{this.getLabelButton(item)}</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                    {/* </ImageBackground> */}

                </Card>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    txtPriceVoucher: { fontWeight: 'bold', fontSize: 16 },
    containerImageBackground: {
        width: null,
        height: null,
        flex: 1,
        padding: 15,
        paddingTop: 20
    },
    customImagePlace: {
        height: 100,
        width: 100,
        borderRadius: 50
    },
    button: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        paddingTop: 10
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
        textAlign: 'center'
    },
    quality: {
        color: '#27AE60',
        fontWeight: '500',
        paddingVertical: 3,
        paddingTop: 7,
        // transform: [{ rotate: '-15deg' }]
    },
    btn: {
        backgroundColor: '#27AE60',
        height: 38,
        borderRadius: 7,
    },
    containerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingLeft: 4
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
        // width: '100%',
        marginBottom: 7,
        color: '#27AE60'
        // color: '#FF0000',
        // transform: [{ rotate: '-10deg' }]
    },
})

export default ItemListVoucher;
