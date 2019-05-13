import React, { Component } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import { connect } from "react-redux";
import ScaleImage from "mainam-react-native-scaleimage";
import ImagePicker from "mainam-react-native-select-image";
import ImageLoad from "mainam-react-native-image-loader";
import connectionUtils from "@utils/connection-utils";
import dateUtils from "mainam-react-native-date-utils";
import StarRating from 'react-native-star-rating';
import userProvider from '@data-access/user-provider';
import questionProvider from '@data-access/question-provider';

class DetailsDoctorScreen extends Component {
  constructor() {
    super();
    this.state = {
      name:'',
      nameSpecialist: '',
      certificateCode:'',
      intro:'',
      rating:0,
      isLoading:true,
      avatar:'',
      id:''
    };
  }
  componentDidMount() {
    var id = this.props.navigation.state.params ? this.props.navigation.state.params.id : ''
    this.setState({
      id : id
    })
     this.getDetails()
  }
  getDetails = () => {
    connectionUtils
    .isConnected()
    .then(s => {
      this.setState(
        {
          isLoading: true
        },
        () => {
    userProvider.detail(this.state.id, (s, e) =>{
  if(s){
    console.log(s.data,'s.data')

    this.setState({
      name:s.data.user.name,
      nameSpecialist: s.data.specialist.name,
      certificateCode:s.data.user.certificateCode,
      intro:s.data.user.introduce,
      avatar:s.data.user.avatar,
      isLoading:false
    })
    this.getRatting()
  }
  if(e){
    this.setState({
      isLoading:false
    })
  }
    })
  })})
  }
getRatting = () => {
  questionProvider.getResultReview(this.state.id).then(res =>{
   if(res.code == 0){
     this.setState({
      rating:res.data.ratingCount
     })
   }
  }).catch(err =>{
    console.log(err)
  })

}
  render() {
    const icSupport = require("@images/new/user.png");
    const source = this.state.avatar
      ? { uri: this.state.avatar.absoluteUrl() }
      : icSupport;

    return (
      <ActivityPanel
      statusbarBackgroundColor="#0049B0"
      containerStyle={{
        backgroundColor: "#rgb(255,255,255)"
    }}
        style={styles.AcPanel}
        title={"Hồ sơ"}
        isLoading={this.state.isLoading}
        actionbarStyle={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.06)'
      }}
        iosBarStyle={"light-content"}
      >
        <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingVertical: 5 }}>
          <View style={styles.viewImgUpload}>
            <View
              style={{ position: "relative", width: 70,marginTop:20 ,}}
            >
              <ImageLoad
                resizeMode="cover"
                imageStyle={{ borderRadius: 35,borderWidth:1,borderColor:'rgba(0,0,0,0.07)' }}
                borderRadius={35}
                customImagePlaceholderDefaultStyle={{
                  width: 70,
                  height: 70,
                  alignSelf: "center"
                }}
                placeholderSource={icSupport}
                style={{ width: 70, height: 70, alignSelf: "center" }}
                resizeMode="cover"
                loadingStyle={{ size: "small", color: "gray" }}
                source={source}
                defaultImage={() => {
                  return (
                    <ScaleImage
                      resizeMode="cover"
                      source={icSupport}
                      width={70}
                      style={{ width: 70, height: 70, alignSelf: "center" }}
                    />
                  );
                }}
              />
            </View>
          </View>
                <View style={{flex:1,alignItems:'center',justifyContent:'center',marginVertical:20}}>
                <Text style ={{fontSize:18,color:'#000'}}>BS.{this.state.name}</Text>
                <Text style ={{marginVertical:5}}>Chuyên khoa: {this.state.nameSpecialist}</Text> 
                 <Text>Số văn bằng chuyên môn: {this.state.certificateCode}</Text>
                </View>
          <View style ={styles.viewRating}>
                <Text style={{fontSize:32,color:'rgb(2,195,154)'}}>{this.state.rating}</Text>
                <StarRating
                                    disabled={true}
                                    starSize={18}
                                    maxStars={5}
                                    rating={this.state.rating}
                                    starStyle={{ margin: 2 }}
                                    fullStarColor={"#fbbd04"}
                                    emptyStarColor={"#fbbd04"}
                                />
          </View>
          <View style={styles.viewIntro}>
            <Text style={{fontSize:18,paddingVertical:20,color:'#000',fontWeight:'400'}}>Giới thiệu</Text>
            <Text style ={{width:'80%',marginTop:-10,marginBottom:10,textAlign:'center'}}>{this.state.intro}</Text>
            {/* <TouchableOpacity style ={styles.viewBtn}>
              <Text style={{color:'#fff'}}>Đặt khám</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </ActivityPanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
const styles = StyleSheet.create({
  AcPanel: {
    flex: 1,
    backgroundColor: "rgb(247,249,251)"
  },
  viewBtn : {
    width:'70%',
    height:41,
    borderRadius:5,
    marginVertical:20,
    backgroundColor:'rgb(2,195,154)',
    justifyContent:'center',
    alignItems:'center'
  },
  viewIntro :{
    width:'100%',
justifyContent:'center',
alignItems:'center'
  },
  viewRating:{
    width:'100%',
    height:100,
    backgroundColor:'rgba(2,195,154,0.06)',
    justifyContent:'center',
    alignItems:'center'
  },
  viewImgUpload: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(DetailsDoctorScreen);
