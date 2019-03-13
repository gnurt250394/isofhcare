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
const { width, height } = Dimensions.get('window');
import PushController from '@components/notification/PushController'
import ActivityPanel from '@components/ActivityPanel';
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
				frontStyle={{ height: height + 10 }}
				content={<DrawerContent navigation={this.props.navigation} drawer={this._drawer} />}
				{...defaultScalingDrawerConfig}
			>
				<ActivityPanel
					style={[{ flex: 1 }, this.props.style]}
					titleStyle={{ marginRight: 60 }}
					imageStyle={{ marginRight: 50 }}
					image={require("@images/logo_home.png")}
					icBack={require("@images/icmenu.png")}
					backButtonClick={() => { this._drawer.open() }}
					// showMessenger={this.props.userApp.isLogin ? true : false}
					showMessenger={false}
					badge={0}>
					<Swiper
						ref={ref => this.swiper = ref}
						onIndexChanged={index => {
							this.setState({ tabIndex: index });
						}}
						dot={<View />}
						activeDot={<View />}
						paginationStyle={{
							bottom: 30
						}}
						loop={false}
						style={{ flex: 1 }}
					>
						<Home navigation={this.props.navigation} style={{ flex: 1 }} drawer={this._drawer} />
						<View style={{ flex: 1, backgroundColor: '#000' }} />
						<View style={{ flex: 1, backgroundColor: '#cac' }} />
						<View style={{ flex: 1, backgroundColor: '#aba' }} />

						{/* <TabSearch navigation={this.props.navigation} style={{ flex: 1 }} drawer={this._drawer} /> */}
					</Swiper>
					<View style={{ height: 50, flexDirection: 'row' }} >
						<TouchableOpacity style={{ flex: 1 }} onPress={this.swipe.bind(this, 0)}>
							<Text style={{ textAlign: 'center' }}>Home</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1 }} onPress={this.swipe.bind(this, 1)}>
							<Text style={{ textAlign: 'center' }}>Lịch khám</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1 }} onPress={this.swipe.bind(this, 2)}>
							<Text style={{ textAlign: 'center' }}>Dịch vụ</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1 }} onPress={this.swipe.bind(this, 3)}>
							<Text style={{ textAlign: 'center' }}>Tài khoản</Text>
						</TouchableOpacity>
					</View>
					<PushController />
				</ActivityPanel>
			</ScalingDrawer>);
	}
	swipe(targetIndex) {
		const currentIndex = this.swiper.state.index;
		const offset = targetIndex - currentIndex;
		this.swiper.scrollBy(offset);
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