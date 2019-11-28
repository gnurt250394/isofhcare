import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView, Animated } from 'react-native';
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
import bookingDoctorProvider from '@data-access/booking-doctor-provider'

const { width, height } = Dimensions.get('window')
const TYPE = {
    SEARCH: 'SEARCH',
    HOSPITAL: 'HOSPITAL',
    SPECIALIST: 'SPECIALIST'
}
class ListDoctorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
            keyword: '',
            infoDoctor: {},
            page: 0,
            size: 20,
            refreshing: false,
            item: {},
            type: ''
        };
        this.listSearch = []
        this.onScroll = new Animated.Value(0)
        this.header = Animated.multiply(Animated.diffClamp(this.onScroll, 0, 60), -1)
    }
    componentDidMount = () => {
        this.getData()
        // setTimeout(()=>{
        //     this.setState({ data, isLoading: false, refreshing: false })

        // },1000)
    };
    getData = () => {
        const { page, size } = this.state
        console.log('getData')

        bookingDoctorProvider.getListDoctor(page, size).then(res => {
            this.setState({ isLoading: false, refreshing: false })
            if (res && res.length > 0) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        }).catch(err => {
            this.formatData([])
            this.setState({ isLoading: false, refreshing: false })

        })
    }
    formatData = (data) => {
        if (data.length == 0) {
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
    loadMore = () => {
        const { page, size, data, keyword } = this.state
        if (data.length >= (page + 1) * size) {
            this.setState(preState => {
                return {
                    page: preState.page + 1
                }
            }, () => {
                switch (this.state.type) {
                    case TYPE.SEARCH:
                        this.search()
                        break;
                    case TYPE.HOSPITAL:
                        this.getDoctorHospitals()
                        break;
                    case TYPE.SPECIALIST:
                        this.getDoctorSpecialists()
                        break;
                    default:
                        this.getData()
                        break;
                }
            })
        }
    }
    goDetailDoctor = (item) => () => {
        this.props.navigation.navigate('detailsDoctor', {
            item
        })
    }
    addBookingDoctor = (item) => () => {
        this.props.navigation.navigate('selectTimeDoctor', {
            item,
            isNotHaveSchedule: true
        })
    }
    goToAdvisory = () => {
        this.props.navigation.navigate("listQuestion");
    }
    renderItem = ({ item }) => {

        return (
            <ItemDoctor
                item={item}
                onPressDoctor={this.goDetailDoctor(item)}
                onPressBooking={this.addBookingDoctor(item)}
                onPressAdvisory={this.goToAdvisory}
            />
        )
    }
    onChangeText = (state) => (value) => {
        this.setState({ [state]: value })
        if (value.length == 0) {
            this.getData()
        }
    }
    search = async () => {
        try {
            let { keyword, page, size } = this.state
            console.log('keyword: ', keyword);
            let res = await bookingDoctorProvider.searchDoctor(keyword, 'en', page + 1, size)
            this.setState({ refreshing: false })
            if (res && res.length > 0) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        } catch (error) {
            this.formatData([])
            this.setState({ refreshing: false })

        }

    }
    onSearch = () => {
        this.setState({
            page: 0,
            refreshing: true,
            type: TYPE.SEARCH
        }, this.search)
    }
    onRefress = () => {
        this.setState({
            page: 0,
            refreshing: true,
            keyword: '',
            item: {},
            type: ''
        }, this.getData)
    }
    keyExtractor = (item, index) => index.toString()
    listEmpty = () => !this.state.isLoading && <Text style={styles.none_data}>Không có dữ liệu</Text>

    getDoctorHospitals = () => {
        const { item } = this.state
        bookingDoctorProvider.get_doctor_hospitals(item.id, this.state.page, this.state.size).then(res => {
            if (res && res.length > 0) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        }).catch(err => {
            this.formatData([])
        })
    }
    getDoctorSpecialists = () => {
        const { item } = this.state
        bookingDoctorProvider.get_doctor_specialists(item.id, this.state.page, this.state.size).then(res => {
            if (res && res.length > 0) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        }).catch(err => {
            this.formatData([])
        })
    }
    onSelectHospitals = (item) => {
        this.setState({ item, type: TYPE.HOSPITAL, page: 0 }, () => {
            this.getDoctorHospitals(item)
        })
    }
    onSelectSpecialist = (item) => {
        this.setState({ item, type: TYPE.SPECIALIST, page: 0 }, () => {
            this.getDoctorSpecialists(item)
        })
    }
    filterCSYT = () => {
        this.props.navigation.navigate('listHospital', {
            onSelected: this.onSelectHospitals
        })
    }
    filterSpecialist = () => {
        this.props.navigation.navigate('listSpecialist', {
            onSelected: this.onSelectSpecialist
        })
    }
    backPress = () => this.props.navigation && this.props.navigation.pop()
    renderHeader = () => {
        return (
            <View style={[styles.containerHeader, 
                // { transform: [{ translateY: this.header }] }
            ]}
                onLayout={(event) => {
                    this.setState({ height: event.nativeEvent.layout.height })
                    // this.height = event.nativeEvent.layout.height
                }}
            >
                <ActionBar
                    actionbarTextColor={[{ color: constants.colors.actionbar_title_color }]}
                    backButtonClick={this.backPress}
                    title={constants.title.select_doctor}
                    icBack={require('@images/new/left_arrow_white.png')}
                    titleStyle={[styles.titleStyle]}
                    actionbarStyle={[{ backgroundColor: constants.colors.actionbar_color }, styles.actionbarStyle]}
                />
                <View style={styles.groupSearch}>
                    <TextInput
                        value={this.state.keyword}
                        onChangeText={this.onChangeText('keyword')}
                        onSubmitEditing={this.onSearch}
                        returnKeyType='search'
                        style={styles.inputSearch}
                        placeholder={"Tìm kiếm…"}
                        underlineColorAndroid={"transparent"} />
                    {
                        this.state.type == TYPE.SEARCH ?
                            <TouchableOpacity style={[styles.buttonSearch, { borderLeftColor: '#BBB', borderLeftWidth: 0.7 }]} onPress={this.onRefress}>
                                <ScaleImage source={require('@images/ic_close.png')} height={16} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={[styles.buttonSearch,]} onPress={this.onSearch}>
                                <ScaleImage source={require('@images/new/hospital/ic_search.png')} height={16} />
                            </TouchableOpacity>

                    }

                </View>
                {/* <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={styles.containerFilte}>
                        <Text
                            onPress={this.filterCSYT}
                            style={styles.txtFilter}>Cơ sở y tế</Text>
                        <Text onPress={this.filterSpecialist} style={styles.txtFilter}>Chuyên khoa</Text>
                    </View>
                    <Text 
                    onPress={this.onRefress}
                    style={styles.txtFilter}>Hiển thị tất cả</Text>
                </View> */}
            </View>
        )
    }
    render() {
        const { refreshing, data } = this.state
        return (
            <ActivityPanel
                actionbar={this.renderHeader}
                isLoading={this.state.isLoading}>
                <ScrollView
                    // onScroll={Animated.event(
                    //     [{ nativeEvent: { contentOffset: { y: this.onScroll } } }],
                    //     { useNativeDriver: true },
                    // )}
                >
                    <View style={[styles.backgroundHeader,]}></View>
                    {
                        this.state.height ?
                            <View style={{ flex: 1, }}>

                                <FlatList
                                    data={data}
                                    renderItem={this.renderItem}
                                    // style={{paddingTop:height/4}}
                                    keyExtractor={this.keyExtractor}
                                    ListEmptyComponent={this.listEmpty}
                                    onEndReached={this.loadMore}
                                    onEndReachedThreshold={0.6}
                                    onRefresh={this.onRefress}
                                    refreshing={refreshing}
                                />
                            </View>
                            : null
                    }
                </ScrollView>
            </ActivityPanel >
        );
    }
}

export default ListDoctorScreen;


const styles = StyleSheet.create({
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
        backgroundColor: '#02C39A'
    },
    actionbarStyle: {
        backgroundColor: '#02C39A',
        borderBottomWidth: 0
    },
    titleStyle: {
        color: '#FFF',
        marginLeft: 10
    },
    backgroundHeader: {
        backgroundColor: '#02C39A',
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




    groupProfile: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },

})