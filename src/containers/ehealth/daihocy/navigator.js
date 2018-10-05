import { StackRouter, createStackNavigator, StackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import DetailBookingScreen from '@ehealth/daihocy/containers/DetailBookingScreen';
const EhealthDHYNavigation = createStackNavigator({
    detailBooking: { screen: DetailBookingScreen }
}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null
        },
        mode: Platform.OS == 'ios' ? 'modal' : 'card'
    });

export { EhealthDHYNavigation };