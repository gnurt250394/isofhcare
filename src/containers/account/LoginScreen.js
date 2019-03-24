import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import ButtonSubmit from "@components/ButtonSubmit";
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TouchableOpacity,
	Image,
	Easing,
	Keyboard
} from "react-native";
import { Card, Item, Label, Input } from 'native-base';
import Dimensions from "Dimensions";
import { connect } from "react-redux";
import snackbar from "@utils/snackbar-utils";
import userProvider from "@data-access/user-provider";
import constants from "@resources/strings";
import redux from "@redux-store";
import ScaleImage from "mainam-react-native-scaleimage";
import SocialNetwork from "@components/LoginSocial";
import RNAccountKit from "react-native-facebook-account-kit";
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';
class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			press: false,
			email: "",
			password: ""
		};
		this.nextScreen = this.props.navigation.getParam("nextScreen", null);

		// Configures the SDK with some options
		RNAccountKit.configure({
			titleType: "login",
			initialPhoneCountryPrefix: "+84", // autodetected if none is provided
			countryWhitelist: ["VN"], // [] by default
			defaultCountry: "VN"
		});
	}


	register() {
		// this.props.navigation.navigate("register", {  })
		// return;
		let verify = async () => {
			RNAccountKit.loginWithPhone().then(async token => {
				console.log(token);
				if (!token) {
					snackbar.show("Xác minh số điện thoại không thành công", "danger");
				} else {
					let account = await RNAccountKit.getCurrentAccount();
					if (account && account.phoneNumber) {
						this.props.navigation.navigate("register", {
							user: {
								phone: "0" + account.phoneNumber.number,
								token: token.token,
								socialType: 1,
								socialId: "0"
							},
							nextScreen: this.nextScreen
						});
					} else {
						snackbar.show("Xác minh số điện thoại không thành công", "danger");
					}
				}
			});
		};
		RNAccountKit.logout()
			.then(() => {
				verify();
			})
			.catch(x => {
				verify();
			});
	}

	login() {
		Keyboard.dismiss();
		if (!this.form.isValid()) {
			return;
		}
		this.setState({ isLoading: true }, () => {
			userProvider.login(this.state.email.trim(), this.state.password).then(s => {
				this.setState({ isLoading: false });
				switch (s.code) {
					case 0:
						var user = s.data.user;
						snackbar.show(constants.msg.user.login_success, "success");
						this.props.dispatch(redux.userLogin(user));
						if (this.nextScreen) {
							this.props.navigation.replace(
								this.nextScreen.screen,
								this.nextScreen.param
							);
						} else {
							this.props.navigation.navigate("home", { showDraw: false });
						}
						return;
					case 4:
						snackbar.show(constants.msg.user.this_account_not_active, "danger");
						return;
					case 3:
						snackbar.show(constants.msg.user.username_or_password_incorrect, "danger");
						return;
					case 2:
					case 1:
						snackbar.show(constants.msg.user.account_blocked, "danger");
						return;
				}
			}).then(e => {
				this.setState({ isLoading: false });
				// snackbar.show(constants.msg.error_occur);
			});
		})

	}

	forgotPassword() {
		let verify = async () => {
			RNAccountKit.loginWithPhone().then(async token => {
				console.log(token);
				if (!token) {
					snackbar.show("Xác minh số điện thoại không thành công", "danger");
				} else {
					let account = await RNAccountKit.getCurrentAccount();
					if (account && account.phoneNumber) {
						this.props.navigation.replace("resetPassword", {
							user: {
								phone: "0" + account.phoneNumber.number,
								token: token.token,
								applicationId: constants.fbApplicationId,
							}
						});
					} else {
						snackbar.show("Xác minh số điện thoại không thành công", "danger");
					}
				}
			});
		};
		RNAccountKit.logout()
			.then(() => {
				verify();
			})
			.catch(x => {
				verify();
			});
	}

	render() {
		return (
			<ActivityPanel
				style={{ flex: 1 }}
				image={require("@images/new/isofhcare.png")}
				imageStyle={{ marginRight: 50 }}
				showFullScreen={true}
				isLoading={this.state.isLoading}
			>
				<ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
					<KeyboardAvoidingView behavior="padding">
						<View style={{ flex: 1 }}>
							<View style={{ margin: 22 }}>
								<Card style={{ padding: 22, paddingTop: 10, borderRadius: 5, marginTop: 60 }}>
									<Form ref={ref => (this.form = ref)}>
										<Field clearWhenFocus={true}>
											<TextField
												getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
													placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.phone} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
												onChangeText={s => this.setState({ email: s })}
												errorStyle={styles.errorStyle}
												validate={{
													rules: {
														required: true,
														phone: true
													},
													messages: {
														required: "Số điện thoại không được bỏ trống!",
														phone: "Nhập SĐT không hợp lệ"
													}
												}}

												placeholder={constants.input_password}
												autoCapitalize={"none"}
											/>
											<TextField
												getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
													placeholderStyle={{ fontSize: 16, fontWeight: '200' }}
													value={value} underlineColor={'#02C39A'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.password} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} secureTextEntry={true} />}
												onChangeText={s => this.setState({ password: s })}
												errorStyle={styles.errorStyle}
												validate={{
													rules: {
														required: true,
													},
													messages: {
														required: "Mật khẩu không được bỏ trống!"
													}
												}}
												inputStyle={styles.input}
												placeholder={constants.input_password}
												autoCapitalize={"none"}
											/>
										</Field>
										<View style={{ flexDirection: 'row', marginTop: 15 }}>
											<TouchableOpacity
												onPress={this.forgotPassword.bind(this)}
												style={{ alignItems: "flex-start", flex: 1 }}
											>
												<Text
													numberOfLines={1}
													ellipsizeMode="tail"
													style={{
														color: '#028090',
														paddingRight: 5,
														fontSize: 14
													}}>
													Quên mật khẩu?
													</Text>
											</TouchableOpacity>
											<TouchableOpacity
												onPress={this.register.bind(this)}
												style={{ alignItems: "center", justifyContent: 'flex-end', flex: 1, flexDirection: 'row' }}
											>
												<Text
													style={{
														color: "rgb(2,195,154)",
														fontSize: 14,
														fontWeight: 'bold',
														marginRight: 5
													}}
												>Đăng ký</Text><ScaleImage source={require("@images/new/right_arrow.png")} height={10} />
											</TouchableOpacity>
										</View>
									</Form>
								</Card>
							</View>
							<SocialNetwork />
							<TouchableOpacity style={{ backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center' }} onPress={this.login.bind(this)}>
								<Text style={{ color: '#FFF', fontSize: 20}}>{"ĐĂNG NHẬP"}</Text>
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>

				</ScrollView>
			</ActivityPanel>
		);
	}
}
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
	form: {
		marginTop: 80,
		borderRadius: 10
	},
	btnEye: {
		position: "absolute",
		right: 25,
		top: 10
	},
	iconEye: {
		width: 25,
		height: 25,
		tintColor: "rgba(0,0,0,0.2)"
	},
	input: {
		maxWidth: 300,
		paddingRight: 30,
		backgroundColor: "#FFF",
		width: DEVICE_WIDTH - 40,
		height: 42,
		marginHorizontal: 20,
		paddingLeft: 15,
		borderRadius: 6,
		color: "#006ac6",
		borderWidth: 1,
		borderColor: "rgba(155,155,155,0.7)"
	},
	errorStyle: {
		color: "red",
		marginTop: 10
	},
	textInputStyle: {
		color: "#53657B",
		fontWeight: "600",
		height: 45,
		marginLeft: 0,
		fontSize: 20
	},
	labelStyle: { paddingTop: 10, color: '#53657B', fontSize: 16 }
});
function mapStateToProps(state) {
	return {
		userApp: state.userApp
	};
}
export default connect(mapStateToProps)(LoginScreen);
