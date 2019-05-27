import React, { Component } from 'react';
import { View, Text,StyleSheet ,TouchableOpacity,ScrollView,Clipboard} from 'react-native';
import ActivityPanel from '@components/ActivityPanel';
import ScaledImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';

export default class ConfirmInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onCopy = () => {
        Clipboard.setString('LAYSO BVE 12345678');
        snackbar.show("Sao chép thành công");

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
    <View style={{width:'100%',paddingHorizontal:20,marginTop:10}}>
    <Text style={{textAlign:'center'}}>Bạn cần nhắn tin tới tổng đài 8800 (5.000đ) để lấy số thứ tự tiếp đón.</Text>
    <View style={{borderWidth:1,borderColor:'#f05673',marginTop:10,  justifyContent:'center',alignItems: 'center',borderRadius:6,paddingVertical:5}}>
    <Text>Cú pháp sms</Text>
    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}> 
    <Text style={{color:'#f05673'}}>LAYSO BVE 12345678</Text>
  <TouchableOpacity onPress={this.onCopy}><ScaledImage style={{marginLeft: 5,}} height = {14} source={require('@images/new/booking/ic_Copy.png')}></ScaledImage></TouchableOpacity> 
    </View>
    </View>
    </View>
       <View style={{marginVertical:20,backgroundColor:'rgba(39,174,96,0.11)',paddingHorizontal:20}}>
        <View style={styles.viewInfo}>
        <Text>THÔNG TIN NGƯỜI KHÁM</Text>
        <Text></Text>
        </View>
       <View style={styles.viewInfo}>
       <Text>Mã thẻ BHYT</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>HT91237126378912</Text>
       </View>
       <View style={styles.viewInfo}>
       <Text>Họ và tên</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>Trần mai hương</Text>
       </View>
       <View style={styles.viewInfo}>
       <Text>Giới tính</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>Nữ</Text>
       </View>
       <View style={styles.viewInfo}>
       <Text>Ngày sinh</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>29-12-1994</Text>
       </View>
       <View style={styles.viewInfo}>
       <Text>Ngày bắt đầu</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>01/01/2019</Text>
       </View>
       <View style={styles.viewInfo}>
       <Text style={{textAlign:'left'}}>Nơi đăng ký khám {`\n`}chữa bệnh ban đầu</Text>
       <Text style={{fontWeight:'bold',color: '#4A4A4A'}}>Bệnh viện thanh nhàn</Text>
       </View>
       <View style={styles.viewInfo}>
       <Text>Số điện thoại</Text>
       <Text style={{fontWeight:'bold',color: '#F05673'}}>0123467889</Text>
       </View>
       <View style={styles.viewInfo}>
       <Text>Địa chỉ</Text>
       <Text  style={{fontWeight:'bold',textAlign:'right',width:150,color: '#4A4A4A'}}>Số 12, ngõ 9 Doãn Kế Thiện, Mai Dịch, Cầu Giấy, Hà Nội</Text>
       </View>
       </View>
       <TouchableOpacity style={[styles.button ]}><Text style={{color: "#ffffff",fontSize:16
      }}>Gửi tin nhắn lấy số</Text></TouchableOpacity>
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
  viewInfo:{flexDirection:'row',justifyContent:'space-between',marginVertical:5},
  button: {
    justifyContent:'center',
    alignItems: 'center',
      borderRadius: 6,
      backgroundColor:"rgb(10,155,225)",
      shadowColor: "rgba(0, 0, 0, 0.21)",
      shadowOffset: {
          width: 2,
          height: 4
      },
      paddingVertical: 15,
      shadowRadius: 10,
      marginVertical:10,
      marginHorizontal: 60,
      shadowOpacity: 1
  },})
