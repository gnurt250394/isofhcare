import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native'
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import newsProvider from '@data-access/news-provider'
import redux from '@redux-store';
import { useSelector } from 'react-redux'
import { connect } from 'react-redux';
const CategoriesNews = (props, listCategories) => {
    const [listTopics, setListTopics] = useState([])
    const [listSelected, setListSelected] = useState(useSelector((state) => state.auth.categoriesSelected))
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(20)
    const onFinish = () => {
        props.onCancel(itemSelected)
    }
    useEffect(() => {
        onGetList()
    }, [page])
    const onGetList = () => {
        newsProvider.listTopics(page, size).then(res => {
            if (res?.content) {
                var listTopics = res.content
                if (props.idCategories) {
                    let indexOld = listTopics.findIndex(obj => obj.topicId == props.idCategories)
                    if (indexOld !== -1) {
                        listTopics[indexOld].selected = true
                    }
                }
                setListTopics([...listTopics])
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }
    const onSelectItem = (item) => {
        props.onSelectCategories(item)

    }
    const renderItem = ({ item, index }) => {


        return (
            <TouchableOpacity
                key={index}
                style={[styles.btnItem, item?.selected ? styles.backgroundBlue : styles.backgroundWrite]}
                onPress={() => onSelectItem(item)}>
                <Text r style={[item?.selected ? styles.txWrite : styles.txBlue]}>
                    {item?.name?.rawText}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <View
            style={styles.container}
        >
            <TouchableOpacity
                onPress={props.onCancel}
                style={styles.btnCancel}>
                <ScaleImage
                    source={require('@images/ic_close.png')}
                    height={15}
                    style={{ tintColor: '#000' }}
                />
            </TouchableOpacity>
            <View style={styles.viewHeader}>
                <Text style={styles.txHeader}>
                    Chuyên mục
                </Text>
            </View>
            <View style={styles.viewFlatList}>
                <FlatList
                    data={listTopics}
                    style={styles.flatList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    numColumns={2}
                    extraData={listTopics}

                >

                </FlatList>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginVertical: 20
    },
    btnCancel: {
        padding: 5,
        margin: 10
    },
    txWrite: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    btnItem: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 100,
        marginLeft: 5,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1 / 2
    },
    txBlue: {
        color: '#3161ad',
        fontSize: 14,
        fontWeight: 'bold',
    },
    backgroundBlue: { backgroundColor: '#3161AD' },
    backgroundWrite: { backgroundColor: '#3161AD20' },
    flatList: {},
    viewFlatList: { flex: 1, padding: 10, },
    viewHeader: { marginBottom: 20, alignItems: 'center', justifyContent: 'center', },
    txHeader: { fontSize: 20, fontWeight: 'bold', },
    btnFinish: { padding: 5, alignSelf: 'flex-end' },
    txFinish: {
        color: '#00BA99',
        fontWeight: 'bold'
    },

})
function mapStateToProps(state) {
    return {
        listCategories: state.auth.listCategories
    };
}
export default connect(mapStateToProps)(CategoriesNews);