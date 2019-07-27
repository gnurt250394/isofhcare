import React from 'react';
import { createDrawerNavigator, DrawerItems, createBottomTabNavigator } from 'react-navigation';
import { Image } from "react-native";
import HomeScreen from "@containers/HomeScreen";
import NotificationScreen from "@containers/notification/NotificationScreen";
import ProfileScreen from '@containers/profile/MenuProfile'
import CustomDrawer from '@components/navigators/CustomDrawer'
import ScaledImage from 'mainam-react-native-scaleimage';

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  // let IconComponent = Ionicons;
  // let iconName;
  // if (routeName === 'Home') {
  //   iconName = `ios-information-circle${focused ? '' : '-outline'}`;
  //   // We want to add badges to home tab icon
  //   IconComponent = HomeIconWithBadge;
  // } else if (routeName === 'Settings') {
  //   iconName = `ios-options${focused ? '' : '-outline'}`;
  // }

  // You can return any component that you like here!
  return 	<ScaledImage height = {25} source = {require('@images/new/home/ic_qr.png')}/>
  // return <IconComponent name={iconName} size={25} color={tintColor} />;
};

const TabNavigator = createBottomTabNavigator(
  {
    home: { screen: HomeScreen,
      navigationOptions: {
        tabBarLabel:"Home Page",
        tabBarIcon: ({ tintColor }) => <ScaledImage height = {25} source = {require('@images/new/home/ic_qr.png')}/>
      }
     },
    profile: {screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel:"Home Page",
        tabBarIcon: ({ tintColor }) => <ScaledImage height = {25} source = {require('@images/new/home/ic_qr.png')}/>
      }
    },
    notification: { screen: NotificationScreen,
      navigationOptions: {
        tabBarLabel:"Home Page",
        tabBarIcon: ({ tintColor }) => <ScaledImage height = {25} source = {require('@images/new/home/ic_qr.png')}/>
      }
   }
  },
  {
    // defaultNavigationOptions: ({ navigation }) => ({
    //   tabBarIcon: ({ focused, tintColor }) =>
    //     getTabBarIcon(navigation, focused, tintColor),
    // }),
    // tabBarOptions: {
    //   activeTintColor: 'tomato',
    //   inactiveTintColor: 'gray',
    // //   showIcon: true, 
    //   style: {
    //     // backgroundColor: '#4BBA7B',
    //   }
    // }
  }
)
const DrawerNav = createDrawerNavigator({
  home: TabNavigator,
  // "home": {
  //   navigationOptions: {
  //     focused:false,
  //   },
  //   screen: (props) => <HomeScreen {...props}></HomeScreen>
  // },
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