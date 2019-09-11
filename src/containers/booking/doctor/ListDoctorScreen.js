import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import StarRating from 'react-native-star-rating';
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import ItemDoctor from '@components/booking/doctor/ItemDoctor';
import ScaleImage from "mainam-react-native-scaleimage";

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
        };
        this.listSearch = []
    }
    componentDidMount = () => {
        setTimeout(() => {
            this.setState({ data, isLoading: false })
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
        let keyword = (value || "").trim().toLowerCase().unsignText();
        let listSearch = this.listSearch.filter(data => {
            return (data && (
                !keyword ||
                ((data.name || "").trim().toLowerCase().unsignText().indexOf(keyword) != -1)))
        })
        this.setState({ data: listSearch })


    }
    keyExtractor = (item, index) =>  index.toString()
    listEmpty = () => !this.state.isLoading && <Text style={styles.none_data}>Không có dữ liệu</Text>
    render() {
        return (
            <ActivityPanel
                title="CHỌN BÁC SỸ"
                showFullScreen={true}
                isLoading={this.state.isLoading}>
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
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ListEmptyComponent={this.listEmpty}
                />
            </ActivityPanel>
        );
    }
}

export default ListDoctorScreen;


const styles = StyleSheet.create({
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
})