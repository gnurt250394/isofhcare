import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';
import constants from "@resources/strings";
import LinearGradient from 'react-native-linear-gradient'
import Field from "mainam-react-native-form-validate/Field";
import Form from "mainam-react-native-form-validate/Form";
import voucherProvider from '@data-access/voucher-provider'
import snackbar from '@utils/snackbar-utils';

class FillMyVocher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voucher: ''
        };
    }
    onChangeText = (s) => this.setState({ voucher: s })

    comfirmVoucher = () => {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        let booking = this.props.booking
        let services = booking && booking.services ? booking.services : []
        let priceServices = services.reduce((total, item) => {
            return total + parseInt(item.price)
        }, 0)
        voucherProvider.fillInVoucher(this.state.voucher).then(res => {
            if (res.data) {
                if (priceServices < res.data.price) {
                    snackbar.show('Số tiền ưu đãi không được vượt quá tổng số tiền dịch vụ đã chọn', 'danger')
                } else {
                    this.props.onPress && this.props.onPress(res.data)
                }
            } else {
                snackbar.show("Mã ưu đãi không tồn tại hoặc đã hết hạn vui lòng thử mã khác", "danger")
            }
        }).catch(err => {
            console.log('err: ', err.response);

        })

    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
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
                            placeholder={'Nhập mã ưu đãi'}
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
                </View>
            </TouchableWithoutFeedback>
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
        height: 43,
        alignSelf: 'center',
        borderColor: '#111111',
        borderWidth: 0.7,
        backgroundColor: '#f2f2f2',
        textAlign: 'center',
        fontSize: 16,
        borderRadius: 5,
        fontWeight: 'bold',
        color: '#27AE60',
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
