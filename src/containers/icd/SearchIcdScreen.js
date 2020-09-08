import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView, Image, Alert, Platform } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import { Card } from 'native-base'
import ScaleImage from "mainam-react-native-scaleimage";
import constants from '@resources/strings'
import diseaseProvider from '@data-access/disease-provider'
import locationUtils from '@utils/location-utils';
import ScaledImage from 'mainam-react-native-scaleimage';
const { width, height } = Dimensions.get('window')
const TYPE = {
    SEARCH: 'SEARCH',
    LOAD: 'LOAD'

}
class SearchIcdScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            page: 0,
            size: 20,
            keyword: '',
            type: ''
        };
    }


    componentDidMount() {
        this.onRefresh()
    }


    onChangeText = (state) => (value) => {
        this.setState({ [state]: value, type: TYPE.SEARCH })
        if (!value) {
            this.setState({ type: '' })
        }
    }
    onSearch = () => {
        if (this.state.keyword.trim()) {
            this.setState({
                page: 0,
                refreshing: true,
                type: TYPE.SEARCH
            }, this.search)
        } else {
            this.getData()
        }
    }
    search = async () => {
        try {
            let { keyword, page, size } = this.state

            let res = await diseaseProvider.search(keyword, page, size)
            this.setState({ refreshing: false })
            if (res && res.content && res.content.length > 0) {
                this.formatData(res.content)
            } else {
                this.formatData([])
            }
        } catch (error) {
            this.formatData([])
            this.setState({ refreshing: false })

        }

    }
    getData = () => {
        const { page, size } = this.state
        console.log('page, size: ', page, size);

        diseaseProvider.search("", page, size).then(res => {
            this.setState({ isLoading: false, refreshing: false })
            if (res && res.content && res.content.length > 0) {
                this.formatData(res.content)
            } else {
                this.formatData([])
            }
        }).catch(err => {
            this.formatData([])
            this.setState({ isLoading: false, refreshing: false })

        })
    }
    formatData = (data) => {
        if (data && data.length == 0) {
            if (this.state.page == 0) {
                this.setState({ data })
            }
        } else {
            if (this.state.page == 0) {
                this.setState({ data })
            } else {
                this.setState(preState => {
                    return { data: [...preState.data, ...data] }
                })
            }
        }
    }

    getListLocation = () => {
        locationUtils.getLocation().then(region => {

            this.setState({
                latitude: region.latitude,
                longitude: region.longitude
            }, this.onRefresh);
        }).catch(err => {


        })
    }
    onShowDetails = (index) => {
        let data = this.state.data
        if (data[index] && data[index].showDetails) {
            data[index].showDetails = false
            this.setState({
                listData: data
            })
        } else {
            data[index].showDetails = true
            this.setState({
                listData: data
            })
        }
    }
    onRefresh = () => {
        this.setState({
            page: 0,
            refreshing: true,
            keyword: '',
            item: {},
            type: ''
        }, () => {
            this.getData()
        })
    }
    loadMore = () => {

        const { page, size, data, keyword } = this.state

        if (data && data.length >= (page + 1) * size) {

            this.setState(preState => {
                return {
                    page: preState.page + 1
                }
            }, () => {
                switch (this.state.type) {
                    case TYPE.SEARCH:
                        this.search()
                        break;
                    case TYPE.LOAD: this.getData()
                        break;
                    default:
                        this.getData()
                        break;
                }
            })
        }
    }
    keyExtractor = (item, index) => item.id || index.toString()
    renderItem = ({ item, index }) => {

        return (
            <View>
                <TouchableOpacity disabled={!(item.children && item.children.length)} style={styles.btn} onPress={() => this.onShowDetails(index)}>
                    <View style={styles.viewCode}>
                        <Text style={styles.txCode}>
                            {item.diseaseCode}
                        </Text>
                    </View>
                    <View style={styles.viewName}>
                        <View style={styles.viewTxName}>
                            <Text style={styles.txName}>{item.diseaseName}</Text>
                            <Text style={styles.txNameEn}>{item.diseaseEnName}</Text>
                        </View>
                        {item.children && item.children.length ? <ScaledImage height={10} source={require('@images/new/icd/ic_right.png')}></ScaledImage> : <View></View>}
                    </View>
                </TouchableOpacity>
                {
                    item.showDetails && item.children ? item.children.map((obj, i) => {
                        return <View style={styles.viewCard} key={i}>
                            <View style={styles.viewCodeDetails}>
                                <Text style={styles.txCodeDetails}>{obj.diseaseCode}</Text>
                            </View>
                            <View style={styles.viewTxNameDetails}>
                                <Text style={styles.txNameDetails}>
                                    {obj.diseaseName}</Text>
                                <Text style={styles.txNameEnDetails}>
                                    {obj.diseaseEnName}</Text>
                            </View>

                        </View>
                    }) : <View></View>
                }
            </View>
        )
    }

    render() {

        const { refreshing, data } = this.state

        return (
            <ActivityPanel
                transparent={true}
                title={'Tra cứu mã bệnh'}
                isLoading={this.state.isLoading}>
                <View style={styles.groupSearch}>
                    <TextInput
                        value={this.state.keyword}
                        onChangeText={this.onChangeText('keyword')}
                        onSubmitEditing={this.onSearch}
                        returnKeyType='search'
                        style={styles.inputSearch}
                        placeholder={"Tìm kiếm theo mã ICD, tên bệnh"}
                        underlineColorAndroid={"transparent"} />
                    {
                        this.state.type == TYPE.SEARCH ?
                            <TouchableOpacity style={[styles.buttonSearch, { borderLeftColor: '#BBB', borderLeftWidth: 0.7 }]} onPress={this.onRefresh}>
                                <ScaleImage source={require('@images/ic_close.png')} height={16} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={[styles.buttonSearch,]} onPress={this.onSearch}>
                                <ScaleImage source={require('@images/new/hospital/ic_search.png')} height={16} />
                            </TouchableOpacity>

                    }

                </View>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                        style={styles.flex}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                        ListEmptyComponent={this.listEmpty}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={1}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                    >

                    </FlatList>
                </View>
            </ActivityPanel >
        );
    }
}

export default SearchIcdScreen;


const styles = StyleSheet.create({
    flex: { flex: 1 },
    txtButtonTab: {
        fontWeight: 'bold'
    },
    buttonTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        paddingVertical: 10,
        borderBottomColor: '#3161AD'
    },
    buttonLocation: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconLocation: {
        tintColor: '#00A3FF'
    },
    txtLocation: {
        color: '#00A3FF',
        paddingLeft: 5,
        paddingRight: 10,
    },
    groupTab: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%'
    },
    containerTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderBottomColor: '#BBB',
        borderBottomWidth: 0.6,
    },
    container: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flex: 1,
        // padding: 10
    },
    containerFilte: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
    },
    txtFilter: {
        color: '#FFF',
        textDecorationLine: 'underline',
        paddingRight: 20,
        paddingBottom: 15,
        fontWeight: '700'
    },
    containerHeader: {
        // position: 'absolute',
        zIndex: 100,
        left: 0,
        right: 0,
        // backgroundColor: '#27c8ad'
    },
    actionbarStyle: {
        backgroundColor: '#27c8ad',
        borderBottomWidth: 0
    },
    titleStyle: {
        color: '#FFF',
        marginLeft: 10
    },
    backgroundHeader: {
        backgroundColor: '#27c8ad',
        height: 100,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0
    },
    flex: {
        flex: 1
    },
    linear: {
        width: '100%',
        height: height / 3,
        alignItems: 'center',
        justifyContent: 'center'
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
    Specialist: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111111',
        width: '40%',
        paddingLeft: 10
    },
    between: {
        backgroundColor: '#02c39a',
        height: 1,
        marginVertical: 9,
        width: '100%',
        alignSelf: 'center'
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        justifyContent: 'flex-start',
        backgroundColor: '#E8EBF1',
        marginTop: 10,
        flex: 1,
        marginHorizontal: 10
    },
    groupProfile: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    viewCode: {
        backgroundColor: '#3161AD',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        height: '100%',
        width: '15%',
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
    },
    txCode: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    viewName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        marginLeft: 12,
        flex: 1,
        paddingRight: 10,
        paddingVertical: 10
    },
    viewTxName: {
    },
    txName: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
    txNameEn: {
        fontSize: 14,
        color: '#00000050'
    },
    viewCodeDetails: {
        // justifyContent: 'flex-start',
        alignItems: 'center',
        // alignSelf: 'flex-start',
        height: '100%',
        padding: 10,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
    },
    viewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        marginHorizontal: 10,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        marginTop: 5,
        flex: 1,
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    txCodeDetails: {
        color: '#E2474B',
        fontSize: 16,
        fontWeight: 'bold'
    },
    viewTxNameDetails: {
        flex: 1,
        paddingVertical: 10
    },
    txNameDetails: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
    txNameEnDetails: {
        fontSize: 14,
        color: '#00000050'
    }

})