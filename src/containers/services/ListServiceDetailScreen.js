import React, { Component, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView, Animated, Image } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import StarRating from 'react-native-star-rating';
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import ItemDoctor from '@components/booking/doctor/ItemDoctor';
import ScaleImage from "mainam-react-native-scaleimage";
import Carousel, { Pagination } from 'react-native-snap-carousel'
import LinearGradient from 'react-native-linear-gradient'
import ActionBar from '@components/Actionbar';
import constants from '@resources/strings'
import ItemService from '@components/services/ItemService';
import serviceProvider from '@data-access/service-provider'

const { width, height } = Dimensions.get('window')
const TYPE = {
    SEARCH: 'SEARCH',
    HOSPITAL: 'HOSPITAL',
    SPECIALIST: 'SPECIALIST'
}
const ListServiceDetailScreen = ({ navigation }) => {
    console.log('navigation: ', navigation);
    const [state, setState] = useState({
        isLoading: false,
        data: [
            {
                id: 1,
                name: 'Khám thạc sĩ',
                hospital: {
                    name: 'BV Đại học Y Hà nội',
                    id: 1
                },
                price: 10000000,
                description: 'Thạc sĩ. Bác sĩ Huỳnh Khiêm Huy đã có hơn 11 kinh nghiệm làm việc Thạc sĩ. Bác sĩ Huỳnh Khiêm Huy đã có hơn 11 kinh nghiệm làm việc Thạc sĩ. Bác sĩ Huỳnh Khiêm Huy đã có hơn 11 kinh nghiệm làm việc Thạc sĩ. Bác sĩ Huỳnh Khiêm Huy đã có hơn 11 kinh nghiệm làm việc Thạc sĩ. Bác sĩ Huỳnh Khiêm Huy đã có hơn 11 kinh nghiệm làm việc Thạc sĩ. Bác sĩ Huỳnh Khiêm Huy đã có hơn 11 kinh nghiệm làm việc',
                voucher: {

                },
                location: '2km'
            },
            {
                id: 1,
                name: 'Khám thạc sĩ',
                hospital: {
                    name: 'BV Đại học Y Hà nội',
                    id: 1
                },
                price: 10000000,
                description: 'Thạc sĩ. Bác sĩ Huỳnh Khiêm Huy đã có hơn 11 kinh nghiệm làm việc...',
                voucher: {

                },
                location: '2km'
            },
        ],
        keyword: '',
        infoDoctor: {},
        page: 0,
        size: 20,
        refreshing: false,
        category: navigation.getParam('item', {}),
        item: {},
        type: ''
    });
    // useEffect(() => {
    //     getData()
    //     return () => {
    //     };
    // }, [])
    const getData = () => {
        console.log('getData')

        console.log('state.categoryId: ', state.categoryId);
        serviceProvider.getListServices(state.keyword, state?.category?.id, state.page, state.size).then(res => {
            setState({ ...state, isLoading: false, refreshing: false })
            if (res && res.length > 0) {
                formatData(res)
            } else {
                formatData([])
            }
        }).catch(err => {
            formatData([])
            setState({ ...state, isLoading: false, refreshing: false })

        })
    }
    const formatData = (data) => {
        if (data.length == 0) {
            if (state.page == 0) {
                setState({ ...state, data })
            }
        } else {
            if (state.page == 0) {
                setState({ ...state, data })
            } else {
                setState(preState => {
                    return { ...state, data: [...preState.data, ...data] }
                })
            }
        }
    }
const gotoDetailService=(item)=>()=>{
    navigation.navigate('listOfServices', { item })
}
    const renderItem = ({ item }) => {
        return (
            <ItemService item={item} onPress={gotoDetailService(item)} />
        )
    }
    const onChangeText = (state) => (value) => {
        setState({ [state]: value })
        if (value.length == 0) {
            getData()
        }
    }

    const keyExtractor = (item, index) => index.toString()
    const listEmpty = () => !state.isLoading && <Text style={styles.none_data}>Không có dữ liệu</Text>

    return (
        <ActivityPanel
            title={navigation?.state?.params?.item?.name}
            transparent={true}
            isLoading={state.isLoading}>
            <View style={styles.groupSearch}>
                <TextInput
                    value={state.keyword}
                    onChangeText={onChangeText('keyword')}
                    // onSubmitEditing={onSearch}
                    returnKeyType='search'
                    style={styles.inputSearch}
                    placeholder={"Tìm kiếm…"}
                    underlineColorAndroid={"transparent"} />
                {
                    state.type == TYPE.SEARCH ?
                        <TouchableOpacity style={[styles.buttonSearch, { borderLeftColor: '#BBB', borderLeftWidth: 0.7 }]} onPress={onRefress}>
                            <ScaleImage source={require('@images/ic_close.png')} height={16} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[styles.buttonSearch,]}
                        // onPress={onSearch}
                        >
                            <ScaleImage source={require('@images/new/hospital/ic_search.png')} height={16} />
                        </TouchableOpacity>

                }
                <View style={styles.containerLocation} />
                <TouchableOpacity style={[styles.buttonLocation]}
                // onPress={onSearch}
                >
                    <ScaleImage source={require('@images/ic_location.png')} height={16} style={{
                        tintColor: '#000',
                    }} />
                    <Text style={styles.txtLocation}>Gần tôi</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={state.data}
                renderItem={renderItem}
                // style={{paddingTop:height/4}}
                keyExtractor={keyExtractor}
                ListEmptyComponent={listEmpty}
                // onEndReached={loadMore}
                onEndReachedThreshold={0.6}
                // onRefresh={onRefress}
                refreshing={state.refreshing}
            />
            {/* </ScrollView> */}
        </ActivityPanel >
    );
}

export default ListServiceDetailScreen;


const styles = StyleSheet.create({
    txtLocation: {
        paddingLeft: 5
    },
    buttonLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    containerLocation: {
        height: '80%',
        width: 1,
        backgroundColor: '#00000060'
    },

    flex: {
        flex: 1
    },
    buttonSearch: {
        marginRight: -2,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    inputSearch: {
        flex: 1,
        height: 41,
        marginLeft: -10,
        fontWeight: 'bold',
        paddingLeft: 9,
        color: '#000'
    },
    groupSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 7,
        borderTopWidth: 0.5,
        height: 41,
        borderStyle: "solid",
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.26)',
        backgroundColor: '#fff',
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 7
    },
    none_data: {
        fontStyle: 'italic',
        marginTop: '50%',
        alignSelf: 'center',
        fontSize: 17
    },

})