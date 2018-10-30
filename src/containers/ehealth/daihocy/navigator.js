import { StackRouter, createStackNavigator, StackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import DetailBookingScreen from '@ehealth/daihocy/containers/DetailBookingScreen';
import BookingResultScreen from '@ehealth/daihocy/containers/BookingResultScreen';
import BookingMedicalTestResultScreen from '@ehealth/daihocy/containers/BookingMedicalTestResultScreen';
// import BookingCheckupResultScreen from '@ehealth/daihocy/containers/BookingCheckupResultScreen';
import BookingCheckupResultScreen from '@ehealth/daihocy/containers/BookingResultSwiperScreen';
import BookingSurgeryResultScreen from '@ehealth/daihocy/containers/BookingSurgeryResultScreen';
import BookingDiagnosticResultScreen from '@ehealth/daihocy/containers/BookingDiagnosticResultScreen';
const EhealthDHYNavigation = createStackNavigator({
    detailBooking: { screen: DetailBookingScreen },
    viewBookingResult: { screen: BookingResultScreen },
    bookingMedicalTestResult: { screen: BookingMedicalTestResultScreen },
    bookingCheckupResult: { screen: BookingCheckupResultScreen },
    bookingSurgeryResult: { screen: BookingSurgeryResultScreen },
    bookingDiagnosticResult: { screen: BookingDiagnosticResultScreen }
}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null
        },
        mode: Platform.OS == 'ios' ? 'modal' : 'card'
    });

export { EhealthDHYNavigation };