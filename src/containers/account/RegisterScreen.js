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
import { DatePicker } from 'native-base';

class RegisterScreen extends Component {

	constructor(props) {
		super(props)
		this.state = {
			showPass: true,
			showPassConfirm: true,
			press: false,
			pressConfirm: false,
			email: "",
			password: "",
			username: "",
			phone: "",
			dob: null,
			gender: 1
		}
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
		if (!this.state.fullname) {
			snackbar.showShort(constants.msg.user.please_input_fullname, "danger");
			this.child.unPress();
			return;
		}
		if (!this.state.fullname.isFullName()) {
			snackbar.showShort(constants.msg.user.please_enter_the_correct_fullname_format, "danger");
			this.child.unPress();
			return;
		}

		if (!this.state.phone) {
			if (!this.state.email) {
				snackbar.showShort(constants.msg.user.please_input_email_or_phone, "danger");
				this.child.unPress();
				return;
			}
		}
		if (this.state.email && !this.state.email.isEmail()) {
			snackbar.showShort(constants.msg.user.please_enter_the_correct_email_format, "danger");
			this.child.unPress();
			return;
		}

		if (this.state.phone && !this.state.phone.isPhoneNumber()) {
			snackbar.showShort(constants.msg.user.please_enter_the_correct_phone_number_format, "danger");
			this.child.unPress();
			return;
		}

		if (!this.state.password) {
			snackbar.showShort(constants.msg.user.please_input_password, "danger");
			this.child.unPress();
			return;
		}
		if (this.state.password.length < 6) {
			snackbar.showShort("Mật khẩu cần nhiều hơn 6 ký tự", "danger");
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


		userProvider.register(this.state.fullname.trim(), this.state.email.trim(), this.state.phone.trim(), this.state.password, this.state.dob ? this.state.dob.format("yyyy-MM-dd HH:mm:ss") : null, this.state.gender, (s, e) => {
			this.child.unPress();
			if (s) {
				// snackbar.show("Thông tin đăng nhập không hợp lệ");
				// return;
				switch (s.code) {
					case 0:
						var user = s.data.user;
						// if (user.role == 4) {
						// 	snackbar.show(constants.msg.user.please_login_on_web_to_management);
						// 	return;
						// }
						if (this.state.email) {
							snackbar.show(constants.msg.user.confirm_email_active_account, "success")
							this.props.navigation.replace("login");
						} else {
							snackbar.show(constants.msg.user.confirm_phone_active_account, "success")
							this.props.navigation.replace("confirmCode", {
								phone: this.state.phone,
								fromRegisterScreen: true,
								user
							});
						}
						return;
					case 2:
						snackbar.show(constants.msg.user.username_or_email_existed, "danger");
						return;
					case 3:
					case 1:
						snackbar.show(constants.msg.user.account_blocked, "danger");
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
			<ActivityPanel style={{ flex: 1 }} title="Đăng nhập" touchToDismiss={true} showFullScreen={true}>
				<ScrollView style={{ flex: 1 }}
					keyboardShouldPersistTaps="always">
					<View style={{ marginTop: 60, justifyContent: 'center', alignItems: 'center' }}>
						<ScaleImage source={require("@images/logo.png")} width={120} />
					</View>
					<KeyboardAvoidingView behavior='padding'
						style={styles.form}>
						<UserInput onTextChange={(s) => this.setState({ fullname: s })}
							placeholder={constants.fullname}
							autoCapitalize={'none'}
							returnKeyType={'next'}
							autoCorrect={false} />
						<View style={{ paddingLeft: 20 }}>
							<Text>Giới tính</Text>
							<View style={{ flexDirection: 'row' }}>
								<TouchableOpacity onPress={() => { this.setState({ gender: 1 }) }} style={{ padding: 10, flexDirection: 'row' }}>
									{
										this.state.gender == 1 ?
											<ScaleImage source={require("@images/ic_radio1.png")} width={20} /> :
											<ScaleImage source={require("@images/ic_radio0.png")} width={20} />
									}
									<Text style={{ marginLeft: 5 }}>Nam</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => { this.setState({ gender: 0 }) }} style={{ padding: 10, flexDirection: 'row' }}>
									{
										this.state.gender == 0 ?
											<ScaleImage source={require("@images/ic_radio1.png")} width={20} /> :
											<ScaleImage source={require("@images/ic_radio0.png")} width={20} />
									}
									<Text style={{ marginLeft: 5 }}>Nữ</Text>
								</TouchableOpacity>
							</View>
						</View>
						<TouchableOpacity style={{ flex: 1, marginTop: 10 }} onPress={() => {
							if (this.dob)
								this.dob.showDatePicker();
						}}>

							<UserInput
								value={this.state.dob ? this.state.dob.format("dd/MM/yyyy") : ""}
								placeholder={constants.dob}
								autoCapitalize={'none'}
								returnKeyType={'next'}
								editable={false}
								autoCorrect={false} />
							<View style={{ display: 'none' }}>
								<DatePicker
									ref={ref => this.dob = ref}
									defaultDate={new Date()}
									minimumDate={new Date(1900, 1, 1)}
									maximumDate={new Date()}
									locale={"en"}
									timeZoneOffsetInMinutes={undefined}
									modalTransparent={false}
									animationType={"fade"}
									androidMode={"default"}
									placeHolderText="Select date"
									textStyle={{ color: "green" }}
									placeHolderTextStyle={{ color: "#d3d3d3" }}
									onDateChange={this.setDate.bind(this)}
									style={{ width: 0 }}
									disabled={false}
								/>
							</View>
						</TouchableOpacity>
						<UserInput onTextChange={(s) => this.setState({ email: s })}
							placeholder={constants.email}
							autoCapitalize={'none'}
							returnKeyType={'next'}
							autoCorrect={false}
							style={{ marginTop: 12 }}
						/>
						<UserInput onTextChange={(s) => this.setState({ phone: s })}
							placeholder={constants.phone}
							autoCapitalize={'none'}
							returnKeyType={'next'}
							autoCorrect={false}
							style={{ marginTop: 12 }}
						/>
						<View style={{ marginTop: 12, flex: 1 }}>

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

						<View style={{ marginTop: 12, flex: 1 }}>

							<UserInput
								onTextChange={(s) => this.setState({ confirm_password: s })}
								secureTextEntry={this.state.showPassConfirm}
								placeholder={constants.confirm_password}
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
});
function mapStateToProps(state) {
	return {
		userApp: state.userApp
	};
}
export default connect(mapStateToProps)(RegisterScreen);