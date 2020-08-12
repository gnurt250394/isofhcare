import React, { Component, PropTypes } from "react";
import ActivityPanel from "@components/ActivityPanel";
import {
	View,
	ActivityIndicator,
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
import Form from "mainam-react-native-form-validate/Form";
import Field from "mainam-react-native-form-validate/Field";
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import client from '@utils/client-utils';
import connectionUtils from "@utils/connection-utils";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputPhone from '@components/account/InputPhone'
class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			press: false,
			phone: "",
			password: "",
			secureTextEntry: true,
			requirePass: true,
			disabled: false
		};
		this.nextScreen = this.props.navigation.getParam("nextScreen", null);


	}
	componentDidMount() {
		firebase.messaging().getToken()
			.then((token) => {

				userProvider.deviceId = DeviceInfo.getUniqueID();
				userProvider.deviceToken = token;
				firebase.messaging().subscribeToTopic("isofhcare_test");
			});
	}


	register() {

		this.props.navigation.replace("register", {
			phone: this.state.phone,
			nextScreen: this.nextScreen
		})

	}
	getDetails = (token) => {

		userProvider.getDetailsUser().then(res => {

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
			this.setState({ isLoading: true, disabled: true }, () => {
				userProvider.login(this.state.phone.trim(), this.state.password).then(s => {
					switch (s.code) {
						case 0:
							var user = s.data.user;
							user.bookingNumberHospital = s.data.bookingNumberHospital;
							user.bookingStatus = s.data.bookingStatus;
							if (s.data.profile && s.data.profile.uid)
								user.uid = s.data.profile.uid;
							snackbar.show(constants.msg.user.login_success, "success");
							if (!user.phone) {
								user.requestInputPhone = true
							}
							this.props.dispatch(redux.userLogin(user));
							if (this.nextScreen) {
								this.props.navigation.replace(
									this.nextScreen.screen,
									this.nextScreen.param
								);
							} else {
								this.props.navigation.navigate("home", { showDraw: false });
							}
							break;
						case 4:
							snackbar.show(constants.msg.user.this_account_not_active, "danger");
							break;
						case 3:
							snackbar.show(constants.msg.user.username_or_password_incorrect, "danger");
							break;
						case 2:
						case 1:
							snackbar.show(constants.msg.user.account_blocked, "danger");
							break;
						case 500:
							snackbar.show(constants.msg.error_occur, "danger");
							break
					}
					this.setState({ isLoading: false, disabled: false });
				}).catch(e => {
					this.setState({ isLoading: false, disabled: false });
					snackbar.show(constants.msg.error_occur, "danger");
				});
			})
		}).catch(e => {
			this.setState({
				isLoading: false,
				disabled: false
			})
			snackbar.show(constants.msg.app.not_internet, "danger");
		})
	}

	forgotPassword() {
		this.props.navigation.navigate('inputPhone')

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
	goHome=()=>{
		this.props.navigation.navigate('home')
	}
	render() {
		return (

			<ActivityPanel
				// showBackgroundHeader={false}
				hideActionbar={true}
				showFullScreen={true}
				transparent={true}
				backgroundHeader={require('@images/new/account/img_bg_login.png')}
				backgroundStyle={styles.imgBg}
			>
				<ImageBackground
					style={styles.imgBg}
					source={require('@images/new/account/img_bg_login.png')}
					resizeMode={'cover'}
				// resizeMethod="resize"
				// image={require("@images/new/isofhcare.png")}
				// imageStyle={{ marginRight: 50 }}
				// showFullScreen={true}
				// isLoading={this.state.isLoading}
				>
					<KeyboardAwareScrollView style={{ flex: 1 }}>

						{/* <KeyboardAvoidingView behavior=""> */}
						<Text style={styles.txLogin}>ĐĂNG NHẬP</Text>
						<View style={styles.viewCard}>
							<View style={styles.viewLogin}>
								<Card style={styles.cardLogin}>
									<ScaleImage style={styles.imgIsc} source={require("@images/new/account/ic_login_isc.png")} height={60}></ScaleImage>
									<Form ref={ref => (this.form = ref)}>
										<Field clearWhenFocus={true}>
											<TextField

												getComponent={(value, onChangeText, onFocus, onBlur, placeholderTextColor) => <FloatingLabel
													// keyboardType='numeric'
													// maxLength={10}
													placeholderStyle={styles.placeholder} value={value} underlineColor={'#CCCCCC'}
													inputStyle={styles.textInputStyle}
													placeholderTextColor='#000'
													autoCapitalize={"none"}
													placeholderStyle={{ fontWeight: '300', fontSize: 16 }}
													labelStyle={styles.labelStyle} placeholder={"SĐT/ Tên đăng nhập"} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
												onChangeText={s => this.setState({ phone: s })}
												errorStyle={styles.errorStyle}
												validate={{
													rules: {
														required: true,
														// phone: true
													},
													messages: {
														required: "Số điện thoại không được bỏ trống",
														// phone: "SĐT không hợp lệ"
													}
												}}
											/>
											<Field style={styles.inputPass}>
												<TextField
													getComponent={(value, onChangeText, onFocus, onBlur, placeholderTextColor) => <FloatingLabel
														placeholderStyle={styles.placeholder}
														placeholderTextColor='#000'
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
												>

												</TextField>
												{
													this.state.password ? (this.state.secureTextEntry ? (<TouchableOpacity style={{ position: 'absolute', right: 10, top: 45, justifyContent: 'center', alignItems: 'center', }} onPress={this.onShowPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} resizeMode={'contain'} height={20} source={require('@images/new/ic_hide_pass.png')}></ScaleImage></TouchableOpacity>) : (<TouchableOpacity style={{ position: 'absolute', right: 10, top: 45, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowPass}><ScaleImage style={{ tintColor: '#7B7C7D' }} height={20} source={require('@images/new/ic_show_pass.png')}></ScaleImage></TouchableOpacity>)) : (<Field></Field>)
												}
											</Field>
										</Field>
										<View style={styles.viewFogot}>
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
												style={styles.btnFogot}
											>
												<Text
													numberOfLines={1}
													ellipsizeMode="tail"
													style={styles.txFogot}>
													Quên mật khẩu?
													</Text>
											</TouchableOpacity>
										</View>
									</Form>
									<TouchableOpacity disabled={this.state.disabled} onPress={this.login.bind(this)} style={styles.btnLogin} >
										{this.state.disabled ? <ActivityIndicator size={'small'} color='#fff'></ActivityIndicator> : <Text style={styles.txlg}>{"ĐĂNG NHẬP"}</Text>}
									</TouchableOpacity>
								</Card>
								<TouchableOpacity style={styles.btnCall} onPress={this.openLinkHotline}><ScaleImage height={20} source={require('@images/new/account/ic_phone.png')}></ScaleImage><Text style={styles.txCall}>Hotline: <Text style={styles.txNumber}>1900299983</Text></Text></TouchableOpacity>
							</View>
						</View>
						{/* </KeyboardAvoidingView> */}
						<TouchableOpacity onPress={this.register.bind(this)} style={styles.btnSignUp} >
							<Text style={styles.txSignUp}>{"ĐĂNG KÝ"}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.goHome} style={{
							alignSelf:'center',
							padding:30
						}} >
							<Text style={[styles.txSignUp,{textDecorationLine:'underline'}]}>{"Về trang chủ"}</Text>
						</TouchableOpacity>
						<View style={styles.viewBottom}></View>
					</KeyboardAwareScrollView>
					<InputPhone onBackdropPress={this.onBackdropPress} isVisible={this.state.isVisible}></InputPhone>
				</ImageBackground>
			</ActivityPanel>

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
		color: "#000",
		fontWeight: "300",
		height: 51,
		marginLeft: 0,
		borderWidth: 1,
		padding: 10,
		paddingHorizontal: 20,
		borderRadius: 6,
		borderColor: '#CCCCCC',
		fontSize: 20,
		paddingLeft: 15,

	},
	labelStyle: { paddingTop: 10, color: '#53657B', fontSize: 16 },
	imgBg: { flex: 1, backgroundColor: '#000', },
	txLogin: { color: '#fff', fontSize: 22, alignSelf: 'center', marginTop: 50 },
	viewCard: { flex: 1, justifyContent: 'center', },
	viewLogin: { marginHorizontal: 22 },
	cardLogin: { padding: 22, paddingTop: 10, borderRadius: 8, marginTop: 50, borderColor: '#02C39A', borderWidth: 1 },
	imgIsc: { alignSelf: 'center', },
	placeholder: { fontSize: 16, fontWeight: '300' },
	viewFogot: { flexDirection: 'row', marginTop: 10, alignSelf: "flex-end", flex: 1 },
	btnFogot: { padding: 5 },
	txFogot: {
		color: '#00A3FF',
		paddingRight: 5,
		fontSize: 14
	},
	btnLogin: { backgroundColor: '#00CBA7', alignSelf: 'center', borderRadius: 6, width: 250, height: 48, marginTop: 10, alignItems: 'center', justifyContent: 'center' },
	txlg: { color: '#FFF', fontSize: 17 },
	btnSignUp: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: '#fff', borderWidth: 1, alignSelf: 'center', borderRadius: 50, width: 250, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 30 },
	txSignUp: { color: '#FFF', fontSize: 17 },
	viewBottom: { height: 50 }
});
function mapStateToProps(state) {
	return {
		userApp: state.auth.userApp
	};
}
export default connect(mapStateToProps)(LoginScreen);
