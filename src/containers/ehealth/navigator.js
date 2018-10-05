import { StackRouter, createStackNavigator, StackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import EhealthScreen from '@containers/ehealth/EhealthScreen';
import { EhealthDHYNavigation } from '@ehealth/daihocy/navigator';
const EHealthNavigator = createStackNavigator({
    ehealth: { screen: EhealthScreen },
    ehealthDHY: { screen: EhealthDHYNavigation }
}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null
        },
        mode: Platform.OS == 'ios' ? 'modal' : 'card'
    });

export { EHealthNavigator };