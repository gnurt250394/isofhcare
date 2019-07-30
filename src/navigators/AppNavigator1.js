import {
  StackRouter,
  createStackNavigator,
} from "react-navigation";
import React from 'react';
import { Platform } from "react-native";
import IntroScreen from "@containers/intro/IntroScreen";
import AboutScreen from "@containers/utility/AboutScreen";
import TermsScreen from "@containers/utility/TermsScreen";
import PolicyScreen from "@containers/utility/PolicyScreen";
import SpecialistScreen from "@containers/specialist/SpecialistScreen";
import ConfirmCodeScreen from "@containers/account/ConfirmCodeScreen";
import ResetPasswordScreen from "@containers/account/ResetPasswordScreen";
import GroupChatScreen from "@containers/chat/GroupChatScreen";
import ChatScreen from "@containers/chat/ChatScreen";

import { EHealthNavigator } from "@ehealth/navigator";
import NotificationScreen from "@containers/notification/NotificationScreen";
import ListQuestionScreen from "@containers/question/ListQuestionScreen";
import CreateQuestionStep1Screen from "@containers/question/CreateQuestionStep1Screen";
import CreateQuestionStep2Screen from "@containers/question/CreateQuestionStep2Screen";
import DetailQuestionScreen from "@containers/question/DetailQuestionScreen";
import PaymentWithVNPayScreen from "@containers/payment/PaymentWithVNPayScreen";
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
//---------------------------
//.....details doctor.......
import EmptyScreen from "@containers/EmptyScreen2";
//---------------------------------
//........................eHealth................
import DrawerNav from './AppNavigator'
import HospitalByLocationScreen from '@containers/home/HospitalByLocationScreen'
// const RootNavigator = createStackNavigator(
//   {
//     groupChat: { screen: GroupChatScreen },
//     groupChatFacility: { screen: GroupChatScreen },
//     chat: { screen: ChatScreen },
//     intro: { screen: IntroScreen },
//     home: {
//       screen: DrawerNav, navigationOptions: ({ navigation }) => ({
//         header: null
//       })
//     },
//     login: { screen: LoginScreen },
//     forgotPassword: { screen: ForgotPasswordScreen },
//     enterPassword: { screen: EnterPasswordScreen },
//     register: { screen: RegisterScreen },
//     about: { screen: AboutScreen },
//     terms: { screen: TermsScreen },
//     policy: { screen: PolicyScreen },
//     specialist: { screen: SpecialistScreen },
//     confirmCode: { screen: ConfirmCodeScreen },
//     resetPassword: { screen: ResetPasswordScreen },
//     notification: { screen: NotificationScreen },
//     listQuestion: { screen: ListQuestionScreen },
//     createQuestionStep1: { screen: CreateQuestionStep1Screen },
//     createQuestionStep2: { screen: CreateQuestionStep2Screen },
//     detailQuestion: { screen: DetailQuestionScreen },
//     FingerScreen: { screen: FingerScreen },
//     FingerSettingScreen: { screen: FingerSettingScreen },
//     //---------------booking navigation
//     //---------------------------------
//     //
//     //------------------get ticket ----------------
//     selectHealthFacilitiesScreen: { screen: SelectHealthFacilitiesScreen },
//     selectProfileMedical: { screen: SelectProfileMedicalScreen },
//     scanQRCode: { screen: ScanQRCodeScreen },
//     getTicketFinish: { screen: GetTicketFinishScreen },
//     confirmGetTicket: { screen: ConfirmGetTicketScreen },
//     //----------------------------------------
//     //----------------ehealth-----------------

//     emptyScreen: { screen: EmptyScreen },
//   },

//   {
//     headerMode: "none",
//     // cardStyle: {
//     //   backgroundColor: 'transparent', opacity: 1,
//     // },
//     // transitionConfig: () => ({
//     //   containerStyle: {
//     //     backgroundColor: 'transparent',
//     //   },
//     // }),
//     header: null,
//     gesturesEnabled: false,
//     navigationOptions: {
//       header: null,
//       gesturesEnabled: false
//     },
//     // mode: Platform.OS == "ios" ? "modal" : "card"
//   }
// )




export { RootNavigator };
