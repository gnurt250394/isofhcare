import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import LinearGradient from 'react-native-linear-gradient'
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
const data = [
    {
        id: 1,
        name: 'GIẢM 50.000Đ KHI ĐẶT KHÁM GIẢM 50.000Đ KHI ĐẶT KHÁM GIẢM 50.000Đ KHI ĐẶT KHÁM',
        date: '20:00, 31/09/2019',
        quality: 5,
        type: 1
    },
    {
        id: 2,
        name: 'GIẢM 50.000Đ KHI ĐẶT KHÁM',
        date: '20:00, 31/09/2019',
        quality: 4,
        type: 2
    },
    {
        id: 3,
        name: 'GIẢM 50.000Đ KHI ĐẶT KHÁM',
        date: '20:00, 31/09/2019',
        quality: 6,
        type: 2
    }
]
class MyVocherCode extends Component {
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
        return (
            <ScaleImage source={icSupport} width={100} />
        );
    }
    comfirmVoucher=(item)=>()=>{
        this.props.onPress && this.props.onPress(item)
    }
    renderItem = ({ item, index }) => {
        const icSupport = require("@images/new/user.png");

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
                        <Text style={[styles.containerText, { fontWeight: 'bold', fontSize: 16 }]}>{item.name}</Text>
                        <Text style={styles.containerText}>{`HẠN SỬ DỤNG ĐẾN ${item.date}`}</Text>
                        <View style={styles.containerRow}>
                            <Text style={styles.quality}>{`CÒN X${item.quality} LẦN`}</Text>
                            <LinearGradient
                                colors={this.getColor(item.type)}
                                locations={[0, 0.7, 1]}
                                style={styles.btn}>
                                <TouchableOpacity
                                onPress={this.comfirmVoucher(item)}
                                    style={[, styles.shadow,]}
                                >
                                    <Text style={styles.txtButton}>{this.getLabelButton(item.type)}</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                </Card>
            </View>
        )
    }

    keyExtractor = (item, index) => index.toString()
    render() {
        return (
            <FlatList
                data={data}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
            />
        );
    }
}

export default MyVocherCode;


const styles = StyleSheet.create({
    styleImgLoad: {
        width: 100,
        height: 100,
        paddingRight:5
    },
    shadow: {
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
        backgroundColor: '#FFFFFF',
        width: '40%',
        paddingVertical: 3
    },
    btn: {
        backgroundColor: '#27AE60',
        alignItems: 'center',
        justifyContent: 'center',
        height: 38,
        width: '55%',
        borderRadius: 7,
        paddingHorizontal: 12,
        elevation: 3
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
        borderColor: '#111111',
        borderWidth: 1,
        padding: 10,
        borderRadius:5,
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