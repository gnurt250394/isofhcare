import { StackRouter, createStackNavigator, StackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import EhealthScreen from '@containers/ehealth/EhealthScreen';
import ListProfileScreen from '@containers/ehealth/ListProfileScreen';

const EHealthNavigator = createStackNavigator({
    ehealth: { screen: EhealthScreen },
    listProfile: { screen: ListProfileScreen }
}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null
        },
        mode: Platform.OS == 'ios' ? 'modal' : 'card'
    });

export { EHealthNavigator };