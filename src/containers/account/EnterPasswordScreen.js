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
import stringUtils from 'mainam-react-native-string-utils';
import dateUtils from 'mainam-react-native-date-utils';
import Form from '@components/form/Form';
import TextField from '@components/form/TextField';

class EnterPasswordScreen extends Component {

	constructor(props) {
		super(props)
		var user = this.props.navigation.getParam("user", null);
		user.showPass = true;
		user.showPassConfirm = true;
		user.press = false;
		user.pressConfirm = false;
		this.state = user;
		this.showPass = this.showPass.bind(this);
		this.showPassConfirm = this.showPassConfirm.bind(this);
	}
	setDate(newDate) {
		this.setState({ dob: newDate });
	}
	showPass() {
		this.state.press === false ? this.setState({ showPass: false, press: true }) : this.setState({ showPass: true, press: false });
	}
	showPassConfirm() {
		this.state.pressConfirm === false ? this.setState({ showPassConfirm: false, pressConfirm: true }) : this.setState({ showPassConfirm: true, pressConfirm: false });
	}


	register() {
		Keyboard.dismiss();

		if (!this.state.password) {
			snackbar.showShort(constants.msg.user.please_input_password, "danger");
			this.child.unPress();
			return;
		}
		if (this.state.password.length < 8) {
			snackbar.showShort("Mật khẩu cần nhiều hơn 8 ký tự", "danger");
			this.child.unPress();
			return;
		}

		var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
		if (!re.test(this.state.password)) {
			snackbar.showShort(constants.msg.user.password_require_uppercase_lowercase_number_special_character, "danger");
			this.child.unPress();
			return;
		}

		if (!this.state.confirm_password) {
			snackbar.showShort(constants.msg.user.please_input_confirm_password, "danger");
			this.child.unPress();
			return;
		}
		if (this.state.password != this.state.confirm_password) {
			snackbar.showShort(constants.msg.user.confirm_password_is_not_match, "danger");
			this.child.unPress();
			return;
		}

		userProvider.register(
			this.state.fullname.trim(),
			this.state.avatar,
			this.state.email.trim(),
			this.state.phone.trim(),
			this.state.password,
			this.state.dob ?
				this.state.dob.format("yyyy-MM-dd HH:mm:ss") : null,
			this.state.gender,
			this.state.token,
			this.state.socialType,
			this.state.socialId
		).then(s => {
			this.child.unPress();
			switch (s.code) {
				case 0:
					var user = s.data.user;
					this.props.dispatch(redux.userLogin(user));
					this.props.navigation.navigate('home', { showDraw: false });
					return;
				case 2:
					snackbar.show(constants.msg.user.username_or_email_existed, "danger");
					return;
				case 3:
				case 1:
					snackbar.show(constants.msg.user.account_blocked, "danger");
					return;
			}
		}).catch(e => {
			this.child.unPress();
			snackbar.show(constants.msg.error_occur);
		});
	}


	render() {
		return (
			<ActivityPanel style={{ flex: 1 }} title="Nhập mật khẩu" touchToDismiss={true} showFullScreen={true}>
				<ScrollView style={{ flex: 1 }}
					keyboardShouldPersistTaps="always">
					<View style={{ marginTop: 60, justifyContent: 'center', alignItems: 'center' }}>
						<ScaleImage source={require("@images/logo.png")} width={120} />
					</View>
					<KeyboardAvoidingView behavior='padding'
						style={styles.form}>
						<Form ref={ref => this.form = ref}>
							<Form style={{ width: "100%", }}>
								<TextField errorStyle={styles.errorStyle} validate={
									{
										rules: {
											required: true,
											minlength: 8
										},
										messages: {
											required: "Mật khẩu bắt buộc phải nhập",
											min: "Mật khẩu dài ít nhất 8 ký tự"
										}
									}
								}
									secureTextEntry={this.state.showPass}
									inputStyle={styles.input} style={{ marginTop: 10 }} onChangeText={(s) => this.setState({ password: s })} placeholder={constants.input_password} autoCapitalize={'none'} />
								<TouchableOpacity
									activeOpacity={0.7}
									style={styles.btnEye}
									onPress={this.showPass}>
									<Image source={eyeImg} style={styles.iconEye} />
								</TouchableOpacity>
							</Form>
							<Form style={{ width: "100%", }}>
								<TextField errorStyle={styles.errorStyle} validate={
									{
										rules: {
											required: true,
											equalTo: this.state.password
										},
										messages: {
											required: "Xác nhận mật khẩu bắt buộc phải nhập",
											equalTo: "Xác nhận mật khẩu không trùng khớp"
										}
									}
								}
									secureTextEntry={this.state.showPassConfirm}
									inputStyle={styles.input} style={{ marginTop: 10 }} onChangeText={(s) => this.setState({ confirm_password: s })} placeholder={constants.confirm_password} autoCapitalize={'none'} />
								<TouchableOpacity
									activeOpacity={0.7}
									style={styles.btnEye}
									onPress={this.showPassConfirm}>
									<Image source={eyeImg} style={styles.iconEye} />
								</TouchableOpacity>
							</Form>
						</Form>


						<ButtonSubmit onRef={ref => (this.child = ref)} click={() => { this.register() }} text={constants.register} />
						<View style={{ width: DEVICE_WIDTH, maxWidth: 300 }}>
							<TouchableOpacity onPress={() => { this.props.navigation.replace("login") }} style={{ alignItems: 'flex-end' }}>
								<Text style={{ marginTop: 15, color: 'rgb(155,155,155)', lineHeight: 20, fontSize: 16 }}>Nếu bạn đã có tài khoản hãy đăng nhập ngay <Text style={{ fontWeight: 'bold', color: 'rgb(0,151,124)' }}>tại đây</Text></Text>
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
		marginTop: 30,
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
	errorStyle: {
		color: 'red',
		marginLeft: 20
	}
});
function mapStateToProps(state) {
	return {
		userApp: state.userApp
	};
}
export default connect(mapStateToProps)(EnterPasswordScreen);