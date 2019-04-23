import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import ScaleImage from "mainam-react-native-scaleimage";
import { Card } from "native-base";
import ImagePicker from "mainam-react-native-select-image";
import imageProvider from "@data-access/image-provider";
import ImageLoad from "mainam-react-native-image-loader";
import stylemodal from "@styles/modal-style";

class createProfile extends Component {
  constructor() {
    super();
    this.state = {
      isGender:false,
      genderUser:[{gender:'nam'},{gender:'nữ'}]
    };
  }

  render() {
    const icSupport = require("@images/new/user.png");
    const source = this.props.userApp.currentUser.avatar
      ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() }
      : icSupport;
    return (
      <ActivityPanel
        style={styles.AcPanel}
        title="Thêm hồ sơ"
        iosBarStyle={"light-content"}
        backButton={
          <TouchableOpacity>
            <Text style={styles.btnhuy}>Huỷ</Text>
          </TouchableOpacity>
        }
        statusbarBackgroundColor="rgb(247,249,251)"
        containerStyle={{
          backgroundColor: "rgb(247,249,251)"
        }}
        titleStyle={{ marginLeft: 55 }}
        menuButton={
          <TouchableOpacity>
            <Text style={styles.btnmenu}>Lưu</Text>
          </TouchableOpacity>
        }
        actionbarStyle={{
          backgroundColor: "rgb(247,249,251)"
        }}
      >
        <ScrollView style={{ flex: 1, paddingVertical: 5 }}>
          <View style={styles.viewImgUpload}>
            <TouchableOpacity
              style={{ position: "relative", width: 70 }}
              onPress={this.selectImage.bind(this)}
            >
              <ImageLoad
                resizeMode="cover"
                imageStyle={{ borderRadius: 35 }}
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
              <ScaleImage
                source={require("@images/new/ic_account_add.png")}
                width={20}
                style={{ position: "absolute", bottom: 0, right: 0 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <View style={[styles.ViewRow]}>
              <Text style={styles.textho1}>Họ và Tên</Text>
              <TextInput style={styles.txInput} underlineColorAndroid = {"#fff"}  placeholder = {'Nhập họ tên'}/>
            </View>
            <View style={styles.ViewRow}>
              <Text style={styles.textho1}>Giới tính</Text>
              <TouchableOpacity onPress = {this.onShowGender}><Text>{!this.state.txGender ? 'Chọn giới tính' : this.state.txGender}</Text></TouchableOpacity>
    
              <Modal
                    visible={this.state.isGender}
                    onBackdropPress={() => this.setState({ isGender: false })}
                    style={stylemodal.bottomModal}>
                    <View style={{ backgroundColor: '#fff', elevation: 3, flexDirection: 'column', maxHeight: 400, minHeight: 100 }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ padding: 20, flex: 1, color: "rgb(0,121,107)", textAlign: 'center', fontSize: 16, fontWeight: '900' }}>
                                Chọn giới tính
                            </Text>
                        </View>
                        <FlatList
                            style={{ padding: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state}
                            data={this.state.genderUser}
                            renderItem={({ item, index }) =>
                                <Card>
                                    <TouchableOpacity onPress = { () => this.onSetGender(item)}>
                                        <Text style={{ padding: 10, fontWeight: '300',}}>{item.gender}</Text>
                                        {/* <Dash style={{ height: 1, width: '100%', flexDirection: 'row' }} dashColor="#00977c" /> */}
                                    </TouchableOpacity>
                                </Card>
                            }
                        />
                    </View>
                </Modal>
            </View>
            <View style={styles.ViewRow}>
              <Text style={styles.textho1}>Họ và Tên</Text>
              <TextInput style={styles.txInput}  placeholder = {'Nhập họ tên'}/>
            </View>
            <View style={styles.ViewRow}>
              <Text style={styles.textho1}>Họ và Tên</Text>
              <TextInput style={styles.txInput}  placeholder = {'Nhập họ tên'}/>
            </View>
            <Text style={styles.textbot}>
              Vui lòng nhập email với người trên 16 tuổi
            </Text>
          </View>
        </ScrollView>
        <ImagePicker ref={ref => (this.imagePicker = ref)} />
      </ActivityPanel>
    );
  }
  onShowGender = () => {
    this.setState({
      isGender:true
    })
  }
  showLoading(loading, callback) {
    if (this.props.showLoading) {
      this.props.showLoading(loading, callback);
    } else {
      callback();
    }
  }
  onSetGender = item => {
   this.setState({
     isGender:false,
     txGender:item.gender
   })
   console.log(item)
  }
  selectImage() {
    if (this.imagePicker) {
      this.imagePicker.open(true, 200, 200, image => {
        this.showLoading(true, () => {
          imageProvider
            .upload(image.path)
            .then(s => {
              this.showLoading(false, () => {
                if (s && s.data.code == 0) {
                  let user = objectUtils.clone(this.props.userApp.currentUser);
                  user.avatar = s.data.data.images[0].thumbnail;
                  this.showLoading(true, () => {
                    userProvider
                      .update(this.props.userApp.currentUser.id, user)
                      .then(s => {
                        this.showLoading(false);
                        if (s.code == 0) {
                          this.props.dispatch(redux.userLogin(s.data.user));
                        } else {
                          snackbar.show(
                            "Cập nhật ảnh đại diện không thành công",
                            "danger"
                          );
                        }
                      })
                      .catch(e => {
                        this.showLoading(false);
                        snackbar.show(
                          "Cập nhật ảnh đại diện không thành công",
                          "danger"
                        );
                      });
                  });
                }
              });
            })
            .catch(e => {
              this.showLoading(false);
              snackbar.show("Upload ảnh không thành công", "danger");
            });
        });
      });
    }
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
  container: {
    backgroundColor: "rgb(247,249,251)",
    borderStyle: "solid",
    marginVertical:20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.07)"
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
  ViewRow: {
    backgroundColor: "rgb(255,255,255)",
    borderStyle: "solid",
    borderWidth: 1,
    alignItems:'center',
    height:41,
    width:'100%',
    borderColor: "rgba(0, 0, 0, 0.06)",
    justifyContent:'space-around',
    flexDirection: 'row',
  },
  textho1: {
    fontSize: 17,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#000000"
  },
  txInput: {
    alignItems:'flex-end',
    width:'50%',
    height:41,
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
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0.2,
    color: "#4a4a4a",
    position: "relative",
    top: 70,
    padding: 10
  },
  btnmenu: {
    fontSize: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#0a7ffe",
    marginRight: 35
  },
  ic_icon: {
    position: "absolute",
    bottom: 0,
    right: 8
  }
});
function mapStateToProps(state) {
  return {
    navigation: state.navigation,
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(createProfile);


