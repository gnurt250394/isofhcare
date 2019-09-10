import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import StarRating from 'react-native-star-rating';
import ScaleImage from "mainam-react-native-scaleimage";
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'
import ItemDoctor from '@components/booking/doctor/ItemDoctor';

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
            data: []
        };
    }
    componentDidMount = () => {
        setTimeout(() => {
            this.setState({ data, isLoading: false })
        }, 1000)
    };
    goDetailDoctor = (item) => () => {
        this.props.navigation.navigate('detailsDoctor', {
            profileDoctor: item
        })
    }
    addBookingDoctor = (item) => () => {
        this.props.navigation.navigate('addBookingDoctor', {
            profileDoctor: item
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
    keyExtractor = (item, index) => index.toString()
    render() {
        return (
            <ActivityPanel
                title="CHỌN BÁC SỸ"
                showFullScreen={true}
                isLoading={this.state.isLoading}>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                />
            </ActivityPanel>
        );
    }
}

export default ListDoctorScreen;
