import React, { useEffect, useState, memo } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import ScaledImage from 'mainam-react-native-scaleimage'
import serviceProvider from '@data-access/service-provider'
import homeProvider from '@data-access/home-provider'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'
const NewsHighLight = memo(({ navigation, refreshing }) => {
    const [data, setData] = useState([])
    const userApp = useSelector((state) => state.auth.userApp)
    const getServiceHighLight = async () => {
        try {
            let res = await homeProvider.listNewsCovid()

            if (res?.code == 200) {
                setData(res.data.news)
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

        navigation.navigate('detailNewsHighlight', { item, data })
    }
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={goToDetailService(item)} style={{ flex: 1 }}>
                <View style={styles.cardView}>
                    <FastImage
                        source={{ uri: item?.image?.absoluteUrl() || '' }}
                        style={{ borderRadius: 6, resizeMode: 'cover', width: 'auto', height: 134 }}
                    />
                </View>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.txContensHospital}>{item ? item.title : ""}</Text>
            </TouchableOpacity>
        )
    }
    if (data?.length) {
        return (
            <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                <View style={styles.viewAds}>
                    <Text style={styles.txAds}>TIN TỨC Y TẾ</Text>
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
    viewAds: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    txAds: { padding: 12, paddingLeft: 20, paddingBottom: 5, color: '#000', fontWeight: 'bold', flex: 1 },
    listAds: { paddingHorizontal: 20, },
    viewFooter: { width: 35 },
    cardView: { borderRadius: 6, marginRight: 10, borderColor: '#9B9B9B', borderWidth: 0.5, backgroundColor: '#fff', height: 134, width: 259 },
    txContensHospital: { color: '#000', margin: 13, marginLeft: 5, maxWidth: 259 },

});
export default NewsHighLight
