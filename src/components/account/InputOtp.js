import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import redux from "@redux-store";
import { connect } from "react-redux";
var data = {}
class InputOtp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    onChangeText1 = (text) => {
        text.length && this.input2.focus()
        data.text1 = text
        this.onPassData()
    }
    onChangeText2 = (text) => {
        text.length && this.input3.focus()
        data.text2 = text
        this.onPassData()

    }
    onChangeText3 = (text) => {
        text.length && this.input4.focus()
        data.text3 = text
        this.onPassData()
    }
    onChangeText4 = (text) => {
        text.length && this.input5.focus()
        data.text4 = text
        this.onPassData()

    }
    onChangeText5 = (text) => {
        text.length && this.input6.focus()
        data.text5 = text
        this.onPassData()

    }
    onChangeText6 = (text) => {
        data.text6 = text
        this.onPassData()

    }
    onPassData = () => {
        this.props.dispatch(redux.getOtpPhone(data));
        this.props.onCheckOtp()
    }
    // onChangeText = (text, value) => {
    //     console.log('text: ', text);
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
