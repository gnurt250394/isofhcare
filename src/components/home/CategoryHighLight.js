import React, { useEffect, useState, memo } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import ScaledImage from 'mainam-react-native-scaleimage'
import serviceProvider from '@data-access/service-provider'
const CategoryHighLight = memo(({ navigation }) => {
    const [data, setData] = useState([])
    const getServiceHighLight = async () => {
        try {
            let res = await serviceProvider.getListServicesHighLight()
            if (res?.length) {
                setData(res)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        getServiceHighLight()
    }, [])
    const goToDetailService = (item) => () => {
        navigation.navigate('listOfServices',{item})
    }
    const renderItem = ({ item, index }) => {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={goToDetailService(item)} style={styles.cardView}>
                    <ScaledImage
                        uri={item?.image?.absoluteUrl() || ''}
                        height={134}
                        style={{ borderRadius: 6, resizeMode: 'cover', width: 'auto' }}
                    />
                </TouchableOpacity>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.txContensHospital}>{item ? item.name : ""}</Text>
                <Text style={styles.txtPrice}>{(item?.monetaryAmount?.value || 0).formatPrice()} đ</Text>
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
})
const styles = StyleSheet.create({
    txtPrice: {
        color: '#00BA99',
        paddingLeft: 5
    },
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
