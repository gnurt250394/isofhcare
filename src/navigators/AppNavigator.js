import { StackRouter, createStackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import LoginScreen from '@containers/account/LoginScreen';
import RegisterScreen from '@containers/account/RegisterScreen';
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
import MyAccountScreen from '@containers/account/MyAccountScreen';
import ProfileScreen from '@containers/account/ProfileScreen'
const RootNavigator = createStackNavigator({
    splash: { screen: SplashScreen },
    mailbox: { screen: GroupChatScreen },
    chat: { screen: ChatScreen },
    intro: { screen: IntroScreen },
    home: { screen: HomeScreen },
    login: { screen: LoginScreen },
    forgotPassword: { screen: ForgotPasswordScreen },
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
    profile: {screen: ProfileScreen}
}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null
        },
        mode: Platform.OS == 'ios' ? 'modal' : 'card'
    }
);

export { RootNavigator };