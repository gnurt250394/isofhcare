import React from 'react';
import { connect } from "react-redux";
import NavigationService from "@navigators/NavigationService";
import userProvider from '@data-access/user-provider';

import { createDrawerNavigator, DrawerItems, createBottomTabNavigator, TabBarBottom, createStackNavigator, createAppContainer } from 'react-navigation';
import NotificationBadge from "@components/notification/NotificationBadge";

//splash
import SplashScreen from "@containers/SplashScreen";
//intro
import IntroScreen from "@containers/intro/IntroScreen";
//about
import AboutScreen from "@containers/utility/AboutScreen";
//scan qrcode
import QRCodeScannerScreen from "@containers/qrcode/QRCodeScannerScreen";


// import HomeScreen from "@containers/HomeScreen";
import HomeScreen from "@containers/home/tab/HomeScreen";
import AccountScreen from "@containers/home/tab/AccountScreen";
import NotificationScreen from "@containers/notification/NotificationScreen";

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
// import DetailsDoctorScreen from "@containers/question/DetailsDoctorScreen";


//booking
import AddBookingScreen from "@containers/booking/AddBookingScreen";
import AddBookingScreen1 from "@containers/booking/AddBookingScreen1";
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
import CreateBookingWithPaymentScreen from "@containers/booking/CreateBookingWithPaymentScreen"


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
import SelectRelationshipScreen from "@containers/profile/SelectRelationshipScreen";
import CheckOtpScreen from "@containers/profile/CheckOtpScreen";
import SendConfirmProfileScreen from "@containers/profile/SendConfirmProfileScreen";
import ShareDataProfileScreen from '@containers/profile/ShareDataProfileScreen'


//
import HospitalByLocationScreen from '@containers/home/HospitalByLocationScreen'
import HospitalScreen from '@containers/home/HospitalScreen'
import DrugScreen from '@containers/home/DrugScreen'


//
import PatientHistoryScreen from "@containers/booking/PatientHistoryScreen";
//
import TermsScreen from "@containers/utility/TermsScreen";
import PolicyScreen from "@containers/utility/PolicyScreen";
import SpecialistScreen from "@containers/specialist/SpecialistScreen";
import ConfirmCodeScreen from "@containers/account/ConfirmCodeScreen";
import ResetPasswordScreen from "@containers/account/ResetPasswordScreen";
import { fromLeft, zoomIn, zoomOut, fromRight } from 'react-navigation-transitions';
import MyVoucherScreen from '@containers/voucher';
import ListDoctorScreen from '@containers/booking/doctor/ListDoctorScreen';
import DetailsDoctorScreen from '@containers/booking/doctor/DetailDoctorScreen';
import AddBookingDoctorScreen from '@containers/booking/doctor/AddBookingDoctorScreen';
import SelectDateTimeDoctorScreen from '@containers/booking/doctor/SelectDateTimeDoctorScreen';
import ListBookingScreen from '@containers/booking/ListBookingScreens'

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

const TabNavigatorComponent = createBottomTabNavigator(
  {
    homeTab: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={25} source={require('@images/new/home/ic_home.png')} style={{ tintColor: tintColor }} />,
      }
    },
    communityTab: {
      screen: AccountScreen,
      navigationOptions: {
        tabBarLabel: "Cộng đồng",
        tabBarIcon: ({ tintColor }) => <ScaledImage touchable={false} height={20} source={require('@images/new/home/ic_community.png')} style={{ tintColor: tintColor }} />,
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          snackbar.show("Chức năng đang phát triển");
        },
      }
    },
    videoTab: {
      screen: AccountScreen,
      navigationOptions: {
        tabBarLabel: "Video",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={25} source={require('@images/new/home/ic_videos.png')} style={{ tintColor: tintColor }} />,
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          snackbar.show("Chức năng đang phát triển");
        },
      }
    },
    accountTab: {
      screen: AccountScreen,
      navigationOptions: {
        // tabBarOnPress: ({ navigation, defaultHandler }) => {
        //   if (userProvider.isLogin) {
        //     defaultHandler();
        //   } else {
        //     NavigationService.navigate("login");
        //   }
        // },
        tabBarLabel: "Account",
        tabBarIcon: ({ tintColor }) => <ScaledImage height={22} source={require('@images/new/home/ic_account.png')} style={{ tintColor: tintColor }} />,
      }
    },
    notificationTab: {
      screen: NotificationScreen,
      navigationOptions: {
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          if (userProvider.isLogin) {
            defaultHandler();
          } else {
            NavigationService.navigate("login", {
              // nextScreen: { screen: "notificationTab", param: {} }
            });
          }
        },
        tabBarLabel: "Thông báo",
        tabBarIcon: ({ tintColor }) => <NotificationBadge height={25} tintColor={tintColor} />
      }
    }
  },
  {
    swipeEnabled: true,
    animationEnabled: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showLabel: false,
      activeTintColor: 'blue',
      inactiveTintColor: 'white',
      style: {
        backgroundColor: "#02C39A",
      },
    }
  }
)


// const DrawerNav = createDrawerNavigator({
//   home: TabNavigatorComponent
// }, {
//     // contentComponent: CustomDrawer,
//     // initialRouteName: 'home',
//     // drawerPosition: 'left',
//     // contentOptions: {
//     //   inactiveTintColor: '#000',
//     // },
//     // drawerOpenRoute: 'DrawerOpen',
//     // drawerCloseRoute: 'DrawerClose'
//   }
// );

const handleCustomTransition = ({ scenes }) => {
  return fromRight();
}


const RootNavigator = createStackNavigator(
  {
    splash: SplashScreen,
    qrcodeScanner: QRCodeScannerScreen,
    intro: { screen: IntroScreen },
    about: { screen: AboutScreen },
    terms: { screen: TermsScreen },
    policy: { screen: PolicyScreen },
    //profile
    selectProfile: { screen: SelectProfileScreen },
    createProfile: { screen: CreateProfileScreen },
    listProfileUser: { screen: ListProfileScreen },
    editProfile: { screen: EditProfileScreen },
    shareDataProfile: { screen: ShareDataProfileScreen },
    checkOtp: { screen: CheckOtpScreen },
    selectProvince: { screen: SelectProvinceScreen },
    selectDistrict: { screen: SelectDistrictScreen },
    selectRelationship: { screen: SelectRelationshipScreen },
    selectZone: { screen: SelectZoneScreen },
    profile: { screen: ProfileScreen },
    sendConfirmProfile: { screen: SendConfirmProfileScreen },
    // listProfileUser: { screen: ListProfileScreen },
    //
    home: TabNavigatorComponent,
    homeTab: HomeScreen,
    notificationTab: NotificationScreen,
    ehealth: EHealthNavigator,
    viewDetailEhealth: { screen: ViewEhealthDetailScreen },
    login: { screen: LoginScreen },
    forgotPassword: { screen: ForgotPasswordScreen },
    confirmCode: { screen: ConfirmCodeScreen },
    resetPassword: { screen: ResetPasswordScreen },
    enterPassword: { screen: EnterPasswordScreen },
    register: { screen: RegisterScreen },
    listQuestion: ListQuestionScreen,
    createQuestionStep1: { screen: CreateQuestionStep1Screen },
    createQuestionStep2: { screen: CreateQuestionStep2Screen },
    detailQuestion: { screen: DetailQuestionScreen },
    detailsProfile: { screen: ProfileInfo },
    detailsDoctor: { screen: DetailsDoctorScreen },
    // booking navigation
    addBooking: AddBookingScreen,
    addBooking1: AddBookingScreen1,
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
    patientHistory: { screen: PatientHistoryScreen },
    createBookingWithPayment: { screen: CreateBookingWithPaymentScreen },

    //get Ticket
    getTicket: GetTicketNavigation,
    //menu profile
    setting: { screen: SettingScreen },
    changePassword: { screen: ChangePasswordScreen },
    //
    //
    specialist: { screen: SpecialistScreen },



    hospital: { screen: HospitalScreen },
    drug: { screen: DrugScreen },
    hospitalByLocation: { screen: HospitalByLocationScreen },
    photoViewer: { screen: PhotoViewerScreen },
    myVoucher: { screen: MyVoucherScreen },
    listDoctor: { screen: ListDoctorScreen },
    addBookingDoctor: { screen: AddBookingDoctorScreen },
    selectTimeDoctor: { screen: SelectDateTimeDoctorScreen },
    listBooking:{screen:ListBookingScreen}
  },
  {
    initialRouteName:'listDoctor',
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
    transitionConfig: (nav) => handleCustomTransition(nav)
  }
);
let AppContainer = createAppContainer(RootNavigator)
export { AppContainer };