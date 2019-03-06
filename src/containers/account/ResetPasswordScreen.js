import React, { Component, PropTypes } from 'react';
import UserInput from '@components/UserInput';
import ActivityPanel from '@components/ActivityPanel';
import ButtonSubmit from '@components/ButtonSubmit';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, Image, Platform, Keyboard } from 'react-native';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import eyeImg from '@images/eye_black.png';
import snackbar from '@utils/snackbar-utils';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import stringUtils from 'mainam-react-native-string-utils';
import redux from '@redux-store';
import ScaleImage from 'mainam-react-native-scaleimage';

class ResetPasswordScreen extends Component {
	constructor(props) {
		super(props)
		let userId = this.props.navigation.getParam("id", null);
		if (!userId)
			this.props.navigation.pop();

		this.state = {
			press: false,
			code: "",
			showPass: true,
			showPassConfirm: true,
			userId
		}
		this.showPass = this.showPass.bind(this);
		this.showPassConfirm = this.showPassConfirm.bind(this);
	}
	showPass() {
		this.state.press === false ? this.setState({ showPass: false, press: true }) : this.setState({ showPass: true, press: false });
	}
	showPassConfirm() {
		this.state.pressConfirm === false ? this.setState({ showPassConfirm: false, pressConfirm: true }) : this.setState({ showPassConfirm: true, pressConfirm: false });
	}

	changePassword() {
		Keyboard.dismiss();

		if (!this.state.password) {
			snackbar.show(constants.msg.user.please_input_password);
			this.child.unPress();
			return;
		}
		if (this.state.password.length < 6) {
			snackbar.show(constants.msg.user.password_must_greater_than_6_character);
			this.child.unPress();
			return;
		}


		if (!this.state.confirm_password) {
			snackbar.show(constants.msg.user.please_input_confirm_password);
			this.child.unPress();
			return;
		}
		if (this.state.password != this.state.confirm_password) {
			snackbar.show(constants.msg.user.confirm_password_is_not_match);
			this.child.unPress();
			return;
		}

		userProvider.changePassword(this.state.userId, this.state.password, (s, e) => {
			this.child.unPress();
			if (s) {
				switch (s.code) {
					case 0:
						snackbar.show(constants.msg.user.change_password_success, 'success');
						this.props.navigation.replace('login');
						return;
				}

			}
			if (e) {
				console.log(e);
			}
			snackbar.show(constants.msg.user.change_password_not_success, 'danger');
		});
	}


	render() {
		return (
			<ActivityPanel style={{ flex: 1 }} touchToDismiss={true} title="Đổi mật khẩu" >
				<ScrollView style={{ flex: 1 }}
					keyboardShouldPersistTaps="always">
					<View style={{ marginTop: 60, justifyContent: 'center', alignItems: 'center' }}>
						<ScaleImage source={require("@images/logo.png")} width={120} />
					</View>
					<KeyboardAvoidingView behavior='padding'
						style={styles.form}>
						<View style={{ marginTop: 12, flex: 1 }}>

							<UserInput
								onTextChange={(s) => this.setState({ password: s })}
								secureTextEntry={this.state.showPass}
								placeholder={constants.msg.user.new_password}
								returnKeyType={'done'}
								autoCapitalize={'none'}
								autoCorrect={false} />

							<TouchableOpacity
								activeOpacity={0.7}
								style={styles.btnEye}
								onPress={this.showPass}>
								<Image source={eyeImg} style={styles.iconEye} />
							</TouchableOpacity>

						</View>

						<View style={{ marginTop: 12, flex: 1 }}>

							<UserInput
								onTextChange={(s) => this.setState({ confirm_password: s })}
								secureTextEntry={this.state.showPassConfirm}
								placeholder={constants.msg.user.confirm_new_password}
								returnKeyType={'done'}
								autoCapitalize={'none'}
								autoCorrect={false} />

							<TouchableOpacity
								activeOpacity={0.7}
								style={styles.btnEye}
								onPress={this.showPassConfirm}>
								<Image source={eyeImg} style={styles.iconEye} />
							</TouchableOpacity>

						</View>

						<ButtonSubmit onRef={ref => (this.child = ref)}
							click={() => { this.changePassword() }} text={constants.change_password} />
					</KeyboardAvoidingView>


				</ScrollView >
			</ActivityPanel >
		);
	}
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
	form: {
		marginTop: 60,
		alignItems: 'center',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		backgroundColor: 'transparent',
	},
	signup_section: {
		marginTop: 30,
		flex: 1,
		width: DEVICE_WIDTH,
		flexDirection: 'row',
		justifyContent: 'space-around',
	}, btnEye: {
		position: 'absolute',
		right: 25,
		top: 10
	},
	iconEye: {
		width: 25,
		height: 25,
		tintColor: 'rgba(0,0,0,0.2)',
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
		userApp: state.userApp
	};
}
export default connect(mapStateToProps)(ResetPasswordScreen);