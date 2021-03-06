import React, { useState, useEffect, memo } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native'
import ActivityPanel from '@components/ActivityPanel'
import HTML from 'react-native-render-html';
import snackbar from "@utils/snackbar-utils";
import ReadMoreText from '@components/ReadMoreText';
import homeProvider from '@data-access/home-provider'
import ScaledImage from 'mainam-react-native-scaleimage';
import FastImage from 'react-native-fast-image'
import Webview from 'react-native-webview'
const { width, height } = Dimensions.get('window')
const DetailNewHighLightScreen = ({ navigation }) => {
    const item = navigation.getParam('item', {})
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [detail, setDetail] = useState({})
    const getServiceHighLight = async () => {
        try {
            let res = await homeProvider.listNewsCovid()
            let resDetail = await homeProvider.getDetailNewsCovid(item.id)
            setLoading(false)
            if (res?.code == 200) {
                const list = [...res.data.news].filter(e => e.id != item.id).slice(0, 5)
                setData(list)
            }
            if (resDetail.code == 200) {
                setDetail(resDetail?.data || {})
            }

        } catch (error) {

            setLoading(false)
            setData([])

        }
    }
    useEffect(() => {
        getServiceHighLight()

    }, [item.id])
    const getTime = () => {
        if (detail?.createdDate) {
            let time = detail?.createdDate?.substring(0, 10)
            return new Date(time).format('dd/MM/yyyy');

        } else {
            return ''
        }
    }
    const goToDetailService = (item) => () => {
        navigation.replace('detailNewsHighlight', { item })
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
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.txContensHospital}>{item.title}</Text>
            </TouchableOpacity>
        )
    }
    const onGoToTest = () => {
        // snackbar.show('T??nh n??ng ??ang ph??t tri???n')
        navigation.navigate('introCovid')
    }
    return (
        <ActivityPanel isLoading={isLoading} title="N???i dung chi ti???t">
            <ScrollView style={styles.container}>
                <View style={styles.flex}>
                    <View style={styles.containerTitle}>
                        <Text style={styles.txtTitle}>{detail?.title}</Text>
                        <Text style={{
                            color: '#00000070',
                            paddingBottom: 10
                        }}>{getTime()}</Text>
                        <FastImage source={{ uri: detail?.image?.absoluteUrl() || '' }} style={styles.imageNews} />
                        {
                            detail?.content ?
                                <HTML html={'<div style="color: black">' + detail?.content + '</div>'}
                                    allowFontScaling={false}
                                    renderers={{
                                        img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                                            return <FastImage source={{ uri: htmlAttribs.src }} style={{ width: width - 30, height: parseInt(htmlAttribs.height), resizeMode: 'contain' }} />
                                        }
                                    }}
                                />
                                : null
                        }
                    </View>
                    <View style={styles.containerButton}>
                        <Text style={styles.txtLabel}>ISOFHCARE h??? tr??? ki???m tra b???n c?? n???m trong nh??m nguy c?? nhi???m virus Covid 19 kh??ng?</Text>
                        <TouchableOpacity
                            onPress={onGoToTest}
                            style={styles.buttonTest}>
                            <Text style={styles.btxtTest}>KI???M TRA COVID NGAY</Text>
                        </TouchableOpacity>
                    </View>
                    {data.length ?
                        <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
                            <View style={styles.viewAds}>
                                <Text style={styles.txAds}>XEM TH??M</Text>
                            </View>
                            <FlatList
                                contentContainerStyle={styles.listAds}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => `${item.id || index}`}
                                data={data}
                                ListFooterComponent={<View style={styles.viewFooter}></View>}
                                renderItem={renderItem}
                            />
                        </View>
                        : null

                    }
                </View>
            </ScrollView>

        </ActivityPanel>
    )
}
const styles = StyleSheet.create({
    btxtTest: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    buttonTest: {
        backgroundColor: '#3161AD',
        borderRadius: 6,
        alignSelf: 'center',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 10
    },
    txtLabel: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#00000070'
    },
    containerButton: {
        backgroundColor: '#FFF',
        margin: 15,
        borderRadius: 5,
        padding: 15,
    },
    imageNews: {
        height: 200,
        width: '100%',
        alignSelf: 'center'
    },
    txtTitle: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16
    },
    containerTitle: {
        backgroundColor: '#FFF',
        padding: 15,

    },
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: '#00000010'
    },
    viewAds: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    txAds: { padding: 12, paddingLeft: 20, paddingBottom: 5, color: '#000', fontWeight: 'bold', flex: 1, fontSize: 16 },
    listAds: { paddingHorizontal: 20, },
    viewFooter: { width: 35 },
    cardView: { borderRadius: 6, marginRight: 10, borderColor: '#9B9B9B', borderWidth: 0.5, backgroundColor: '#fff', height: 134, width: 259 },
    txContensHospital: { color: '#000', margin: 13, marginLeft: 5, maxWidth: 259 },

});
export default DetailNewHighLightScreen
