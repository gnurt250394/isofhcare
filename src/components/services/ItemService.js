import React, { Component, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView, Animated, Image } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import StarRating from 'react-native-star-rating';
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import ItemDoctor from '@components/booking/doctor/ItemDoctor';
import ScaleImage from "mainam-react-native-scaleimage";
import Carousel, { Pagination } from 'react-native-snap-carousel'
import LinearGradient from 'react-native-linear-gradient'
import ActionBar from '@components/Actionbar';
import constants from '@resources/strings'
const { height } = Dimensions.get('window')
const ItemService = ({ item, onPress }) => {
    const source = item?.hospital?.imagePath ? { uri: item?.hospital?.imagePath?.absoluteUrl() } : require("@images/new/user.png");
    return (
        <TouchableOpacity onPress={onPress} style={styles.containerItem}>

            <View style={styles.containerImage}>
                <ImageLoad
                    resizeMode="cover"
                    imageStyle={styles.borderImgProfile}
                    borderRadius={25}
                    customImagePlaceholderDefaultStyle={[styles.avatar, styles.placeHolderImgProfile]}
                    placeholderSource={require("@images/new/user.png")}
                    resizeMode="cover"
                    loadingStyle={{ size: 'small', color: 'gray' }}
                    source={source}
                    style={styles.imgProfile}
                    defaultImage={() => {
                        return (
                            <ScaleImage resizeMode='cover' source={require("@images/new/user.png")} width={40} height={40} />
                        )
                    }}
                />
                <Text>{item.location}</Text>
            </View>
            <Image resizeMode='cover' source={require("@images/new/ic_line_dash.png")} style={styles.imageLine} />
            <View style={styles.containerProfile}>
                <Text style={styles.txtName}>{item.name}</Text>
                <Text style={styles.txtHospital}>{item.hospital.name}</Text>
                <View style={styles.groupPrice}>
                    <Text style={styles.txtPriceFinal}>{item?.monetaryAmount?.value?.formatPrice()} đ</Text>
                    <Text style={styles.txtPriceUnit}>{item?.monetaryAmount?.value?.formatPrice()} đ</Text>
                </View>
                <Text numberOfLines={3}>{item.description}</Text>
            </View>
            <View style={styles.flag}>
                <View style={styles.flagTop} >
                    <Text style={styles.txtVoucher}>Giam 100k</Text>
                </View>
                <View style={styles.flagBottom} />
            </View>

        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    txtVoucher: {
        color: '#FFF',
        textAlign: 'center'
    },
    txtPriceUnit: {
        color: '#00000050',
        textDecorationLine: 'line-through'
    },
    txtPriceFinal: {
        color: '#00BA99',
        paddingRight: 10,
        fontWeight: 'bold'
    },
    groupPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    txtHospital: {
        width: '80%',
        color: '#00000070'
    },
    txtName: {
        width: '80%',
        fontWeight: 'bold'
    },
    containerProfile: {
        paddingLeft: 10,
        alignItems: 'flex-start',
        height: '100%',
        flex: 1
    },
    imageLine: {
        width: 1,
        height: '95%'
    },
    containerImage: {
        alignItems: 'center',
        // alignSelf: 'flex-start',
        paddingHorizontal: 10
    },
    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        margin: 10,
        borderRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowColor: '#000',
        elevation: 3,
        height: 170,
    },
    flag: {
        position: 'absolute',
        top: 0,
        right: 10,
    },
    flagTop: {
        width: 50,
        paddingVertical: 10,
        backgroundColor: '#ffac4d',
        alignItems: 'center',
        justifyContent: 'center'

    },
    flagBottom: {
        borderBottomWidth: 13,
        borderBottomColor: 'transparent',
        borderLeftWidth: 25,
        borderLeftColor: '#ffac4d',
        borderRightWidth: 25,
        borderRightColor: '#ffac4d'
    },
    imgProfile: {
        alignSelf: 'center',
        borderRadius: 25,
        width: 50,
        height: 50
    },
    placeHolderImgProfile: { width: 50, height: 50 },
    borderImgProfile: {
        borderRadius: 25,
        borderWidth: 0.5,
        borderColor: 'rgba(151, 151, 151, 0.29)'
    },
});
export default ItemService
