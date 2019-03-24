import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking, StyleSheet
} from "react-native";
import { connect } from "react-redux";
import ScaledImage from "mainam-react-native-scaleimage";
import Dimensions from "Dimensions";
const DEVICE_WIDTH = Dimensions.get("window").width;
import Carousel, { Pagination } from "react-native-snap-carousel";
import advertiseProvider from "@data-access/advertise-provider";
import snackbar from "@utils/snackbar-utils";
import { Card } from "native-base";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      ads0: [1, 2, 3, 4, 5]
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
    return (<View style={{ padding: 12 }}>
      <Text style={{ marginBottom: 5, color: 'rbg(74,74,74)' }}>Ưu đãi</Text>
      <Carousel
        enableSnap={false}
        loop={true}
        // onSnapToItem={(index) => {
        //   this.setState({ adsActiveIndex: index })
        // }}
        activeSlideAlignment={'start'}
        // firstItem={this.state.ads && this.state.ads.length > 1 ? 1 : 0}
        ref={c => {
          this._carousel = c;
        }}
        data={this.state.ads}
        layoutCardOffset={'3'}
        stagePadding={3}
        // layout={'stack'}
        renderItem={({ item, index }) => {
          return (
            <Card>
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
                  width={DEVICE_WIDTH - 100}
                />
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: '#00000064', margin: 13 }}>{item.advertise ? item.advertise.content : ""}</Text>
              </TouchableOpacity>
            </Card>
          );
        }}
        sliderWidth={DEVICE_WIDTH}
        itemWidth={DEVICE_WIDTH - 100}
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
          activeDotIndex={activeSlide}
          dotContainerStyle={{ width: 10, margin: 0, padding: 0, height: 10}}
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

  render() {
    return (
      <ScrollView
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
          {
            this.pagination()
          }
        </View>
        <View style={{ flexDirection: "row", padding: 10, marginTop: 25 }}>
          <TouchableOpacity
            style={{ flex: 1, marginLeft: 5, alignItems: 'center' }}
            onPress={() => {
              if (this.props.userApp.isLogin)
                this.props.navigation.navigate("dhyBooking");
              else
                this.props.navigation.navigate("login", {
                  nextScreen: {
                    screen: "dhyBooking",
                    param: {}
                  }
                });
            }}
          >
            <View style={[styles.icon]}></View>
            <Text style={[styles.label]}>Đặt khám</Text>
            <Text style={[styles.subLabel]}>
              1000+ người đã dùng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, marginLeft: 5, alignItems: 'center' }}
            onPress={() => {
              if (this.props.userApp.isLogin)
                this.props.navigation.navigate("listQuestion");
              else
                this.props.navigation.navigate("login", {
                  nextScreen: {
                    screen: "listQuestion",
                    param: {}
                  }
                });
            }}
          >
            <View style={[styles.icon]}></View>
            <Text style={[styles.label]}>Tư vấn</Text>
            <Text style={[styles.subLabel]}>
              1000+ người yêu thích
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, marginLeft: 5, alignItems: 'center' }}
            onPress={() => { snackbar.show("Chức năng đang phát triển") }}
          >
            <View style={[styles.icon]}></View>
            <Text style={[styles.label]}>Tra cứu</Text>
            <Text style={[styles.subLabel]}>
              1000+ người hài lòng
            </Text>
          </TouchableOpacity>
        </View>
        {
          this.renderAds()
        }
        <View style={{ height: 30 }} />
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    height: 55,
    width: 55,
    backgroundColor: '#02c39a',
    borderRadius: 30
  },
  label: {
    marginTop: 5, color: '#4A4A4A', fontFamily: 'Source Sans Pro', fontSize: 15, fontWeight: '600', lineHeight: 23
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
