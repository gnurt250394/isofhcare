import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
	View,
	ScrollView,
	Linking,
	StyleSheet,
	Text,
	TouchableOpacity,
	ImageBackground,
	Dimensions,
	Keyboard
} from "react-native";
import { Card, Item, Label, Input } from 'native-base';
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
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import client from '@utils/client-utils';
import connectionUtils from "@utils/connection-utils";
class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			press: false,
			phone: "",
			password: "",
			secureTextEntry: true,
			requirePass: true,
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
	componentDidMount() {
		firebase.messaging().getToken()
			.then((token) => {
				console.log('Device FCM Token: ', token);
				userProvider.deviceId = DeviceInfo.getUniqueID();
				userProvider.deviceToken = token;
				firebase.messaging().subscribeToTopic("isofhcare_test");
			});
	}


	register() {
		this.props.navigation.navigate("register", {
			phone: this.state.phone
		})
		// return;
		// let verify = async () => {
		// 	RNAccountKit.loginWithPhone().then(async token => {
		// 		console.log(token);
		// 		if (!token) {
		// 			snackbar.show("Xác minh số điện thoại không thành công", "danger");
		// 		} else {
		// 			let account = await RNAccountKit.getCurrentAccount();
		// 			if (account && account.phoneNumber) {
		// 				this.props.navigation.navigate("register", {
		// 					user: {
		// 						phone: "0" + account.phoneNumber.number,
		// 						token: token.token,
		// 						socialType: 1,
		// 						socialId: "0"
		// 					},
		// 					nextScreen: this.nextScreen
		// 				});
		// 			} else {
		// 				snackbar.show("Xác minh số điện thoại không thành công", "danger");
		// 			}
		// 		}
		// 	});
		// };
		// RNAccountKit.logout()
		// 	.then(() => {
		// 		verify();
		// 	})
		// 	.catch(x => {
		// 		verify();
		// 	});
	}
	getDetails = (token) => {
		console.log(client.auth)
		userProvider.getDetailsUser().then(res => {
			console.log(res, 'sssssss')
			let user = res.details
			user.loginToken = token
			this.props.dispatch(redux.userLogin(user));
		})
		if (this.nextScreen) {
			this.props.navigation.replace(
				this.nextScreen.screen,
				this.nextScreen.param
			);
		} else this.props.navigation.navigate("home", { showDraw: false });
	}

	loginV2() {
		Keyboard.dismiss();
		if (!this.form.isValid()) {
			return;
		}
		this.setState({ isLoading: true }, () => {
			userProvider.loginV2(this.state.phone.trim(), this.state.password).then(s => {
				this.setState({ isLoading: false });
				if (s.code == 0) {
					this.getDetails()
				} else {
					snackbar.show(s.message, "danger");
				}
			}).catch(e => {
				console.log(e)
				this.setState({ isLoading: false });
				snackbar.show(constants.msg.error_occur, "danger");
			});
		})
	}
	login() {
		Keyboard.dismiss();
		if (!this.form.isValid()) {
			return;
		}

		connectionUtils.isConnected().then(s => {
			this.setState({ isLoading: true }, () => {
				userProvider.login(this.state.phone.trim(), this.state.password).then(s => {
					this.setState({ isLoading: false });
					switch (s.code) {
						case 0:
							var user = s.data.user;
							user.bookingNumberHospital = s.data.bookingNumberHospital;
							user.bookingStatus = s.data.bookingStatus;
							if (s.data.profile && s.data.profile.uid)
								user.uid = s.data.profile.uid;
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
						case 500:
							snackbar.show(constants.msg.error_occur, "danger");
					}
				}).catch(e => {
					this.setState({ isLoading: false });
					snackbar.show(constants.msg.error_occur, "danger");
				});
			})
		}).catch(e => {
			this.setState({
				isLoading: false,
			})
			snackbar.show(constants.msg.app.not_internet, "danger");
		})
	}

	forgotPassword() {
		this.props.navigation.navigate('inputPhone')
		// this.setState({
		// 	requirePass: false
		// }, () => {
		// 	Keyboard.dismiss();
		// 	if (!this.form.isValid()) {
		// 		return;
		// 	}
		// 	connectionUtils.isConnected().then(s => {
		// 		this.setState({
		// 			isLoading: true
		// 		}, () => {
		// 			userProvider.forgotPassword(this.state.phone.trim(), 2, (s, e) => {
		// 				switch (s.code) {
		// 					case 0:
		// 						this.props.navigation.navigate('verifyPhone', {
		// 							phone: this.state.phone,
		// 							verify: 2
		// 						})
		// 						break
		// 					case 2:
		// 						snackbar.show('Số điện thoại chưa được đăng ký', "danger");
		// 						break
		// 					case 6:
		// 						this.props.navigation.navigate('verifyPhone', {
		// 							phone: this.state.phone,
		// 							verify: 2
		// 						})
		// 						break
		// 				}


		// 			})
		// 			this.setState({
		// 				isLoading: false,
		// 				requirePass: true
		// 			})
		// 		})
		// 	}).catch(e => {
		// 		this.setState({
		// 			isLoading: false,
		// 			requirePass: true
		// 		})
		// 		snackbar.show(constants.msg.app.not_internet, "danger");
		// 	})
		// })

		// let verify = async () => {
		// 	RNAccountKit.loginWithPhone().then(async token => {
		// 		console.log(token);
		// 		if (!token) {
		// 			snackbar.show("Xác minh số điện thoại không thành công", "danger");
		// 		} else {
		// 			let account = await RNAccountKit.getCurrentAccount();
		// 			if (account && account.phoneNumber) {
		// 				this.props.navigation.replace("resetPassword", {
		// 					user: {
		// 						phone: "0" + account.phoneNumber.number,
		// 						token: token.token,
		// 						applicationId: constants.fbApplicationId,
		// 					}
		// 				});
		// 			} else {
		// 				snackbar.show("Xác minh số điện thoại không thành công", "danger");
		// 			}
		// 		}
		// 	});
		// };
		// RNAccountKit.logout()
		// 	.then(() => {
		// 		verify();
		// 	})
		// 	.catch(x => {
		// 		verify();
		// 	});
	}
	onShowPass = () => {
		this.setState({
			secureTextEntry: !this.state.secureTextEntry
		})
	}
	onChangeText = (state) => (value) => {
		this.setState({ [state]: value })
	}
	openLinkHotline = () => {
		Linking.openURL(
			'tel:1900299983'
		);
	}
	render() {
		return (

			<ScrollView
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"

			>
				<ImageBackground
					style={{ flex: 1, backgroundColor: '#000', height: DEVICE_HEIGHT }}
					source={require('@images/new/account/img_bg_login.png')}
					resizeMode={'cover'}
					resizeMethod="resize"
				// image={require("@images/new/isofhcare.png")}
				// imageStyle={{ marginRight: 50 }}
				// showFullScreen={true}
				// isLoading={this.state.isLoading}
				>
					{/* <KeyboardAvoidingView behavior=""> */}
					<Text style={{ color: '#fff', fontSize: 22, alignSelf: 'center', marginTop: 100 }}>ĐĂNG NHẬP</Text>
					<View style={{ flex: 1, justifyContent: 'center', }}>
						<View style={{ marginHorizontal: 22 }}>
							<Card style={{ padding: 22, paddingTop: 10, borderRadius: 8, marginTop: 50, borderColor: '#02C39A', borderWidth: 1 }}>
								<ScaleImage style={{ alignSelf: 'center', }} source={require("@images/new/account/ic_login_isc.png")} height={60}></ScaleImage>
								<Form ref={ref => (this.form = ref)}>
									<Field clearWhenFocus={true}>
										<TextField
											getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
												keyboardType='numeric'
												placeholderStyle={{ fontSize: 16, }} value={value} underlineColor={'#CCCCCC'}
												inputStyle={styles.textInputStyle}
												labelStyle={styles.labelStyle} placeholder={constants.phone} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
											onChangeText={s => this.setState({ phone: s })}
											errorStyle={styles.errorStyle}
											validate={{
												rules: {
													required: true,
													phone: true
												},
												messages: {
													required: "Số điện thoại không được bỏ trống",
													phone: "SĐT không hợp lệ"
												}
											}}

											autoCapitalize={"none"}
										/>
										<Field style={styles.inputPass}>
											<TextField
												getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
													placeholderStyle={{ fontSize: 16 }}
													value={value} underlineColor={'#CCCCCC'} inputStyle={styles.textInputStyle} labelStyle={styles.labelStyle} placeholder={constants.password} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} secureTextEntry={this.state.secureTextEntry} />}
												onChangeText={s => this.setState({ password: s })}
												errorStyle={styles.errorStyle}
												validate={{
													rules: {
														required: this.state.requirePass,
													},
													messages: {
														required: "Mật khẩu không được bỏ trống"
													}
												}}
												// inputStyle={styles.input}
												autoCapitalize={"none"}
											>

											</TextField>
											{
												this.state.password ? (this.state.secureTextEntry ? (<TouchableOpacity style={{ position: 'absolute', right: 10, top: 45, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 3, top: 45, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
											}
										</Field>
									</Field>
									<View style={{ flexDirection: 'row', marginTop: 15 }}>
										{/* <TouchableOpacity
												onPress={this.register.bind(this)}
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
													Tạo tài khoản
													</Text>
											</TouchableOpacity> */}
										<TouchableOpacity
											onPress={this.forgotPassword.bind(this)}
											style={{ alignItems: "flex-end", flex: 1 }}
										>
											<Text
												numberOfLines={1}
												ellipsizeMode="tail"
												style={{
													color: '#00A3FF',
													paddingRight: 5,
													fontSize: 14
												}}>
												Quên mật khẩu?
													</Text>
										</TouchableOpacity>
									</View>
								</Form>
								<TouchableOpacity onPress={this.login.bind(this)} style={{ backgroundColor: '#00CBA7', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 10, alignItems: 'center', justifyContent: 'center' }} >
									<Text style={{ color: '#FFF', fontSize: 17 }}>{"ĐĂNG NHẬP"}</Text>
								</TouchableOpacity>
							</Card>
							<TouchableOpacity style={styles.btnCall} onPress={this.openLinkHotline}><ScaleImage height={20} source={require('@images/new/account/ic_phone.png')}></ScaleImage><Text style={styles.txCall}>Hotline: <Text style={styles.txNumber}>1900299983</Text></Text></TouchableOpacity>
						</View>


					</View>
					{/* </KeyboardAvoidingView> */}
					<TouchableOpacity onPress={this.register.bind(this)} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: '#fff', borderWidth: 1, alignSelf: 'center', borderRadius: 50, width: 250, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 100 }} >
						<Text style={{ color: '#FFF', fontSize: 17 }}>{"ĐĂNG KÝ"}</Text>
					</TouchableOpacity>
					<View style={{ height: 50 }}></View>
				</ImageBackground>

			</ScrollView>

		);
	}
}
const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
	txNumber: {
		fontWeight: 'bold',
		color: '#fff',
		fontSize: 14
	},
	txtRegister: {
		color: '#000',
		textAlign: 'center',
		marginVertical: 20
	},
	btnCall: {
		padding: 5,
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'center',
	},
	txCall: {
		color: '#fff',
		fontSize: 14,
		marginLeft: 10,
	},
	txtLogin: {
		color: "rgb(2,195,154)",
		fontSize: 14,
		fontWeight: 'bold',
		marginRight: 5
	},
	buttonLogin: {
		alignItems: "center",
		justifyContent: 'flex-end',
		flex: 1,
		flexDirection: 'row'
	},
	txtForgotPass: {
		color: '#028090',
		paddingRight: 5,
		fontSize: 14
	},
	buttonForgotPass: { alignItems: "flex-start", flex: 1 },
	containerFooter: { flexDirection: 'row', marginTop: 15 },
	iconHide: { tintColor: '#7B7C7D' },
	buttonHide: {
		position: 'absolute',
		right: 3,
		top: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	placeFloat: {
		fontSize: 16,
		fontWeight: '200'
	},
	card: {
		padding: 22,
		paddingTop: 10,
		borderRadius: 5,
		marginTop: 60
	},
	margin22: { margin: 22 },
	container: { flex: 1 },
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
	inputPass: {
		position: 'relative',
		alignSelf: 'stretch',
		justifyContent: 'center'
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
		height: 51,
		marginLeft: 0,
		borderWidth: 1,
		padding: 10,
		paddingHorizontal: 20,
		borderRadius: 6,
		borderColor: '#CCCCCC',
		fontSize: 20,
		paddingLeft: 15,
		paddingRight: 45,

	},
	labelStyle: { paddingTop: 10, color: '#53657B', fontSize: 16 }
});
function mapStateToProps(state) {
	return {
		userApp: state.userApp
	};
}
export default connect(mapStateToProps)(LoginScreen);
