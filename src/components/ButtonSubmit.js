import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dimensions from 'Dimensions';
import {
	StyleSheet,
	TouchableOpacity,
	Text,
	Animated,
	Easing,
	Image,
	Alert,
	View,
} from 'react-native';

import spinner from '@images/loading.gif';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 42;

export default class ButtonSubmit extends Component {
	constructor() {
		super();

		this.state = {
			isLoading: false,
		};

		this.buttonAnimated = new Animated.Value(0);
		this.growAnimated = new Animated.Value(0);
		this.onPress = this.onPress.bind(this);
	}
	componentWillUnmount() {
		this.props.onRef(undefined)
	}
	componentDidMount() {
		this.props.onRef(this)
	}
	unPress() {
		// Actions.secondScreen();
		this.setState({ isLoading: false });
		this.buttonAnimated.setValue(0);
		this.growAnimated.setValue(0);
	}
	onPress() {
		// if (this.state.isLoading) return;

		this.setState({ isLoading: true });
		Animated.timing(
			this.buttonAnimated,
			{
				toValue: 1,
				duration: 200,
				easing: Easing.linear
			}
		).start();

		this.props.click();

		setTimeout(() => {
			this._onGrow();
		}, 2000);
	}

	_onGrow() {
		Animated.timing(
			this.growAnimated,
			{
				toValue: 1,
				duration: 200,
				easing: Easing.linear
			}
		).start();
	}

	render() {
		const changeWidth = this.buttonAnimated.interpolate({
			inputRange: [0, 1],
			outputRange: [DEVICE_WIDTH - MARGIN, MARGIN]
		});
		const changeScale = this.growAnimated.interpolate({
			inputRange: [0, 1],
			outputRange: [1, MARGIN]
		});

		return (
			<View style={[styles.container, this.props.style]}>
				<Animated.View>
					<TouchableOpacity style={styles.button}
						onPress={this.onPress}
						activeOpacity={1} >
						{this.state.isLoading ?
							<View style={{ paddingLeft: 15, paddingRight: 15 }}>
								<Image source={spinner} style={styles.image} />
							</View>
							:
							<Text style={styles.text}>{this.props.text}</Text>
						}
					</TouchableOpacity>
				</Animated.View>
			</ View>
		);
	}
}

ButtonSubmit.propTypes = {
	click: PropTypes.func,
	text: PropTypes.string
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#00796b',
		height: MARGIN,
		borderRadius: 5,
		zIndex: 100,
	},
	circle: {
		height: MARGIN,
		width: MARGIN,
		marginTop: -MARGIN,
		borderWidth: 1,
		borderColor: '#F035E0',
		borderRadius: 100,
		alignSelf: 'center',
		zIndex: 99,
		backgroundColor: '#F035E0',
	},
	text: {
		width: Dimensions.get('window').width - 40,
		maxWidth: 300,
		textAlign: 'center',
		color: 'white',
		fontWeight: 'bold',
		backgroundColor: 'transparent',
	},
	image: {
		width: 35,
		height: 35,
	},
});