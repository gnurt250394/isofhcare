import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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
import * as Animatable from 'react-native-animatable';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      refreshing: false,
      ads0: [],
      features: [
        // {
        //   icon: require("@images/new/home/ic_ticket_news.png"),
        //   text: "Lấy số",
        //   onPress: () => {
        //     if (this.props.userApp.isLogin)
        //       this.props.navigation.navigate("selectHealthFacilitiesScreen");
        //     else
        //       this.props.navigation.navigate("login", {
        //         nextScreen: { screen: "selectHealthFacilitiesScreen", param: {} }
        //       });
        //   }
        // },
        {
          icon: require("@images/new/home/ic_booking_news.png"),
          text: "Đặt khám",
          onPress: () => {
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate("addBooking");
            else
              this.props.navigation.navigate("login", {
                nextScreen: { screen: "addBooking", param: {} }
              });
          }
        },
        {
          icon: require("@images/new/home/ic_question_news.png"),
          text: "Tư vấn",
          onPress: () => {
            this.props.navigation.navigate("listQuestion");
          }
        },
        {
          icon: require("@images/new/home/ic_ehealth_news.png"),
          text: "Y bạ",
          onPress: () => {
            if (this.props.userApp.isLogin)
              this.props.navigation.navigate("ehealth");
            else
              this.props.navigation.navigate("login", {
                nextScreen: { screen: 'ehealth' }
              });
          }
        }
      ]
    };
  }

  getTopAds(reload) {
    advertiseProvider.getTop(100, (s, e) => {
      if (s) {
        if (s.length == 0) {
          if (!reload)
            this.getTopAds(true);
        }
        this.setState({
          ads: (s || []).filter(x => x.advertise && x.advertise.type == 2 && x.advertise.images),
          ads0: (s || []).filter(x => x.advertise && x.advertise.type == 1 && x.advertise.images)
          // .filter(item => { return item.advertise && item.advertise.images })
        });
      }
      else {
        if (!reload)
          this.getTopAds(true);
      }
      if (e) {
        if (!reload)
          this.getTopAds(true);
      }
    });
  }
  componentWillMount() {
    this.onRefresh();
  }
  renderAds() {
    return (<View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ padding: 12, paddingLeft: 20, paddingBottom: 5, color: 'rgba(74,74,74,0.6)', fontWeight: '500', flex: 1 }}>Ưu đãi</Text>
        <ScaledImage source={require("@images/new/ic_more.png")} width={20} style={{ marginTop: 10, marginRight: 20 }} />
      </View>
      <FlatList
        style={{ paddingHorizontal: 20 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
        data={this.state.ads}
        ListFooterComponent={<View style={{ width: 35 }}></View>}
        renderItem={({ item, index }) => {
          if (!item || !item.advertise || !item.advertise.images)
            return null;
          return (
            <Card style={{ width: DEVICE_WIDTH - 60, borderRadius: 6, marginRight: 10 }}>
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
                  uri={item.advertise.images.absoluteUrl()}
                  width={DEVICE_WIDTH - 60}
                />
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: '#000', margin: 13 }}>{item.advertise ? item.advertise.title : ""}</Text>
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

  onRefresh(reload) {
    this.setState({ refreshing: true }, () => {
      advertiseProvider.getTop(100, (s, e) => {
        if (s) {
          if (s.length == 0) {
            if (!reload)
              this.getTopAds(true);
            this.setState({
              refreshing: false,

            })
          }
          this.setState({
            ads: (s || []).filter(x => x.advertise && x.advertise.type == 2 && x.advertise.images),
            ads0: (s || []).filter(x => x.advertise && x.advertise.type == 1 && x.advertise.images),
            refreshing: false,

            // .filter(item => { return item.advertise && item.advertise.images })
          });
        }
        else {
          this.setState({
            refreshing: false,

          })
          if (!reload)
            this.getTopAds(true);
        }
        if (e) {
          this.setState({
            refreshing: false,

          })
          if (!reload)
            this.getTopAds(true);
        }
      });
    })
  }

  getItemWidth() {
    const width = DEVICE_WIDTH - 40;
    if (width >= 320)
      return 70;
    if (width > 300)
      return 110;
    if (width > 250)
      return 70;
    return width - 50;
  }

  render() {
    const icSupport = require("@images/new/user.png");
    const source = this.props.userApp.isLogin ? (this.props.userApp.currentUser.avatar ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() } : icSupport) : icSupport;

    return (
      <ActivityPanel
        hideStatusbar={true}
        hideActionbar={true}
        style={[{ flex: 1 }, this.props.style]}
        hideBackButton={true}
      >
        <View style={{ flex: 1, position: 'relative' }}>
          <ScaledImage source={require("@images/new/home/bg_home_new.png")} width={DEVICE_WIDTH} style={{ position: 'absolute', top: 72, right: 0, left: 0 }} />
          <View style={{ height: 75, flexDirection: 'row', alignItems: 'center', paddingHorizontal:10,backgroundColor:'#fff',borderBottomColor:'#7c817f',borderBottomWidth:0.5}}>
            <View style={{ flex: 1, alignItems: 'center', marginLeft: 45 }}>
              <ScaledImage source={require("@images/new/isofhcare.png")} width={116} />
            </View>
            <NotificationBadge />
          </View>
          <ScrollView
            refreshControl={<RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              paddingTop: 0
            }}
          >
            <View style={{ padding: 21 }}>
              <Card style={{ borderRadius: 6, marginTop: 130 }}>

                {this.props.userApp.isLogin &&
                  <View style={{ alignItems: 'center', flexDirection: 'row', borderBottomColor: 'rgba(151, 151, 151, 0.29)', borderBottomWidth: 1, paddingVertical: 10, marginHorizontal: 20, justifyContent: 'center' }}>
                    {/*   <ImageLoad
                      resizeMode="cover"
                      imageStyle={{ borderRadius: 20, borderWidth: 0.5, borderColor: 'rgba(151, 151, 151, 0.29)' }}
                      borderRadius={20}
                      customImagePlaceholderDefaultStyle={{
                        width: 40,
                        height: 40,
                        alignSelf: "center"
                      }}
                      placeholderSource={icSupport}
                      style={{ width: 40, height: 40, alignSelf: "center" }}
                      resizeMode="cover"
                      loadingStyle={{ size: "small", color: "gray" }}
                      source={source}
                      defaultImage={() => {
                        return (
                          <ScaledImage
                            resizeMode="cover"
                            source={icSupport}
                            width={40}
                            style={{ width: 40, height: 40, alignSelf: "center" }}
                          />
                        );
                      }}
                    />  */}
                    <Text style={{ marginLeft: 5, fontSize: 18, fontWeight: 'bold', color: "#4a4a4a" }} >Xin chào, <Text style={{ color: 'rgb(255,138,21)' }}>{((name) => {
                      if (!name) return "";
                      let x = name.trim().split(" ");
                      name = (x[x.length - 1]).toLowerCase();
                      if (name[0])
                        return name.charAt(0).toUpperCase() + name.slice(1);
                      return name;
                    }).call(this, this.props.userApp.currentUser.name) + '!'}</Text></Text>
                  </View>
                }

                <View style={{
                  flexDirection: "row", padding: 10, marginVertical: 20, flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  {
                    (this.state.features || []).map((item, position) => {
                      return (
                        <Animatable.View key={position} delay={100} animation={"swing"} direction="alternate">
                          {
                            item.empty ? <View style={{ flex: 1, marginLeft: 5, alignItems: 'center', height: 100, width: this.getItemWidth() }}
                            ></View> :
                              <TouchableOpacity
                                style={{ flex: 1, marginLeft: 5, alignItems: 'center', width: this.getItemWidth() }}
                                onPress={item.onPress}
                              >
                                <View style={{ position: 'relative', padding: 5 }}>
                                  <ScaledImage style={[styles.icon]} source={item.icon} height={48} />
                                </View>
                                <Text style={[styles.label]}>{item.text}</Text>
                              </TouchableOpacity>

                          }
                        </Animatable.View>);
                    })
                  }
                </View>
              </Card>
            </View>
            {
              this.renderAds()
            }
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>


      </ActivityPanel>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
  },
  label: {
    marginTop: 2, color: '#4A4A4A', fontSize: 15, fontWeight: '600', lineHeight: 20
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
