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
import RNAccountKit from 'react-native-facebook-account-kit'
import Form from 'mainam-react-native-form-validate/Form';
import TextField from 'mainam-react-native-form-validate/TextField';

class RegisterScreen extends Component {

	constructor(props) {
		super(props)
		let user = this.props.navigation.getParam("user", null);
		// var phone = this.props.navigation.getParam("phone", null);
		// var token = this.props.navigation.getParam("token", null);
		let verified = true;
		if (!user)
			user = {};
		user.verified = verified;
		user.press = false;
		user.pressConfirm = false;
		user.gender = 1;
		this.state = user;
	}
	setDate(newDate) {
		this.setState({ dob: newDate });
	}

	changeEmail() {
		let verify = async () => {
			RNAccountKit.loginWithEmail().then(async (token) => {
				if (!token) {
					snackbar.show("Xác minh email không thành công", "danger");
				} else {
					let account = await RNAccountKit.getCurrentAccount();
					if (account && account.email) {
						this.setState({ email: account.email });
					} else {
						snackbar.show("Xác minh email không thành công", "danger");
					}
				}
			});
		};
		RNAccountKit.logout()
			.then(() => {
				verify();
			}).catch(x => {
				verify();
			});
	}
	changePhone() {
		let verify = async () => {
			RNAccountKit.loginWithPhone().then(async (token) => {
				if (!token) {
					snackbar.show("Xác minh số điện thoại không thành công", "danger");
				} else {
					let account = await RNAccountKit.getCurrentAccount();
					if (account && account.phoneNumber) {
						this.setState({
							phone: "0" + account.phoneNumber.number,
							token: token.token
						})
					} else {
						snackbar.show("Xác minh số điện thoại không thành công", "danger");
					}
				}
			});
		};
		RNAccountKit.logout()
			.then(() => {
				verify();
			}).catch(x => {
				verify();
			});
	}

	register() {
		if (!this.form.isValid()) {
			this.child.unPress();
			return;
		}
		Keyboard.dismiss();


		this.child.unPress();
		this.props.navigation.navigate("enterPassword", {
			user: {
				phone: this.state.phone,
				// email: this.state.email,
				fullname: this.state.fullname,
				dob: this.state.dob,
				gender: this.state.gender,
				token: this.state.token,
				socialId: this.state.socialId,
				socialType: this.state.socialType ? this.state.socialType : 1
			}
		})
	}


	render() {
		let maxDate = new Date();
		maxDate = new Date(maxDate.getFullYear() - 15, maxDate.getMonth(), maxDate.getDate());
		return (
			this.state.verified &&
			<ActivityPanel style={{ flex: 1 }} title="Đăng nhập" touchToDismiss={true} showFullScreen={true}>
				<ScrollView style={{ flex: 1 }}
					keyboardShouldPersistTaps="always">
					<View style={{ marginTop: 60, justifyContent: 'center', alignItems: 'center' }}>
						<ScaleImage source={require("@images/logo.png")} width={120} />
					</View>
					<KeyboardAvoidingView behavior='padding'
						style={styles.form}>
						<View style={{ flex: 1 }}>
							<Form ref={ref => this.form = ref}>
								<TextField errorStyle={styles.errorStyle} validate={
									{
										rules: {
											required: true,
											maxlength: 255
										},
										messages: {
											required: "Họ tên không được bỏ trống!",
											maxlength: "Họ tên tối đa 255 ký tự"
										}
									}
								} inputStyle={styles.input} onChangeText={(s) => { this.setState({ fullname: s }) }} placeholder={constants.fullname} returnKeyType={'next'} autoCapitalize={'none'} autoCorrect={false} />

								<View style={{ paddingLeft: 30, width: DEVICE_WIDTH - 40, marginTop: 10 }}>
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
								<TouchableOpacity style={{ marginTop: 10 }} onPress={() => {
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
								</TouchableOpacity>

								<View style={{ display: 'none' }}>
									<DatePicker
										ref={ref => this.dob = ref}
										defaultDate={maxDate}
										minimumDate={new Date(1900, 1, 1)}
										maximumDate={maxDate}
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
								{/* <TouchableOpacity onPress={this.changeEmail.bind(this)}  >
									<UserInput
										editable={false}
										value={this.state.email}
										placeholder={constants.email}
										autoCapitalize={'none'}
										returnKeyType={'next'}
										autoCorrect={false}
										style={{ marginTop: 12 }}
									/>
								</TouchableOpacity> */}
								{/* <TouchableOpacity onPress={this.changePhone.bind(this)} >
									<UserInput
										value={this.state.phone}
										placeholder={constants.phone}
										autoCapitalize={'none'}
										returnKeyType={'next'}
										editable={false}
										autoCorrect={false}
										style={{ marginTop: 12 }}
									/>
								</TouchableOpacity> */}
							</Form>
						</View>

						<ButtonSubmit onRef={ref => (this.child = ref)} click={() => { this.register() }} text={"Tiếp tục"} />
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
export default connect(mapStateToProps)(RegisterScreen);