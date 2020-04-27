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
import constants from '@resources/strings';

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
      id: ''
    };
  }
  componentDidMount() {
    var id = this.props.navigation.state.params ? this.props.navigation.state.params.id : ''
    this.setState({
      id: id
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
            userProvider.detail(this.state.id).then(s => {
              if (s) {
                console.log(s.data, 's.data')

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
        title={constants.title.file}
        isLoading={this.state.isLoading}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode='on-drag'
          style={styles.scroll}>
          <View style={styles.viewImgUpload}>
            <View
              style={styles.containerAvatar}
            >
              <ImageLoad
                resizeMode="cover"
                imageStyle={styles.borderImage}
                borderRadius={35}
                customImagePlaceholderDefaultStyle={styles.image}
                placeholderSource={icSupport}
                style={styles.image}
                resizeMode="cover"
                loadingStyle={{ size: "small", color: "gray" }}
                source={source}
                defaultImage={() => {
                  return (
                    <ScaleImage
                      resizeMode="cover"
                      source={icSupport}
                      width={70}
                      style={styles.image}
                    />
                  );
                }}
              />
            </View>
          </View>
          <View style={styles.groupInfoDoctor}>
            <Text style={styles.txtNameDoctor}>BS.{this.state.name}</Text>
            <Text style={styles.txtSpecialist}>{constants.questions.specialist}: {this.state.nameSpecialist}</Text>
            <Text>{constants.questions.certificate_code}: {this.state.certificateCode}</Text>
          </View>
          <View style={styles.viewRating}>
            <Text style={styles.txtRating}>{this.state.rating}</Text>
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
            <Text style={styles.txtIntroduce}>{constants.about}</Text>
            <Text style={styles.txtContentIntro}>{this.state.intro}</Text>
            {/* <TouchableOpacity style ={styles.viewBtn}>
              <Text style={{color:'#fff'}}>Đặt khám</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  txtContentIntro: {
    width: '80%',
    marginTop: -10,
    marginBottom: 10,
    textAlign: 'center'
  },
  txtIntroduce: {
    fontSize: 18,
    paddingVertical: 20,
    color: '#000',
    fontWeight: '400'
  },
  txtRating: {
    fontSize: 32,
    color: 'rgb(2,195,154)'
  },
  txtSpecialist: {
    marginVertical: 5
  },
  txtNameDoctor: {
    fontSize: 18,
    color: '#000'
  },
  groupInfoDoctor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  image: {
    width: 70,
    height: 70,
    alignSelf: "center"
  },
  borderImage: {
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)'
  },
  containerAvatar: {
    position: "relative",
    width: 70,
    marginTop: 20,
  },
  scroll: {
    flex: 1,
    paddingVertical: 5
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
    justifyContent: "center"
  },
});
function mapStateToProps(state) {
  return {
    userApp: state.auth.userApp
  };
}
export default connect(mapStateToProps)(DetailsDoctorScreen);
