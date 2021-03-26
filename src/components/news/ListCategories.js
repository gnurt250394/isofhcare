import React, { useEffect, useState, useRef, } from 'react'
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator, } from 'react-native'
import newsProvider from '@data-access/news-provider'
import { connect } from 'react-redux';
const ListCategories = (props) => {
    const [listCategories, setListCategories] = useState([])
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(20)
    const [loading, setLoading] = useState(true)
    const refContainer = useRef(null);
    useEffect(() => {
        onGetList()

    }, [])
    useEffect(() => {

        if (props.isNew) {
            var list = listCategories
            list.map(obj => {
                obj.isSelected = false
            })
            setListCategories([...list])
        }
        if (props.idCategories) {
            var listTopics = listCategories
            listTopics.map(obj => obj.isSelected = false)
            let indexOld = listTopics.findIndex(obj => obj.topicId == props.idCategories)
            if (indexOld !== -1) {
                listTopics[indexOld].isSelected = true
            }
            setListCategories([...listTopics])
            if (refContainer.current) {
                refContainer.current.scrollToIndex({ animated: true, index: indexOld });

            }
        }
    }, [props.isNew, props.idCategories, page])

    const onRefresh = async () => {
        await setPage(0)
        await setLoading(true)
        onGetList()
    }
    const loadMore = async () => {
        if (listCategories.length >= (page + 1) * size) {
            await setPage(prevState + 1)
            onGetList()
        }
    }
    const onGetList = () => {
        newsProvider.listTopics(page, size).then(res => {

            if (res?.content?.length) {
                var listTopics = res.content
                setListCategories([...listTopics])
            }
            setLoading(false)
        }).catch(err => {

            setLoading(false)

        })
    }
    const onSelectItem = (item, index) => {
        var list = listCategories
        list.map(obj => obj.isSelected = false)
        if (item?.isSelected) {
            item.isSelected = false
            list[index] = item
        } else {
            item.isSelected = true
            list[index] = item
        }
        if (refContainer.current) {
            refContainer.current.scrollToIndex({ animated: true, index: index });

        }
        setListCategories([...list])
        props.onSelectCategories(item)
    }
    const renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity disabled={item.isSelected} onPress={() => onSelectItem(item, index)} style={[styles.btnItem, item.isSelected ? styles.btnSelect : styles.btnUnselect]}>
                <Text style={[item.isSelected ? styles.txSelect : styles.txUnSelect, styles.txItem]}>
                    {item?.name?.rawText}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <FlatList
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            data={listCategories}
            onRefresh={onRefresh}
            refreshing={loading}
            onEndReached={loadMore}
            horizontal={true}
            ref={refContainer}
            onEndReachedThreshold={0.7}
            showsHorizontalScrollIndicator={false}
        >

        </FlatList>
    )

}
const styles = StyleSheet.create({
    btnItem: {
        padding: 10,
        marginRight: 10,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnSelect: {
        backgroundColor: '#3161AD',


    },
    btnUnselect: {
        backgroundColor: '#DEE6F2',
    },
    txSelect: {
        color: '#fff'
    },
    txUnSelect: {
        color: '#3161AD'

    },
    txItem: {
        fontSize: 14
    }

})
function mapStateToProps(state) {
    return {
        categoriesSelected: state.auth.categoriesSelected
    };
}
export default connect(mapStateToProps)(ListCategories);