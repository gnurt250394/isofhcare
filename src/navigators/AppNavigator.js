import {
  StackRouter,
  createStackNavigator,
} from "react-navigation";
import React from 'react';
import { Platform } from "react-native";
import LoginScreen from "@containers/account/LoginScreen";
import RegisterScreen from "@containers/account/RegisterScreen";
import EnterPasswordScreen from "@containers/account/EnterPasswordScreen";
import ForgotPasswordScreen from "@containers/account/ForgotPasswordScreen";
import SplashScreen from "@containers/SplashScreen";
import PhotoViewerScreen from "@containers/image/PhotoViewerScreen";
import IntroScreen from "@containers/intro/IntroScreen";
import AboutScreen from "@containers/utility/AboutScreen";
import TermsScreen from "@containers/utility/TermsScreen";
import PolicyScreen from "@containers/utility/PolicyScreen";
import SpecialistScreen from "@containers/specialist/SpecialistScreen";
import ConfirmCodeScreen from "@containers/account/ConfirmCodeScreen";
import ResetPasswordScreen from "@containers/account/ResetPasswordScreen";
import GroupChatScreen from "@containers/chat/GroupChatScreen";
import ChatScreen from "@containers/chat/ChatScreen";
// import ProfileScreen from "@containers/account/ProfileScreen";
import ProfileScreen from "@containers/profile/ProfileScreen";
import SelectProvinceScreen from "@containers/profile/SelectProvinceScreen";
import SelectZoneScreen from "@containers/profile/SelectZoneScreen";
import SelectDistrictScreen from "@containers/profile/SelectDistrictScreen";

import { EHealthNavigator } from "@ehealth/navigator";
import NotificationScreen from "@containers/notification/NotificationScreen";
import ListQuestionScreen from "@containers/question/ListQuestionScreen";
import CreateQuestionStep1Screen from "@containers/question/CreateQuestionStep1Screen";
import CreateQuestionStep2Screen from "@containers/question/CreateQuestionStep2Screen";
import DetailQuestionScreen from "@containers/question/DetailQuestionScreen";
import PaymentWithVNPayScreen from "@containers/payment/PaymentWithVNPayScreen";
import ChangePasswordScreen from "@containers/account/ChangePasswordScreen";
import FingerScreen from "@containers/account/FingerScreen";
import FingerSettingScreen from "@containers/account/FingerSettingScreen";
//=========BOOKING NAVIGATION
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
//=========PROFILE NAVIGATION
import SelectProfileScreen from "@containers/booking/SelectProfileScreen";
// import CreateProfileScreen from "@containers/booking/CreateProfileScreen";
import ProfileInfo from '@containers/account/ProfileInfo'
import CreateProfileScreen from "@containers/profile/CreateProfileScreen";
import MenuProfile from '@containers/profile/MenuProfile'
import ListProfileScreen from '@containers/profile/ListProfileScreen'
import EditProfileScreen from '@containers/profile/EditProfileScreen'
import SettingScreen from '@containers/profile/SettingScreen'
//---------------------------
import PatientHistoryScreen from "@containers/booking/PatientHistoryScreen";
//.....details doctor.......
import DetailsDoctorScreen from "@containers/question/DetailsDoctorScreen";
import EmptyScreen from "@containers/EmptyScreen2";
//-------get ticket----------------
import SelectProfileMedicalScreen from "@containers/ticket/SelectProfileMedicalScreen";
import SelectHealthFacilitiesScreen from "@containers/ticket/SelectHealthFacilitiesScreen";
import ConfirmGetTicketScreen from "@containers/ticket/ConfirmGetTicketScreen";
import ScanQRCodeScreen from "@containers/ticket/ScanQRCodeScreen";
import GetTicketFinishScreen from "@containers/ticket/GetTicketFinishScreen";
//---------------------------------
import ViewEhealthDetailScreen from '@containers/ehealth/ViewEhealthDetailScreen';
//........................eHealth................
import HospitalScreen from '@containers/home/HospitalScreen'
import DrugScreen from '@containers/home/DrugScreen'
import DrawerNav from './DrawerNav'
import HospitalByLocationScreen from '@containers/home/HospitalByLocationScreen'
const RootNavigator = createStackNavigator(
  {
    // createProfileTicketScreen : {screen:CreateProfileTicketScreen},
    // testVNPay: { screen: TestVNPayScreen },
    // scanQRCode: { screen: ScanQRCodeScreen },
    //=---------------Profile-----------------
    // profile: { screen: ProfileScreen },
    splash: { screen: SplashScreen },
    setting:{screen:SettingScreen},
    listProfile:{screen:ListProfileScreen},
    createProfile: { screen: CreateProfileScreen },
    editProfile:{screen:EditProfileScreen},
    selectProvince : {screen:SelectProvinceScreen},
    selectDistrict : {screen:SelectDistrictScreen},
    selectZone : {screen:SelectZoneScreen},
    groupChat: { screen: GroupChatScreen },
    groupChatFacility: { screen: GroupChatScreen },
    chat: { screen: ChatScreen },
    intro: { screen: IntroScreen },
    home: {
      screen: DrawerNav, navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    login: { screen: LoginScreen },
    forgotPassword: { screen: ForgotPasswordScreen },
    enterPassword: { screen: EnterPasswordScreen },
    register: { screen: RegisterScreen },
    photoViewer: { screen: PhotoViewerScreen },
    about: { screen: AboutScreen },
    terms: { screen: TermsScreen },
    policy: { screen: PolicyScreen },
    specialist: { screen: SpecialistScreen },
    confirmCode: { screen: ConfirmCodeScreen },
    resetPassword: { screen: ResetPasswordScreen },
    profile: { screen: ProfileScreen },
    notification: { screen: NotificationScreen },
    listQuestion: { screen: ListQuestionScreen },
    createQuestionStep1: { screen: CreateQuestionStep1Screen },
    createQuestionStep2: { screen: CreateQuestionStep2Screen },
    detailQuestion: { screen: DetailQuestionScreen },
    changePassword: { screen: ChangePasswordScreen },
    FingerScreen: { screen: FingerScreen },
    FingerSettingScreen: { screen: FingerSettingScreen },
    //---------------booking navigation
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
    //---------------------------------
    selectProfile: { screen: SelectProfileScreen },
    detailsProfile: { screen: ProfileInfo },
    detailsDoctorScreen: { screen: DetailsDoctorScreen },
    //
    PatientHistoryScreen: { screen: PatientHistoryScreen },
    //------------------get ticket ----------------
    selectHealthFacilitiesScreen: { screen: SelectHealthFacilitiesScreen },
    selectProfileMedical: { screen: SelectProfileMedicalScreen },
    scanQRCode: { screen: ScanQRCodeScreen },
    getTicketFinish: { screen: GetTicketFinishScreen },
    confirmGetTicket: { screen: ConfirmGetTicketScreen },
    //----------------------------------------
    //----------------ehealth-----------------
    ehealth: { screen: EHealthNavigator },
    viewDetailEhealth: { screen: ViewEhealthDetailScreen },

    emptyScreen: { screen: EmptyScreen },
    hospital: { screen: HospitalScreen },
    drug: { screen: DrugScreen },
    hospitalByLocation:{screen:HospitalByLocationScreen}
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
)

export { RootNavigator };
