import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import profileProvider from '@data-access/profile-provider'

export default class SendConfirmProfileScreen extends Component {
  constructor(props) {
    super(props);
    let phone =  this.props.navigation.state.params && this.props.navigation.state.params.phone ? this.props.navigation.state.params.phone : ''
    let id =  this.props.navigation.state.params && this.props.navigation.state.params.id ? this.props.navigation.state.params.id : ''
    
    this.state = {
        phone,id
    };
  }
  
  onSendConfirm = () => {
    profileProvider.sendConfirmProfile(this.state.id).then(res => {
        console.log(res,'send confirm')
    }).catch(err => {
        console.log(err)
    })
  }
  render() {
    return (
        <View style = {styles.container}>
      <View style = {styles.viewContent}>
        <Text style = {styles.txContent}> ISOFHCARE đã tìm thấy tài khoản sở hữu số điện thoại {this.state.phone ? this.state.phone : this.state.phone} trên hệ thống. Vui lòng GỬI và ĐỢI XÁC NHẬN mối quan hệ với chủ tài khoản trên. Mọi thông tin thành viên gia đình sẽ lấy theo tài khoản sẵn có. </Text>
      </View>
      <TouchableOpacity onPress = {this.onSendConfirm} style = {styles.btnConfirm}><Text style ={styles.txConfirm}>Gửi xác nhận</Text></TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
    container:{
        flex:1,
        alignItems:'center'
    },
    txContent:{
        textAlign:'center',
        fontSize:14,
        fontWeight: 'bold',
        color:'#000'
    },
    viewContent:{
        padding:10,
        marginVertical:40,
        marginHorizontal:20,
        backgroundColor:'#FAD77D'
    },
    btnConfirm:{
        padding:5,
        backgroundColor:'#359A60',
        borderRadius:5
    },
    txConfirm:{
        color:'#fff',
        fontSize:14
    }
})