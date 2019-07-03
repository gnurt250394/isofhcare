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
import { Card, Toast } from "native-base";
import NotificationBadge from "@components/notification/NotificationBadge";
import redux from "@redux-store";
import ImageLoad from "mainam-react-native-image-loader";
import * as Animatable from 'react-native-animatable';

import Actionbar from '@components/home/Actionbar';
import SlideBanner from '@components/home/SlideBanner';
import TopHospital from '@components/hospital/TopHospital';
import HospitalNearYou from '@components/hospital/HospitalNearYou';
import TopDrug from '@components/drug/TopDrug';
import TopNews from '@components/news/TopNews';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing:false,
      countReset:0,
    }
  }


  componentWillMount() {
  }
  onRefresh = () => {
    this.setState({
      refreshing:true,
      countReset:this.state.countReset+1,

    })
    setTimeout(() => this.setState({
      refreshing:false
  }),500)
  }
  render() {
    return (
      <ScrollView refreshControl={<RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
      />} bounces={false} style={{ flex: 1 }}>
        <View>
          <Actionbar />
          <SlideBanner countReset = {this.state.countReset}/>
          <TopHospital countReset = {this.state.countReset}/>
          <HospitalNearYou/>
          <TopDrug countReset = {this.state.countReset}/>
          <TopNews countReset = {this.state.countReset}/>
          <View style={{ width: '100%', height: 50 }}></View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

});

function mapStateToProps(state) {
  return {
    navigation: state.navigation,
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(Home);
