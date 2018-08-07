import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
  } from 'react-navigation-redux-helpers';

import LoginScreen from '@containers/account/LoginScreen';
import SplashScreen from '@containers/SplashScreen';
import HomeScreen from '@containers/conference/HomeScreen';

const middleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
  );
  

const RootNavigator = createStackNavigator({
    splash: { screen: SplashScreen },
    login: { screen: LoginScreen },
    home: { screen: HomeScreen },
});

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
    state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export { RootNavigator, AppNavigator, middleware };