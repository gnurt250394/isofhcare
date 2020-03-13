import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import ScaledImage from 'mainam-react-native-scaleimage'
const CategoryHighLight = ({ data }) => {

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => this.getDetailsHospital(item)} style={styles.cardView}>
                    <ScaledImage
                        uri={item.imageHome.absoluteUrl()}
                        height={134}
                        style={{ borderRadius: 6, resizeMode: 'cover', width: 'auto' }}
                    />
                </TouchableOpacity>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.txContensHospital}>{item ? item.name : ""}</Text>
                <Text style={{
                    color: '#00BA99'
                }}>{(item?.price || 1000000).formatPrice()} đ</Text>
            </View>
        )
    }
    return (
        <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
            <View style={styles.viewAds}>
                <Text style={styles.txAds}>DỊCH VỤ NỔI BẬT</Text>
            </View>
            <FlatList
                contentContainerStyle={styles.listAds}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                data={data}
                ListFooterComponent={<View style={styles.viewFooter}></View>}
                renderItem={renderItem}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    viewAds: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txAds: {
        padding: 12,
        paddingLeft: 20,
        paddingBottom: 5,
        color: '#000',
        fontWeight: 'bold',
        flex: 1
    },
    imgMore: {
        marginTop: 10,
        marginRight: 20
    },
    listAds: {
        paddingHorizontal: 20,
    },
    viewFooter: {
        width: 35
    },
    cardView: {
        borderRadius: 6,
        marginRight: 10,
        borderColor: '#9B9B9B',
        borderWidth: 0.5,
        backgroundColor: '#fff',
        height: 134,
        width: 259
    },
    txContensHospital: {
        color: '#000',
        marginTop: 13,
        marginLeft: 5,
        maxWidth: 259
    },
});
export default CategoryHighLight
