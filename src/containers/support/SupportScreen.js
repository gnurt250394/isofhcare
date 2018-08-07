
import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, TouchableOpacity, Text, Platform, TextInput, ScrollView, KeyboardAvoidingView, Linking } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import snackbar from '@utils/snackbar-utils';
import supportProvider from '@data-access/support-provider';
import constants from '@resources/strings';

class SupportScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: "",
            phone: ""
        }
    }
    send() {
        if (!this.state.phone || !this.state.phone.trim()) {
            snackbar.show("Vui lòng nhập số điện thoại của bạn");
            return;
        }
        if (!this.state.content || !this.state.content.trim()) {
            snackbar.show("Vui lòng nhập nội dung cần hỗ trợ");
            return;
        }
        this.setState({ isLoading: true });
        supportProvider.send(this.props.conference.conference.id, this.props.userApp.currentUser.id, this.state.phone, this.state.content, (s, e) => {
            setTimeout(() => {
                this.setState({ isLoading: false });
                if (s) {
                    snackbar.show(constants.msg.support.send_support_success);
                    this.setState({ phone: "", content: "" });
                    Actions.pop();
                }
                else {
                    snackbar.show(constants.msg.support.send_support_failed);

                }
            }, 2000);
        });

    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Hỗ trợ" showFullScreen={true} isLoading={this.state.isLoading}>
                <ScrollView style={{ paddingTop: 37, paddingLeft: 18, paddingRight: 18 }}>
                    <Text style={{ marginBottom: 13 }}>Xin vui lòng <Text style={{ fontWeight: '900', fontSize: 14 }} >LIÊN HỆ</Text> với chúng tôi khi cần hỗ trợ.
                </Text>
                    <View style={{ borderRadius: 3, backgroundColor: 'rgb(235,235,235)', padding: 19, paddingTop: 29, height: 137 }}>
                        {
                            this.props.conference.conference.hotline ?
                                <Text style={{ fontSize: 19, fontWeight: 'bold' }}>Hotline: <Text onPress={() => Linking.openURL("tel:" + this.props.conference.conference.hotline)} style={{ color: 'rgb(222,76,60)' }}>{this.props.conference.conference.hotline}</Text></Text>
                                : null
                        }
                        {
                            this.props.conference.conference.email ?
                                <Text style={{ fontSize: 19, marginTop: 17, fontWeight: 'bold' }}>Email: <Text onPress={() => Linking.openURL("mailto:" + this.props.conference.conference.email)} style={{ color: 'rgb(0,138,122)' }}>{this.props.conference.conference.email}</Text></Text> :
                                null
                        }
                    </View>
                    <Text style={{ marginTop: 32 }}><Text style={{ padding: 10, fontWeight: '900', fontSize: 14 }} >HOẶC</Text> gửi nội dung cần được hỗ trợ trực tiếp cho chúng tôi.
                </Text>

                    <KeyboardAvoidingView behavior={'padding'} >
                        <View style={{ marginTop: 13, padding: 16, paddingTop: 10, paddingBottom: 10, borderWidth: 1, borderColor: 'rgb(0,121,107)', borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                onChangeText={(s) => this.setState({ phone: s })}
                                placeholder="Số điện thoại của bạn"
                                value={this.state.phone}
                                underlineColorAndroid="transparent" style={{ flex: 1, textAlignVertical: "top", padding: 0, paddingTop: Platform.OS == "android" ? 10 : 0 }} />
                        </View>
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView behavior={'padding'} >
                        <View style={{ marginTop: 13, padding: 16, borderWidth: 1, borderColor: 'rgb(0,121,107)', borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                onChangeText={(s) => this.setState({ content: s })}
                                placeholder="Nhập nội dung cần hỗ trợ"
                                value={this.state.content}
                                underlineColorAndroid="transparent" style={{ flex: 1, height: 120, textAlignVertical: "top" }} multiline={true} />
                        </View>
                    </KeyboardAvoidingView>
                    <TouchableOpacity style={{ backgroundColor: "rgb(0,121,107)", marginTop: 16, padding: 16, borderWidth: 1, borderColor: 'rgb(0,121,107)', borderRadius: 5, flexDirection: 'row', alignItems: 'center' }} onPress={this.send.bind(this)}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, flex: 1, color: 'white', textAlign: 'center' }}>GỬI HỖ TRỢ</Text>
                    </TouchableOpacity>

                    <View style={{ height: 400 }} />
                </ScrollView>
            </ActivityPanel>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        conference: state.conference
    };
}
export default connect(mapStateToProps)(SupportScreen);