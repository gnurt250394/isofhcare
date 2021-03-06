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
import { withNavigation } from 'react-navigation';
const { width, height } = Dimensions.get('window')
const TYPE = {
    SEARCH: 'SEARCH',
    HOSPITAL: 'HOSPITAL',
    SPECIALIST: 'SPECIALIST'
}
class ListDoctorOfSpecialistScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
            keyword: '',
            page: 1,
            size: 20,
            refreshing: false,
            item: {},
            type: ''
        };
        this.listSearch = []
        this.self = this.props.self ? this.props.self : this
    }
    componentDidMount = () => {
        this.getData()
    };
    getData = () => {
        const { page, size } = this.state
        bookingDoctorProvider.getListDoctorWithSpecialist(this.props.item.id, page, size).then(res => {
            this.self.setState({ isLoading: false })
            this.setState({ refreshing: false })
            if (res && res.length > 0) {
                this.formatData(res)
            } else {
                this.formatData([])
            }
        }).catch(err => {
            this.formatData([])
            this.setState({ refreshing: false })
            this.self.setState({ isLoading: false })

        })
    }
    formatData = (data) => {
        if (data.length == 0) {
            if (this.state.page == 1) {
                this.setState({ data })
            }
        } else {
            if (this.state.page == 1) {
                this.setState({ data })
            } else {
                this.setState(preState => {
                    return { data: [...preState.data, ...data] }
                })
            }
        }
    }
    componentWillReceiveProps = (props) => {
        if (props.keyword != this.state.keyword) {
            if (this.timeout) clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.setState({ type: props.type, keyword: props.keyword || '', page: 1, refreshing: true }, () => {
                    switch (this.state.type) {
                        case TYPE.SEARCH:
                            this.search()
                            break;
                        default:
                            this.getData()
                            break;
                    }
                })
            }, 500);

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
    renderItem = ({ item }) => {

        return (
            <ItemDoctor
                item={item}
                onPressDoctor={this.goDetailDoctor(item)}
                onPressBooking={this.addBookingDoctor(item)}
            />
        )
    }
    search = async () => {
        try {
            let { page, size, keyword } = this.state

            let res = await bookingDoctorProvider.searchListDoctorWithSpecialist(this.props.item.id, keyword, page, size)
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

    onRefress = () => {
        this.setState({
            page: 1,
            refreshing: true,
        }, () => {
            switch (this.state.type) {
                case TYPE.SEARCH:
                    this.search()
                    break;
                default:
                    this.getData()
                    break;
            }
        })
    }
    keyExtractor = (item, index) => index.toString()
    listEmpty = () => <Text style={styles.none_data}>Kh??ng c?? d??? li???u</Text>

    render() {
        const { refreshing, data } = this.state
        return (

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
        );
    }
}

export default withNavigation(ListDoctorOfSpecialistScreen);


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
        backgroundColor: '#27c8ad'
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
        // fontStyle: 'italic',
        marginTop: '50%',
        alignSelf: 'center',
        fontSize: 17,
        color: '#000'
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