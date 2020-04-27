import React, { Component, PropTypes } from 'react';
import { View, Image, StyleSheet, TouchableOpacity,StatusBar } from 'react-native';
import { connect } from 'react-redux';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import redux from '@redux-store';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import { StackActions, NavigationActions } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import snackbar from "@utils/snackbar-utils";
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

		// dataCache.read("", constants.key.storage.KEY_HAS_UPDATE_NEW_VERSION, (s) => {
		// 	dataCache.save("", constants.key.storage.KEY_HAS_UPDATE_NEW_VERSION, 0);
		// 	if (s == 1) {
		// 		snackbar.show("Ứng dụng của bạn vừa được cập nhật", "success");
		// 	}
		// });

		userProvider.getAccountStorage((s) => {
			setTimeout(() => {
				if (s) {
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
			<ActivityPanel style={styles.flex} hideActionbar={true} hideStatusbar={true} showFullScreen={true} showBackgroundHeader={false}>
				<StatusBar translucent={true} backgroundColor='transparent'/>
				<View style={styles.container}>
					<View style={[styles.containerLogo]}>
						<MyScaleImage animation="rubberBand" delay={500} duration={3000} source={require("@images/logo.png")} width={120} />
					</View>

					<View style={styles.containerCopyRight}>
						<ScaleImage source={require("@images/new/copyright.png")} height={20} style={{
						}} />
					</View>

				</View>
			</ActivityPanel>
		);
	}
}

const styles = StyleSheet.create({
	containerCopyRight: {
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
	},
	containerLogo: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	container: {
		position: 'relative',
		flex: 1
	},
	flex: {
		flex: 1
	},
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
		userApp: state.auth.userApp
	};
}
export default connect(mapStateToProps)(SplashScreen);