import React, { Component } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList
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
import Button from "@components/booking/doctor/Button";
import constants from '@resources/strings'
import bookingDoctorProvider from '@data-access/booking-doctor-provider'
import Modal from "@components/modal";
import snackbar from '@utils/snackbar-utils';

const dataRate = [
  { id: 1, name: 'Lê Hùng', rate: 4, message: 'Bác sĩ rất ...' },
  { id: 2, name: 'Lê Hùng', rate: 4.5, message: 'Bác sĩ rất ...' },
  { id: 3, name: 'Lê Hùng', rate: 3, message: 'Bác sĩ rất ...' },
  { id: 4, name: 'Lê Hùng', rate: 5, message: 'Bác sĩ rất ...' },
]
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
      profileDoctor: {},
      item: {},
      isVisible: false
    };
  }
  componentDidMount() {
    this.getDetails()
  }
  getDetails = () => {
    const item = this.props.navigation.getParam('item', {})
    let id = item && item.id
    bookingDoctorProvider.detailDoctor(id).then(s => {
      if (s) {
        this.setState({ profileDoctor: s, isLoading: false })
      }
    }).catch(e => {
      if (e) {
        this.setState({
          isLoading: false
        })
      }
    })
  }

  addBooking = () => {
    this.props.navigation.navigate('selectTimeDoctor', {
      item: this.state.profileDoctor,
      isNotHaveSchedule: true,
      schedules: this.state.profileDoctor.schedules
    })
  }
  goToAdvisory = () => {
    // this.props.navigation.navigate("listQuestion");
    this.setState({ isVisible: true })
  }

  renderText = (data) => {
    console.log('data: ', data);
    if (Array.isArray(data)) {
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
    } else if (data && data.name) {
      return <View style={styles.flex}>
        <Text style={styles.txtPosition} >{data.name}</Text>
      </View>
    }
  }
  _renderItem = ({ item, index }) => {
    return (
      <View style={[styles.containerItem, { borderBottomWidth: index == dataRate.length - 1 ? 0 : 0.7 }]}>
        <Text style={styles.txtName}>{item.name}</Text>
        <StarRating
          disabled={true}
          starSize={11}
          containerStyle={{ width: '20%' }}
          maxStars={5}
          rating={item.rate}
          starStyle={{ margin: 1, marginVertical: 7 }}
          fullStarColor={"#fbbd04"}
          emptyStarColor={"#fbbd04"}
          fullStar={require("@images/ic_star.png")}
          emptyStar={require("@images/ic_empty_star.png")}
        />
        {/* <Text numberOfLines={2}>{item.message}</Text> */}
      </View>
    )
  }
  renderPosition = (item) => {
    switch (item.position) {
      case 'Director': return 'Giám đốc'
      case 'ViceDirector': return 'Phó Giám đốc'
      case 'Manager': return 'Trưởng phòng'
      case 'DeputyManager': return 'Phó phòng'
      case 'HeadOfDepartment': return 'Trưởng khoa'
      case 'DeputyOfDepartment': return 'Phó khoa'
      case 'DepartmentChief': return 'Phụ trách khoa'
      case 'HeadNurse': return 'Điều dưỡng trưởng'
      case 'Nursing': return 'Y tá'
      case 'ChiefMedicalTechnician': return 'Kỹ thuật y trưởng'
      default: return ''
    }
  }
  ratingDoctor = () => {
    snackbar.show('Chức năng đang phát triển')
    return
    this.props.navigation.navigate('listRatingDoctor')
  }
  _keyExtractor = (item, index) => `${item.id || index}`
  onBackdropPress = () => { this.setState({ isVisible: false }) }
  render() {
    const icSupport = require("@images/new/user.png");
    const { profileDoctor } = this.state
    const source = profileDoctor && profileDoctor.imagePath
      ? { uri: profileDoctor.imagePath.absoluteUrl() }
      : icSupport;

    return (
      <ActivityPanel
        title={constants.title.info_doctor}
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
            {/** profile doctor */}
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
                  <Text style={styles.nameDoctor}>{profileDoctor.academicDegree}.{profileDoctor.name}</Text>

                  <Text style={{ paddingBottom: 10 }}>{this.renderPosition(profileDoctor)}</Text>
                  <View style={styles.containerButton}>
                    <Button label="Tư vấn" style={styles.txtAdvisory} onPress={this.goToAdvisory} source={require("@images/new/booking/ic_chat.png")} />
                    <Button label="Đặt khám" style={styles.txtBooking} onPress={this.addBooking} source={require("@images/ic_service.png")} />
                  </View>



                </View>

              </View>
              <View
                style={styles.row}
              >
                <View style={styles.groupQuantityBooking}>
                  <Text>{constants.booking.quantity_booking}</Text>
                  <Text style={styles.rating}>{profileDoctor.appointments}</Text>
                </View>
                <View style={styles.groupQuantityBooking}>
                  <Text>{constants.booking.quantity_advisory}</Text>
                  <Text style={styles.rating}>{profileDoctor.advices}</Text>
                </View>
                <TouchableOpacity onPress={this.ratingDoctor} style={styles.groupRating}>
                  <Text>{constants.booking.rating}</Text>
                  <Text style={[styles.rating, { color: '#00CBA7' }]}>{profileDoctor.average ? profileDoctor.average : 0}</Text>
                </TouchableOpacity>
              </View>
            </Card>
            {/** */}

            <Card style={styles.containerInfo}>
              <Text style={{
                color: '#00BA99',
                fontWeight: 'bold',
                paddingVertical: 10,
                borderBottomWidth: 0.7,
                borderBottomColor: '#BBB',
                paddingLeft: 10,
              }}>THÔNG TIN BÁC SĨ</Text>
              <View style={{
                paddingLeft: 10,
              }}>
                <Text style={styles.colorBold}>{constants.booking.work}:</Text>
                {this.renderText(profileDoctor.hospital)}

                <Text style={styles.colorBold}>{constants.booking.specialist}:</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {profileDoctor.specializations && profileDoctor.specializations.length > 0 ?
                    profileDoctor.specializations.map((e, i) => {
                      return (
                        <Text style={styles.txtPosition} key={i}>{e.name}{i == profileDoctor.specializations.length - 1 ? '.' : ', '}</Text>
                      )
                    }) :
                    null
                  }
                </View>
                <Text style={styles.colorBold}>{constants.booking.time_work}:</Text>
                <View style={styles.flex}>
                  <View style={styles.flexRow}>
                    {/* <View style={styles.dots} /> */}
                    <View style={{
                      paddingLeft: 5,
                    }}>
                      <Text style={styles.txtPosition}>{profileDoctor.experiences}</Text>
                      {/* <Text style={{
                      paddingBottom: 5,
                    }}>{e.note}</Text> */}
                    </View>
                  </View>
                  {/* {profileDoctor.schedules && profileDoctor.schedules.length > 0 ?
                  profileDoctor.schedules.map((e, i) => {
                    return (
                      <View key={i} style={styles.flexRow}>
                        <View style={styles.dots} />
                        <View style={{
                          paddingLeft: 5,
                        }}>
                          <Text style={styles.txtPosition}>{e.workTime.start}</Text>
                          <Text style={{
                            paddingBottom: 5,
                          }}>{e.note}</Text>
                        </View>
                      </View>
                    )
                  }) :
                  null
                } */}
                </View>
              </View>
            </Card>
            {/** */}

            {/* <Card style={{
              borderRadius: 10
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
              }}>
                <Text style={styles.txtRate}>ĐÁNH GIÁ</Text>
                <Text style={{
                  fontStyle: 'italic'
                }}>22 lượt đánh giá</Text>
              </View>
              <View style={styles.end} />
              <FlatList
                data={dataRate}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
              />
            </Card> */}
          </View>


        </ScrollView>
        <Modal
          isVisible={this.state.isVisible}
          onBackdropPress={this.onBackdropPress}
          backdropOpacity={0.5}
          animationInTiming={500}
          animationOutTiming={500}
          style={styles.modal}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
          <View style={styles.containerModal}>
            <View >
              <TouchableOpacity style={[styles.buttonMessage, { backgroundColor: '#e6fffa', }]}>
                <ScaleImage source={require('@images/new/booking/ic_message.png')} height={50} />
                <Text style={styles.txtPrice}>50k/ Phiên</Text>
                <Text style={styles.txtname}>Tư vấn qua tin nhắn</Text>
              </TouchableOpacity>
              <Text style={styles.txtDetail}>Xem chi tiết</Text>
            </View>
            <View>
              <TouchableOpacity style={[styles.buttonMessage,]}>
                <ScaleImage source={require('@images/new/booking/ic_video_call.png')} height={50} />
                <Text style={styles.txtPrice}>35k/ Phiên</Text>
                <Text style={styles.txtname}>Tư vấn qua video call</Text>
              </TouchableOpacity>
              <Text style={[styles.txtDetail]}>Xem chi tiết</Text>
            </View>
          </View>
        </Modal>
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtDetail: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 10
  },
  txtname: {
    color: '#000',
    fontWeight: 'bold'
  },
  txtPrice: {
    color: '#3161AD',
    paddingVertical: 5,
    fontWeight: '700'
  },
  buttonMessage: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'

  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  groupRating: {
    alignItems: 'center',
    paddingRight: 5,
    flex: 1
  },
  groupQuantityBooking: {
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    paddingRight: 5,
    flex: 1
  },
  txtName: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
  containerItem: {
    padding: 10,
    borderBottomColor: '#ccc',
  },
  txtRate: {
    color: '#00CBA7',
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 9,
    paddingBottom: 7,
  },
  end: {
    backgroundColor: '#ccc',
    height: 0.6,
    width: '100%'
  },
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
    backgroundColor: '#FF8A00',
  },
  containerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
  backgroundHeader: {
    backgroundColor: '#27c8ad',
    height: '13%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  containerInfo: {
    flex: 1,
    marginVertical: 20,
    borderRadius: 10,
    paddingBottom: 10
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
  rating: { color: '#000', fontWeight: 'bold' },
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
