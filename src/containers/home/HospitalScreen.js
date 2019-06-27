import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import hospitalProvider from '@data-access/hospital-provider'
import HospitalItem from '@components/hospital/HospitalItem'
import HeaderLine from '@components/home/HeaderLine'
import Actionbar from '@components/home/Actionbar';
export default class HospitalScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: []
        }
    }
    componentDidMount() {
        this.getList()
    }
    getList = () => {
        hospitalProvider.getListTopRateHospital().then(res => {
            this.setState({
                listData: res
            })
        }).catch(err => {
            console.log(err)
        })
    }
    getWidth = () => {
        let width = Dimensions.get("window").width;
        return width / 2 - 10;
    }
    renderItem = (item) => {
        return (
            <HospitalItem widthImg={this.getWidth()}  index={item.index} item={item.item}></HospitalItem>
        )
    }
    render() {
        return (
            <View>
                <Actionbar />
                <HeaderLine onPress={this.onShowInfo} isShowViewAll={false} title={'PHÒNG KHÁM, BỆNH VIỆN HÀNG ĐẦU'} />
                <View style={{ alignItems: 'center', width: '100%' }}>
                    <FlatList
                        data={this.state.listData}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        numColumns={2}
                        renderItem={this.renderItem}
                        showsVerticalScrollIndicator={false}
                    >

                    </FlatList>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({

})
