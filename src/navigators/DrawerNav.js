import React from 'react';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import { Image } from "react-native";
import HomeScreen from "@containers/HomeScreen";
import CustomDrawer from '@components/navigators/CustomDrawer'
import ScaledImage from 'mainam-react-native-scaleimage';

const DrawerNav = createDrawerNavigator({
  "home": {
    navigationOptions: {
      focused:false,
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },
  "qr": {
    navigationOptions: {
      drawerLabel:'Quét Mã',
      drawerIcon: () => (
      	<ScaledImage height = {25} source = {require('@images/new/home/ic_qr.png')}/>
      ),
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },
  "help": {
    navigationOptions: {
      drawerLabel:'Hỗ trợ',
      drawerIcon: () => (
      	<ScaledImage height = {25} source = {require('@images/new/home/ic_help.png')}/>
      ),
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },
  "abort": {
    navigationOptions: {
      drawerLabel:'Báo Lỗi',
      drawerIcon: () => (
      	<ScaledImage height = {25} source = {require('@images/new/home/ic_abort.png')}/>
      ),
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },
  "rules": {
    navigationOptions: {
      drawerLabel:'Điều Khoản Sử Dụng',
      drawerIcon: () => (
      	<ScaledImage height = {25} source = {require('@images/new/home/ic_rules.png')}/>
      ),
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },
  "rate": {
    navigationOptions: {
      drawerLabel:'Đánh Giá Isofhcare',
      drawerIcon: () => (
      	<ScaledImage height = {25} source = {require('@images/new/home/ic_rate.png')}/>
      ),
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },

}, {
  contentComponent:CustomDrawer,
    initialRouteName: 'home',
    drawerPosition: 'left',
    contentOptions: {
      inactiveTintColor: '#000',
    },
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose'
  }
);

export default DrawerNav;