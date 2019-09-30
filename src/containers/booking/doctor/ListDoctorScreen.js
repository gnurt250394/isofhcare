import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import StarRating from 'react-native-star-rating';
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import ItemDoctor from '@components/booking/doctor/ItemDoctor';
import ScaleImage from "mainam-react-native-scaleimage";
import Carousel, { Pagination } from 'react-native-snap-carousel'
import LinearGradient from 'react-native-linear-gradient'
const { width, height } = Dimensions.get('window')
const data = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        rating: 3.5,
        quantity: 1024,
        avatar: 'http://www.dangcongsan.vn/DATA/0/2019/09/file76xog5oc70i1g0dp219_156748_9282_7304_1567581048-20_11_49_618.jpg',
        position: ['Răng hàm mặt', 'Tai mũi họng', 'Mắt'],
        address: ['Phòng khám Y Khoa Hà Nội', 'Bệnh viện Đại học Y', 'Bệnh viện E']
    },
    {
        id: 2,
        name: 'Nguyễn Văn B',
        rating: 4.7,
        quantity: 2098,
        avatar: 'https://icdn.dantri.com.vn/thumb_w/640/2019/08/14/nu-sinh-lao-cai-xinh-dep-duoc-vi-nhu-thien-than-anh-thedocx-1565795558127.jpeg',
        position: ['Tai mũi họng', 'Mắt'],
        address: ['Phòng khám Y Khoa Hà Nội', 'Bệnh viện Đại học Y', 'Bệnh viện E']
    },
    {
        id: 3,
        name: 'Nguyễn Văn C',
        rating: 3.5,
        quantity: 1024,
        avatar: 'http://www.dangcongsan.vn/DATA/0/2019/09/file76xog5oc70i1g0dp219_156748_9282_7304_1567581048-20_11_49_618.jpg',
        position: ['Tai mũi họng', 'Răng hàm mặt', 'Mắt'],
        address: ['Phòng khám Y Khoa Hà Nội', 'Bệnh viện Đại học Y', 'Bệnh viện E']
    },
    {
        id: 4,
        name: 'Nguyễn Văn D',
        rating: 4.7,
        quantity: 2098,
        avatar: 'https://icdn.dantri.com.vn/thumb_w/640/2019/08/14/nu-sinh-lao-cai-xinh-dep-duoc-vi-nhu-thien-than-anh-thedocx-1565795558127.jpeg',
        position: ['Răng hàm mặt', 'Tai mũi họng', 'Mắt'],
        address: ['Phòng khám Y Khoa Hà Nội', 'Bệnh viện Đại học Y', 'Bệnh viện E']
    },
    {
        id: 5,
        name: 'Nguyễn Văn E',
        rating: 3.5,
        quantity: 1024,
        avatar: 'http://www.dangcongsan.vn/DATA/0/2019/09/file76xog5oc70i1g0dp219_156748_9282_7304_1567581048-20_11_49_618.jpg',
        position: ['Răng hàm mặt', 'Tai mũi họng', 'Mắt'],
        address: ['Phòng khám Y Khoa Hà Nội', 'Bệnh viện Đại học Y', 'Bệnh viện E']
    },
    {
        id: 6,
        name: 'Nguyễn Văn F',
        rating: 4.7,
        quantity: 2098,
        avatar: 'https://icdn.dantri.com.vn/thumb_w/640/2019/08/14/nu-sinh-lao-cai-xinh-dep-duoc-vi-nhu-thien-than-anh-thedocx-1565795558127.jpeg',
        position: ['Răng hàm mặt', 'Tai mũi họng', 'Mắt'],
        address: ['Phòng khám Y Khoa Hà Nội', 'Bệnh viện Đại học Y', 'Bệnh viện E']
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
    renderItem = ({ item }) => {

        return (
            <ItemDoctor
                item={item}
                onPressDoctor={this.goDetailDoctor(item)}
                onPress={this.addBookingDoctor(item)}
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
    onSnapToItem = (index) => {
        let data = [...this.state.data]
        let obj = data[index]
        this.setState({ infoDoctor: obj })
    }
    render() {
        const { infoDoctor } = this.state
        return (
            <ActivityPanel
                title="CHỌN BÁC SỸ"
                showFullScreen={true}
                isLoading={this.state.isLoading}>
                <ScrollView>
                    <View style={{ flex: 1 }}>
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
                        {/* <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ListEmptyComponent={this.listEmpty}
                /> */}
                        <View style={styles.flex}>
                            <LinearGradient
                                colors={['#02C39A', '#00B96C']}
                                locations={[0, 1]}
                                style={styles.linear}>
                                <Carousel
                                    ref={(c) => { this._carousel = c; }}
                                    data={this.state.data}
                                    renderItem={this.renderItem}
                                    sliderWidth={width}
                                    itemWidth={width - 100}
                                    layout={"default"}
                                    sliderHeight={height / 3}
                                    layoutCardOffset={9}
                                    itemHeight={height / 3}
                                    onSnapToItem={this.onSnapToItem}
                                />
                            </LinearGradient>
                            <View
                                style={[styles.groupProfile, { paddingRight: 10 }]}
                            >
                                <Text style={styles.Specialist}>Chuyên khoa</Text>
                                <View style={styles.flex}>
                                    {infoDoctor.position && infoDoctor.position.length > 0 ?
                                        infoDoctor.position.map((e, i) => {

                                            return (
                                                <Text key={i}>{e}</Text>
                                            )
                                        }) :
                                        null
                                    }
                                </View>

                            </View>
                            <View style={styles.between} />
                            <View style={[styles.groupProfile, { paddingRight: 10 }]} >
                                <Text style={styles.Specialist}>Địa điểm làm việc</Text>
                                <View style={styles.flex}>
                                    {infoDoctor.address && infoDoctor.address.length > 0 ?
                                        infoDoctor.address.map((e, i) => {
                                            return (
                                                <Text key={i}>{e}</Text>
                                            )
                                        }) :
                                        null
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ActivityPanel >
        );
    }
}

export default ListDoctorScreen;


const styles = StyleSheet.create({
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
        paddingLeft: 9
    },
    groupSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
        borderTopWidth: 0.5,
        height: 41,
        borderStyle: "solid",
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.26)',
        marginVertical: 10
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