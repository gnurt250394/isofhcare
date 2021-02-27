import React, { useEffect, useState, memo } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import ScaledImage from 'mainam-react-native-scaleimage'
import serviceProvider from '@data-access/service-provider'
import homeProvider from '@data-access/home-provider'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'
import newsProvider from '@data-access/news-provider'
import firebaseUtils from '@utils/firebase-utils'

const NewsHighLight = memo(({ navigation, refreshing }) => {
    const [data, setData] = useState([])
    const userApp = useSelector((state) => state.auth.userApp)
    const getServiceHighLight = async () => {
        try {
            let res = await newsProvider.listNews(0, 25)


            if (res?.content?.length) {
                setData(res.content)
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
        firebaseUtils.sendEvent('news_screen')
        navigation.navigate('detailNews', {
            item,
            // idCategories
        })
    }
    const renderItem = ({ item, index }) => {
        let urlImage = item?.images[0].downloadUri

        return (
            <TouchableOpacity onPress={goToDetailService(item)} style={{ flex: 1 }}>
                <View style={styles.cardView}>
                    <FastImage
                        source={{ uri: urlImage || '' }}
                        style={{ borderRadius: 6, resizeMode: 'cover', width: 'auto', height: 134 }}
                    />
                </View>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.txContensHospital}>{item?.shortTitle?.rawText || ""}</Text>
            </TouchableOpacity>
        )
    }
    const onShowAll = () => {

        navigation.navigate('listNews')
    }
    if (data?.length) {
        return (
            <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                <View style={styles.viewAds}>
                    <Text style={styles.txAds}>CẨM NANG Y TẾ</Text>
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
    viewAds: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    txAds: { padding: 12, paddingLeft: 20, paddingBottom: 5, color: '#000', fontWeight: 'bold', flex: 1 },
    listAds: { paddingHorizontal: 20, },
    viewFooter: { width: 35 },
    cardView: { borderRadius: 6, marginRight: 10, borderColor: '#9B9B9B', borderWidth: 0.5, backgroundColor: '#fff', width: 259 },
    txContensHospital: { color: '#000', margin: 13, marginLeft: 5, maxWidth: 259 },

});
export default NewsHighLight
