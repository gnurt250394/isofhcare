import React, { Component } from 'react';
import { View, Text,FlatList,StyleSheet } from 'react-native';
import hospitalProvider from '@data-access/hospital-provider'
import HospitalItemFull from '@components/hospital/HospitalItemFull'
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
        <HospitalItemFull index={item.index} item={item.item}></HospitalItemFull>
    )
}
  render() {
    return (
      <View>
    <Actionbar />
        <HeaderLine onPress={this.onShowInfo} isShowViewAll={false} title={'PHÒNG KHÁM, BỆNH VIỆN HÀNG ĐẦU'} />
       <View style={{alignItems:'center'}}>

       </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({

})
