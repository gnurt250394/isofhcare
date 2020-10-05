import React, { Component, useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import newsProvider from '@data-access/news-provider';
import snackbar from '@utils/snackbar-utils';
const CategoryScreen = ({ navigation }) => {
    const [data, setData] = useState([])
    const [listSelected, setListSelected] = useState(() => navigation.getParam('listSelected', []))
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(20)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        getData()
    }, [])
    const getData = () => {
        newsProvider
            .getListCategory(page, size)
            .then(res => {
                console.log('res: ', res);
                setRefreshing(false)
                if (res?._embedded?.topics?.length) {
                    formatData(res?._embedded?.topics);
                } else {
                    formatData([]);
                }
            })
            .catch(err => {
                console.log('err: ', err);
                setRefreshing(false)
                formatData([]);
            });
    };

    const formatData = data => {
        if (data.length == 0) {
            if (page == 0) {
                setData([]);
            }
        } else {
            if (page == 0) {
                setData(data);
            } else {
                setData(state => [...state, ...data]);
            }
        }
    };
    const footerComponent = () => {
        const { page, size, data } = state;
        if (data.length >= (page + 1) * size) {
            return <ActivityIndicator color="#00CBA7" size="small" />;
        } else {
            return null;
        }
    };
    const onSelected = item => () => {
        let list = [...listSelected];

        let i = list.findIndex(e => e.topicId == item.topicId);

        if (i == -1 && list.length >= 3) {
            list.shift();
            list.push(item);
        } else {
            if (i != -1) {
                list.splice(i, 1);
            } else {
                list.push(item);
            }
        }
        setListSelected(list)
    }
    const nextPage = () => {
        if (!listSelected.length) {
            snackbar.show('Vui lòng chọn ít nhất 1 chuyên mục', 'danger')
            return
        }
        const onSelected = navigation.getParam('onSelected', null);
        if (onSelected) onSelected(listSelected);
        navigation.goBack();
    };
    const renderItem = ({ item, index }) => {
        const isChecked = listSelected.find(e => e.topicId == item.topicId);
        return (
            <TouchableOpacity
                onPress={onSelected(item)}
                style={[styles.containerItem, isChecked ? { backgroundColor: '#3161AD' } : {}]}>
                {/* <ScaleImage source={require('@images/ic_service.png')} width={20} height={22} style={{ tintColor: '#FFF', }} /> */}
                <Text numberOfLines={2} style={[styles.txtItem, isChecked ? { color: "#FFF" } : {}]}>
                    {item?.name?.rawText}
                </Text>
            </TouchableOpacity>
        );
    };
    const keyExtractor = (item, index) => `${item.id || index}`;
    const listEmpty = () =>
        !refreshing && (
            <Text style={styles.none_data}>Không có dữ liệu</Text>
        );
    const loadMore = () => {
        if (data.length >= (page + 1) * size) {
            setPage(page => page + 1);
        }
    };


    const onClose = () => {
        navigation.pop();
    };

    const renderFooter = () => {
        return <View style={{ height: 50 }} />;
    };
    return (
        <ActivityPanel
            hideActionbar={true}
            transparent={true}
            useCard={true}
            containerStyle={styles.container}>
            <View style={styles.group}>
                <View>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.buttonClose}>
                        <ScaleImage
                            source={require('@images/ic_close.png')}
                            height={18}
                            style={{ tintColor: '#000' }}
                        />
                    </TouchableOpacity>
                    <View style={styles.containerDone}>
                        <Text style={styles.txtHeader}>Chuyên mục</Text>
                        <TouchableOpacity onPress={nextPage} style={{ paddingRight: 20 }} >
                            <Text style={styles.txtDone}>Xong</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.containerInput}>
                        <TextInput
                            style={styles.inputSearch}
                            onSubmitEditing={searchData}
                            value={keyword}
                            placeholder="Tìm kiếm chuyên khoa"
                            onChangeText={onChangeText}
                        />
                        <TouchableOpacity
                            style={[styles.buttonSearch]}
                            onPress={searchData}>
                            <ScaleImage
                                source={require('@images/new/hospital/ic_search.png')}
                                height={16}
                            />
                        </TouchableOpacity>
                    </View> */}
                </View>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    // style={{paddingTop:height/4}}
                    keyExtractor={keyExtractor}
                    style={{
                        padding: 10,
                        // justifyContent: 'space-evenly',
                    }}
                    numColumns={2}
                    ListEmptyComponent={listEmpty}
                    onRefresh={getData}
                    ListFooterComponent={renderFooter}
                    refreshing={refreshing}
                />
            </View>
        </ActivityPanel>
    );
}

const styles = StyleSheet.create({
    txtDone: {
        color: '#00BA99',
        fontWeight: 'bold'
    },
    containerDone: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    buttonClose: {
        // alignSelf: 'flex-end',
        paddingLeft: 20,
        paddingBottom: 10,
    },
    group: {
        flex: 1,
        marginTop: 20,
    },
    container: {
        paddingHorizontal: 10,
        paddingTop: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    txtItem: {
        color: '#3161AD',
        paddingHorizontal: 7,
        paddingRight: 10,
        fontWeight: 'bold',
    },
    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3161AD30',
        paddingVertical: 5,
        width: '45%',
        marginLeft: 13,
        marginTop: 10,
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 10,
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        height: 45,
        borderColor: '#BBB',
        borderWidth: 0.7,
        borderRadius: 5,
        alignSelf: 'center',
        paddingLeft: 10,
    },
    txtHeader: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 17,
        flex: 1,
        paddingLeft: 45,
    },
    none_data: {
        marginTop: '50%',
        alignSelf: 'center',
        fontSize: 17,
        color: '#000',
    },
    buttonSearch: {
        marginRight: -2,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    inputSearch: {
        flex: 1,
        marginLeft: -10,
        fontWeight: 'bold',
        paddingLeft: 9,
        color: '#000',
    },
});
export default CategoryScreen;
