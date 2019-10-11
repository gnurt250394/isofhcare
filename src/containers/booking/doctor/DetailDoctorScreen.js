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
import { Card } from 'native-base'
import Button from "../../../components/booking/doctor/Button";

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
  goToAdvisory = () => {
    this.props.navigation.navigate("listQuestion");
  }

  renderText = (data) => {
    return <View style={styles.flex}>
      {data && data.length > 0 ?
        data.map((e, i) => {
          return (
            <Text style={styles.txtPosition} key={i}>{e.name}</Text>
          )
        }) :
        null
      }
    </View>
  }
  render() {
    const icSupport = require("@images/new/user.png");
    const { profileDoctor } = this.state
    const source = profileDoctor && profileDoctor.avatar
      ? { uri: profileDoctor.avatar.absoluteUrl() }
      : icSupport;

    return (
      <ActivityPanel
        title={"Thông tin bác sỹ"}
        isLoading={this.state.isLoading}

      >
        <View style={styles.backgroundHeader}></View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode='on-drag'
          style={styles.scroll}>
          <View style={{
            padding: 10,
          }}>
            <Card style={styles.viewImgUpload}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
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
                <View style={{ paddingLeft: 10, flex: 1 }}>
                  <Text style={styles.nameDoctor}>BS.{profileDoctor.name}</Text>
                  <View >
                    {profileDoctor.address && profileDoctor.address.length > 0 ?
                      <Text >{profileDoctor.address[0].name}</Text>
                      :
                      null
                    }
                  </View>
                  <View style={styles.containerButton}>
                    <Button label="Tư vấn" style={styles.txtAdvisory} onPress={this.goToAdvisory} source={require("@images/new/booking/ic_chat.png")} />
                    <Button label="Đặt khám" style={styles.txtBooking} onPress={this.addBooking} source={require("@images/ic_service.png")} />
                  </View>



                </View>

              </View>
              <View
                style={styles.row}
              >
                <View style={{
                  alignItems: 'center',
                  borderRightColor: '#ccc',
                  borderRightWidth: 1,
                  paddingRight: 5,
                  flex: 1
                }}>
                  <Text>Lượt đặt khám</Text>
                  <Text style={styles.rating}>{profileDoctor.rating}</Text>
                </View>
                <View style={{
                  alignItems: 'center',
                  borderRightColor: '#ccc',
                  borderRightWidth: 1,
                  paddingRight: 5,
                  flex: 1
                }}>
                  <Text>Lượt tư vấn</Text>
                  <Text style={styles.rating}>{profileDoctor.rating}</Text>
                </View>
                <View style={{
                  alignItems: 'center',
                  paddingRight: 5,
                  flex: 1
                }}>
                  <Text>Đánh giá</Text>
                  <Text style={styles.rating}>{profileDoctor.rating}</Text>
                </View>
              </View>
            </Card>
            {/** */}

            <Card style={styles.containerInfo}>
              <Text style={styles.colorBold}>Đơn vị công tác:</Text>
              {this.renderText(profileDoctor.address)}

              <Text style={styles.colorBold}>Chuyên khoa:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {profileDoctor.position && profileDoctor.position.length > 0 ?
                  profileDoctor.position.map((e, i) => {
                    return (
                      <Text style={styles.txtPosition} key={i}>{e}{i == profileDoctor.position.length - 1 ? '.' : ', '}</Text>
                    )
                  }) :
                  null
                }
              </View>
              <Text style={styles.colorBold}>Quá trình công tác:</Text>
              <View style={styles.flex}>
                {profileDoctor.time && profileDoctor.time.length > 0 ?
                  profileDoctor.time.map((e, i) => {
                    return (
                      <View key={i} style={styles.flexRow}>
                        <View style={styles.dots} />
                        <View style={{
                          paddingLeft: 5,
                        }}>
                          <Text style={styles.txtPosition}>{e.time}</Text>
                          <Text style={{
                            paddingBottom: 5,
                          }}>{e.name}</Text>
                        </View>
                      </View>
                    )
                  }) :
                  null
                }
              </View>
            </Card>
            {/** */}

            <Card style={{
              borderRadius: 10
            }}>
              <Text style={{
                color: '#00CBA7',
                fontWeight: 'bold',
                fontSize: 16,
                paddingLeft: 10,
                paddingTop: 9,
                paddingBottom: 7,
              }}>ĐÁNH GIÁ</Text>
              <View style={{
                backgroundColor: '#ccc',
                height: 0.6,
                width: '100%'
              }} />
              <Text>aaa</Text>
              <Text>aaa</Text>
              <Text>aaa</Text>
              <Text>aaa</Text>
              <Text>aaa</Text>
              <Text>aaa</Text>
              <Text>aaa</Text>
            </Card>
          </View>


        </ScrollView>
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  dots: {
    backgroundColor: '#00CBA7',
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 7
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  txtPosition: {
    color: '#000000',
    fontWeight: '700'
  },
  txtBooking: {
    backgroundColor: '#00CBA7',
    marginLeft: 6
  },
  txtAdvisory: {
    backgroundColor: '#3161AD',
  },
  containerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
  backgroundHeader: {
    backgroundColor: '#02C39A',
    height: '13%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  containerInfo: {
    flex: 1,
    marginVertical: 20,
    paddingLeft: 10,
    borderRadius: 10
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
    color: '#b3b3b3',
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: 8,
    fontStyle: 'italic'
  },
  fontItalic: { fontStyle: 'italic' },
  rating: { color: '#000', paddingLeft: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  nameDoctor: { fontSize: 16, color: '#000000', fontWeight: 'bold', paddingBottom: 5, },
  imgDefault: { width: 70, height: 70, alignSelf: "center" },
  boderImage: { borderRadius: 35, borderWidth: 2, borderColor: '#00CBA7' },
  avatar: { width: 70, height: 70, alignSelf: "flex-start", },
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
    padding: 10,
    borderRadius: 10
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(DetailsDoctorScreen);
