import { StackRouter, createStackNavigator, StackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import EhealthScreen from '@containers/ehealth/EhealthScreen';
import ListProfileScreen from '@containers/ehealth/ListProfileScreen';
import ViewInMonthScreen from '@containers/ehealth/ViewInMonthScreen';
import { EhealthDHYNavigation } from '@ehealth/daihocy/navigator';

const EHealthNavigator = createStackNavigator({
    ehealth: { screen: EhealthScreen },
    listProfile: { screen: ListProfileScreen },
    viewInMonth: { screen: ViewInMonthScreen },
    ehealthDHY: { screen: EhealthDHYNavigation },

}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null
        },
        mode: Platform.OS == 'ios' ? 'modal' : 'card'
    });

export { EHealthNavigator };