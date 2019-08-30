import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';

export default class ProfileInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
      <View style={styles.viewItem}>
        <Text><Text style={styles.txLabel}>Họ và tên:</Text><Text style={styles.txContent}>{'xxxxxxxx'}</Text></Text>
        <ScaledImage height={20} source={require('@images/new/profile/ic_edit.png')}></ScaledImage>
      </View>
      <View style={styles.viewItem}>
        <Text><Text style={styles.txLabel}>Ngày sinh:</Text><Text style={styles.txContent}>{'xxxxxx'}</Text></Text>
      </View>
      <View style={styles.viewItem}>
        <Text><Text style={styles.txLabel}>ID:</Text><Text style={styles.txContent}>{'xxxxxxxx'}</Text></Text>
        <ScaledImage height={20} source={require('@images/new/profile/ic_edit.png')}></ScaledImage>
      </View>
      <View style={styles.viewItem}>
        <Text><Text style={styles.txLabel}>Giới tính:</Text><Text style={styles.txContent}>{'xxxxxxxxxxx'}</Text></Text>
        <ScaledImage height={20} source={require('@images/new/profile/ic_edit.png')}></ScaledImage>
      </View>
      <View style={[styles.viewItem,{}]}>
      <Text><Text style={styles.txLabel}>Chiều cao: </Text><Text style={styles.txContent}>{'173'}</Text></Text>
        <Text style={[styles.txLabel]}>Cân nặng: <Text style={{color:'#000'}}>{'69'}</Text></Text>
        <ScaledImage height={20} source={require('@images/new/profile/ic_edit.png')}></ScaledImage>
      </View>
      <View style={styles.viewItem}>
        <Text><Text style={styles.txLabel}>Chỉ số BMI:</Text><Text style={styles.txContent}>{'xxxxxxxxxx'}</Text></Text>
        <ScaledImage height={20} source={require('@images/new/profile/ic_edit.png')}></ScaledImage>
      </View>
      <View style={styles.viewItem}>
        <Text><Text style={styles.txLabel}>Số điện thoại:</Text><Text style={styles.txContent}>{'xxxxxxxxxx'}</Text></Text>
      </View>
      <View style={styles.viewItem}>
        <Text><Text style={styles.txLabel}>Địa chỉ:</Text><Text style={styles.txContent}>{'xxxxxxx'}</Text></Text>
        <ScaledImage height={20} source={require('@images/new/profile/ic_edit.png')}></ScaledImage>
      </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    padding:10,
    flex:1,
  },
  viewItem:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginVertical: 10,
  },
  txLabel:{
    color:'#02C39A'
  },
  txContent:{
    marginLeft:5,
    color:'#000'
  }
})