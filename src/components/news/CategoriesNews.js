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
    const [listSelected, setListSelected] = useState(useSelector((state) => state.auth.listCategories))

    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(20)



    const onFinish = () => {
        props.dispatch(redux.categoriesSelected(listSelected));
        props.onCancel()
    }

    useEffect(() => {
        onRefresh()
    }, [])
    const onRefresh = async () => {
        await setPage(0)
        await setLoading(true)
        onGetList(page, size)
    }
    const onGetList = (page, size) => {
        newsProvider.listTopics(page, size).then(res => {

            if (res?.content?.length) {
                let listTopics = res.content
                setListTopics(res.content)
            } else {
                var list = [{ id: 1, name: 'Răng hàm mặt' }, { id: 2, name: 'Răng hàm mặt' }, { id: 3, name: 'Răng hàm mặt' }, { id: 4, name: 'Răng hàm mặt' }, { id: 5, name: 'Răng hàm mặt' }, { id: 5, name: 'Răng hàm mặt' }, { id: 6, name: 'Răng hàm mặt' }, { id: 7, name: 'Răng hàm mặt' }, { id: 8, name: 'Răng hàm mặt' }, { id: 9, name: 'Răng hàm mặt' }, { id: 10, name: 'Răng hàm mặt' }, { id: 11, name: 'Răng hàm mặt' }, { id: 12, name: 'Răng hàm mặt' }, { id: 13, name: 'Răng hàm mặt' }, { id: 14, name: 'Răng hàm mặt' }, { id: 15, name: 'Răng hàm mặt' }, { id: 16, name: 'Răng hàm mặt' }, { id: 17, name: 'Răng hàm mặt' }, { id: 18, name: 'Răng hàm mặt' },]
                listSelected.map(obj => {
                    if (obj.selected) {
                        let index = list.findIndex(obj1 => obj1.id == obj.id)

                        list[index].selected = true
                    }
                })

                setListTopics([...list])

            }
            setLoading(false)
        }).catch(err => {
            var list = [{ id: 1, name: 'Răng hàm mặt' }, { id: 2, name: 'Răng hàm mặt' }, { id: 3, name: 'Răng hàm mặt' }, { id: 4, name: 'Răng hàm mặt' }, { id: 5, name: 'Răng hàm mặt' }, { id: 5, name: 'Răng hàm mặt' }, { id: 6, name: 'Răng hàm mặt' }, { id: 7, name: 'Răng hàm mặt' }, { id: 8, name: 'Răng hàm mặt' }, { id: 9, name: 'Răng hàm mặt' }, { id: 10, name: 'Răng hàm mặt' }, { id: 11, name: 'Răng hàm mặt' }, { id: 12, name: 'Răng hàm mặt' }, { id: 13, name: 'Răng hàm mặt' }, { id: 14, name: 'Răng hàm mặt' }, { id: 15, name: 'Răng hàm mặt' }, { id: 16, name: 'Răng hàm mặt' }, { id: 17, name: 'Răng hàm mặt' }, { id: 18, name: 'Răng hàm mặt' },]
            listSelected.map(obj => {
                if (obj.selected) {
                    let index = list.findIndex(obj1 => obj1.id == obj.id)
                    list[index].selected = true
                }
            })
            setListTopics([...list])
            setLoading(false)

        })
    }
    const onSelectItem = (item, index) => {
        var listSelectedOld = listSelected
        var listTopicsOld = listTopics
        if (item?.selected) {
            item.selected = false
            let indexOld = listSelectedOld.findIndex(obj => obj.id = item.id)
            listSelectedOld.splice(indexOld, 1)
        } else {
            item.selected = true
            listSelectedOld.push(item)
        }
        listTopicsOld[index] = item
        setListSelected([...listSelectedOld])
        setListTopics([...listTopicsOld])
    }
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={[styles.btnItem, item?.selected ? styles.backgroundBlue : styles.backgroundWrite]}
                onPress={() => onSelectItem(item, index)}>
                <Text style={[item?.selected ? styles.txWrite : styles.txBlue]}>
                    {item?.name}
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
                <View></View>
                <Text style={styles.txHeader}>
                    Chuyên mục
                </Text>
                <TouchableOpacity style={styles.btnFinish} onPress={onFinish}>
                    <Text style={styles.txFinish}>
                        Xong
                    </Text>
                </TouchableOpacity>
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
        backgroundColor: '#fff'
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
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 100,
        margin: 5

    },
    txBlue: {
        color: '#3161ad',
        fontSize: 14,
        fontWeight: 'bold'
    },
    backgroundBlue: { backgroundColor: '#3161AD' },
    backgroundWrite: { backgroundColor: '#3161AD20' },
    flatList: {},
    viewFlatList: { alignItems: 'center', flex: 1 },
    viewHeader: { marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', },
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