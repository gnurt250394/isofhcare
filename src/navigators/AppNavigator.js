import React from 'react';
import {connect} from 'react-redux';
import NavigationService from '@navigators/NavigationService';
import userProvider from '@data-access/user-provider';

import {
  createDrawerNavigator,
  DrawerItems,
  createBottomTabNavigator,
  TabBarBottom,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import NotificationBadge from '@components/notification/NotificationBadge';

//splash
import SplashScreen from '@containers/SplashScreen';
//intro
import IntroScreen from '@containers/intro/IntroScreen';
//about
import AboutScreen from '@containers/utility/AboutScreen';
//scan qrcode
import QRCodeScannerScreen from '@containers/qrcode/QRCodeScannerScreen';

// import HomeScreen from "@containers/HomeScreen";
import HomeScreen from '@containers/home/tab/HomeScreen';
import AccountScreen from '@containers/home/tab/AccountScreen';
import NotificationScreen from '@containers/notification/NotificationScreen';
import VerifyPhoneNumberScreen from '@containers/account/VerifyPhoneNumberScreen';
import CustomDrawer from '@components/navigators/CustomDrawer';
import ScaledImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';

import SettingScreen from '@containers/profile/SettingScreen';

//y ba dien tu
import {EHealthNavigator} from '@ehealth/navigator';
import ViewEhealthDetailScreen from '@containers/ehealth/ViewEhealthDetailScreen';

//login
import LoginScreen from '@containers/account/LoginScreen';
import RegisterScreen from '@containers/account/RegisterScreen';
import EnterPasswordScreen from '@containers/account/EnterPasswordScreen';
import ForgotPasswordScreen from '@containers/account/ForgotPasswordScreen';
import ChangePasswordScreen from '@containers/account/ChangePasswordScreen';
import OtpPhoneNumberScreen from '@containers/account/OtpPhoneNumberScreen';
import InputPhoneScreen from '@containers/account/InputPhoneScreen';

//question
import ListQuestionScreen from '@containers/question/ListQuestionScreen';
import CreateQuestionStep1Screen from '@containers/question/CreateQuestionStep1Screen';
import CreateQuestionStep2Screen from '@containers/question/CreateQuestionStep2Screen';
import DetailQuestionScreen from '@containers/question/DetailQuestionScreen';
import ProfileInfo from '@containers/account/ProfileInfo';
// import DetailsDoctorScreen from "@containers/question/DetailsDoctorScreen";

//booking
import AddBookingScreen from '@containers/booking/AddBookingScreen';
import AddBookingScreen1 from '@containers/booking/AddBookingScreen1';
import SelectHospitalScreen from '@containers/booking/SelectHospitalScreen';
import SelectHospitalByLocationScreen from '@containers/booking/SelectHospitalByLocationScreen';
import SelectTimeScreen from '@containers/booking/SelectTimeScreen';
import SelectServiceScreen from '@containers/booking/SelectServiceScreen';
import SelectServiceTypeScreen from '@containers/booking/SelectServiceTypeScreen';
import FilterSpecialistScreen from '@containers/booking/FilterSpecialistScreen';
import SelectSpecialistScreen from '@containers/booking/SelectSpecialistScreen';
import ConfirmBookingScreen from '@containers/booking/ConfirmBookingScreen';
import CreateBookingSuccessScreen from '@containers/booking/CreateBookingSuccessScreen';
import PaymentBookingErrorScreen from '@containers/booking/PaymentBookingErrorScreen';
import CreateBookingWithPaymentScreen from '@containers/booking/CreateBookingWithPaymentScreen';

import SelectNationsSceen from '@containers/profile/SelectNationsSceen';
import SelectJobsSceen from '@containers/profile/GetJobsSceen';
import CreateProfileScreen from '@containers/profile/CreateProfileScreen1';
import PaymentWithVNPayScreen from '@containers/payment/PaymentWithVNPayScreen';
import SelectProfileScreen from '@containers/booking/SelectProfileScreen';
// import SelectProfileScreen from "@containers/booking/SelectProfileScreen1";

//-------get ticket----------------
import SelectProfileMedicalScreen from '@containers/ticket/SelectProfileMedicalScreen';
import SelectHealthFacilitiesScreen from '@containers/ticket/SelectHealthFacilitiesScreen';
import ConfirmGetTicketScreen from '@containers/ticket/ConfirmGetTicketScreen';
import ScanQRCodeScreen from '@containers/ticket/ScanQRCodeScreen';
import GetTicketFinishScreen from '@containers/ticket/GetTicketFinishScreen';

//photo viewer
import PhotoViewerScreen from '@containers/image/PhotoViewerScreen';

//profile
import ProfileScreen from '@containers/profile/ProfileScreen';
import ListProfileScreen from '@containers/profile/ListProfileScreen';
import EditProfileScreen from '@containers/profile/EditProfileScreen';
import SelectProvinceScreen from '@containers/profile/SelectProvinceScreen';
import SelectZoneScreen from '@containers/profile/SelectZoneScreen';
import SelectDistrictScreen from '@containers/profile/SelectDistrictScreen';
import SelectRelationshipScreen from '@containers/profile/SelectRelationshipScreen';
import SendConfirmProfileScreen from '@containers/profile/SendConfirmProfileScreen';
import ShareDataProfileScreen from '@containers/profile/ShareDataProfileScreen';
import EditProfileUsernameScreen from '@containers/profile/EditProfileUsernameScreen';
import SelectCountrySceen from '@containers/profile/SelectCountrySceen';

//
import HospitalByLocationScreen from '@containers/home/HospitalByLocationScreen';
import HospitalScreen from '@containers/home/HospitalScreen';
//drug
import DrugScreen from '@containers/home/DrugScreen';
import FindDrugScreen from '@containers/drug/FindDrugScreen';
import InputLocationScreen from '@containers/drug/InputLocationScreen';
import SelectLocationScreen from '@containers/drug/SelectLocationScreen';
import DetailsDrugScreen from '@containers/drug/DetailsDrugScreen';
import DrugStoreScreen from '@containers/drug/DrugStoreScreen';
import EditDrugInputScreen from '@containers/drug/EditDrugInputScreen';
import EditDrugScanScreen from '@containers/drug/EditDrugScanScreen';

//
import PatientHistoryScreen from '@containers/booking/PatientHistoryScreen';
//
import TermsScreen from '@containers/utility/TermsScreen';
import PolicyScreen from '@containers/utility/PolicyScreen';
import SpecialistScreen from '@containers/specialist/SpecialistScreen';
import ConfirmCodeScreen from '@containers/account/ConfirmCodeScreen';
import ResetPasswordScreen from '@containers/account/ResetPasswordScreen';
import {
  fromLeft,
  zoomIn,
  zoomOut,
  fromRight,
  fromBottom,
} from 'react-navigation-transitions';
import MyVoucherScreen from '@containers/voucher';

import DetailVoucherScreen from '@containers/voucher/DetailVoucherScreen';

import ListDoctorScreen from '@containers/booking/doctor/ListDoctorScreen';
import DetailsDoctorScreen from '@containers/booking/doctor/DetailDoctorScreen';
import AddBookingDoctorScreen from '@containers/booking/doctor/AddBookingDoctorScreen';
import SelectDateTimeDoctorScreen from '@containers/booking/doctor/SelectDateTimeDoctorScreen';
import ListPaymentMethodScreen from '@containers/booking/doctor/ListPaymentMethodScreen';
import CreateBookingDoctorSuccessScreen from '@containers/booking/doctor/CreateBookingDoctorSuccessScreen';
import EditProfileScreen1 from '@containers/booking/EditProfileScreen';
import SelectAddressScreen from '@containers/booking/SelectAddressScreen';
import ListSpecialistWithDoctorScreen from '@containers/booking/doctor/ListSpecialistWithDoctorScreen';
import ListHospitalScreen from '@containers/booking/doctor/ListHospitalScreen';
import RatingDoctorScreen from '@containers/booking/doctor/RatingDoctorScreen';
import ListRatingDoctorScreen from '@containers/booking/doctor/ListRatingDoctorScreen';
import ListBookingHistoryScreen from '@containers/booking/ListBookingHistoryScreen';
import DetailHistoryBookingScreen from '@containers/booking/DetailHistoryBookingScreen';
import ConfirmBookingDoctorScreen from '@containers/booking/doctor/ConfirmBookingDoctorScreen';
import ListSpecialistScreen from '@containers/booking/specialist/ListSpecialistScreen';
import TabDoctorAndHospitalScreen from '@containers/booking/specialist/TabDoctorAndHospitalScreen';
import ProfileHospitalScreen from '@containers/booking/specialist/ProfileHospitalScreen';
import MaphospitalScreen from '@containers/booking/specialist/MaphospitalScreen';
import DetailServiceScreen from '@containers/booking/DetailServiceScreen';
import ListServicesScreen from '@containers/services/ListServicesScreen';
import ListServiceDetailScreen from '@containers/services/ListServiceDetailScreen';
import ListOfServiceScreen from '@containers/services/ListOfServiceScreen';
import DetailNewHighLightScreen from '@containers/home/DetailNewHighLightScreen';

// import VideoCallScreen from '@containers/community/CallVideoScreen';
//icd
import SearchIcdScreen from '@containers/icd/SearchIcdScreen';
import CodeScreen from '@containers/code/CodeScreen';
import HistoryCumulativeScreen from '@containers/code/HistoryCumulativeScreen';
import GroupChatScreen from '@containers/chat/GroupChatScreen';
import ChatScreen from '@containers/chat/ChatScreen';
import ListMyQuestionScreen from '@containers/question/ListMyQuestionScreen';
import DetailMessageScreen from '@containers/question/DetailMessageScreen';
import IntroCovidScreen from '@containers/covid/IntroCovidScreen';
import TestCovidScreen from '@containers/covid/TestCovidScreen';
import TestResultScreen from '@containers/covid/TestResultScreen';
import HealthMonitoringScreen from '@containers/ehealth/healthMonitoring/HealthMonitoringScreen';

const ProfileNavigation = createStackNavigator(
  {
    selectProfile: SelectProfileScreen,
    createProfile: CreateProfileScreen,
    listProfile: {screen: ListProfileScreen},
    editProfile: {screen: EditProfileScreen},
    selectProvince: {screen: SelectProvinceScreen},
    selectDistrict: {screen: SelectDistrictScreen},
    selectZone: {screen: SelectZoneScreen},
    profile: {screen: ProfileScreen},
  },
  {
    headerMode: 'none',
    header: null,
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
);
const GetTicketNavigation = createStackNavigator(
  {
    selectHealthFacilitiesScreen: {screen: SelectHealthFacilitiesScreen},
    selectProfileMedical: {screen: SelectProfileMedicalScreen},
    scanQRCode: {screen: ScanQRCodeScreen},
    getTicketFinish: {screen: GetTicketFinishScreen},
    confirmGetTicket: {screen: ConfirmGetTicketScreen},
  },
  {
    headerMode: 'none',
    header: null,
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
);

const TabNavigatorComponent = createBottomTabNavigator(
  {
    homeTab: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Trang chủ',
        tabBarIcon: ({tintColor}) => (
          <ScaledImage
            height={20}
            source={require('@images/new/homev2/ic_home_menu.png')}
            style={{tintColor: tintColor}}
          />
        ),
      },
    },
    communityTab: {
      screen: ListQuestionScreen,
      navigationOptions: {
        tabBarLabel: 'Cộng đồng',
        tabBarIcon: ({tintColor}) => (
          <ScaledImage
            touchable={false}
            height={20}
            source={require('@images/new/homev2/ic_community_menu.png')}
            style={{tintColor: tintColor}}
          />
        ),
      //   tabBarOnPress: ({navigation, defaultHandler}) => {
      //     if (userProvider.isLogin) {
      //       console.log('userProvider.isLogin: ', userProvider.isLogin);
      //       defaultHandler();
      //     } else {
      //       NavigationService.navigate('login');
      //     }
      //   },
      },
    },
    // drugTab: {
    //   screen: DrugScreen,
    //   navigationOptions: {
    //     tabBarLabel: "Thuốc",
    //     tabBarIcon: ({ tintColor }) => <ScaledImage height={23} source={require('@images/new/homev2/ic_drug_menu.png')} style={{ tintColor: tintColor }} />,
    //     tabBarOnPress: ({ navigation, defaultHandler }) => {
    //       if (userProvider.isLogin) {
    //         console.log('userProvider.isLogin: ', userProvider.isLogin);
    //         defaultHandler();
    //       } else {
    //         NavigationService.navigate("login");
    //       }
    //     },
    //   }
    // },
    // bookingTab: {
    //   screen: ListBookingHistoryScreen,
    //   navigationOptions: {
    //     tabBarLabel: 'Lich khám',
    //     tabBarIcon: ({tintColor}) => (
    //       <ScaledImage
    //         height={23}
    //         source={require('@images/new/homev2/ic_booking_home.png')}
    //         style={{tintColor: tintColor}}
    //       />
    //     ),
    //     tabBarOnPress: ({navigation, defaultHandler}) => {
    //       if (userProvider.isLogin) {
    //         console.log('userProvider.isLogin: ', userProvider.isLogin);
    //         defaultHandler();
    //       } else {
    //         NavigationService.navigate('login');
    //       }
    //     },
    //   },
    // },
    // ehealthTab: {
    //   screen: EHealthNavigator,
    //   navigationOptions: {
    //     tabBarLabel: "Y bạ điên tử",
    //     tabBarIcon: ({ tintColor }) => <ScaledImage height={23} source={require('@images/new/homev2/ic_ehealth_home.png')} style={{ tintColor: tintColor }} />,
    //     tabBarOnPress: ({ navigation, defaultHandler }) => {
    //       if (userProvider.isLogin) {
    //         console.log('userProvider.isLogin: ', userProvider.isLogin);
    //         defaultHandler();
    //       } else {
    //         NavigationService.navigate("login");
    //       }
    //     },
    //   }
    // },
    notificationTab: {
      screen: NotificationScreen,
      navigationOptions: {
        tabBarOnPress: ({navigation, defaultHandler}) => {
          if (userProvider.isLogin) {
            defaultHandler();
          } else {
            NavigationService.navigate('login', {
              // nextScreen: { screen: "notificationTab", param: {} }
            });
          }
        },
        tabBarLabel: 'Thông báo',
        tabBarIcon: ({tintColor}) => (
          <NotificationBadge height={20} tintColor={tintColor} />
        ),
      },
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
        tabBarLabel: 'Cá nhân',
        tabBarIcon: ({tintColor}) => (
          <ScaledImage
            height={20}
            source={require('@images/new/homev2/ic_profile_menu.png')}
            style={{tintColor: tintColor}}
          />
        ),
      },
    },
  },
  {
    swipeEnabled: true,
    animationEnabled: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showLabel: true,
      activeTintColor: '#00CBA7',
      inactiveTintColor: '#b3b3b3',
      allowFontScaling: false,
      style: {
        backgroundColor: '#FFF',
        paddingTop: 5,
      },
    },
  },
);

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

const handleCustomTransition = ({scenes}) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];
  if (
    prevScene &&
    prevScene.route.routeName === 'home' &&
    nextScene.route.routeName === 'listSpecialist'
  ) {
    return fromBottom();
  }
  if (
    prevScene &&
    prevScene.route.routeName === 'listQuestion' &&
    nextScene.route.routeName === 'detailQuestion'
  ) {
    return fromBottom();
  }
  return fromRight();
};

const RootNavigator = (route = 'splash') =>
  createStackNavigator(
    {
      splash: SplashScreen,
      qrcodeScanner: QRCodeScannerScreen,
      intro: {screen: IntroScreen},
      about: {screen: AboutScreen},
      terms: {screen: TermsScreen},
      policy: {screen: PolicyScreen},
      verifyPhone: {screen: VerifyPhoneNumberScreen},
      //profile
      selectProfile: {screen: SelectProfileScreen},
      createProfile: {screen: CreateProfileScreen},
      listProfileUser: {screen: ListProfileScreen},
      editProfile: {screen: EditProfileScreen},
      shareDataProfile: {screen: ShareDataProfileScreen},
      selectProvince: {screen: SelectProvinceScreen},
      selectDistrict: {screen: SelectDistrictScreen},
      selectRelationship: {screen: SelectRelationshipScreen},
      selectZone: {screen: SelectZoneScreen},
      profile: {screen: ProfileScreen},
      sendConfirmProfile: {screen: SendConfirmProfileScreen},
      // listProfileUser: { screen: ListProfileScreen },
      //
      home: TabNavigatorComponent,
      homeTab: HomeScreen,
      notificationTab: NotificationScreen,
      ehealth: EHealthNavigator,
      viewDetailEhealth: {screen: ViewEhealthDetailScreen},
      //
      login: {screen: LoginScreen},
      forgotPassword: {screen: ForgotPasswordScreen},
      confirmCode: {screen: ConfirmCodeScreen},
      resetPassword: {screen: ResetPasswordScreen},
      enterPassword: {screen: EnterPasswordScreen},
      register: {screen: RegisterScreen},
      otpPhoneNumber: {screen: OtpPhoneNumberScreen},
      inputPhone: {screen: InputPhoneScreen},
      //
      listQuestion: ListQuestionScreen,
      createQuestionStep1: {screen: CreateQuestionStep1Screen},
      createQuestionStep2: {screen: CreateQuestionStep2Screen},
      detailQuestion: {screen: DetailQuestionScreen},
      detailsProfile: {screen: ProfileInfo},
      detailsDoctor: {screen: DetailsDoctorScreen},
      // videoCall: { screen: VideoCallScreen },
      // booking navigation
      addBooking: AddBookingScreen,
      addBooking1: AddBookingScreen1,
      selectHospital: {screen: SelectHospitalScreen},
      selectHospitalByLocation: {screen: SelectHospitalByLocationScreen},
      selectTime: {screen: SelectTimeScreen},
      selectService: {screen: SelectServiceScreen},
      selectServiceType: {screen: SelectServiceTypeScreen},
      selectSpecialist: {screen: SelectSpecialistScreen},
      confirmBooking: {screen: ConfirmBookingScreen},
      createBookingSuccess: {screen: CreateBookingSuccessScreen},
      paymentBookingError: {screen: PaymentBookingErrorScreen},
      detailsHistory: {screen: DetailHistoryBookingScreen},
      createProfile: {screen: CreateProfileScreen},
      paymentVNPay: {screen: PaymentWithVNPayScreen},
      filterSpecialist: {screen: FilterSpecialistScreen},
      // selectProfile: { screen: SelectProfileScreen },
      patientHistory: {screen: PatientHistoryScreen},
      createBookingWithPayment: {screen: CreateBookingWithPaymentScreen},

      //get Ticket
      getTicket: GetTicketNavigation,
      //menu profile
      setting: {screen: SettingScreen},
      changePassword: {screen: ChangePasswordScreen},
      //drug
      findDrug: {screen: FindDrugScreen},
      selectLocation: {screen: SelectLocationScreen},
      inputLocation: {screen: InputLocationScreen},
      detailsDrug: {screen: DetailsDrugScreen},
      drugStore: {screen: DrugStoreScreen},

      //
      specialist: {screen: SpecialistScreen},

      detailsVoucher: {screen: DetailVoucherScreen},
      hospital: {screen: HospitalScreen},
      drugTab: {screen: DrugScreen},
      editDrugScan: {screen: EditDrugScanScreen},
      editDrugInput: {screen: EditDrugInputScreen},
      hospitalByLocation: {screen: HospitalByLocationScreen},
      photoViewer: {screen: PhotoViewerScreen},
      myVoucher: {screen: MyVoucherScreen},
      listDoctor: {screen: ListDoctorScreen},
      addBookingDoctor: {screen: AddBookingDoctorScreen},
      selectTimeDoctor: {screen: SelectDateTimeDoctorScreen},
      listHospital: {screen: ListHospitalScreen},
      listPaymentMethod: {screen: ListPaymentMethodScreen},
      createBookingDoctorSuccess: {screen: CreateBookingDoctorSuccessScreen},
      editProfile1: {screen: EditProfileScreen1},
      selectAddress: {screen: SelectAddressScreen},
      listSpecialistWithDoctor: {screen: ListSpecialistWithDoctorScreen},
      ratingDoctor: {screen: RatingDoctorScreen},
      listRatingDoctor: {screen: ListRatingDoctorScreen},
      listBookingHistory: {screen: ListBookingHistoryScreen},
      confirmBookingDoctor: {screen: ConfirmBookingDoctorScreen},
      listSpecialist: {screen: ListSpecialistScreen},
      tabDoctorAndHospital: {screen: TabDoctorAndHospitalScreen},
      profileHospital: {screen: ProfileHospitalScreen},
      mapHospital: {screen: MaphospitalScreen},
      detalService: {screen: DetailServiceScreen},
      listServices: {screen: ListServicesScreen},
      listServicesDetail: {screen: ListServiceDetailScreen},
      listOfServices: {screen: ListOfServiceScreen},
      detailNewsHighlight: {screen: DetailNewHighLightScreen},
      //icd
      searchIcd: {screen: SearchIcdScreen},
      code: {screen: CodeScreen},
      historyCumulative: {screen: HistoryCumulativeScreen},
      selectNations: {screen: SelectNationsSceen},
      getJobs: {screen: SelectJobsSceen},
      selectCountry: {screen: SelectCountrySceen},
      editProfileUsername: {screen: EditProfileUsernameScreen},
      groupChat: {screen: GroupChatScreen},
      chat: {screen: ChatScreen},
      listMyQuestion: ListMyQuestionScreen,
      detailMessage: {screen: DetailMessageScreen},
      introCovid: {screen: IntroCovidScreen},
      testCovid: {screen: TestCovidScreen},
      testResult: {screen: TestResultScreen},
      healthMonitoring: {screen: HealthMonitoringScreen},
    },
    {
      initialRouteName: route,
      headerMode: 'none',
      // cardStyle: {
      //   backgroundColor: 'transparent', opacity: 1,
      // },
      // transitionConfig: () => ({
      //   containerStyle: {
      //     backgroundColor: 'transparent',
      //   },
      // }),
      defaultNavigationOptions: {
        gesturesEnabled: false,
      },
      header: null,
      gesturesEnabled: false,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
        navigationOptions: {
          header: null,
          gesturesEnabled: false,
        },
        // mode: Platform.OS == "ios" ? "modal" : "card"
        transitionConfig: nav => handleCustomTransition(nav),
      },
    },
  );
const defaultStackGetStateForAction = RootNavigator().router.getStateForAction;

RootNavigator().router.getStateForAction = (action, state) => {
  console.log('state: ', state);
  if (state.index === 0 && action.type === NavigationActions.BACK) {
    return null;
  }

  return defaultStackGetStateForAction(action, state);
};
let AppContainer = route => createAppContainer(RootNavigator(route));
export {AppContainer};
