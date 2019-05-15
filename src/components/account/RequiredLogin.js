import React, { Component } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import constants from '@resources/strings'
import { connect } from 'react-redux';
import {
    StyleSheet
} from 'react-native';

class RequiredLogin extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
    }
    login() {
        Actions.login({ directScreen: this.props.directScreen })
    }
    register() {
        Actions.createAccount({ directScreen: this.props.directScreen })
    }
    render() {
        return (
            <View>
                {!this.props.userApp.isLogin ?
                    <TouchableOpacity onPress={
                        () => {
                        this.login()
                    }}>
                        <View style={{ flexDirection: 'row', backgroundColor: constants.colors.primaryColor, padding: 10, alignItems: 'center' }}>
                            <ScaleImage source={require("@images/ic_account_logo.png")} width={60} />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={{ color: constants.colors.white }}>Bạn chưa đăng nhập vui lòng</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => { this.login() }}>
                                        <Text style={{ fontWeight: 'bold', color: constants.colors.white }}>Đăng nhập</Text>
                                    </TouchableOpacity>
                                    <Text style={{
                                        marginLeft: 5, marginRight: 5, color: constants.colors.white
                                    }} > /</Text>
                                    <TouchableOpacity onPress={() => { this.register() }}>
                                        <Text style={{ fontWeight: 'bold', color: constants.colors.white }}>Đăng ký</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <ScaleImage width={10} source={require("@images/ic_next.png")} />
                        </View>
                    </TouchableOpacity>
                    : null
                }

            </View>
        )
    };
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
    }
}
export default connect(mapStateToProps)(RequiredLogin);