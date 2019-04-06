import { StackRouter, createStackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import LoginScreen from '@containers/account/LoginScreen';
import RegisterScreen from '@containers/account/RegisterScreen';
import EnterPasswordScreen from '@containers/account/EnterPasswordScreen';
import ForgotPasswordScreen from '@containers/account/ForgotPasswordScreen';
import SplashScreen from '@containers/SplashScreen';
import HomeScreen from '@containers/HomeScreen';
import SearchDrugScreen from '@containers/drug/SearchDrugScreen';
import SearchFacilityScreen from '@containers/facility/SearchFacilityScreen';
import SearchFacilityResultScreen from '@containers/facility/SearchFacilityResultScreen';
import SearchByLocationScreen from '@containers/facility/SearchByLocationScreen';
import SearchDrugResultScreen from '@containers/drug/SearchDrugResultScreen';
import DrugDetailScreen from '@containers/drug/DrugDetailScreen';
import FacilityDetailScreen from '@containers/facility/FacilityDetailScreen';
import MyFacilityScreen from '@containers/facility/MyFacilityScreen';
import AddNewDrugStoreScreen from '@containers/facility/AddNewDrugStoreScreen';
import AddNewClinicScreen from '@containers/facility/AddNewClinicScreen';
import PhotoViewerScreen from '@containers/image/PhotoViewerScreen';
import SearchDiseaseScreen from '@containers/disease/SearchDiseaseScreen';
import DiseaseDetailScreen from '@containers/disease/DiseaseDetailScreen';
import SearchDiseaseResultScreen from '@containers/disease/SearchDiseaseResultScreen';
import IntroScreen from '@containers/intro/IntroScreen';
import AboutScreen from '@containers/utility/AboutScreen';
import TermsScreen from '@containers/utility/TermsScreen';
import PolicyScreen from '@containers/utility/PolicyScreen';
import SpecialistScreen from '@containers/specialist/SpecialistScreen';
import ConfirmCodeScreen from '@containers/account/ConfirmCodeScreen';
import ResetPasswordScreen from '@containers/account/ResetPasswordScreen';
import SymptomScreen from '@containers/symptom/SymptomScreen';
import GroupChatScreen from '@containers/chat/GroupChatScreen';
import ChatScreen from '@containers/chat/ChatScreen';
import ProfileScreen from '@containers/account/ProfileScreen';
import { EHealthNavigator } from '@ehealth/navigator';
import { BookingDHYNavigation } from '@dhy/navigator';
import NotificationScreen from '@containers/notification/NotificationScreen';
import ListQuestionScreen from '@containers/question/ListQuestionScreen';
import MyQuestionScreen from '@containers/question/MyQuestionScreen';
import CreateQuestionStep1Screen from '@containers/question/CreateQuestionStep1Screen';
import CreateQuestionStep2Screen from '@containers/question/CreateQuestionStep2Screen';
import DetailQuestionScreen from '@containers/question/DetailQuestionScreen';
import TestVNPayScreen from '@containers/test/TestVNPayScreen';
import ChangePass from '@containers/account/ChangePassWord'
import EmptyScreen from '@containers/EmptyScreen2';
const RootNavigator = createStackNavigator({
    // testVNPay: { screen: TestVNPayScreen },
    splash: { screen: SplashScreen },
    ehealth: { screen: EHealthNavigator },
    addBookingBVDHY: { screen: BookingDHYNavigation },
    groupChat: { screen: GroupChatScreen },
    groupChatFacility: { screen: GroupChatScreen },
    chat: { screen: ChatScreen },
    intro: { screen: IntroScreen },
    home: { screen: HomeScreen },
    login: { screen: LoginScreen },
    forgotPassword: { screen: ForgotPasswordScreen },
    enterPassword: { screen: EnterPasswordScreen },
    register: { screen: RegisterScreen },
    searchFacility: { screen: SearchFacilityScreen },
    searchFacilityResult: { screen: SearchFacilityResultScreen },
    searchFacilityByLocation: { screen: SearchByLocationScreen },
    searchDrug: { screen: SearchDrugScreen },
    searchDrugResult: { screen: SearchDrugResultScreen },
    searchDisease: { screen: SearchDiseaseScreen },
    diseaseDetail: { screen: DiseaseDetailScreen },
    searchDiseaseResult: { screen: SearchDiseaseResultScreen },
    drugDetailScreen: { screen: DrugDetailScreen },
    facilityDetailScreen: { screen: FacilityDetailScreen },
    myFacility: { screen: MyFacilityScreen },
    addNewDrugStore: { screen: AddNewDrugStoreScreen },
    addNewClinic: { screen: AddNewClinicScreen },
    photoViewer: { screen: PhotoViewerScreen },
    about: { screen: AboutScreen },
    terms: { screen: TermsScreen },
    policy: { screen: PolicyScreen },
    specialist: { screen: SpecialistScreen },
    confirmCode: { screen: ConfirmCodeScreen },
    resetPassword: { screen: ResetPasswordScreen },
    symptom: { screen: SymptomScreen },
    profile: { screen: ProfileScreen },
    notification: { screen: NotificationScreen },
    listQuestion: { screen: ListQuestionScreen },
    myQuestion: { screen: MyQuestionScreen },
    createQuestionStep1: { screen: CreateQuestionStep1Screen },
    createQuestionStep2: { screen: CreateQuestionStep2Screen },
    detailQuestion: { screen: DetailQuestionScreen },
    changePass : { screen: ChangePass} ,
    emptyScreen : { screen: EmptyScreen} 
}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        },
        mode: Platform.OS == 'ios' ? 'modal' : 'card'
    }
);

export { RootNavigator };