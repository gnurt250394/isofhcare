import React, { Component, PropTypes } from 'react';
import { Text, StatusBar, View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import redux from '@redux-store';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import ScalingDrawer from 'react-native-scaling-drawer';
import DrawerContent from '@components/DrawerContent';
import { IndicatorViewPager } from 'mainam-react-native-viewpager';
import TabSearch from '@containers/home/tab/TabSearch';
const { width, height } = Dimensions.get('window');

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
		console.disableYellowBox = true;
		this.props.dispatch({ type: constants.action.create_navigation_global, value: this.props.navigation });
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
			<ScalingDrawer
				// frontStyle={{}}
				// contentWrapperStyle={{}}
				// swipeOffset={defaultScalingDrawerConfig.swipeOffset}
				ref={ref => this._drawer = ref}
				content={<DrawerContent navigation={this.props.navigation} drawer={this._drawer} />}
				{...defaultScalingDrawerConfig}
			>
				<IndicatorViewPager ref={(viewPager) => { this.viewPager = viewPager }} style={{
					flex: 1, backgroundColor: "#000", width, height
				}}>
					< TabSearch navigation={this.props.navigation} style={{ width, height }} drawer={this._drawer} />
					<TabSearch navigation={this.props.navigation} style={{ width, height }} drawer={this._drawer} />
				</IndicatorViewPager>


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