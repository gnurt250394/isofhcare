import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TextField from "mainam-react-native-form-validate/TextField";
import FloatingLabel from 'mainam-react-native-floating-label';
import constants from "@resources/strings";
import LinearGradient from 'react-native-linear-gradient'


class FillMyVocher extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{
                flex: 1,
                paddingTop: 20
            }}>
                <TextField
                    // getComponent={(value, onChangeText, onFocus, onBlur, isError) => <FloatingLabel
                    //     placeholderStyle={{ fontSize: 16, fontWeight: '200' }} value={value} underlineColor={'#02C39A'}
                    //     inputStyle={styles.textInputStyle}
                    //     labelStyle={styles.labelStyle} placeholder={constants.phone} onChangeText={onChangeText} onBlur={onBlur} onFocus={onFocus} />}
                    onChangeText={s => this.setState({ email: s })}
                    inputStyle={{
                        width: '70%',
                        alignSelf: 'center',
                        borderColor: '#111111',
                        borderWidth: 1,
                        elevation: 3,
                        backgroundColor: '#fff',
                    }}
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

                    // placeholder={constants.input_password}
                    autoCapitalize={"none"}
                />
                <LinearGradient
                    colors={['rgb(255, 214, 51)', 'rgb(204, 163, 0)', 'rgb(179, 143, 0)']}
                    locations={[0, 0.7, 1]}
                    style={styles.containerButton}>
                    <TouchableOpacity
                        >
                        <Text style={{
                            color:'#fff',
                            fontSize:16,
                            fontWeight:'bold'
                        }}>XÁC NHẬN</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    containerButton: {
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        alignSelf: 'center',
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 5
    },

});
export default FillMyVocher;
