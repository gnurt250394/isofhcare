import { StackRouter, StackNavigator } from 'react-navigation';

import LoginScreen from '@containers/account/LoginScreen';
import SplashScreen from '@containers/SplashScreen';
import HomeScreen from '@containers/HomeScreen';
import SearchDrugScreen from '@containers/drug/SearchDrugScreen';
import SearchFacilityScreen from '@containers/facility/SearchFacilityScreen';
import SearchFacilityResultScreen from '@containers/facility/SearchFacilityResultScreen';
import SearchByLocationScreen from '@containers/facility/SearchByLocationScreen';
import SearchDrugResultScreen from '@containers/drug/SearchDrugResultScreen';
import DrugDetailScreen from '@containers/drug/DrugDetailScreen';


const RootNavigator = StackNavigator({
    splash: { screen: SplashScreen },
    home: { screen: HomeScreen },
    login: { screen: LoginScreen },
    searchFacility: { screen: SearchFacilityScreen },
    searchFacilityResult: { screen: SearchFacilityResultScreen },
    searchFacilityByLocation: { screen: SearchByLocationScreen },
    searchDrug: { screen: SearchDrugScreen },
    searchDrugResult: { screen: SearchDrugResultScreen },
    drugDetailScreen: { screen: DrugDetailScreen },
}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null
        }
    }
);

export { RootNavigator };