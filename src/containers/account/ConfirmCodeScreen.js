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
		let phone = this.props.navigation.getParam("phone", null);
		if (!phone)
			this.props.navigation.pop();
		this.state = {
			press: false,
			code: "",
			phone
		}
	}


	confirmCode() {
		Keyboard.dismiss();
		if (!this.state.code) {
			snackbar.showShort(constants.msg.user.please_input_verify_code, 'danger');
			this.child.unPress();
			return;
		}

		userProvider.confirmCode(this.state.phone, this.state.code, (s, e) => {
			this.child.unPress();
			if (s) {

				// // snackbar.show("Thông tin đăng nhập không hợp lệ");
				// // return;
				switch (s.code) {
					case 0:
						snackbar.show(constants.msg.user.confirm_code_success, 'success');
						this.props.navigation.replace("resetPassword", { id: s.data.user.id });
						return;
				}

			}
			if (e) {
				console.log(e);
			}
			snackbar.show(constants.msg.user.confirm_code_not_success);
		});
	}


	render() {
		return (
			<ActivityPanel style={{ flex: 1 }} touchToDismiss={true} hideActionbar={true} hideStatusbar={true} showFullScreen={true}>
				<ScrollView style={{ flex: 1 }}
					keyboardShouldPersistTaps="always">
					<View style={{ marginTop: 60, justifyContent: 'center', alignItems: 'center' }}>
						<ScaleImage source={require("@images/logo.png")} width={120} />
					</View>
					<KeyboardAvoidingView behavior='padding'
						style={styles.form}>
						<UserInput onTextChange={(s) => this.setState({ code: s })}
							placeholder={constants.input_code}
							autoCapitalize={'none'}
							returnKeyType={'next'}
							autoCorrect={false} />

						<ButtonSubmit onRef={ref => (this.child = ref)} click={() => { this.confirmCode() }} text={constants.confirm} />
					</KeyboardAvoidingView>


				</ScrollView >
			</ActivityPanel >
		);
	}
}
const DEVICE_WIDTH = Dimensions.get('window').width;

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