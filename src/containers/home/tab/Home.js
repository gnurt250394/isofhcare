import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking, StyleSheet,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import ScaledImage from "mainam-react-native-scaleimage";
import Dimensions from "Dimensions";
const DEVICE_WIDTH = Dimensions.get("window").width;
import Carousel, { Pagination } from "react-native-snap-carousel";
import advertiseProvider from "@data-access/advertise-provider";
import snackbar from "@utils/snackbar-utils";
import { Card } from "native-base";
import NotificationBadge from "@components/notification/NotificationBadge";
import redux from "@redux-store";
import ImageLoad from "mainam-react-native-image-loader";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      ads0: [1]
    };
  }
  componentWillMount() {
    advertiseProvider.getTop(100, (s, e) => {
      if (s) {
        this.setState({
          ads: s
          // .filter(item => { return item.advertise && item.advertise.images })
        });
      }
      if (e) {
      }
    });
  }
  renderAds() {
    return (<View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ padding: 12, paddingBottom: 5, color: 'rgba(74,74,74,0.6)', fontWeight: '500', flex: 1 }}>Tin tức</Text>
        <ScaledImage source={require("@images/new/ic_more.png")} width={20} style={{ marginTop: 10, marginRight: 10 }} />
      </View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
        data={this.state.ads}
        renderItem={({ item, index }) => {
          return (
            <Card style={{ width: DEVICE_WIDTH - 60 }}>
              <TouchableOpacity
                onPress={() => {
                  if (item.advertise && item.advertise.value) {
                    Linking.openURL(item.advertise.value);
                  } else {
                    snackbar.show("Url không tồn tại", "danger");
                  }
                }}
              >
                <ScaledImage
                  source={require("@images/banner/bannerbooking.png")}
                  width={DEVICE_WIDTH - 60}
                />
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: '#00000064', margin: 13 }}>{item.advertise ? item.advertise.content : ""}</Text>
              </TouchableOpacity>
            </Card>
          );
        }}
      />
    </View>)
  }
  pagination() {
    const { ads0, activeSlide } = this.state;
    let length = ads0.length;
    return (
      <View style={{ position: 'absolute', bottom: 0, width: DEVICE_WIDTH }}>
        <Pagination
          dotsLength={length}
          activeDotIndex={activeSlide || 0}
          dotContainerStyle={{ width: 10, margin: 0, padding: 0, height: 10 }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 10,
            backgroundColor: "#02c39a",
            paddingHorizontal: 0,
            margin: 0,
            padding: 0
          }}
          inactiveDotStyle={
            {
              // Define styles for inactive dots here
              backgroundColor: "#d8d8d8"
            }
          }
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          containerStyle={
            {
              paddingVertical: 10,
              paddingHorizontal: 0
            }
          }
        />
      </View>
    );
  }
  logout() {
    this.props.dispatch(redux.userLogout());
  }

  render() {
    const icSupport = require("@images/new/user.png");
    const source = this.props.userApp.isLogin ? (this.props.userApp.currentUser.avatar ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() } : icSupport) : icSupport;

    return (
      <ActivityPanel
        hideStatusbar={true}
        style={[{ flex: 1 }, this.props.style]}
        // titleStyle={{ marginRight: 60 }}
        // imageStyle={{ marginRight: 20 }}
        hideBackButton={true}
        // backButton={<TouchableOpacity style={{ paddingLeft: 15 }} onPress={() => {
        //   if (this.props.userApp.isLogin) {
        //     if (this.props.userInfoClick)
        //       this.props.userInfoClick();
        //   } else {
        //     this.props.navigation.navigate("login");
        //   }
        // }}>
        //   <ImageLoad
        //     resizeMode="cover"
        //     imageStyle={{ borderRadius: 15 }}
        //     borderRadius={15}
        //     customImagePlaceholderDefaultStyle={{
        //       width: 30,
        //       height: 30,
        //       alignSelf: "center"
        //     }}
        //     placeholderSource={icSupport}
        //     style={{ width: 30, height: 30, alignSelf: "center" }}
        //     resizeMode="cover"
        //     loadingStyle={{ size: "small", color: "gray" }}
        //     source={source}
        //     defaultImage={() => {
        //       return (
        //         <ScaledImage
        //           resizeMode="cover"
        //           source={icSupport}
        //           width={30}
        //           style={{ width: 30, height: 30, alignSelf: "center" }}
        //         />
        //       );
        //     }}
        //   />
        // </TouchableOpacity>}
        // image={}
        titleView={<View>
          <ScaledImage source={require("@images/logotext.png")} width={116} />
        </View>}
        titleViewStyle={{ marginLeft: 10 }}
        menuButton={<NotificationBadge />}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            paddingTop: 0
          }}
        >
          <View style={{ position: 'relative' }}>
            <Carousel
              enableSnap={true}
              data={this.state.ads0}
              loop={true}
              autoplayInterval={3000}
              autoplay={true}
              onSnapToItem={index => {
                this.setState({ activeSlide: index });
              }}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (item.advertise && item.advertise.value) {
                        Linking.openURL(item.advertise.value);
                      } else {
                        snackbar.show("Url không tồn tại", "danger");
                      }
                    }}
                  >
                    <ScaledImage
                      source={require("@images/banner/bannerbooking.png")}
                      width={DEVICE_WIDTH}
                    />
                  </TouchableOpacity>
                );
              }}
              sliderWidth={DEVICE_WIDTH}
              itemWidth={DEVICE_WIDTH}
            />
            {/* {
              this.pagination()
            } */}
          </View>
          <View style={{ flexDirection: "row", padding: 10, marginTop: 25 }}>
            <TouchableOpacity
              style={{ flex: 1, marginLeft: 5, alignItems: 'center' }}
              onPress={() => {
                this.props.navigation.navigate("listQuestion");
              }}
            >
              <View style={{ position: 'relative', padding: 5 }}><ScaledImage style={[styles.icon]} source={require("@images/new/ic_question.png")} height={48} />
              </View>
              <Text style={[styles.label]}>Hỏi đáp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, marginLeft: 5, alignItems: 'center' }}
              onPress={() => {
                if (this.props.userApp.isLogin)
                  this.props.navigation.navigate("ehealth");
                else
                  this.props.navigation.navigate("login", {
                    nextScreen: { screen: 'ehealth' }
                  });
              }}
            >
              <View style={{ position: 'relative', padding: 5 }}>
                <ScaledImage style={[styles.icon]} source={require("@images/new/ic_ehealth.png")} height={48} />
                <ScaledImage style={[{ position: 'absolute', right: 0, top: 0 }]} source={require("@images/new/ic_home_chat.png")} width={30} />
              </View>
              <Text style={[styles.label]}>Y bạ điện tử</Text>
            </TouchableOpacity>
          </View>
          {
            this.renderAds()
          }
          <View style={{ height: 30 }} />
        </ScrollView >
      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
  },
  label: {
    marginTop: 17, color: '#4A4A4A', fontSize: 15, fontWeight: '600', lineHeight: 23
  },
  subLabel: {
    color: '#9B9B9B', fontSize: 12, textAlign: 'center', marginTop: 5
  }
});

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(Home);
