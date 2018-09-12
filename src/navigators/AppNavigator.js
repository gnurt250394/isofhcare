import { StackRouter, StackNavigator } from 'react-navigation';

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
import IntroScreen from '@containers/intro/IntroScreen';

const RootNavigator = StackNavigator({
    intro: { screen: IntroScreen},
    splash: { screen: SplashScreen },
    
    home: { screen: HomeScreen },
    login: { screen: LoginScreen },
    forgotPassword: { screen: ForgotPasswordScreen },
    register: { screen: RegisterScreen },
    searchFacility: { screen: SearchFacilityScreen },
    searchFacilityResult: { screen: SearchFacilityResultScreen },
    searchFacilityByLocation: { screen: SearchByLocationScreen },
    searchDrug: { screen: SearchDrugScreen },
    searchDrugResult: { screen: SearchDrugResultScreen },
    searchDisease : { screen: SearchDiseaseScreen},
    diseaseDetail : { screen: DiseaseDetailScreen},
    drugDetailScreen: { screen: DrugDetailScreen },
    facilityDetailScreen: { screen: FacilityDetailScreen },
    myFacility: { screen: MyFacilityScreen },
    addNewDrugStore: { screen: AddNewDrugStoreScreen },
    addNewClinic: { screen: AddNewClinicScreen },
    photoViewer: { screen: PhotoViewerScreen },
}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null
        }
    }
);

export { RootNavigator };