import React, { useState, useEffect } from 'react'
import {
    View, StyleSheet, FlatList, Text, TouchableOpacity
} from 'react-native'
import ActivityPanel from '@components/ActivityPanel';
import newsProvider from '@data-access/news-provider'
import ScaledImage from 'mainam-react-native-scaleimage';
import dateUtils from 'mainam-react-native-date-utils';
import Modal from "@components/modal";
import CategoriesNews from '@components/news/CategoriesNews'
import redux from '@redux-store';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux'

const ListNews = ({ navigation, props, }) => {

    const [listNews, setListNews] = useState([])
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(20)
    const [loading, setLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const listCategories = useSelector((state) => state.auth.listCategories)


    useEffect(() => {
        onRefresh()
    }, [])
    const onRefresh = async () => {
        await setPage(0)
        getList(page, size)
    }
    const getList = (page, size) => {
        newsProvider.listNews(page, size).then(res => {

            if (res && res.content?.length) {
                setListNews(res.content)
            }
            setLoading(false)

        }).catch(err => {
            setLoading(false)

        })
    }


    const loadMore = async () => {
        if (listNews.length >= (page + 1) * size) {
            await setPage(prevState + 1)
            getList(page, size)
        }
    }
    const onBackdropPress = () => {
        setIsVisible(false)
    }
    const renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity style={styles.viewItem}>
                <ScaledImage height={70} width={143} source={require('@images/new/news/ic_demo.png')}></ScaledImage>
                <View style={styles.viewTitle}>
                    <Text style={styles.txTitle}>{item?.title?.rawText}</Text>
                    <View style={styles.viewTime}>
                        <ScaledImage source={require('@images/new/news/ic_time.png')} height={15}  ></ScaledImage>
                        <Text style={styles.txTime} >{item?.createdAt?.toDateObject('-')?.format('dd/MM/yyyy') || '12/10/2020'}</Text>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }
    const footerComponent = () => {
        if (listNews.length >= (page + 1) * size) {
            return (
                <ActivityIndicator color="#00CBA7" size="small" />
            )
        } else {
            return null
        }
    }
    const onSelectTopics = () => {
        setIsVisible(true)
    }
    return (
        <ActivityPanel
            title='Cẩm nang y tế'
            container={styles.container}
        >
            <TouchableOpacity onPress={onSelectTopics} style={styles.btnTopics}>
                <Text>
                    Tất cả chuyên mục
                </Text>
                <ScaledImage style={styles.imagesDown} height={8} source={require('@images/new/news/ic_down.png')} />
            </TouchableOpacity>
            <FlatList
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                data={listNews}
                onRefresh={onRefresh}
                refreshing={loading}
                onEndReached={loadMore}
                onEndReachedThreshold={0.7}
                ListFooterComponent={footerComponent}
                extraData={listNews}
            >

            </FlatList>
            <Modal
                isVisible={isVisible}
                onBackdropPress={onBackdropPress}
                backdropOpacity={0.5}
                animationInTiming={500}
                animationOutTiming={500}
                style={styles.modal}
                backdropTransitionInTiming={1000}
                backdropTransitionOutTiming={1000}
            >
                <CategoriesNews
                    onCancel={onBackdropPress}

                ></CategoriesNews>
            </Modal>
        </ActivityPanel>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    viewItem: {
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: 20,
        flex: 1
    },
    txTitle: {
        flexWrap: 'wrap',
        fontSize: 16,
        fontWeight: 'bold'
    },
    viewTitle: {
        paddingHorizontal: 10,
        width: '70%',
    },
    viewTime: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    txTime: {
        marginLeft: 5,
        color: '#2F3035'
    },
    btnTopics: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        padding: 5
    },
    imagesDown: {
        marginLeft: 5
    },
    modal: {
        flex: 1,
    },
})
function mapStateToProps(state) {
    return {
        listCategories: state.auth.listCategories
    };
}
export default connect(mapStateToProps)(ListNews);