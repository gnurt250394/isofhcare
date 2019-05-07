import React, { Component, PropTypes, PureComponent } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  Text,
  TouchableOpacity,
  Platform,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import ScaleImage from "mainam-react-native-scaleimage";
import { Card } from "native-base";
import ImagePicker from "mainam-react-native-select-image";
import imageProvider from "@data-access/image-provider";
import ImageLoad from "mainam-react-native-image-loader";
import stylemodal from "@styles/modal-style";
import DateTimePicker from "mainam-react-native-date-picker";
import Modal from "react-native-modal";
import connectionUtils from "@utils/connection-utils";
import snackbar from "@utils/snackbar-utils";
import medicalRecordProvider from "@data-access/medical-record-provider";
import NavigationService from "@navigators/NavigationService";
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from "mainam-react-native-floating-label";
import { cleanSingle } from "react-native-image-crop-picker";
import dateUtils from "mainam-react-native-date-utils";
import constants from "@resources/strings";
import profileProvider from "@data-access/profile-provider"
import KeyboardSpacer from "react-native-keyboard-spacer";
class ProfileInfo extends Component {
  constructor() {
    super();
    this.state = {
        avatar:'',
        email:'',
        username:'',
        phone:'',
        dob:'',
        medicalRecords:[]
    };
  }
  componentDidMount() {
      let id = this.props.userApp.currentUser.id
    profileProvider.getUserInfo(id).then(res => {
      if(res.code == 0 ){
          this.setState({
              avatar:res.data.user.avatar,
              email:res.data.user.email,
              username:res.data.user.username,
              phone:res.data.user.phone,
              medicalRecords:res.data.medicalRecords,
              gender:res.data.user.gender,
              dob:res.data.user.dob
          })
      }s
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
        title={"Hồ sơ cá nhân"}
        isLoading={this.state.isLoading}
        actionbarStyle={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.06)'
      }}
        iosBarStyle={"light-content"}
      >
        <ScrollView style={{ flex: 1, paddingVertical: 5 }}>
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
                <Text style ={{fontSize:18,color:'#000'}}>{this.state.username ? this.state.username : ''}</Text>
                <Text style ={{color:'rgb(2,195,154)',marginVertical:5}}>{this.state.phone ? this.state.phone : ''}</Text>
                <Text style ={{marginTop:15}}>{this.state.medicalRecords ? `${this.state.medicalRecords.length} ` : '0 '}lượt sử dụng dịch vụ</Text>
                </View>
          <View style={styles.container}>
            <Form ref={ref => (this.form = ref)} style={[{ flex: 1}]}>
              <Text style={[styles.errorStyle]}>{this.state.nameError}</Text>

              <View
                style={[
                  styles.mucdichkham,
                  { marginTop: 5,justifyContent:'center',alignItems:'flex-end',paddingVertical:12,borderBottomWidth:0}
                ]}
              >
                <Text style={styles.mdk}>Giới tính</Text>
                <Text style={styles.ktq}>
                  {this.state.gender && this.state.gender == 1
                    ? 'Nam'
                    : 'Nữ'}
                </Text>

              </View>
             
              <Field

                style={[styles.mucdichkham, {justifyContent:'center',alignItems: 'flex-end', flex:1,paddingVertical: 12,borderBottomWidth:0}]}
              >
                <Text style={styles.mdk}>Ngày sinh</Text>

                <Text style={styles.ktq}> {this.state.dob ? this.state.dob.toDateObject('-').format('dd-MM-yyyy') : ('')}
</Text>
              </Field>
              <Field
                style={[styles.mucdichkham, {flex:1}]}
              >
                <Text style={styles.mdk}>Email</Text>
                <TextField
                  hideError={true}
                  editable={false}
                  multiline = {true}
                  inputStyle={[
                    styles.ktq,
                    Platform.OS == "ios" ? {paddingVertical: 12,}:{},
                    {justifyContent:'center',alignItems: 'flex-end',width: 200, }
                  ]}
                  value={this.state.email}
                  // underlineColorAndroid="transparent"
                />
              </Field>
            </Form>
          </View>


        </ScrollView>
      </ActivityPanel>
    );
  }
  onShowGender = () => {
    this.setState({
      isGender: true
    });
  };
  showLoading(loading, callback) {
    if (this.props.showLoading) {
      this.props.showLoading(loading, callback);
    } else {
      callback;
    }
  }
  onSetGender = item => {
    this.setState({ 
      isGender: false,
      txGender: item.gender,
      valueGender: item.value
    });
  };

  selectImage() {
    connectionUtils
      .isConnected()
      .then(s => {
        if (this.imagePicker) {
          this.imagePicker.open(false, 200, 200, image => {
            setTimeout(() => {
              Keyboard.dismiss();
            }, 500);
            this.setState({
              image
            });
            imageProvider.upload(this.state.image.path, (s, e) => {
              if (s.success && s.data.code == 0) {
                let images = s.data.data.images[0].thumbnail;
                this.setState({
                  imgLocal: images
                });
              }
              if (e) {
                this.setState({
                  isLoading: false
                });
              }
            });
          });
        }
      })
      .catch(e => {
        snackbar.show("Không có kết nối mạng", "danger");
      });
  }
  onUpdate2(image) {
    if (!this.form.isValid()) {
      return;
    }

    connectionUtils
      .isConnected()
      .then(s => {
        this.setState(
          {
            isLoading: true
          },
            ()  => {


            const { name } = this.state;
            const gender = this.state.valueGender;
            const email = this.state.email
            let date = this.state.dob ? this.state.dob.format('yyyy-MM-dd') : ('')
            let date2 = date + ' 00:00:00'
            medicalRecordProvider
              .createMedical(name, gender, date2,email, image)
              .then( res  => {
                if (res.code == 0) {
                  this.setState({
                    isLoading: false
                  });
                  this.state.isDataNull ? snackbar.show("Bạn đã tạo hồ sơ thành công", "success") : snackbar.show("Bạn đã thêm người thân thành công", "success");

                  
                  NavigationService.navigate('selectProfile',{loading:true});
                }if(res.code == 2){
                  this.setState({
                    isLoading: false
                  });
                  this.state.isDataNull ? snackbar.show("Hồ sơ đã tồn tại trong hệ thống",'danger') : snackbar.show("Hồ sơ đã tồn tại trong hệ thống",'danger')
                } else {
                  this.setState({
                    isLoading: false
                  });
                }
              })
              .catch(err => {
                this.setState({
                  isLoading: false
                });
                snackbar.show("Có lỗi, xin vui lòng thử lại", "danger");
              });
          }
        )
      })
      .catch(e => {
        snackbar.show("Không có kết nối mạng", "danger");
      });
  }
  onUpdate = () => {
    this.form.isValid();
    if (!this.form.isValid()) {
      return;
    }
    if (this.state.image)
      this.setState({ isLoading: true }, () => {
        imageProvider.upload(this.state.image.path, (s, e) => {
          if (s.success && s.data.code == 0) {
            let image = s.data.data.images[0].thumbnail;
            this.onUpdate2(image);
          }
          if (e) {
            this.setState({
              isLoading: false
            });
          }
        });
      });
    else this.onUpdate2("");
  };
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
  imgIc: {
    marginLeft: 10
  },
  imgmdk: {
    marginRight: 5
  },
  mucdichkham: {
    backgroundColor: "rgb(255,255,255)",
    // borderStyle: "solid",
    borderWidth: 1,
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.06)",
    flexDirection: "row"
   
  },
  mdk: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#000000",
 
  },
  ktq: {
    flex: 1,
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "right",
    color: "#8e8e93",
    marginRight: 10,
    marginLeft: 20
  },
  container: {
    // borderStyle: "solid",
    marginVertical: 5,
    // borderWidth: 1,
    // borderColor: "rgba(0, 0, 0, 0.07)"
  },
  btnhuy: {
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#8e8e93",
    marginLeft: 10
  },
  header: { alignItems: "center" },
  avatar: {
    alignItems: "center",
    paddingTop: 20,
    width: 70
  },
  add: {
    position: "absolute"
  },
  viewImgUpload: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  ViewRow: {},
  textho1: {
    fontSize: 17,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#000000"
  },
  txInput: {
    alignItems: "flex-end",
    width: "50%",
    height: 41,
    color: "#8e8e93"
  },
  view2: {
    backgroundColor: "rgb(255,255,255)",
    top: 40,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)"
  },
  next: {
    position: "absolute",
    top: 17,
    right: 25
  },
  view3: {
    backgroundColor: "rgb(255,255,255)",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",

    top: 60
  },

  textbot: {
    marginLeft:15
    // fontSize: 15,
    // fontWeight: "normal",
    // fontStyle: "normal",
    // letterSpacing: 0.2,
    // color: "#4a4a4a",
    // position: "relative",
    // top: 70,
    // padding: 10
  },
  btnmenu: {
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#0a7ffe",
    marginRight: 10
  },
  ic_icon: {
    position: "absolute",
    bottom: 0,
    right: 8
  },
  errorStyle: {
    color: "red",
    marginTop: 10,
    marginLeft: 12
  },
  textInputStyle: {
    color: "#53657B",
    height: 45,
  },
  labelStyle: { color: '#53657B', fontSize: 16, marginBottom: 10, marginLeft: 50 }
});
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(ProfileInfo);
