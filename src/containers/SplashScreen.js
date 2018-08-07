import React, { Component, PropTypes } from 'react';
import { Text, StatusBar, View, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import redux from '@redux-store';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';

class SplashScreen extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		console.disableYellowBox = true;
		userProvider.getAccountStorage((s) => {
			setTimeout(() => {
				if (s) {
					this.props.dispatch(redux.userLogin(s));
					// Actions.home();
				}
				else {
					// this.props.dispatch(redux.userLogout(s));
					// Actions.login({ type: 'replace' });
				}
			}, 2000);
		});
	}

	render() {
		return (
			<ActivityPanel style={{ flex: 1 }} touchToDismiss={true} hideActionbar={true} hideStatusbar={true} showFullScreen={true}>
				<View style={{ position: 'relative', flex: 1 }}>
					<Image source={require('@images/bg_login.png')} style={styles.picture} />
					<View style={[{ justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
						<ScaleImage source={require("@images/logo.png")} width={120} />
					</View>
					<View style={{
						margin: 10, justifyContent: 'center',
						alignItems: 'center',
						padding: 10
					}}>
						<ScaleImage source={require("@images/copyright.png")} height={15} style={{
						}} />
					</View>
				</View>
			</ActivityPanel >
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