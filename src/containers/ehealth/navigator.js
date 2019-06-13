import { StackRouter, createStackNavigator, StackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import EhealthScreen from '@containers/ehealth/EhealthScreen';
import ListProfileScreen from '@containers/ehealth/ListProfileScreen';
import ViewInMonthScreen from '@containers/ehealth/ViewInMonthScreen';
import ViewInDayScreen from '@containers/ehealth/ViewInDayScreen';
import ViewEhealthDetailScreen from '@containers/ehealth/ViewEhealthDetailScreen';
import SearchProfileScreen from '@containers/ehealth/SearchProfileScreen';


const EHealthNavigator = createStackNavigator({
    ehealth: { screen: EhealthScreen },
    listProfile: { screen: ListProfileScreen },
    viewInMonth: { screen: ViewInMonthScreen },
    viewInDay: { screen: ViewInDayScreen },
    viewDetail: { screen: ViewEhealthDetailScreen },
    searchProfile: { screen: SearchProfileScreen },

    
}, {
        headerMode: 'none',
        header: null,
        gesturesEnabled: false,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        },
        mode: Platform.OS == 'ios' ? 'modal' : 'card'
    });

export { EHealthNavigator };