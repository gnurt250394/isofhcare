import React from 'react';
import { createDrawerNavigator, DrawerItems, createBottomTabNavigator, TabBarBottom } from 'react-navigation';
import { Image } from "react-native";
import HomeScreen from "@containers/HomeScreen";
import NotificationScreen from "@containers/notification/NotificationScreen";
import ProfileScreen from '@containers/profile/MenuProfile'
import CustomDrawer from '@components/navigators/CustomDrawer'
import ScaledImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';

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
  return <ScaledImage height={25} source={require('@images/new/home/ic_qr.png')} />
  // return <IconComponent name={iconName} size={25} color={tintColor} />;
};

const TabNavigator = createBottomTabNavigator(
  {
    home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={25} source={require('@images/new/home/ic_home.png')} style={{ tintColor: tintColor }} />,
      }
    },
    community: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: "Cộng đồng",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={20} source={require('@images/new/home/ic_community.png')} style={{ tintColor: tintColor }} />,
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          snackbar.show("Chức năng đang phát triển");
        },
      }
    },
    video: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: "Video",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={25} source={require('@images/new/home/ic_videos.png')} style={{ tintColor: tintColor }} />,
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          snackbar.show("Chức năng đang phát triển");
        },
      }
    },
    account: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: "Video",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={22} source={require('@images/new/home/ic_account.png')} style={{ tintColor: tintColor }} />,
        // tabBarOnPress: ({ navigation, defaultHandler, screenProps }) => {
        //   debugger;
        //   //   snackbar.show("Chức năng đang phát triển");
        // },
      }
    },
    notification: {
      screen: NotificationScreen,
      navigationOptions: {
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          defaultHandler();
        },
        tabBarLabel: "Thông báo",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={25} source={require('@images/new/home/ic_bell.png')} style={{ tintColor: tintColor }} />,
      }
    }
  },
  {
    swipeEnabled: true,
    animationEnabled: true,
    tabBarPosition: 'bottom',
    // tabBarComponent: props => {
    //   const backgroundColor = props.position.interpolate({
    //     inputRange: [0, 1, 2],
    //     outputRange: ['orange', 'white', 'green'],
    //   })
    //   return (r
    //     <TabBarBottom
    //       {...props}
    //       style={{ backgroundColor: "#4BBA7B" }}
    //     />
    //   );
    // },
    tabBarOptions: {
      showLabel: false,
      activeTintColor: 'blue',
      inactiveTintColor: 'white',
      style: {
        backgroundColor: "#4BBA7B",
      },
    }
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
      drawerLabel: 'Quét Mã',
      drawerIcon: () => (
        <ScaledImage height={25} source={require('@images/new/home/ic_qr.png')} />
      ),
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },
  "help": {
    navigationOptions: {
      drawerLabel: 'Hỗ trợ',
      drawerIcon: () => (
        <ScaledImage height={25} source={require('@images/new/home/ic_help.png')} />
      ),
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },
  "abort": {
    navigationOptions: {
      drawerLabel: 'Báo Lỗi',
      drawerIcon: () => (
        <ScaledImage height={25} source={require('@images/new/home/ic_abort.png')} />
      ),
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },
  "rules": {
    navigationOptions: {
      drawerLabel: 'Điều Khoản Sử Dụng',
      drawerIcon: () => (
        <ScaledImage height={25} source={require('@images/new/home/ic_rules.png')} />
      ),
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },
  "rate": {
    navigationOptions: {
      drawerLabel: 'Đánh Giá Isofhcare',
      drawerIcon: () => (
        <ScaledImage height={25} source={require('@images/new/home/ic_rate.png')} />
      ),
    },
    screen: (props) => <HomeScreen {...props}></HomeScreen>

  },

}, {
    contentComponent: CustomDrawer,
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