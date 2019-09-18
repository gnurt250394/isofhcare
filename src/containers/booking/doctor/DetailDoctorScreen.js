import React, { Component } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity
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
      name: '',
      nameSpecialist: '',
      certificateCode: '',
      intro: '',
      rating: 0,
      isLoading: true,
      avatar: '',
      id: '',
      profileDoctor: {}
    };
  }
  componentDidMount() {
    let profileDoctor = this.props.navigation.getParam('profileDoctor', {})
    setTimeout(() => {
      this.setState({ profileDoctor, isLoading: false })
    }, 1000)
    // var id = this.props.navigation.state.params ? this.props.navigation.state.params.id : ''
    // this.setState({
    //   id: id
    // })
    // this.getDetails()
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
            userProvider.detail(this.state.id).then(s => {
              if (s) {


                this.setState({
                  name: s.data.user.name,
                  nameSpecialist: s.data.specialist.name,
                  certificateCode: s.data.user.certificateCode,
                  intro: s.data.user.introduce,
                  avatar: s.data.user.avatar,
                  isLoading: false
                })
                this.getRatting()
              }
            }).catch(e => {
              if (e) {
                this.setState({
                  isLoading: false
                })
              }
            })
          })
      })
  }
  getRatting = () => {
    questionProvider.getResultReview(this.state.id).then(res => {
      if (res.code == 0) {
        this.setState({
          rating: res.data.ratingCount
        })
      }
    }).catch(err => {

    })
  }

  addBooking = () => {
    this.props.navigation.navigate('selectTimeDoctor', {
      profileDoctor: this.state.profileDoctor,
      isNotHaveSchedule: true
    })
  }
  onSeeDetails=()=>{
    alert('hello')
  }
  render() {
    const icSupport = require("@images/new/user.png");
    const { profileDoctor } = this.state
    const source = profileDoctor && profileDoctor.avatar
      ? { uri: profileDoctor.avatar.absoluteUrl() }
      : icSupport;
    return (
      <ActivityPanel
        title={"HỒ SƠ BÁC SỸ"}
        isLoading={this.state.isLoading}

      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode='on-drag'
          style={styles.scroll}>
          <View style={styles.viewImgUpload}>
            <ImageLoad
              resizeMode="cover"
              imageStyle={styles.boderImage}
              borderRadius={35}
              customImagePlaceholderDefaultStyle={styles.imgPlaceHoder}
              placeholderSource={icSupport}
              style={styles.avatar}
              loadingStyle={{ size: "small", color: "gray" }}
              source={source}
              defaultImage={() => {
                return (
                  <ScaleImage
                    resizeMode="cover"
                    source={icSupport}
                    width={70}
                    style={styles.imgDefault}
                  />
                );
              }}
            />
            <View style={{ paddingLeft: 7 }}>
              <Text style={styles.nameDoctor}>BS.{profileDoctor.name}</Text>
              <Text style={styles.fontItalic}>{profileDoctor.quantity} lượt đặt khám</Text>
              <View
                style={styles.row}
              >
                <StarRating
                  disabled={true}
                  starSize={15}
                  maxStars={5}
                  rating={profileDoctor.rating}
                  starStyle={{ margin: 2 }}
                  fullStarColor={"#fbbd04"}
                  emptyStarColor={"#fbbd04"}
                />
                <Text style={styles.rating}>{profileDoctor.rating}</Text>
              </View>
              <View style={styles.containerSeeDetails}>
                <TouchableOpacity
                  style={styles.buttonSeeDetail}
                  hitSlop={styles.hitSlopButton}
                  onPress={this.onSeeDetails}
                >
                  <Text style={styles.txtSeeDetails}>Xem chi tiết</Text>
                </TouchableOpacity>
                <Text style={styles.fontItalic}>{this.state.name} nhận xét, {this.state.name} đánh giá</Text>

              </View>

            </View>
          </View>
          {/** */}
          <TouchableOpacity
            style={styles.btnBooking}
            onPress={this.addBooking}
          >
            <Text style={styles.txtButtonBooking}>Đặt khám</Text>
          </TouchableOpacity>
          <View style={styles.containerInfo}>
            <Text style={styles.colorBold}>Đơn vị công tác:</Text>

            <Text style={styles.colorBold}>Chuyên khoa:</Text>

            <Text style={styles.colorBold}>Quá trình công tác: {this.state.certificateCode}</Text>
            <Text style={styles.colorBold}>Giới thiệu chung: {this.state.certificateCode}</Text>
          </View>


        </ScrollView>
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  containerInfo: {
    flex: 1,
    marginVertical: 20,
    paddingLeft: 10
  },
  containerSeeDetails: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtSeeDetails: {
    color: 'rgb(2,195,154)',
    textDecorationLine: 'underline',

  },
  hitSlopButton: {
    top: 10,
    bottom: 10,
    right: 10
  },
  buttonSeeDetail: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    paddingRight: 10
  },
  scroll: {
    flex: 1,
    paddingVertical: 5
  },
  txtButtonBooking: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnBooking: {
    backgroundColor: '#fbbd04',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '30%',
    marginLeft: '10%',
    marginTop: 13
  },
  colorBold: {
    color: 'rgb(2,195,154)',
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: 8
  },
  fontItalic: { fontStyle: 'italic' },
  rating: { color: '#000', paddingLeft: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameDoctor: { fontSize: 16, color: 'rgb(2,195,154)' },
  imgDefault: { width: 70, height: 70, alignSelf: "center" },
  boderImage: { borderRadius: 35, borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)' },
  avatar: { width: 70, height: 70, alignSelf: "center" },
  imgPlaceHoder: {
    width: 70,
    height: 70,
    alignSelf: "center"
  },
  AcPanel: {
    flex: 1,
    backgroundColor: "rgb(247,249,251)"
  },
  viewBtn: {
    width: '70%',
    height: 41,
    borderRadius: 5,
    marginVertical: 20,
    backgroundColor: 'rgb(2,195,154)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewIntro: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewRating: {
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(2,195,154,0.06)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewImgUpload: {
    width: "100%",
    alignItems: "center",
    flexDirection: 'row',
    paddingHorizontal: 10
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(DetailsDoctorScreen);
