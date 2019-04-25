import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import bookingProvider from "@data-access/booking-provider";
import { connect } from "react-redux";
import ActivityPanel from "@components/ActivityPanel";


class PatientHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          day: 25,
          month:'08/2019',
          time:'09:00',
          title:'Khám tổng quát',
          name:'Nguyễn văn an',
          hospital:'Bệnh viện đại học y hà nội',
          status:true
        },
        {
          day: 25,
          month:'08/2019',
          time:'09:00',
          title:'Khám tổng quát',
          name:'Nguyễn văn an',
          hospital:'Bệnh viện đại học y hà nội',
          status:false
        }
      ]
    };
  }
  componentDidMount() {
    const id = this.props.booking.hospitalId ? this.props.booking.hospitalId : 65
    bookingProvider
      .getPatientHistory(id)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }
  renderItem = item => {
    console.log(item,'s')
    return (
      <TouchableOpacity style={styles.listBtn}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{fontSize:40,fontWeight:'bold',color:"#C6C6C9"}}>{item.item.day}</Text>
            <Text style={{fontWeight:'bold'}}>{item.item.month}</Text>
            <Text>{item.item.time}</Text>
          </View>
          <View
            style={{
              width: "75%",
              borderLeftColor: "#E5E5E5",
              borderLeftWidth: 1,
              padding: 10
            }}
          >
            <Text style ={{fontWeight:'bold'}}>{item.item.title}</Text>
            <Text>{item.item.name}</Text>
            <Text>{item.item.hospital}</Text>
            {item.item.status ? (
              <TouchableOpacity style = {styles.statusTx}>
              <Text style={{color:'#fff'}}>Chờ xác nhận</Text>
            </TouchableOpacity>
            ):(
              <TouchableOpacity style = {styles.statusReject}>
              <Text style={{color:'rgb(208,2,27)'}}>Đã huỷ ( không phục vụ )</Text>
            </TouchableOpacity>
            )}
       
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <ActivityPanel
        style={{ flex: 1, backgroundColor: "#f7f9fb" }}
        title="Lịch sử đặt lịch"
        titleStyle={{ marginLeft: 40 }}
        containerStyle={{
          backgroundColor: "#f7f9fb"
        }}
        actionbarStyle={{
          marginLeft: 10
        }}
      >
        <FlatList
          data={this.state.data}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </ActivityPanel>
    );
  }
}
const styles = StyleSheet.create({
  listBtn: {
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E5E5E5"
  },
  statusTx:{marginVertical:5, backgroundColor:'rgb(2,195,154)',borderRadius:10,width:100,justifyContent:'center',alignItems:'center'},
  statusReject:{marginVertical:5,borderColor:'#E5E5E5',borderWidth:1, borderRadius:10,width:200,justifyContent:'center',alignItems:'center'}
});
function mapStateToProps(state) {
  return {
      userApp: state.userApp,
      booking: state.booking

  };
}
export default connect(mapStateToProps)(PatientHistoryScreen);