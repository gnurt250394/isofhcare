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
import objectUtils from "@utils/object-utils";

const dataRate = [
  { id: 1, name: 'Lê Hùng', rate: 4, message: 'Bác sĩ rất ...' },
  { id: 2, name: 'Lê Hùng', rate: 4.5, message: 'Bác sĩ rất ...' },
  { id: 3, name: 'Lê Hùng', rate: 3, message: 'Bác sĩ rất ...' },
  { id: 4, name: 'Lê Hùng', rate: 5, message: 'Bác sĩ rất ...' },
]
class DetailsDoctorScreen extends Component {
  constructor(props) {
    super(props);
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
      isVisible: false,
      disableBooking: this.props.navigation.getParam('disableBooking', false)
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
        if (s && s.workingProcesses && s.workingProcesses.length) {
          s.workingProcesses.length && s.workingProcesses.sort(function (a, b) {
            return new Date(b.startDate) - new Date(a.startDate);
          });
          this.setState({ profileDoctor: s, isLoading: false })
        } else {
          this.setState({ profileDoctor: s, isLoading: false })
        }
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
    if (this.props.userApp.isLogin) {
      this.props.navigation.navigate('selectTimeDoctor', {
        item: this.state.profileDoctor,
        isNotHaveSchedule: true,
        schedules: this.state.profileDoctor.schedules
      })
    }
    else {

      this.props.navigation.navigate("login", {
        nextScreen: {
          screen: 'selectTimeDoctor', param: {
            item: this.state.profileDoctor,
            isNotHaveSchedule: true,
            schedules: this.state.profileDoctor.schedules
          }
        }
      });
    }
  }
  goToAdvisory = () => {
    // this.props.navigation.navigate("listQuestion");
    // snackbar.show('Tính năng đang phát triển')
    // return
    this.setState({ isVisible: true })
  }

  onCallVideo = () => {
    // this.setState({ isVisible: false }, () => {
    if (!this.state.profileDoctor.userId) {
      snackbar.show('Bác sĩ hiện tại không online vui lòng đặt lịch gọi khám vào thời gian khác')
      return
    }
    // if (this.props.userApp.isLogin) {
    this.props.navigation.navigate('selectTimeDoctor', {
      item: this.state.profileDoctor,
      isNotHaveSchedule: true,
      schedules: this.state.profileDoctor.schedules,
      isOnline: true

    })
    // }
    // else {

    //   this.props.navigation.navigate("login", {
    //     nextScreen: {
    //       screen: 'selectTimeDoctor', param: {
    //         item: this.state.profileDoctor,
    //         isNotHaveSchedule: true,
    //         schedules: this.state.profileDoctor.schedules,
    //         isOnline: true
    //       }
    //     }
    //   });
    // }
    // this.props.navigation.navigate("videoCall", {
    //   from: this.props.userApp.currentUser.id,
    //   to: this.state.item.userId,
    //   isOutgoingCall: true,
    //   isVideoCall: true
    // });
    // })
  }
  onCallVoice = () => {
    this.setState({ isVisible: false }, () => {
      if (this.props.userApp.isLogin) {
        this.props.navigation.navigate('selectTimeDoctor', {
          item: this.state.item,
          isNotHaveSchedule: true,
          schedules: this.state.item.schedules
        })
      }
      else {

        this.props.navigation.navigate("login", {
          nextScreen: {
            screen: 'selectTimeDoctor', param: {
              item: this.state.item,
              isNotHaveSchedule: true,
              schedules: this.state.item.schedules
            }
          }
        });
      }
      // this.props.navigation.navigate("videoCall", {
      //   from: this.state.myUserId,
      //   to: this.state.callToUserId,
      //   isOutgoingCall: true,
      //   isVideoCall: false
      // });
    })
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
          rating={5}
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
      case 'Nursing': return 'Phó trưởng khoa'
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
  renderItemWorking = ({ item, index }) => {
    return (
      <View style={styles.viewItemBooking}>
        <Text style={styles.txItemWorking}>+ </Text>
        <Text style={styles.contentWorking}>{`${item.startDate ? item.startDate.toDateObject('-').format("yyyy") : ''} - ${item.endDate ? item.endDate.toDateObject('-').format("yyyy") : 'Hiện tại'} : ${item.position} tại ${item.workPlace}`}</Text>
      </View>
    )
  }
  renderWorking = () => {
    const { profileDoctor } = this.state
    if (profileDoctor && profileDoctor.workingProcesses && profileDoctor.workingProcesses.length) {
      return (
        <FlatList
          data={profileDoctor.workingProcesses}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
          renderItem={this.renderItemWorking}

        >

        </FlatList>
      )
    }
    // return `${x.startDate ? moment(x.startDate).format("DD/MM/YYYY") : ''} - ${x.endDate ? moment(x.endDate).format("DD/MM/YYYY") : 'Hiện tại'} : ${x.position} tại ${x.workPlace}`
  }
  renderAcademic = (academicDegree) => {
    switch (academicDegree) {
      case 'BS': return 'BS'
      case 'ThS': return 'ThS'
      case 'TS': return 'TS'
      case 'PGS': return 'PGS'
      case 'GS': return 'GS'
      case 'BSCKI': return 'BSCKI'
      case 'BSCKII': return 'BSCKII'
      case 'GSTS': return 'GS.TS'
      case 'PGSTS': return 'PGS.TS'
      case 'ThsBS': return 'ThS.BS'
      case 'ThsBSCKII': return 'ThS.BSCKII'
      case 'TSBS': return 'TS.BS'
      default: return ''
    }
  }
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
        transparent={true}
      >

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
                {/* <ImageLoad
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
                /> */}
                <ScaleImage
                  resizeMode="cover"
                  source={source}
                  style={styles.imgDefault}
                />
                <View style={{ paddingLeft: 10, flex: 1 }}>
                  <Text style={styles.nameDoctor}>{objectUtils.renderAcademic(profileDoctor?.academicDegree)}{profileDoctor.name}</Text>

                  <Text style={{ paddingBottom: 10 }}>{profileDoctor?.position?.fullName}</Text>
                  <View style={styles.containerButton}>
                    <Button textStyle={{ textAlign: 'center' }} label={`Tư vấn\ntrực tuyến`} style={styles.txtAdvisory} onPress={this.onCallVideo} source={require("@images/new/videoCall/ic_call.png")} />
                    {!this.state.disableBooking ?
                      <Button textStyle={{ textAlign: 'center' }} label={`Đặt khám\ntại CSYT`} style={styles.txtBooking} onPress={this.addBooking} source={require("@images/ic_service.png")} />
                      : <View style={{ flex: 1 }} />
                    }
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
                  <Text style={styles.rating}>{profileDoctor.onlineAppointments}</Text>
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
                <Text style={styles.colorBold}>Kinh nghiệm khám chữa bệnh:</Text>
                {profileDoctor.overview ?
                  <Text style={styles.txtPosition}>{profileDoctor.overview}</Text>
                  : null
                }
                <Text style={styles.colorBold}>{constants.booking.time_work}:</Text>
                {this.renderWorking()}
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
              <TouchableOpacity
                onPress={this.onCallVoice}
                style={[styles.buttonMessage, { backgroundColor: '#e6fffa', }]}>
                <ScaleImage source={require('@images/new/booking/ic_message.png')} height={50} />
                <Text style={styles.txtPrice}>50k/ Phiên</Text>
                <Text style={styles.txtname}>Tư vấn qua tin nhắn</Text>
              </TouchableOpacity>
              <Text style={styles.txtDetail}>Xem chi tiết</Text>
            </View>
            <View>
              <TouchableOpacity onPress={this.onCallVideo} style={[styles.buttonMessage,]}>
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
    // fontWeight: '700'
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
    borderRadius: 5,
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
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: 8,
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
  imgDefault: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: '#00CBA7',
    borderWidth: 0.2
  },
  boderImage: { borderRadius: 35, },
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
    borderRadius: 5
  },
  viewItemBooking: { flexDirection: 'row', alignItems: 'center', paddingRight: 20 },
  txItemWorking: { alignSelf: 'flex-start', },
  contentWorking: { fontSize: 14, textAlign: 'left', },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp
  };
}
export default connect(mapStateToProps)(DetailsDoctorScreen);
