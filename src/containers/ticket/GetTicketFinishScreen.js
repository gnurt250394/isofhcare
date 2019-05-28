import React, { Component } from 'react';
import { View, Text,ImageBackground,StyleSheet  } from 'react-native';
import Dash from 'mainam-react-native-dash-view';
import Modal from 'react-native-modal';
import NavigationService from "@navigators/NavigationService";

export default class GetTicketFinishScreen extends Component {
    state = {

    }
  componentDidMount(){
      this.setState({
        ticketFinish:true,
      })
  }
onCloseTicket = () => {
    this.setState({
        ticketFinish:false
    })
    NavigationService.pop()
}
    render() {
        return (
            <View>
            <Modal
            animationType="fade"
                onBackdropPress={this.onCloseTicket}
                transparent={true} isVisible={this.state.ticketFinish}
            >
            <View style = {styles.container}>
            <View style={styles.viewDialog}> 
            <Text style={{color:'rgb(39,174,96)',fontWeight:'600',marginVertical:20}}>Lấy số khám thành công!</Text>
            <Dash dashColor ={'gray'} style={{ height: 1,flexDirection: 'row',width:'90%'}}  />
            <Text style={{textAlign:'center',marginTop:10}}>Số khám của bạn tại bệnh viện E ngày 14/5/2019 là:</Text>
            <Text style={{fontSize:55,color:'#9013fe',textAlign:'center',fontWeight:'bold',marginVertical: 10,}}>192</Text>
            <View style={{height:1,width:'100%',backgroundColor:'gray' }}></View>
            <Text style={{color:"#27ae60",marginVertical:10}}>Xem chi tiết</Text>
            </View>
          </View>
            </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
    },
    viewDialog:{
        backgroundColor:'#fff',
        alignItems: 'center',
        marginHorizontal:20,
        marginVertical: 20,
        borderRadius: 6,
    }
})