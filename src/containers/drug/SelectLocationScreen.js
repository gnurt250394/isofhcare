import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';

export default class SelectLocationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLocation:[
                {
                    name:'Nguyễn Đình Huấn',
                    phone:'0333876555',
                    location:'Toà nhà Udic Complex Hoàng Đạo Thuý, Trung Hoà, Cầu Giấy, Hà Nội',
                    status:1
                },
                {
                    name:'Nguyễn Đình Huấn',
                    phone:'0333876555',
                    location:'Toà nhà Udic Complex Hoàng Đạo Thuý, Trung Hoà, Cầu Giấy, Hà Nội',
                    status:0
                },
                {
                    name:'Nguyễn Đình Huấn',
                    phone:'0333876555',
                    location:'Toà nhà Udic Complex Hoàng Đạo Thuý, Trung Hoà, Cầu Giấy, Hà Nội',
                    status:0
                }
            ]
        };
    }
    renderItem = ({ item, index }) => {
        return (
            <View>
                <View><Text>{item.name}</Text><ScaledImage height = {10} source = {require('@images/new/images/ic_dot.png')}></ScaledImage></View>
                <Text>{item.name}</Text>
                <Text>{item.location}</Text>
            </View>
        )
    }
    render() {
        return (
            <View>
                <FlatList
                    data={this.state.dataLocation}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                ></FlatList>
            </View>
        );
    }
}
