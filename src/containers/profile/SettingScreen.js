import React, { Component } from 'react';
import ScaledImage from "mainam-react-native-scaleimage";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity,Linking } from 'react-native'
import ActivityPanel from '@components/ActivityPanel';
import NavigationService from "@navigators/NavigationService";
import redux from "@redux-store";
import { connect } from "react-redux";

 class SettingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }}
                icBack={require('@images/new/left_arrow_white.png')}
                iosBarStyle={'dark-content'}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#22b060"
                actionbarStyle={styles.actionbarStyle}
                titleStyle={{
                    color: '#FFF'
                }}
            >
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {/* <DrawerItems></DrawerItems> */}
                    <View style={{ marginTop: 50 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><ScaledImage width={30} source={require('@images/new/profile/ic_setting.png')}></ScaledImage><Text style={{ fontSize: 20, color: '#4BBA7B', fontWeight: '600' }}>Cài Đặt</Text></View>
                        <TouchableOpacity onPress={() => NavigationService.navigate('changePass')} style={styles.viewDrawer}>
                            <ScaledImage height={20} source={require('@images/new/profile/ic_change_password.png')} />
                            <Text style={styles.txDrawer}>Đổi mật khẩu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => NavigationService.navigate('terms')} style={styles.viewDrawer}>
                            <ScaledImage height={20} source={require('@images/new/profile/ic_policy.png')} />
                            <Text style={styles.txDrawer}>Chính sách sử dụng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            Linking.openURL(
                                "mailto:support@isofhcare.vn?subject=Hỗ trợ sử dụng app ISofhCare&body="
                            );
                        }} style={styles.viewDrawer}>
                            <ScaledImage height={15} source={require('@images/new/profile/ic_help.png')} />
                            <Text style={styles.txDrawer}>Trợ giúp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.props.dispatch(redux.userLogout());
                            if (this.props.onLogout) this.props.onLogout();
                        }} style={styles.viewDrawer}>
                            <ScaledImage height={18} source={require('@images/new/profile/ic_logout.png')} />
                            <Text style={styles.txDrawer}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ActivityPanel>

        );
    }
}
const styles = StyleSheet.create({
    avatarStyle: {
        borderRadius: 30,
        marginLeft: 15,
        borderWidth: 1,
        borderColor: '#fff',
    },
    actionbarStyle: {
        backgroundColor: '#22b060',
        borderBottomWidth: 0
    },
    viewInfo: {
        marginLeft: 10
    },
    viewDrawer: {
        flexDirection: 'row',
        padding: 10,
        marginLeft: 30,
        marginVertical: 10
    },
    txDrawer: {
        marginLeft: 10,
        color: '#000',
        fontWeight: '200',
        fontSize: 15
    },
    txHello: {
        color: '#fff',
        fontStyle: 'italic',
        fontSize: 14
    },
    txName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff'
    },
    txId: {
        color: '#fff',
        fontSize: 14
    },
    viewHeader: {
        width: '100%',
        backgroundColor: '#359A60',
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row'
    },
    imgLogo: {
        marginVertical: 20, marginLeft: 25
    }

})
function mapStateToProps(state) {
    return {
      navigation: state.navigation,
      userApp: state.userApp
    };
  }
  export default connect(mapStateToProps)(SettingScreen);