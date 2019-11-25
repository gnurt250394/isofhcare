import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import redux from "@redux-store";
import { connect } from "react-redux";
class InputOtp extends PureComponent {
    constructor(props) {
        super(props);
        
        this.data = {}
    }
    onChangeText1 = (text) => {
        text.length && this.input2.focus()
        this.data.text1 = text
        this.onPassData()
    }
    onChangeText2 = (text) => {
        text.length && this.input3.focus()
        this.data.text2 = text
        this.onPassData()

    }
    onChangeText3 = (text) => {
        text.length && this.input4.focus()
        this.data.text3 = text
        this.onPassData()
    }
    onChangeText4 = (text) => {
        text.length && this.input5.focus()
        this.data.text4 = text
        this.onPassData()

    }
    onChangeText5 = (text) => {
        text.length && this.input6.focus()
        this.data.text5 = text
        this.onPassData()

    }
    onChangeText6 = (text) => {
        this.data.text6 = text
        this.onPassData()

    }
    onPassData = () => {
        let text1 = this.data && (this.data.text1 || this.data.text1 == 0) ? this.data.text1.toString() : ''
        let text2 = this.data && (this.data.text2 || this.data.text2 == 0) ? this.data.text2.toString() : ''
        let text3 = this.data && (this.data.text3 || this.data.text3 == 0) ? this.data.text3.toString() : ''
        let text4 = this.data && (this.data.text4 || this.data.text4 == 0) ? this.data.text4.toString() : ''
        let text5 = this.data && (this.data.text5 || this.data.text5 == 0) ? this.data.text5.toString() : ''
        let text6 = this.data && (this.data.text6 || this.data.text6 == 0) ? this.data.text6.toString() : ''
        
        let otp = text1.concat(text2).concat(text3).concat(text4).concat(text5).concat(text6)
        if (otp.length == 6) {
            
            this.props.dispatch(redux.getOtpPhone(otp));
        }
    }
    // onChangeText = (text, value) => {
    //     
    //     var data = []
    //     if (text.length == 1) {
    //         if (value == 1) {

    //         }
    //         if (value == 2) {
    //             this.input3.focus()
    //             data.push(text)
    //         }
    //         if (value == 3) {
    //             this.input4.focus()
    //             data.push(text)
    //         }
    //         if (value == 4) {
    //             this.input5.focus()
    //             data.push(text)
    //         }
    //         if (value == 5) {
    //             this.input6.focus()
    //             data.push(text)
    //         }
    //         if (value == 6) {
    //             data.push(text)
    //         }
    //         this.props.dispatch(redux.getOtpPhone(data));
    //         this.props.onCheckOtp()
    //     }
    // }

    render() {
        return (
            <View style={this.props.style}>
                <View style={styles.viewComponents}>
                    <TextInput
                        ref={ref => this.input1 = ref}
                        maxLength={1}
                        onChangeText={text => this.onChangeText1(text)}
                        keyboardType={'numeric'}
                        style={styles.input}
                        underlineColorAndroid={'#fff'}
                    ></TextInput>
                </View>
                <View style={styles.viewComponents}>
                    <TextInput
                        ref={ref => this.input2 = ref}
                        maxLength={1}
                        onChangeText={text => this.onChangeText2(text, 2)}
                        keyboardType={'numeric'}
                        style={styles.input}
                        underlineColorAndroid={'#fff'}
                    ></TextInput>
                </View>
                <View style={styles.viewComponents}>
                    <TextInput
                        ref={ref => this.input3 = ref}
                        maxLength={1}
                        onChangeText={text => this.onChangeText3(text, 3)}
                        keyboardType={'numeric'}
                        style={styles.input}
                        underlineColorAndroid={'#fff'}
                    ></TextInput>
                </View>
                <View style={styles.viewComponents}>
                    <TextInput
                        ref={ref => this.input4 = ref}
                        maxLength={1}
                        onChangeText={text => this.onChangeText4(text, 4)}
                        keyboardType={'numeric'}
                        style={styles.input}
                        underlineColorAndroid={'#fff'}
                    ></TextInput>
                </View>
                <View style={styles.viewComponents}>
                    <TextInput
                        ref={ref => this.input5 = ref}
                        maxLength={1}
                        onChangeText={text => this.onChangeText5(text, 5)}
                        keyboardType={'numeric'}
                        style={styles.input}
                        underlineColorAndroid={'#fff'}
                    ></TextInput>
                </View>
                <View style={styles.viewComponents}>
                    <TextInput
                        onChangeText={text => this.onChangeText6(text, 6)}
                        ref={ref => this.input6 = ref}
                        maxLength={1}
                        keyboardType={'numeric'}
                        style={styles.input}
                        underlineColorAndroid={'#fff'}
                    ></TextInput>
                </View>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    underLinde: {
        flexDirection: 'row', width: '100%',
        justifyContent: 'space-around',
    },
    viewLine: {
        backgroundColor: '#3161AD',
        height: 4,
        width: 38
    },
    input: {
        borderBottomWidth: 4,
        borderColor: '#3161AD',
        width: 38,
        textAlign: 'center'
    },
    viewComponents: {
        marginLeft: 10
    }
})
function mapStateToProps(state) {
    return {
        otpPhone: state.otpPhone
    };
}
export default connect(mapStateToProps)(InputOtp);
