import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput ,Keyboard,KeyboardAvoidingView} from 'react-native';
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';
import constants from "@resources/strings";
import LinearGradient from 'react-native-linear-gradient'
import Field from "mainam-react-native-form-validate/Field";
import Form from "mainam-react-native-form-validate/Form";

class FillMyVocher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voucher: ''
        };
    }
    onChangeText = (s) => this.setState({ voucher: s })

    comfirmVoucher=()=>{
        Keyboard.dismiss();
		if (!this.form.isValid()) {
			return;
        }
       this.props.onPress && this.props.onPress(this.state.voucher)
    }
    render() {
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior="padding">
                <Form ref={ref => (this.form = ref)}>
                        <TextField
                            onChangeText={this.onChangeText}
                            inputStyle={styles.inputVoucher}
                            errorStyle={styles.errorStyle}
                            validate={{
                                rules: {
                                    required: true,
                                },
                                messages: {
                                    required: "Mã ưu đãi không được bỏ trống",
                                }
                            }}
                            placeholder={'Mã ưu đãi'}
                            autoCapitalize={"none"}
                        />
                </Form>
                <LinearGradient
                    colors={['rgb(255, 214, 51)', 'rgb(204, 163, 0)', 'rgb(179, 143, 0)']}
                    locations={[0, 0.7, 1]}
                    style={styles.containerButton}>
                    <TouchableOpacity
                    onPress={this.comfirmVoucher}
                        style={styles.button}
                    >
                        <Text style={styles.txtButton}>XÁC NHẬN</Text>
                    </TouchableOpacity>
                </LinearGradient>
                </KeyboardAvoidingView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,

    },
    txtButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    errorStyle: {
        color: "red",
        marginTop: 10,
        alignSelf: 'center'
    },
    container: {
        flex: 1,
        paddingTop: '10%'
    },
    inputVoucher: {
        width: '70%',
        alignSelf: 'center',
        borderColor: '#111111',
        borderWidth: 0.7,
        backgroundColor: '#DDDDDD',
        textAlign: 'center',
        fontSize: 15,
        borderRadius: 5
    },
    containerButton: {
        height: 43,
        width: 140,
        alignSelf: 'center',
        borderRadius: 8,
        marginTop: 25,
        marginBottom: 5
    },

});
export default FillMyVocher;
