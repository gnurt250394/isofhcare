import AddBookingScreen from '@dhy/containers/AddBookingScreen'
import BookingScreen from '@dhy/containers/BookingScreen'
import SelectDoctorScreen from '@dhy/containers/SelectDoctorScreen'
import SelectSpecialistScreen from '@dhy/containers/SelectSpecialistScreen'
import ViewScheduleDoctorScreen from '@dhy/containers/ViewScheduleDoctorScreen'

const CustomRouter = createStackNavigator({
    Home: { screen: MyHomeScreen },
    Settings: { screen: MySettingsScreen },
});