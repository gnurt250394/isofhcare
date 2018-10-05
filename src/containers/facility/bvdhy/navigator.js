import { createStackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import AddBookingScreen from '@dhy/containers/AddBookingScreen'
import BookingScreen from '@dhy/containers/BookingScreen'
import SelectDoctorScreen from '@dhy/containers/SelectDoctorScreen'
import SelectSpecialistScreen from '@dhy/containers/SelectSpecialistScreen'
import ViewScheduleDoctorScreen from '@dhy/containers/ViewScheduleDoctorScreen'

const BookingDHYNavigation = createStackNavigator({
    dhyBooking: {screen: BookingScreen},
    dhyAddBooking: {screen: AddBookingScreen},
    dhySelectDoctor: {screen: SelectDoctorScreen},
    dhySelectSpeciaList: {screen: SelectSpecialistScreen},
    dhyViewScheduleDoctor: {screen: ViewScheduleDoctorScreen},

}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null
        },
        mode: Platform.OS == 'ios' ? 'modal' : 'card'
    });

export { BookingDHYNavigation };