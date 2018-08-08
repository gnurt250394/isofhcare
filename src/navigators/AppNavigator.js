import { StackRouter, StackNavigator } from 'react-navigation';

import LoginScreen from '@containers/account/LoginScreen';
import SplashScreen from '@containers/SplashScreen';
import HomeScreen from '@containers/HomeScreen';


const RootNavigator = StackNavigator({
    splash: { screen: SplashScreen },
    home: { screen: HomeScreen },
    login: { screen: LoginScreen },
}, {
        headerMode: 'none',
        header: null,
        navigationOptions: {
            header: null
        }
    }
);

export { RootNavigator };