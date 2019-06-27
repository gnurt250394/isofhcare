import React, { Component } from 'react';
import { View, Text,FlatList,StyleSheet } from 'react-native';
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
renderItem = ( item) => {
    return (
        <HospitalItem widthImg = {150} widthCard={140}  index={item.index} item={item.item}></HospitalItem>
    )
}
  render() {
    return (
      <View>
    <Actionbar />
        <HeaderLine onPress={this.onShowInfo} isShowViewAll={false} title={'PHÒNG KHÁM, BỆNH VIỆN HÀNG ĐẦU'} />
        <FlatList
        data = {this.state.listData}
        keyExtractor = {(item,index) => index.toString()}
        extraData = {this.state}
        numColumns= {2}
        renderItem = {this.renderItem}
        >

        </FlatList>
      </View>
    );
  }
}
const styles = StyleSheet.create({

})
