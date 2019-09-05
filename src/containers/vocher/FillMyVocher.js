import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';
import constants from "@resources/strings";
import LinearGradient from 'react-native-linear-gradient'
import Field from "mainam-react-native-form-validate/Field";

class FillMyVocher extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <TextField
                    // getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                    //     placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'}
                    //     inputStyle={styles.textInputStyle}
                    //     labelStyle={styles.labelStyle} placeholder={constants.phone} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                    onChangeText={s => this.setState({ email: s })}
                    inputStyle={styles.inputVoucher}
                    errorStyle={styles.errorStyle}
                    validate={{
                        rules: {
                            required: true,
                        },
                        messages: {
                            required: "Số điện thoại không được bỏ trống",
                        }
                    }}

                    placeholder={'Mã ưu đãi'}
                    autoCapitalize={"none"}
                />
                <LinearGradient
                    colors={['rgb(255, 214, 51)', 'rgb(204, 163, 0)', 'rgb(179, 143, 0)']}
                    locations={[0, 0.7, 1]}
                    style={styles.containerButton}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 8,

                        }}
                    >
                        <Text style={styles.txtButton}>XÁC NHẬN</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        );
    }
}
const styles = StyleSheet.create({
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
