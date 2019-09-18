import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';
import constants from "../../res/strings";
import LinearGradient from 'react-native-linear-gradient'
import Field from "mainam-react-native-form-validate/Field";
import Form from "mainam-react-native-form-validate/Form";
import voucherProvider from '@data-access/voucher-provider'
import snackbar from '@utils/snackbar-utils';
import ImageLoad from "mainam-react-native-image-loader";
import { Card } from 'native-base'

class FillMyVocherScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voucher: '',
            item: {}
        };
    }
    onChangeText = (s) => this.setState({ voucher: s })

    checkVoucher = () => {
        Keyboard.dismiss();
        if (!this.form.isValid()) {
            return;
        }
        let confirm = () => {

            let booking = this.props.booking
            let services = booking && booking.services ? booking.services : []
            let priceServices = services.reduce((total, item) => {
                return total + parseInt(item.price)
            }, 0)
            let voucher = this.state.voucher || ""
            voucherProvider.fillInVoucher(voucher.toUpperCase()).then(res => {
                if (this.props.parrent) {
                    this.props.parrent.setState({ isLoading: false });
                }

                if (res.code == 0) {
                    if (res.data) {
                        // if (priceServices < res.data.price) {
                        //     snackbar.show(constants.voucher.money_not_bigger_sum_price, 'danger')
                        // } else {
                        // this.props.onPress && this.props.onPress(res.data)
                        // this.setState({ item: res.data })
                        this.props.parrent.props.navigation.navigate('detailsVoucher', {
                            item: res.data,
                            booking
                        })
                        // }
                        return;
                    }
                }
                snackbar.show(constants.voucher.voucher_not_found_or_expired, "danger")
            }).catch(err => {
                if (this.props.parrent)
                    this.props.parrent.setState({ isLoading: false })
                console.log('err: ', err.response);

            })
        }

        if (this.props.parrent)
            this.props.parrent.setState({ isLoading: true }, () => {
                confirm();
            })
        else
            confirm();

    }

    
    render() {
        const icSupport = require("@images/new/user.png");
        const { item } = this.state
        console.log('item: ', item);
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <View style={{
                        flex: 1
                    }}>
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
                                        required: constants.voucher.voucher_not_null,
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
                                onPress={this.checkVoucher}
                                style={styles.button}
                            >
                                <Text style={styles.txtButton}>{constants.actionSheet.confirm.toUpperCase()}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        );
    }
}
const styles = StyleSheet.create({
    groupPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        flexWrap: 'wrap',
        flexShrink: 2
    },
    groupInfo: {
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1
    },
    titleInfoVoucher: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 10
    },
    container2: {
        padding: 10,
        flex: 2,
    },
    txtTitle: {
        fontSize: 15,
        color: '#111',
        paddingVertical: 5
    },
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
    customImagePlace: {
        height: 100,
        width: 100,
        borderRadius: 50
    },

    styleImgLoad: {
        width: 100,
        height: 100,
        paddingRight: 5
    },
    shadow: {
        elevation: 3,
        shadowColor: '#111111',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 2
    },
    txtButton: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15
    },
    quality: {
        color: '#27AE60',
        fontWeight: '500',
        paddingLeft: 10,
    },
    btn: {
        backgroundColor: '#27AE60',
        height: 38,
        width: '55%',
        borderRadius: 7,
        alignSelf: 'center',
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    containerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',

    },

    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF'
    },
    containerText: {
        // backgroundColor: '#FFFFFF',
        width: '100%',
        color: '#27AE60',
        paddingLeft: 10
    },
});
export default FillMyVocherScreen;
