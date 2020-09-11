import React, { useEffect, useState, memo } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import ScaledImage from 'mainam-react-native-scaleimage'
import serviceProvider from '@data-access/service-provider'
import homeProvider from '@data-access/home-provider'
import { useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image'
import objectUtils from '@utils/object-utils'
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const DoctorHighLight = memo(({ navigation, refreshing }) => {
    const [data, setData] = useState([])
    const userApp = useSelector((state) => state.auth.userApp)
    const getServiceHighLight = async () => {
        try {
            let res = await homeProvider.listDoctor()

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
        navigation.navigate('detailsDoctor', { item })
    }
    const renderAcademic = (academicDegree) => {
        switch (academicDegree) {
            case 'BS': return 'BS'
            case 'ThS': return 'ThS'
            case 'TS': return 'TS'
            case 'PGS': return 'PGS'
            case 'GS': return 'GS'
            case 'BSCKI': return 'BSCKI'
            case 'BSCKII': return 'BSCKII'
            case 'GSTS': return 'GS.TS'
            case 'PGSTS': return 'PGS.TS'
            case 'ThsBS': return 'ThS.BS'
            case 'ThsBSCKII': return 'ThS.BSCKII'
            case 'TSBS': return 'TS.BS'
            default: return ''
        }
    }
    const renderItem = ({ item, index }) => {
        const source = item.imagePath ? { uri: item.imagePath.absoluteUrl() } : require('@images/new/user.png')
        return (
            <TouchableOpacity onPress={goToDetailService(item)} style={styles.cardViewDoctor}>
                {/* <Card style={{ borderRadius: 5, }}> */}
                <View style={styles.containerImageDoctor}>
                    <FastImage
                        // uri={item.advertise.images.absoluteUrl()}
                        style={{ borderRadius: 5, width: '100%', height: '100%' }}
                        source={source}
                    // width={DEVICE_WIDTH / 3}
                    // height={137}
                    />
                </View>
                {/* </Card> */}
                <Text style={styles.txContensDoctor}>{objectUtils.renderAcademic(item.academicDegree)}{item.name ? item.name : ""}</Text>

            </TouchableOpacity>
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
        alignSelf: 'center',
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
    cardViewDoctor: { borderRadius: 6, marginRight: 18 },
    txContensDoctor: { color: '#000', margin: 13, marginLeft: 5, },
});
export default DoctorHighLight
