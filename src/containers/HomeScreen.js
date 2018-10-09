import React, { Component, PropTypes } from 'react';
import { Text, StatusBar, View, Image, StyleSheet, TouchableOpacity, Dimensions, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import redux from '@redux-store';
import ScalingDrawer from 'mainam-react-native-scaling-drawer';
import DrawerContent from '@components/DrawerContent';
import Home from '@containers/home/tab/Home';
import TabSearch from '@containers/home/tab/TabSearch';
import Swiper from 'react-native-swiper';
let defaultScalingDrawerConfig = {
	scalingFactor: 0.7,
	minimizeFactor: 0.7,
	swipeOffset: 20
};
class SplashScreen extends Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		this.props.dispatch({ type: constants.action.create_navigation_global, value: this.props.navigation });
	}
	componentDidMount() {
		DeviceEventEmitter.removeAllListeners('hardwareBackPress')
		DeviceEventEmitter.addListener('hardwareBackPress', this.handleHardwareBack.bind(this));
	}

	componentWillUnmount() {
		DeviceEventEmitter.removeAllListeners('hardwareBackPress')
	}

	handleHardwareBack = () => {
		this.props.navigation.pop();
		return true;
	}

	render() {
		return (
			<ScalingDrawer
				ref={ref => this._drawer = ref}
				content={<DrawerContent navigation={this.props.navigation} drawer={this._drawer} />}
				{...defaultScalingDrawerConfig}
			>
				<Swiper
					dot={<View />}
					activeDot={<View />}
					paginationStyle={{
						bottom: 30
					}}
					loop={true}>
					<Home navigation={this.props.navigation} style={{ flex: 1 }} drawer={this._drawer} />
					{/* <TabSearch navigation={this.props.navigation} style={{ flex: 1 }} drawer={this._drawer} /> */}
				</Swiper>
			</ScalingDrawer >);
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