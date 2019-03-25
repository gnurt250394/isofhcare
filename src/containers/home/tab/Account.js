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
import ImageLoad from "mainam-react-native-image-loader";
import clientUtils from '@utils/client-utils';
import ScaleImage from "mainam-react-native-scaleimage";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      ads0: [1, 2, 3, 4, 5]
    };
  }
  componentWillMount() {

  }
  render() {
    if (!this.props.userApp.isLogin) {
      return (<View></View>);
    }
    const icSupport = require("@images/new/user.png");
    const source = this.props.userApp.currentUser.avatar ? { uri: this.props.userApp.currentUser.avatar.absoluteUrl() } : icSupport;

    return (
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 0,
          paddingHorizontal: 20,
          paddingTop: 20
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text>{this.props.userApp.currentUser.name}</Text>
            <TouchableOpacity><Text>Xem hồ sơ cá nhân</Text></TouchableOpacity>
          </View>
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
        </View>

      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  icon: {
  },
  label: {
    marginTop: 2, color: '#4A4A4A', fontFamily: 'Source Sans Pro', fontSize: 15, fontWeight: '600', lineHeight: 23
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
export default connect(mapStateToProps)(Account);
