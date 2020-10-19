import React, { useEffect, useState, memo } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import ScaledImage from 'mainam-react-native-scaleimage'
import serviceProvider from '@data-access/service-provider'
import FastImage from 'react-native-fast-image'
const CategoryHighLight = memo(({ navigation, refreshing }) => {
    const [data, setData] = useState([])
    const getServiceHighLight = async () => {
        try {
            let res = await serviceProvider.getListServicesHighLight()

            if (res?.length) {
                setData(res)
            } else {
                setData([])

            }
        } catch (error) {

            setData([])

        }
    }
    useEffect(() => {
        getServiceHighLight()

    }, [])
    useEffect(() => {
        if (refreshing)
            getServiceHighLight()
    }, [refreshing])
    const goToDetailService = (item) => () => {
        navigation.navigate('listOfServices', { item })
    }
    disablePromotion = (promotion) => {
        let dayOfWeek = {
            0: 6,
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4,
            6: 5
        }
        let startDate = new Date(promotion.startDate)
        let endDate = new Date(promotion.endDate)
        let day = new Date()
        let isDayOfWeek = (promotion.dateRepeat | Math.pow(2, dayOfWeek[day.getDay()]))
        if (startDate < day && endDate > day && isDayOfWeek != 0) {
            return true
        }
        return false
    }
    const renderPromotion = (promotion) => {
        let text = ''
        if (promotion.type == "PERCENT") {
            text = promotion.value + '%'
        } else {
            // let value = (promotion?.value || 0).toString()
            // if (value.length > 5) {
            //     text = value.substring(0, value.length - 3) + 'K'
            // } else {
            text = promotion.value.formatPrice() + 'đ'

            // }
        }
        return text
    }
    const renderPricePromotion = (item) => {
        let text = 0
        if (item.promotion.type == "PERCENT") {
            text = (item.monetaryAmount.value - (item.monetaryAmount.value * (item.promotion.value / 100) || 0))
        } else {
            text = (item.monetaryAmount.value - item.promotion.value || 0)
        }
        if (text < 0) {
            return 0
        }
        return text.formatPrice()
    }
    const onShowAll = () => {

        navigation.navigate('listNews')
    }
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={goToDetailService(item)} style={{ flex: 1, paddingBottom: 10 }}>
                <View style={styles.cardView}>
                    <FastImage
                        source={{ uri: item?.image?.absoluteUrl() || '' }}
                        style={{ borderRadius: 6, resizeMode: 'cover', width: 'auto', height: 134 }}
                    />
                </View>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.txContensHospital}>{item && item.name ? item.name : ""}</Text>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.txtHospital}>{item.hospital.name && item.hospital.name ? item.hospital.name : ""}</Text>
                {

                    item?.promotion?.value && disablePromotion(item?.promotion) ?
                        < View style={styles.groupPrice}>
                            <Text style={styles.txtPrice}>{renderPricePromotion(item)} đ</Text>

                            <Text style={styles.txtUnit}>{(item?.monetaryAmount?.value || 0).formatPrice()} đ</Text>
                        </ View>
                        :
                        <Text style={styles.txtPrice}>{(item?.monetaryAmount?.value || 0).formatPrice()} đ</Text>

                }
                {
                    item?.promotion?.value && disablePromotion(item?.promotion) ?
                        <View style={styles.flag}>
                            <View style={styles.flagTop} >
                                <Text style={styles.txtVoucher}>{`Giảm \n ${renderPromotion(item.promotion)}`}</Text>
                            </View>
                            <View style={styles.flagBottom} />
                        </View> : null
                }

            </TouchableOpacity >
        )
    }
    if (data?.length) {
        return (
            <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                <View style={styles.viewAds}>
                    <Text style={styles.txAds}>DỊCH VỤ NỔI BẬT</Text>
                    <TouchableOpacity onPress={onShowAll} style={styles.btnViewAll}>
                        <Text style={styles.txViewAll}>Xem tất cả</Text>
                    </TouchableOpacity>
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
    } else {
        return null
    }

})
const styles = StyleSheet.create({
    btnViewAll: { padding: 5 },
    txViewAll: {
        padding: 12, paddingLeft: 20, paddingBottom: 5, flex: 1,
        color: '#009BF2',
    },
    groupPrice: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtUnit: {
        color: '#00000060',
        paddingLeft: 10,
        textDecorationLine: 'line-through'
    },
    txtHospital: {
        color: '#00000070',
        marginLeft: 5,
        marginBottom: 10,
        maxWidth: 259,

    },
    txtVoucher: {
        color: '#FFF',
        textAlign: 'center',
        width: 85
    },
    flag: {
        position: 'absolute',
        top: 0,
        right: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2
    },
    flagTop: {
        // width: 70,
        paddingVertical: 10,
        flexWrap: 'wrap',
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
        width: 259,
    },
    txContensHospital: {
        color: '#000',
        marginTop: 13,
        marginLeft: 5,
        maxWidth: 259,
        fontSize: 15
    },
});
export default CategoryHighLight
