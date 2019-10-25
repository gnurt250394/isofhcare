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


const { width, height } = Dimensions.get('window')
const data = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        rating: 3.5,
        quantity: 1024,
        avatar: 'http://www.dangcongsan.vn/DATA/0/2019/09/file76xog5oc70i1g0dp219_156748_9282_7304_1567581048-20_11_49_618.jpg',
        position: ['Răng hàm mặt', 'Tai mũi họng', 'Mắt'],
        address: [
            { name: 'Phòng khám Y Khoa Hà Nội', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện Đại học Y', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện E', service: 'Khám tổng quát', price: 100000 }],
    },
    {
        id: 2,
        name: 'Nguyễn Văn B',
        rating: 4.7,
        quantity: 2098,
        avatar: 'https://icdn.dantri.com.vn/thumb_w/640/2019/08/14/nu-sinh-lao-cai-xinh-dep-duoc-vi-nhu-thien-than-anh-thedocx-1565795558127.jpeg',
        position: ['Tai mũi họng', 'Mắt'],
        address: [
            { name: 'Phòng khám Y Khoa Hà Nội', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện Đại học Y', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện E', service: 'Khám tổng quát', price: 100000 }],
    },
    {
        id: 3,
        name: 'Nguyễn Văn C',
        rating: 3.5,
        quantity: 1024,
        avatar: 'https://lh3.googleusercontent.com/-owjXePebdEk/WqHli8rgihI/AAAAAAAABQQ/tXgbapuQrmw8iaxG3XfXx5ZJstkm6NIRwCHMYCw/s0/5aa1e5850d188.jpg',
        position: ['Tai mũi họng', 'Răng hàm mặt', 'Mắt', 'Tai mũi họng', 'Răng mặt'],
        address: [
            { name: 'Phòng khám Y Khoa Hà Nội', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện Đại học Y', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện E', service: 'Khám tổng quát', price: 100000 }],
        time: [
            { time: '07/2011', name: 'Chức vụ bác sỹ đa khoa - Bệnh viện K Hà Nội' },
            { time: '09/2019', name: 'Chức vụ bác sỹ đa khoa - Bệnh viện E Hà Nội' },
        ]
    },
    {
        id: 4,
        name: 'Nguyễn Văn D',
        rating: 4.7,
        quantity: 2098,
        avatar: 'https://imgur.com/vuggCtC.gif',
        position: ['Răng hàm mặt', 'Tai mũi họng', 'Mắt'],
        address: [
            { name: 'Phòng khám Y Khoa Hà Nội', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện Đại học Y', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện E', service: 'Khám tổng quát', price: 100000 }],
        time: [
            { time: '07/2011', name: 'Chức vụ bác sỹ đa khoa - Bệnh viện K Hà Nội' },
            { time: '09/2019', name: 'Chức vụ bác sỹ đa khoa - Bệnh viện E Hà Nội' },
        ]
    },
    {
        id: 5,
        name: 'Nguyễn Văn E',
        rating: 3.5,
        quantity: 1024,
        avatar: 'https://gonhub.com/wp-content/uploads/2018/11/cach-tao-anh-gif.gif',
        position: ['Răng hàm mặt', 'Tai mũi họng', 'Mắt'],

        address: [
            { name: 'Phòng khám Y Khoa Hà Nội', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện Đại học Y', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện E', service: 'Khám tổng quát', price: 100000 }],
        time: [
            { time: '07/2011', name: 'Chức vụ bác sỹ đa khoa - Bệnh viện K Hà Nội' },
            { time: '09/2019', name: 'Chức vụ bác sỹ đa khoa - Bệnh viện E Hà Nội' },
        ]
    },
    {
        id: 6,
        name: 'Nguyễn Văn F',
        rating: 4.7,
        quantity: 2098,
        avatar: 'http://static2.yan.vn/photo/2017/08/15/fce65d76-f337-4ee2-b459-34e68b7b2c46.gif',
        position: ['Răng hàm mặt', 'Tai mũi họng', 'Mắt'],
        address: [
            { name: 'Phòng khám Y Khoa Hà Nội', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện Đại học Y', service: 'Khám tổng quát', price: 100000 },
            { name: 'Bệnh viện E', service: 'Khám tổng quát', price: 100000 }],
        time: [
            { time: '07/2011', name: 'Chức vụ bác sỹ đa khoa - Bệnh viện K Hà Nội' },
            { time: '09/2019', name: 'Chức vụ bác sỹ đa khoa - Bệnh viện E Hà Nội' },
        ]
    },
]
class ListDoctorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
            keyword: '',
            infoDoctor: {}
        };
        this.listSearch = []
        this.onScroll = new Animated.Value(0)
        this.header = Animated.multiply(Animated.diffClamp(this.onScroll, 0, 60), -1)
    }
    componentDidMount = () => {
        setTimeout(() => {
            this.setState({ data, infoDoctor: data[0], isLoading: false })
            this.listSearch = data
        }, 1000)
    };
    goDetailDoctor = (item) => () => {
        this.props.navigation.navigate('detailsDoctor', {
            profileDoctor: item
        })
    }
    addBookingDoctor = (item) => () => {
        this.props.navigation.navigate('selectTimeDoctor', {
            profileDoctor: item,
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
        this.search(value)

    }
    search = (value) => {
        if (this.timeOut) {
            try {
                clearTimeout(this.timeOut)
            } catch (error) {

            }
        }
        this.timeOut = setTimeout(() => {
            let keyword = (value || "").trim().toLowerCase().unsignText();
            let listSearch = this.listSearch.filter(data => {
                return (data && (
                    !keyword ||
                    ((data.name || "").trim().toLowerCase().unsignText().indexOf(keyword) != -1)))
            })
            let obj = listSearch[0] || {}
            this.setState({ data: listSearch, infoDoctor: obj })
        }, 100)


    }
    keyExtractor = (item, index) => index.toString()
    listEmpty = () => !this.state.isLoading && <Text style={styles.none_data}>Không có dữ liệu</Text>
   
    backPress = () => this.props.navigation && this.props.navigation.pop()
    renderHeader = () => {
        return (
            <Animated.View style={[styles.containerHeader, { transform: [{ translateY: this.header }] }]}
                onLayout={(event) => {
                    this.height = event.nativeEvent.layout.height
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
                        onSubmitEditing={this.search}
                        returnKeyType='search'
                        style={styles.inputSearch}
                        placeholder={"Tìm kiếm…"}
                        underlineColorAndroid={"transparent"} />
                    <TouchableOpacity style={styles.buttonSearch} onPress={this.search}>
                        <ScaleImage source={require('@images/new/hospital/ic_search.png')} height={16} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }
    render() {
        const { infoDoctor } = this.state
        return (
            <ActivityPanel
                actionbar={this.renderHeader}
                isLoading={this.state.isLoading}>
                <Animated.ScrollView
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.onScroll } } }],
                        { useNativeDriver: true },
                    )}
                >
                    <View style={[styles.backgroundHeader,]}></View>
                    <View style={{ flex: 1, paddingTop: this.height }}>

                        <FlatList
                            data={this.state.data}
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                            ListEmptyComponent={this.listEmpty}
                        />
                    </View>
                </Animated.ScrollView>
            </ActivityPanel >
        );
    }
}

export default ListDoctorScreen;


const styles = StyleSheet.create({
    containerHeader: {
        position: 'absolute',
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
        height: '15%',
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
        marginTop: 30,
        alignSelf: 'center',
        fontSize: 16
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