import { StackRouter,StackNavigator } from 'react-navigation';

import LoginScreen from '@containers/account/LoginScreen';
import SplashScreen from '@containers/SplashScreen';
import HomeScreen from '@containers/conference/HomeScreen';


const RootNavigator = StackNavigator({
    splash: { screen: SplashScreen },
    login: { screen: LoginScreen },
    home: { screen: HomeScreen },
}, {
    headerMode: 'none',
    header: null,
    navigationOptions: {
      header: null
    }
    }
);

export { RootNavigator };