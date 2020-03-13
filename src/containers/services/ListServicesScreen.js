import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native'
import ActivityPanel from '@components/ActivityPanel'
import serviceProvider from '@data-access/service-provider'
const { height } = Dimensions.get('window')
const ListServicesScreen = ({ navigation }) => {
    const [state, setState] = useState(
        {
            isLoading: true,
            page: 0,
            size: 20,
            data: [
                // {
                //     id: 1,
                //     name: 'Khám sức khoẻ tổng quát',
                //     image: 'https://i.pinimg.com/736x/7c/1a/e2/7c1ae2112b91008df6440f5a6ecece6a.jpg'
                // },
                // {
                //     id: 2,
                //     name: 'Kham tong quat',
                //     image: 'https://media-cdn.tripadvisor.com/media/photo-s/12/45/4d/03/anhr-tren-d-i-nhin-v.jpg'

                // },
                // {
                //     id: 3,
                //     name: 'Kham tong quat',
                //     image: 'https://media-cdn.tripadvisor.com/media/photo-s/12/45/4d/03/anhr-tren-d-i-nhin-v.jpg'

                // },
                // {
                //     id: 3,
                //     name: 'Kham tong quat',
                //     image: 'https://media-cdn.tripadvisor.com/media/photo-s/12/45/4d/03/anhr-tren-d-i-nhin-v.jpg'

                // },
            ]
        }
    );
    async function getData() {
        try {
            let res = await serviceProvider.searchCategory(null, state.page, state.size)
            console.log('res: ', res);
            if (res.length) {
                formatData(res)
            } else {
                formatData([])
            }

        } catch (error) {
            formatData([])
            console.log('error: ', error);

        }
    }
    const formatData = (data) => {
        if (data.length == 0) {
            if (state.page == 0) {
                setState({ ...state, data: [], isLoading: false  })
            } else {
            }
        } else {
            if (state.page == 0) {
                setState({ ...state, data , isLoading: false })
            } else {
                setState({ ...state, data: [...state.data, ...data], isLoading: false  })
            }
        }
    }
    useEffect(() => {

        getData()
        return () => {
        };
    }, [])
    const loadMore = () => {
        if (state.data.length >= (state.page + 1) * state.size) {
            setState({ ...state, page: state.page + 1 })
        }
    }
    useEffect(() => {
        if (state.page) {
            getData()
        }
    }, [state.page])
    const goToDetailService = (item) => () => {
        navigation.navigate('listServicesDetail', { item })
    }
    const keyExtractor = (item, index) => `${index}`
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={goToDetailService(item)}
                style={styles.containerItem}>
                <Image source={{ uri: item.image }} style={styles.imageItem} />
                <View style={styles.groupName}>
                    <Text style={styles.txtName} numberOfLines={2}>{item.name}</Text>
                </View>

            </TouchableOpacity>
        )
    }
    return (
        <ActivityPanel
            isLoading={state.isLoading}
            title="Danh mục dịch vụ">

            <FlatList
                data={state.data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReached={loadMore}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.6}
            />
        </ActivityPanel>
    )
}

export default ListServicesScreen


const styles = StyleSheet.create({
    txtName: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    groupName: {
        backgroundColor: '#3161AD',
        borderRadius: 30,
        alignSelf: 'flex-start',
        padding: 10,
        marginTop: 20,
        marginLeft: 10,
        maxWidth: '40%'
    },
    imageItem: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 10,
        resizeMode: 'cover'

    },
    containerItem: {
        borderRadius: 10,
        height: height / 5,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        elevation: 2
    },
})