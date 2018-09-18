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
import redux from '@redux-store';
import ScaleImage from 'mainam-react-native-scaleimage';
import SocialNetwork from '@components/LoginSocial';

class LoginScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showPass: true,
			press: false,
			email: "",
			password: ""
		}
		this.showPass = this.showPass.bind(this);
	}
	showPass() {
		this.state.press === false ? this.setState({ showPass: false, press: true }) : this.setState({ showPass: true, press: false });
	}


	login() {
		Keyboard.dismiss();
		if (this.state.email.trim() === "" || this.state.email === "" || this.state.password === "") {
			snackbar.showShort(constants.msg.user.please_input_username_and_password);
			this.child.unPress();
			return;
		}

		userProvider.login(this.state.email.trim(), this.state.password, (s, e) => {
			this.child.unPress();
			if (s) {
				switch (s.code) {
					case 0:
						var user = s.data.user;
						// if (user.role == 4) {
						// 	snackbar.show(constants.msg.user.please_login_on_web_to_management);
						// 	return;
						// }
						snackbar.show(constants.msg.user.login_success, 'success');
						this.props.dispatch(redux.userLogin(user));
						this.props.navigation.navigate('home');
						return;
					case 4:
					snackbar.show(constants.msg.user.this_account_not_active, 'danger');
					return;
					case 3:
						snackbar.show(constants.msg.user.username_or_password_incorrect, 'danger');
						return;
					case 2:
					case 1:
						snackbar.show(constants.msg.user.account_blocked, 'danger');
						return;
				}

			}
			if (e) {
				console.log(e);
			}
			snackbar.show(constants.msg.error_occur);
		});
	}

	render() {
		return (
			<ActivityPanel style={{ flex: 1 }} title="Đăng nhập" touchToDismiss={true} hideActionbar={true} hideStatusbar={true} showFullScreen={true}>
				<ScrollView style={{ flex: 1 }}
					keyboardShouldPersistTaps="always">
					<View style={{ marginTop: 60, justifyContent: 'center', alignItems: 'center' }}>
						<ScaleImage source={require("@images/logo.png")} width={120} />
					</View>
					<KeyboardAvoidingView behavior='padding'
						style={styles.form}>
						<UserInput onTextChange={(s) => this.setState({ email: s })}
							placeholder={constants.input_username_or_email}
							autoCapitalize={'none'}
							returnKeyType={'next'}
							autoCorrect={false} />
						<View style={{ marginTop: 15, flex: 1 }}>

							<UserInput
								onTextChange={(s) => this.setState({ password: s })}
								secureTextEntry={this.state.showPass}
								placeholder={constants.input_password}
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
						<View style={{ width: DEVICE_WIDTH, maxWidth: 300 }}>
							<TouchableOpacity onPress={() => { this.props.navigation.replace("forgotPassword") }} style={{ alignItems: 'flex-end' }}>
								<Text style={{ marginTop: 12, color: 'rgb(49,96,172)' }}>Quên mật khẩu</Text>
							</TouchableOpacity>
						</View>
						<ButtonSubmit onRef={ref => (this.child = ref)} click={() => { this.login() }} text={constants.login} />
						<View style={{ width: DEVICE_WIDTH, maxWidth: 300 }}>
							<TouchableOpacity onPress={() => { this.props.navigation.replace("register") }} style={{ alignItems: 'flex-end' }}>
								<Text style={{ marginTop: 15, color: 'rgb(155,155,155)', lineHeight: 20, fontSize: 16 }}>Nếu bạn chưa có tài khoản hãy đăng ký ngay <Text style={{ fontWeight: 'bold', color: 'rgb(0,151,124)' }}>tại đây</Text></Text>
							</TouchableOpacity>
						</View>
						<SocialNetwork />
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
export default connect(mapStateToProps)(LoginScreen);