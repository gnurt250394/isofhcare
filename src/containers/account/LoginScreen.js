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
	Animated,
	Easing,
	Keyboard
} from "react-native";
import { Card, Item, Label, Input } from 'native-base';
import Dimensions from "Dimensions";
import { connect } from "react-redux";
import eyeImg from "@images/eye_black.png";
import snackbar from "@utils/snackbar-utils";
import userProvider from "@data-access/user-provider";
import constants from "@resources/strings";
import redux from "@redux-store";
import ScaleImage from "mainam-react-native-scaleimage";
import SocialNetwork from "@components/LoginSocial";
import RNAccountKit from "react-native-facebook-account-kit";
const durationDefault = 500;
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showPass: true,
			press: false,
			email: "",
			password: ""
		};
		this.showPass = this.showPass.bind(this);
		this.animatedValue = new Animated.Value(0);
		this.animatedValue1 = new Animated.Value(0);
		this.animatedValue2 = new Animated.Value(0);
		this.nextScreen = this.props.navigation.getParam("nextScreen", null);

		// Configures the SDK with some options
		RNAccountKit.configure({
			titleType: "login",
			initialPhoneCountryPrefix: "+84", // autodetected if none is provided
			countryWhitelist: ["VN"], // [] by default
			defaultCountry: "VN"
		});
	}

	componentDidMount() {
		this.animate();
	}

	animate() {
		this.animatedValue.setValue(0);
		this.animatedValue1.setValue(0);
		this.animatedValue2.setValue(0);
		const createAnimation = function (value, duration, easing, delay = 0) {
			return Animated.timing(value, {
				toValue: 1,
				duration,
				easing,
				delay
			});
		};
		Animated.parallel([
			createAnimation(
				this.animatedValue,
				durationDefault,
				Easing.ease,
				durationDefault
			),
			createAnimation(
				this.animatedValue1,
				durationDefault,
				Easing.ease,
				durationDefault
			),
			createAnimation(
				this.animatedValue2,
				durationDefault,
				Easing.ease,
				durationDefault
			)
		]).start();
	}

	showPass() {
		this.state.press === false
			? this.setState({ showPass: false, press: true })
			: this.setState({ showPass: true, press: false });
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
		userProvider.login(this.state.email.trim(), this.state.password, (s, e) => {
			if (s) {
				switch (s.code) {
					case 0:
						var user = s.data.user;
						// if (user.role == 4) {
						// 	snackbar.show(constants.msg.user.please_login_on_web_to_management);
						// 	return;
						// }
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
						snackbar.show(
							constants.msg.user.username_or_password_incorrect,
							"danger"
						);
						return;
					case 2:
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
			<ActivityPanel
				style={{ flex: 1 }}
				touchToDismiss={true}
				image={require("@images/new/isofhcare.png")}
				imageStyle={{ marginRight: 50 }}
				showFullScreen={true}
			>
				<ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
					<KeyboardAvoidingView behavior="padding">
						<View style={{ flex: 1 }}>
							<View style={{ margin: 22 }}>
								<Card style={{ padding: 22, paddingTop: 10, align: 'center', borderRadius: 5, marginTop: 60 }}>
									<Form ref={ref => (this.form = ref)}>
										<Field clearWhenFocus={true}>
											<TextField
												getComponent={(value, onChangeText, onFocus, onBlur, isError) => <Item floatingLabel>
													<Label style={styles.labelStyle}>{constants.phone}</Label>
													<Input style={styles.textInputStyle}
														value={value} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />
												</Item>
												}
												onChangeText={s => this.setState({ email: s })
												}
												errorStyle={styles.errorStyle}
												validate={{
													rules: {
														required: true,
														phone: true
													},
													messages: {
														required: "Số điện thoại bắt buộc phải nhập",
														phone: "Nhập SĐT không hợp lệ"
													}
												}}
												secureTextEntry={this.state.showPass}
												inputStyle={styles.input}
												style={{ marginTop: 10 }}
												placeholder={constants.input_password}
												autoCapitalize={"none"}
											/>
											<TextField
												getComponent={(value, onChangeText, onFocus, onBlur, isError) => <Item floatingLabel>
													<Label style={styles.labelStyle}>{constants.password}</Label>
													<Input style={styles.textInputStyle}
														secureTextEntry={true}
														value={value} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />
												</Item>
												}
												onChangeText={s => this.setState({ password: s })}
												errorStyle={styles.errorStyle}
												validate={{
													rules: {
														required: true
													},
													messages: {
														required: "Mật khẩu bắt buộc phải nhập"
													}
												}}
												secureTextEntry={this.state.showPass}
												inputStyle={styles.input}
												style={{ marginTop: 10 }}
												placeholder={constants.input_password}
												autoCapitalize={"none"}
											/>
										</Field>
										<View style={{ flexDirection: 'row', marginTop: 15 }}>
											<TouchableOpacity
												onPress={() => {
													this.props.navigation.replace("forgotPassword", {
														nextScreen: this.nextScreen
													});
												}}
												style={{ alignItems: "flex-start", flex: 1 }}
											>
												<Text
													style={{
														color: '#028090',
														paddingRight: 10,
														fontSize: 16
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
														fontSize: 16,
														fontWeight: 'bold',
														marginRight: 5
													}}
												>Đăng ký</Text><ScaleImage source={require("@images/new/right-arrow.png")} height={10} />
											</TouchableOpacity>
										</View>
									</Form>
								</Card>
							</View>
							<SocialNetwork />
							<TouchableOpacity style={{ backgroundColor: 'rgb(2,195,154)', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 34, alignItems: 'center', justifyContent: 'center' }} onPress={this.login.bind(this)}>
								<Text style={{ color: '#FFF', fontSize: 20, textTransform: 'uppercase' }}>{"ĐĂNG NHẬP"}</Text>
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
		height: 60,
		marginLeft: 0
	},
	labelStyle: { paddingTop: 10, color: '#53657B' }
});
function mapStateToProps(state) {
	return {
		userApp: state.userApp
	};
}
export default connect(mapStateToProps)(LoginScreen);
