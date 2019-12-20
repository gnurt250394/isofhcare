import React, { Component, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from "mainam-react-native-scaleimage";
import bookingDoctorProvider from '@data-access/booking-doctor-provider'
const list = [
    {
        id: 1,
        name: 'Nam khoa, Vô sinh-Hiếm muộn, Vô sinh-Hiếm muộn',
        icon: require('@images/ic_close.png')
    },
    {
        id: 2,
        name: 'Khoa nội',
        icon: require('@images/ic_close.png')
    },
    {
        id: 3,
        name: 'Khoa nội',
        icon: require('@images/ic_close.png')
    },
]
class ListSpecialistScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            data: [],
            page: 0,
            size: 20,
            keyword: ''
        }
    }


    getData = () => {
        const { page, size } = this.state
        bookingDoctorProvider.get_list_specialists(page, size).then(res => {
            this.setState({ isLoading: false })
            if (res && res.length > 0) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        }).catch(err => {
            this.setState({ isLoading: false })
            this.formatData([])
        })
    }

    formatData = (data) => {
        if (data.length == 0) {
            if (this.state.page == 0) {
                this.setState({ data: [] })
            }
        } else {
            if (this.state.page == 0) {
                this.setState({ data })
            } else {
                this.setState((prev) => {
                    console.log('prev: ', prev);
                    return { data: [...prev.data, ...data] }
                })
            }
        }
    }
    footerComponent = () => {
        const { page, size, data } = this.state
        if (data.length >= (page + 1) * size) {
            return (
                <ActivityIndicator color="#00CBA7" size="small" />
            )
        } else {
            return null
        }
    }
    nextPage = (item) => () => {
        this.props.navigation.navigate('tabDoctorAndHospital', {
            item
        })
    }
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={this.nextPage(item)}
                style={styles.containerItem}>
                <ScaleImage source={require('@images/ic_service.png')} width={20} height={22} style={{ tintColor: '#FFF', }} />
                <Text numberOfLines={2} style={styles.txtItem}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    keyExtractor = (item, index) => `${item.id || index}`
    listEmpty = () => !this.state.isLoading && <Text style={styles.none_data}>Không có dữ liệu</Text>
    loadMore = () => {
        const { page, size, data } = this.state
        if (data.length >= (page + 1) * 20) {
            this.setState(preState => {
                return {
                    page: preState.page + 1
                }
            }, () => {
                switch (type) {
                    case TYPE.SEARCH:
                        this.search()
                        break;
                    default:
                        this.getData()
                        break;
                }
            })
        }
    }
    componentDidMount = () => {
        // setTimeout(() => {
        //     setIsLoading(false)
        //     setData(list)
        // }, 500)
        this.getData()
    };

    onClose = () => {
        this.props.navigation.pop()
        console.log('props: ', this.props);
    }
    render() {
        return (
            <ActivityPanel
                hideActionbar={true}
                transparent={true}
                isLoading={this.state.isLoading}>
                <View style={{ padding: 10, }}>
                    <TouchableOpacity
                        onPress={this.onClose}
                        style={{ alignSelf: 'flex-end' }}>
                        <ScaleImage source={require('@images/ic_close.png')} height={18} style={{ tintColor: '#000' }} />
                    </TouchableOpacity>
                    <Text style={styles.txtHeader}>Chuyên khoa</Text>
                    <View style={styles.containerInput}>
                        <TextInput style={styles.inputSearch} placeholder="Tìm kiếm bác sĩ, chuyên khoa hoặc cơ sở y tế" />
                        <TouchableOpacity style={[styles.buttonSearch,]} onPress={this.onSearch}>
                            <ScaleImage source={require('@images/new/hospital/ic_search.png')} height={16} />
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    // style={{paddingTop:height/4}}
                    keyExtractor={this.keyExtractor}
                    columnWrapperStyle={{
                        // justifyContent: 'space-evenly',
                    }}
                    numColumns={2}
                    ListEmptyComponent={this.listEmpty}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.6}
                    onRefresh={this.onRefress}
                    refreshing={this.state.refreshing}
                />
            </ActivityPanel >
        )
    }
}

const styles = StyleSheet.create({
    txtItem: {
        color: '#FFF',
        paddingHorizontal: 7,
        fontWeight: 'bold'
    },
    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00BA99',
        paddingVertical: 10,
        width: '45%',
        marginLeft: 13,
        height: 50,
        marginTop: 10,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
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
        paddingBottom: 10,
    },
    none_data: {
        fontStyle: 'italic',
        marginTop: '50%',
        alignSelf: 'center',
        fontSize: 17
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
        marginLeft: -10,
        fontWeight: 'bold',
        paddingLeft: 9,
    },
});
export default ListSpecialistScreen;
