import React, { useEffect, useState, memo } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import ScaledImage from 'mainam-react-native-scaleimage'
import serviceProvider from '@data-access/service-provider'
import homeProvider from '@data-access/home-provider'
import { useSelector } from 'react-redux'
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const DoctorHighLight = memo(({ navigation, refreshing }) => {
    const [data, setData] = useState([])
    const userApp = useSelector((state) => state.userApp)
    const getServiceHighLight = async () => {
        try {
            let res = await homeProvider.listDoctor()
            console.log('res: ', res);
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
        if (userApp.isLogin) {
            navigation.navigate('detailsDoctor', { item })
        } else {
            navigation.navigate("login", {
                nextScreen: { screen: "detailsDoctor", param: { item } }
            });
        }
    }
    const renderItem = ({ item, index }) => {
        const source = item.imagePath ? { uri: item.imagePath.absoluteUrl() } : require('@images/new/user.png')
        return (
            <View style={styles.cardViewDoctor}>
                {/* <Card style={{ borderRadius: 5, }}> */}
                <TouchableOpacity onPress={goToDetailService(item)} style={styles.containerImageDoctor}>
                    <Image
                        // uri={item.advertise.images.absoluteUrl()}
                        style={{ borderRadius: 5, width: '100%', height: '100%' }}
                        source={source}
                    // width={DEVICE_WIDTH / 3}
                    // height={137}
                    />
                </TouchableOpacity>
                {/* </Card> */}
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.txContensDoctor}>{item.name ? item.name : ""}</Text>

            </View>
        )
    }
    if (data?.length) {
        return (
            <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                <View style={styles.viewAds}>
                    <Text style={styles.txAds}>CÁC BÁC SĨ HÀNG ĐẦU</Text>
                </View>
                <FlatList
                    contentContainerStyle={styles.listAds}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    // extraData={state}
                    data={data}
                    // ListFooterComponent={<View style={styles.viewFooter}></View>}
                    renderItem={renderItem}
                />
            </View>
        )
    } else {
        return null
    }

})
const styles = StyleSheet.create({
    containerImageDoctor: {
        borderRadius: 6,
        elevation: 4,
        backgroundColor: '#FFF',
        margin: 1,
        width: DEVICE_WIDTH / 3,
        height: 137,
        shadowColor: '#222',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.4
    },
    viewAds: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    txAds: { padding: 12, paddingLeft: 20, paddingBottom: 5, color: '#000', fontWeight: 'bold', flex: 1 },
    listAds: { paddingHorizontal: 20, },
    viewFooter: { width: 35 },
    cardViewDoctor: { width: DEVICE_WIDTH / 3, borderRadius: 6, marginRight: 18 },
    txContensDoctor: { color: '#000', margin: 13, marginLeft: 5, },
});
export default DoctorHighLight
