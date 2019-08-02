import React, { Component, PropTypes } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import userProvider from '@data-access/user-provider';
import appProvider from '@data-access/app-provider';
import constants from '@resources/strings';
import redux from '@redux-store';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import { StackActions, NavigationActions } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
MyScaleImage = Animatable.createAnimatableComponent(ScaleImage);
const resetAction = (route) => {
	return StackActions.reset({
		index: 0,
		actions: [NavigationActions.navigate({ routeName: route })],
	})
};

import dataCache from '@data-access/datacache-provider';
class SplashScreen extends Component {
	constructor(props) {
		super(props);
		this.Actions = this.props.navigation;
	}
	componentDidMount() {
		this.props.dispatch({
			type: constants.action.create_navigation_global,
			value: this.props.navigation
		});

		console.disableYellowBox = true;
		console.reportErrorsAsExceptions = false;
		appProvider.setActiveApp();
		// this.Actions.navigate('home')
		// setTimeout(() => {
		// 	this.Actions.dispatch(StackActions.reset({
		// 		index: 0,
		// 		actions: [NavigationActions.navigate({ routeName: "home" })],
		// 	}));
		// }, 3000);
		userProvider.getAccountStorage((s) => {
			setTimeout(() => {
				if (s) {
					// s.id = "55";
					this.props.dispatch(redux.userLogin(s));
				}
				else {
					this.props.dispatch(redux.userLogout());
				}
				dataCache.read("", constants.key.storage.INTRO_FINISHED, (s) => {
					this.Actions.dispatch(StackActions.reset({
						index: 0,
						actions: [NavigationActions.navigate({ routeName: s && JSON.stringify(s) != "{}" ? "home" : "intro" })],
					}));

				});

			}, 2000);
		});
	}

	render() {
		return (
			<ActivityPanel style={{ flex: 1 }} hideActionbar={true} hideStatusbar={true} showFullScreen={true}>
				<View style={{ position: 'relative', flex: 1 }}>
					<View style={[{ justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
						<MyScaleImage animation="rubberBand" delay={500} duration={3000} source={require("@images/logo.png")} width={120} />
					</View>

					<View style={{
						margin: 10, justifyContent: 'center',
						alignItems: 'center',
						padding: 10
					}}>
						<ScaleImage source={require("@images/new/copyright.png")} height={20} style={{
						}} />
					</View>

				</View>
			</ActivityPanel>
		);
	}
}

const styles = StyleSheet.create({
	picture: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		width: null,
		height: null,
		resizeMode: 'cover',
	},
});

function mapStateToProps(state) {
	return {
		userApp: state.userApp
	};
}
export default connect(mapStateToProps)(SplashScreen);