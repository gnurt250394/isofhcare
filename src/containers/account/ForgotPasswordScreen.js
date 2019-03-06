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

class ForgotPasswordScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			press: false,
			email: ""
		}
	}


	forgotPassword() {
		Keyboard.dismiss();
		if (this.state.email.trim() === "" || this.state.email === "") {
			snackbar.showShort(constants.msg.user.please_input_email_or_phone, 'danger');
			this.child.unPress();
			return;
		}
		if (!this.state.email.isEmail() && !this.state.email.isPhoneNumber()) {
			snackbar.showShort(constants.msg.user.please_input_correct_email_or_phone, 'danger');
			this.child.unPress();
			return;
		}
		let type = this.state.email.isEmail() ? 1 : 2;

		userProvider.forgotPassword(this.state.email.trim(), type, (s, e) => {
			this.child.unPress();
			if (s) {
				// snackbar.show("Thông tin đăng nhập không hợp lệ");
				// return;
				switch (s.code) {
					case 2:
						snackbar.show(constants.msg.user.not_found_user_with_email_or_phone, 'danger');
						return;
					case 0:
						if (s.data && s.data.status == 1) {
							// if (type == 2) {
							snackbar.show(constants.msg.user.send_sms_recovery_success, 'success');
							this.props.navigation.replace("confirmCode", { phone: this.state.email });
							// }
							// else
							// {
							// 	snackbar.show(constants.msg.user.send_mail_recovery_success, 'success');
							// 	this.props.navigation.replace("login", { phone: this.state.email });
							// }
							return;
						} else {
							snackbar.show(constants.msg.user.not_found_user_with_email_or_phone, 'danger');
						}
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
			<ActivityPanel style={{ flex: 1 }} title="Quên mật khẩu" touchToDismiss={true}>
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

						<ButtonSubmit onRef={ref => (this.child = ref)} click={() => { this.forgotPassword() }} text={constants.send} />
						<View style={{ width: DEVICE_WIDTH, maxWidth: 300 }}>
							<TouchableOpacity onPress={() => { this.props.navigation.replace("register") }} style={{ alignItems: 'flex-end' }}>
								<Text style={{ marginTop: 15, color: 'rgb(155,155,155)', lineHeight: 20, fontSize: 16 }}>Nếu bạn chưa có tài khoản hãy đăng ký ngay <Text style={{ fontWeight: 'bold', color: 'rgb(0,151,124)' }}>tại đây</Text></Text>
							</TouchableOpacity>
						</View>
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
export default connect(mapStateToProps)(ForgotPasswordScreen);