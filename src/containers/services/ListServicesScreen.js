import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native'
import ActivityPanel from '@components/ActivityPanel'
import serviceProvider from '@data-access/service-provider'
import ImageLoad from "mainam-react-native-image-loader";
import ImageUtils from 'mainam-react-native-image-utils'
const { height } = Dimensions.get('window')
const ListServicesScreen = ({ navigation }) => {
    const [state, setState] = useState(
        {
            isLoading: true,
            page: 0,
            size: 20,
            data: []
        }
    );
    console.log('state: ', state);
    async function getData() {
        try {
            let res = await serviceProvider.searchCategory(null, state.page, state.size)
            if (res.length) {
                // res.forEach(async(e) => {
                //     let img = await ImageUtils.cachingImage(e.image, 50, 50, 'PNG', 0, 0)
                //     e.image = img.path

                // })
                formatData(res)
            } else {
                formatData([])
            }

        } catch (error) {
            formatData([])


        }
    }
    const formatData = (data) => {
        if (data.length == 0) {
            if (state.page == 0) {
                setState({ ...state, data: [], isLoading: false })
            } else {
            }
        } else {
            if (state.page == 0) {
                setState({ ...state, data, isLoading: false })
            } else {
                setState({ ...state, data: [...state.data, ...data], isLoading: false })
            }
        }
    }

    const loadMore = () => {
        if (state.data.length >= (state.page + 1) * state.size) {
            setState({ ...state, page: state.page + 1 })
        }
    }
    useEffect(() => {
        getData()
    }, [state.page])
    const goToDetailService = (item) => () => {
        navigation.navigate('listServicesDetail', { item })
    }
    const keyExtractor = (item, index) => `${index}`
    const renderItem = ({ item, index }) => {
        console.log('item: ', item);
        let source = item.image ? { uri: item.image } : require("@images/new/user.png")
        return (
            <TouchableOpacity
                onPress={goToDetailService(item)}
                style={styles.containerItem}>
                {/* <Image source={{ uri: item.image }} style={styles.imageItem} /> */}
                <ImageLoad
                    resizeMode="cover"
                    imageStyle={styles.imageItem}
                    borderRadius={10}
                    customImagePlaceholderDefaultStyle={[{
                        width:'100%',
                        height:'100%'
                    }]}
                    placeholderSource={require("@images/new/user.png")}
                    resizeMode="cover"
                    loadingStyle={{ size: 'small', color: 'white' }}
                    source={source}
                    style={styles.imageItem}
                />
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
        elevation: 2,
        backgroundColor: '#FFF'
    },
})