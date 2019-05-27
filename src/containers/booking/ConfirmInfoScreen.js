import React, { Component } from 'react';
import { View, Text,StyleSheet ,TouchableOpacity,ScrollView} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';

export default class ConfirmInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <ActivityPanel
        style={styles.AcPanel}
        title="Xác nhận thông tin"
        containerStyle={{
            backgroundColor: "#f7f9fb"
        }}
        actionbarStyle={{
            backgroundColor: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.06)'
        }}
    >
    <ScrollView>
       <View style={{marginVertical:20,padding:10,backgroundColor:'rgba(39,174,96,0.11)'}}>
 
       <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
       <Text>Mã thẻ BHYT</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>HT91237126378912</Text>
       </View>
       <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
       <Text>Họ và tên</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>Trần mai hương</Text>
       </View>
       <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
       <Text>Giới tính</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>Nữ</Text>
       </View>
       <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
       <Text>Ngày sinh</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>29-12-1994</Text>
       </View>
       <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
       <Text>Ngày bắt đầu</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>01/01/2019</Text>
       </View>
       <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
       <Text>Nơi đăng ký khám {`\n`} chữa bệnh ban đầu</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>Bệnh viện thanh nhàn</Text>
       </View>
       <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
       <Text>Số điện thoại</Text>
       <Text style={{fontWeight:'bold',color: '#F05673'}}>0123467889</Text>
       </View>
       <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
       <Text>Địa chỉ</Text>
       <Text  style={{fontWeight:'bold',textAlign:'right',width:150,color: '#4A4A4A'}}>Số 12, ngõ 9 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội</Text>
       </View>
       </View>
       <TouchableOpacity style={[styles.button ]}><Text style={{color: "#ffffff",fontSize:16
      }}>Lấy số ngay</Text></TouchableOpacity>
      </ScrollView>
      </ActivityPanel>
      
    );
  }
}
const styles = StyleSheet.create({
    AcPanel: {
        flex: 1,
        backgroundColor: '#cacaca',
    },
  
  button: {
    justifyContent:'center',
    alignItems: 'center',
      borderRadius: 6,
      backgroundColor: "#02c39a",
      shadowColor: "rgba(0, 0, 0, 0.21)",
      shadowOffset: {
          width: 2,
          height: 4
      },
      paddingVertical: 15,
      shadowRadius: 10,
      marginVertical:10,
      marginHorizontal: 30,
      shadowOpacity: 1
  },})
