import React, { Component, PropTypes } from 'react';
import UserInput from '@components/UserInput';
import ActivityPanel from '@components/ActivityPanel';
import ButtonSubmit from '@components/ButtonSubmit';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, Image, Animated, Easing, Keyboard } from 'react-native';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import eyeImg from '@images/eye_black.png';
import snackbar from '@utils/snackbar-utils';
import userProvider from '@data-access/user-provider';
import constants from '@resources/strings';
import redux from '@redux-store';
import ScaleImage from 'mainam-react-native-scaleimage';
import SocialNetwork from '@components/LoginSocial';
import RNAccountKit from 'react-native-facebook-account-kit'
const durationDefault = 500;
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
		this.animatedValue = new Animated.Value(0);
		this.animatedValue1 = new Animated.Value(0);
		this.animatedValue2 = new Animated.Value(0);
		// Configures the SDK with some options
		RNAccountKit.configure({
			titleType: 'login',
			initialPhoneCountryPrefix: '+84', // autodetected if none is provided
			countryWhitelist: ['VN'], // [] by default
			defaultCountry: 'VN',
		});
	}

	componentDidMount() {
		this.animate()
	}

	animate() {
		this.animatedValue.setValue(0)
		this.animatedValue1.setValue(0)
		this.animatedValue2.setValue(0)
		const createAnimation = function (value, duration, easing, delay = 0) {
			return Animated.timing(
				value,
				{
					toValue: 1,
					duration,
					easing,
					delay
				}
			)
		}
		Animated.parallel([
			createAnimation(this.animatedValue, durationDefault, Easing.ease, durationDefault),
			createAnimation(this.animatedValue1, durationDefault, Easing.ease, durationDefault),
			createAnimation(this.animatedValue2, durationDefault, Easing.ease, durationDefault)
		]).start()
	}

	showPass() {
		this.state.press === false ? this.setState({ showPass: false, press: true }) : this.setState({ showPass: true, press: false });
	}
	register() {
		// this.props.navigation.navigate("register", {  })
		// return;
		let verify = async () => {
			RNAccountKit.loginWithPhone().then(async (token) => {
				if (!token) {
					snackbar.show("Xác minh số điện thoại không thành công", "danger");
				} else {
					let account = await RNAccountKit.getCurrentAccount();
					if (account && account.phoneNumber) {
						this.props.navigation.navigate("register", { user: { phone: "0" + account.phoneNumber.number, token: token.token, socialType: 1, socialId: 0 } })
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
						this.props.navigation.navigate('home', { showDraw: false });
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
		const introButton = this.animatedValue1.interpolate({
			inputRange: [0, 1],
			outputRange: [150, 60]
		})
		const introBottom = this.animatedValue2.interpolate({
			inputRange: [0, 1],
			outputRange: [150, 0]
		})
		const marginLeft = this.animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: [-800, 0]
		})
		return (
			<ActivityPanel style={{ flex: 1 }}
				title="Đăng nhập 1"
				touchToDismiss={true}
				// hideActionbar={true}
				// hideStatusbar={true}
				showFullScreen={true}>
				<ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
					<Animated.View style={{ top: introButton }}>
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<ScaleImage source={require("@images/logo.png")} width={120} />
						</View>
					</Animated.View>

					<KeyboardAvoidingView behavior='padding' style={styles.form}>
						<Animated.View style={{ marginLeft, flex: 1 }}>
							<UserInput onTextChange={(s) => this.setState({ email: s })}
								placeholder={constants.input_username_or_email}
								autoCapitalize={'none'}
								returnKeyType={'next'}
								autoCorrect={false}
								style={{ width: "100%" }} />
							<View style={{ marginTop: 15, flex: 1, width: "100%", }}>
								<UserInput
									onTextChange={(s) => this.setState({ password: s })}
									secureTextEntry={this.state.showPass}
									placeholder={constants.input_password}
									returnKeyType={'done'}
									autoCapitalize={'none'}
									autoCorrect={false}
									style={{ width: "100%" }} />
								<TouchableOpacity
									activeOpacity={0.7}
									style={styles.btnEye}
									onPress={this.showPass}>
									<Image source={eyeImg} style={styles.iconEye} />
								</TouchableOpacity>
							</View>
							<View style={{ marginLeft: 20, width: 300, maxWidth: 300 }}>
								<TouchableOpacity onPress={() => { this.props.navigation.replace("forgotPassword") }} style={{ alignItems: 'flex-end' }}>
									<Text style={{ marginTop: 12, color: 'rgb(49,96,172)', paddingRight: 10 }}>Quên mật khẩu</Text>
								</TouchableOpacity>
							</View>
							<View style={{ marginLeft: 20, width: 300, maxWidth: 300 }}>
								<ButtonSubmit style={{ width: '100%' }} onRef={ref => (this.child = ref)} click={() => { this.login() }} text={constants.login} />
							</View>
							<View style={{ width: 300, maxWidth: 300, paddingLeft: 20, justifyContent: 'center' }}>
								<TouchableOpacity onPress={this.register.bind(this)}>
									<Text style={{ marginTop: 15, color: 'rgb(155,155,155)', lineHeight: 20, fontSize: 16 }}>Nếu bạn chưa có tài khoản hãy đăng ký ngay <Text style={{ fontWeight: 'bold', color: 'rgb(0,151,124)' }}>tại đây</Text></Text>
								</TouchableOpacity>
							</View>
						</Animated.View>
					</KeyboardAvoidingView>

					<Animated.View style={{ bottom: introBottom, flex: 1 }}><SocialNetwork /></Animated.View>
				</ScrollView >
			</ActivityPanel >
		);
	}
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
	form: {
		marginTop: 80,
		alignItems: 'center',
	},
	btnEye: {
		position: 'absolute',
		right: 25,
		top: 10
	},
	iconEye: {
		width: 25,
		height: 25,
		tintColor: 'rgba(0,0,0,0.2)',
	},
});
function mapStateToProps(state) {
	return {
		userApp: state.userApp
	};
}
export default connect(mapStateToProps)(LoginScreen);