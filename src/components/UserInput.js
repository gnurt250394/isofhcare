import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {
	StyleSheet,
	View,
	TextInput,
	Image,
} from 'react-native';

export default class UserInput extends Component {
	render() {
		return (
			<View style={[styles.inputWrapper, this.props.style]}>
				<TextInput style={styles.input}
					keyboardType={this.props.keyboardType}
					onChangeText={this.props.onTextChange}
					placeholder={this.props.placeholder}
					secureTextEntry={this.props.secureTextEntry}
					autoCorrect={this.props.autoCorrect}
					autoCapitalize={this.props.autoCapitalize}
					returnKeyType={this.props.returnKeyType}
					value={this.props.value}
					placeholderTextColor='#c0c0c0'
					underlineColorAndroid='transparent' />
			</View>
		);
	}
}

UserInput.propTypes = {
	keyboardType: PropTypes.string,
	onTextChange: PropTypes.func,
	placeholder: PropTypes.string.isRequired,
	secureTextEntry: PropTypes.bool,
	autoCorrect: PropTypes.bool,
	autoCapitalize: PropTypes.string,
	returnKeyType: PropTypes.string,
	value: PropTypes.string,
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
	input: {
		maxWidth: 300,
		paddingRight: 30,
		backgroundColor: '#FFF',
		width: DEVICE_WIDTH - 40,
		height: 42,
		marginHorizontal: 20,
		paddingLeft: 15,
		borderRadius: 6,
		color: '#006ac6',
		borderWidth: 1,
		borderColor: 'rgba(155,155,155,0.7)'
	},
	inputWrapper: {
		flex: 1,
	},
	inlineImg: {
		position: 'absolute',
		zIndex: 99,
		width: 20,
		height: 20,
		left: 35,
		top: 9,
	},
});