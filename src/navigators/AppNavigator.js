import React from 'react';
import { createDrawerNavigator, DrawerItems, createBottomTabNavigator, TabBarBottom, createStackNavigator } from 'react-navigation';
import { Image } from "react-native";
//splash
import SplashScreen from "@containers/SplashScreen";


import HomeScreen from "@containers/HomeScreen";
import NotificationScreen from "@containers/notification/NotificationScreen";
import MenuProfileScreen from '@containers/profile/MenuProfile';

import CustomDrawer from '@components/navigators/CustomDrawer'
import ScaledImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';

import SettingScreen from '@containers/profile/SettingScreen'


//y ba dien tu
import { EHealthNavigator } from "@ehealth/navigator";
import ViewEhealthDetailScreen from '@containers/ehealth/ViewEhealthDetailScreen';

//login
import LoginScreen from "@containers/account/LoginScreen";
import RegisterScreen from "@containers/account/RegisterScreen";
import EnterPasswordScreen from "@containers/account/EnterPasswordScreen";
import ForgotPasswordScreen from "@containers/account/ForgotPasswordScreen";
import ChangePasswordScreen from "@containers/account/ChangePasswordScreen";

//question
import ListQuestionScreen from "@containers/question/ListQuestionScreen";
import CreateQuestionStep1Screen from "@containers/question/CreateQuestionStep1Screen";
import CreateQuestionStep2Screen from "@containers/question/CreateQuestionStep2Screen";
import DetailQuestionScreen from "@containers/question/DetailQuestionScreen";
import ProfileInfo from '@containers/account/ProfileInfo'
import DetailsDoctorScreen from "@containers/question/DetailsDoctorScreen";


//booking
import AddBookingScreen from "@containers/booking/AddBookingScreen";
import SelectHospitalScreen from "@containers/booking/SelectHospitalScreen";
import SelectHospitalByLocationScreen from "@containers/booking/SelectHospitalByLocationScreen";
import SelectTimeScreen from "@containers/booking/SelectTimeScreen";
import SelectServiceScreen from "@containers/booking/SelectServiceScreen";
import SelectServiceTypeScreen from "@containers/booking/SelectServiceTypeScreen";
import FilterSpecialistScreen from "@containers/booking/FilterSpecialistScreen";
import SelectSpecialistScreen from "@containers/booking/SelectSpecialistScreen";
import ConfirmBookingScreen from "@containers/booking/ConfirmBookingScreen";
import CreateBookingSuccessScreen from "@containers/booking/CreateBookingSuccessScreen";
import PaymentBookingErrorScreen from "@containers/booking/PaymentBookingErrorScreen";
import DetailsHistoryScreen from "@containers/booking/DetailsHistoryScreen"

import CreateProfileScreen from "@containers/profile/CreateProfileScreen";
import PaymentWithVNPayScreen from "@containers/payment/PaymentWithVNPayScreen";
import SelectProfileScreen from "@containers/booking/SelectProfileScreen";

//-------get ticket----------------
import SelectProfileMedicalScreen from "@containers/ticket/SelectProfileMedicalScreen";
import SelectHealthFacilitiesScreen from "@containers/ticket/SelectHealthFacilitiesScreen";
import ConfirmGetTicketScreen from "@containers/ticket/ConfirmGetTicketScreen";
import ScanQRCodeScreen from "@containers/ticket/ScanQRCodeScreen";
import GetTicketFinishScreen from "@containers/ticket/GetTicketFinishScreen";

//photo viewer
import PhotoViewerScreen from "@containers/image/PhotoViewerScreen";

//profile
import ProfileScreen from "@containers/profile/ProfileScreen";
import ListProfileScreen from '@containers/profile/ListProfileScreen'
import EditProfileScreen from '@containers/profile/EditProfileScreen'
import SelectProvinceScreen from "@containers/profile/SelectProvinceScreen";
import SelectZoneScreen from "@containers/profile/SelectZoneScreen";
import SelectDistrictScreen from "@containers/profile/SelectDistrictScreen";

//
import HospitalByLocationScreen from '@containers/home/HospitalByLocationScreen'
import HospitalScreen from '@containers/home/HospitalScreen'
import DrugScreen from '@containers/home/DrugScreen'


//
import PatientHistoryScreen from "@containers/booking/PatientHistoryScreen";


import EmptyScreen from "@containers/EmptyScreen2";

const BookingNavigation = createStackNavigator({
  addBooking: { screen: AddBookingScreen },
  selectHospital: { screen: SelectHospitalScreen },
  selectHospitalByLocation: { screen: SelectHospitalByLocationScreen },
  selectTime: { screen: SelectTimeScreen },
  selectService: { screen: SelectServiceScreen },
  selectServiceType: { screen: SelectServiceTypeScreen },
  selectSpecialist: { screen: SelectSpecialistScreen },
  confirmBooking: { screen: ConfirmBookingScreen },
  createBookingSuccess: { screen: CreateBookingSuccessScreen },
  paymentBookingError: { screen: PaymentBookingErrorScreen },
  detailsHistory: { screen: DetailsHistoryScreen },
  createProfile: { screen: CreateProfileScreen },
  paymentVNPay: { screen: PaymentWithVNPayScreen },
  filterSpecialist: { screen: FilterSpecialistScreen },
  selectProfile: { screen: SelectProfileScreen },
},
  {
    headerMode: "none",
    header: null,
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  })

const LoginNavigation = createStackNavigator({
  login: { screen: LoginScreen },
  forgotPassword: { screen: ForgotPasswordScreen },
  enterPassword: { screen: EnterPasswordScreen },
  register: { screen: RegisterScreen },
},
  {
    headerMode: "none",
    header: null,
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  })
const ProfileNavigation = createStackNavigator({
  selectProfile: SelectProfileScreen,
  createProfile: CreateProfileScreen,
  listProfile: { screen: ListProfileScreen },
  editProfile: { screen: EditProfileScreen },
  selectProvince: { screen: SelectProvinceScreen },
  selectDistrict: { screen: SelectDistrictScreen },
  selectZone: { screen: SelectZoneScreen },
  profile: { screen: ProfileScreen },
},
  {
    headerMode: "none",
    header: null,
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  })
const GetTicketNavigation = createStackNavigator({
  selectHealthFacilitiesScreen: { screen: SelectHealthFacilitiesScreen },
  selectProfileMedical: { screen: SelectProfileMedicalScreen },
  scanQRCode: { screen: ScanQRCodeScreen },
  getTicketFinish: { screen: GetTicketFinishScreen },
  confirmGetTicket: { screen: ConfirmGetTicketScreen },
},
  {
    headerMode: "none",
    header: null,
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  })
const QuestionNavigation = createStackNavigator({
  listQuestion: { screen: ListQuestionScreen },
  createQuestionStep1: { screen: CreateQuestionStep1Screen },
  createQuestionStep2: { screen: CreateQuestionStep2Screen },
  detailQuestion: { screen: DetailQuestionScreen },
  detailsProfile: { screen: ProfileInfo },
  detailsDoctor: { screen: DetailsDoctorScreen },
},
  {
    headerMode: "none",
    header: null,
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  })

const HomeNavigation = createStackNavigator({
  home: {
    screen: HomeScreen
  },
},
  {
    headerMode: "none",
    header: null,
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  })

const TabNavigator = createBottomTabNavigator(
  {
    home: {
      screen: HomeNavigation,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={25} source={require('@images/new/home/ic_home.png')} style={{ tintColor: tintColor }} />,
      }
    },
    community: {
      screen: MenuProfileScreen,
      navigationOptions: {
        tabBarLabel: "Cộng đồng",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={20} source={require('@images/new/home/ic_community.png')} style={{ tintColor: tintColor }} />,
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          snackbar.show("Chức năng đang phát triển");
        },
      }
    },
    video: {
      screen: MenuProfileScreen,
      navigationOptions: {
        tabBarLabel: "Video",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={25} source={require('@images/new/home/ic_videos.png')} style={{ tintColor: tintColor }} />,
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          snackbar.show("Chức năng đang phát triển");
        },
      }
    },
    account: {
      screen: MenuProfileScreen,
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

const RootNavigator = createStackNavigator(
  {
    splash: SplashScreen,
    home: DrawerNav,
    ehealth: EHealthNavigator,
    viewDetailEhealth: { screen: ViewEhealthDetailScreen },
    login: LoginNavigation,
    listQuestion: QuestionNavigation,
    // booking navigation
    addBooking: BookingNavigation,
    createBookingSuccess: { screen: CreateBookingSuccessScreen },
    patientHistory: { screen: PatientHistoryScreen },

    //get Ticket
    getTicket: GetTicketNavigation,
    //menu profile
    setting: { screen: SettingScreen },
    changePassword: { screen: ChangePasswordScreen },


    hospital: { screen: HospitalScreen },
    drug: { screen: DrugScreen },
    hospitalByLocation: { screen: HospitalByLocationScreen },
    photoViewer: { screen: PhotoViewerScreen }
  },
  {
    headerMode: "none",
    // cardStyle: {
    //   backgroundColor: 'transparent', opacity: 1,
    // },
    // transitionConfig: () => ({
    //   containerStyle: {
    //     backgroundColor: 'transparent',
    //   },
    // }),
    header: null,
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    },
    // mode: Platform.OS == "ios" ? "modal" : "card"
  }
);


export { RootNavigator };