import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import stringUtils from 'mainam-react-native-string-utils';

import specialistProvider from '@data-access/specialist-provider';

class TextField extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false,
            message: ""
        }
    }
    getError() {
        if (!this.props.validate) {
            return null;
        }
        var validator = this.props.validate;
        if (validator instanceof Object) {
            let rules = validator.rules ? validator.rules : {};
            let messages = validator.messages ? validator.messages : {};
            if (rules.required) {
                if (!this.state.value || !this.state.value.trim()) {
                    let message = messages.required ? messages.required : "Trường này là bắt buộc";
                    let result = { error: true, message };
                    this.setState(result);
                    return result;
                }
            }
            if (rules.minlength && rules.minlength > 0) {
                if (this.state.value && this.state.value.length < rules.minlength) {
                    let message = messages.minlength ? messages.minlength : "Yêu cầu tối thiểu " + rules.minlength + " ký tự";
                    let result = { error: true, message };
                    this.setState(result);
                    return result;
                }
            }
            if (rules.maxlength && rules.maxlength > 0) {
                if (this.state.value && this.state.value.length > rules.maxlength) {
                    let message = messages.maxlength ? messages.maxlength : "Yêu cầu tối đa " + rules.maxlength + " ký tự";
                    let result = { error: true, message };
                    this.setState(result);
                    return result;
                }
            }
            if (rules.equalTo) {
                let equalTo = rules.equalTo;
                if (rules.equalTo instanceof Function) {
                    equalTo = rules.equalTo();
                }

                if (this.state.value != equalTo) {
                    let message = messages.equalTo ? messages.equalTo : "Dữ liệu không trùng khớp";
                    let result = { error: true, message };
                    this.setState(result);
                    return result;
                }
            }
            if (rules.password) {
                var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
                if (!re.test(this.state.value)) {
                    let message = messages.password ? messages.password : "Mật khẩu nhập không hợp lệ";
                    let result = { error: true, message };
                    this.setState(result);
                    return result;
                }
            }
            if (rules.email) {
                if (!this.state.value.isEmail()) {
                    let message = messages.email ? messages.email : "Vui lòng nhập đúng định dạng email";
                    let result = { error: true, message };
                    this.setState(result);
                    return result;
                }
            }
            if (rules.phone) {
                if (!this.state.value.isPhoneNumber()) {
                    let message = messages.phone ? messages.phone : "Vui lòng nhập đúng định dạng số điện thoại";
                    let result = { error: true, message };
                    this.setState(result);
                    return result;
                }
            }
            if (rules.number) {
                var re = /^-{0,1}\d+$/g;
                if (!re.test(this.state.value)) {
                    let message = messages.number ? messages.number : "Vui lòng nhập đúng định dạng ký tự số";
                    let result = { error: true, message };
                    this.setState(result);
                    return result;
                }
            }
            if (rules.min) {
                if (this.state.value < rules.min) {
                    let message = messages.min ? messages.min : "Vui lòng nhập giá trị lớn hơn " + rules.min;
                    let result = { error: true, message };
                    this.setState(result);
                    return result;
                }
            }
            if (rules.max) {
                if (this.state.value > rules.max) {
                    let message = messages.max ? messages.max : "Vui lòng nhập giá trị nhỏ hơn " + rules.max;
                    let result = { error: true, message };
                    this.setState(result);
                    return result;
                }
            }
            for (var name in rules) {
                var fun = rules[name];
                if (fun instanceof Function) {
                    if (!fun(this.state.value, this)) {
                        let message = messages[name] ? messages[name] : "Dữ liệu không hợp lệ";
                        let result = { error: true, message };
                        this.setState(result);
                        return result;
                    }
                }
            }
        }
        this.setState({ message: "", error: false });
        return null;
    }

    isValid() {
        var error = this.getError();
        return error;
    }

    onChangeText(s) {
        this.setState({
            value: s
        }, () => {
            this.isValid();
        })
    }
    // shouldComponentUpdate(newProps, newState) {
    //     return true;
    // }
    render() {
        return (
            <View {...this.props}>
                <TextInput style={[this.props.inputStyle, this.state.error ? this.props.inputStyleError : null]} onChangeText={this.onChangeText.bind(this)} />
                {
                    this.state.error ?
                        this.props.getLableError ?
                            this.props.getLableError(this.state.message) :
                            <Text style={[this.props.errorStyle]}>{this.state.message}</Text> : null
                }
            </View>
        );
    }
}

export default TextField;