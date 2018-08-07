import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import Dimensions from 'Dimensions';
const DEVICE_WIDTH = Dimensions.get('window').width;
import ImageProgress from 'mainam-react-native-image-progress';
import Progress from 'react-native-progress/Pie';
import clientUtils from '@utils/client-utils';
import convertUtils from 'mainam-react-native-convert-utils';
import QRCode from 'react-native-qrcode';
import userProvider from '@data-access/user-provider';
import redux from '@redux-store';

class MyAccountScreen extends Component {
    constructor(props) {
        super(props);
        var user = this.props.user;
        if (!user)
            user = this.props.userApp.currentUser;
        if (!user || !this.props.userApp.isLogin)
            Actions.pop();
        var title = convertUtils.toJsonArray(user.title, []);
        if (!title.length)
            title = [];
        var company = convertUtils.toJsonArray(user.company, []);
        if (!company.length)
            company = [];
        this.state = {
            user,
            title,
            company
        }
    }

    logout() {
        this.props.dispatch(redux.userLogout());
        Actions.login();
    }



    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Thông tin cá nhân" showFullScreen={true}>
                <ScrollView>
                    <View style={{ position: 'relative' }}>
                        <ScaleImage source={require("@images/bannerprofile.png")} width={DEVICE_WIDTH} style={{ marginBottom: 80 }} resizeMode="cover" />
                        <View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', width: 157, height: 157, borderRadius: 80, backgroundColor: '#00796b10', position: 'absolute', bottom: 0, left: (DEVICE_WIDTH - 157) / 2 }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', width: 130, height: 130, backgroundColor: '#00796b20', borderRadius: 65 }}>
                                    <ImageProgress
                                        indicator={Progress} resizeMode='cover' style={{ width: 104, height: 104 }} imageStyle={{ width: 104, height: 104, borderRadius: 52, borderWidth: 3, borderColor: '#00796b' }} source={{ uri: this.props.userApp.currentUser.avatar ? this.props.userApp.currentUser.avatar.absoluteUrl() : "undefined" }}
                                        defaultImage={() => {
                                            return <ScaleImage resizeMode='cover' source={require("@images/doctor.png")} width={104} style={{ width: 104, height: 104, borderRadius: 52, borderWidth: 3, borderColor: '#00796b' }} />
                                        }}
                                    />

                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 7 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>{this.state.user.degree} {this.state.user.name}</Text>
                        {this.props.userApp.currentUser.type == 1 ?
                            <View style={{ paddingTop: 10, alignItems: 'center' }}>
                                <Text style={{ marginBottom: 10, fontSize: 10, fontStyle: 'italic' }}>Mã QRCode của bạn</Text>
                                <QRCode
                                    value={JSON.stringify({ id: this.state.user.id, name: this.state.user.name })}
                                    size={100}
                                    fgColor='white' />
                            </View> : null
                        }
                        {
                            this.state.user.email && this.props.userApp.currentUser.type != 1 ?
                                <Text style={{ color: '#00000060', fontSize: 14, marginTop: 7 }}>{this.state.user.email}</Text> : null
                        }
                        {
                            this.state.user.phone && this.props.userApp.currentUser.type != 1 ?
                                <Text style={{ color: '#00000060', fontSize: 14, marginTop: 7 }}>{this.state.user.phone}</Text> : null
                        }
                        {
                            this.state.user && this.props.userApp.isLogin && this.state.user.id == this.props.userApp.currentUser.id ?
                                <TouchableOpacity style={{ marginTop: 16, marginBottom: 31, padding: 6, paddingLeft: 20, paddingRight: 20, borderWidth: 1, borderRadius: 13, borderColor: 'rgb(149,149,149)' }}
                                    onPress={() => this.logout()}><Text style={{ fontWeight: '900' }}>Đăng xuất</Text></TouchableOpacity>
                                : <View style={{ marginBottom: 31 }} />
                        }

                        {
                            this.state.title ?
                                this.state.title.map((item, i) => {
                                    return (
                                        item && this.state.company.length > i && this.state.company[i] ?
                                            <View style={{ padding: 9, flexDirection: 'row', marginTop: 0 }}>
                                                <View style={{ flex: 1, backgroundColor: 'rgb(204,204,204)', marginLeft: 10, paddingTop: 21, alignItems: 'center', paddingBottom: 26, marginRight: 9 }}>
                                                    <ScaleImage source={require("@images/icchucvu.png")} height={35} />
                                                    <Text style={{ color: '#000000', fontWeight: '800', marginTop: 24 }}>Chức vụ:</Text>
                                                    <Text style={{ color: '#000000', marginTop: 7 }}>{item}</Text>
                                                </View>
                                                <View style={{ flex: 1, backgroundColor: 'rgb(204,204,204)', marginLeft: 9, paddingTop: 21, alignItems: 'center', paddingBottom: 26, marginRight: 10 }}>
                                                    <ScaleImage source={require("@images/iccoquan.png")} height={35} />
                                                    <Text style={{ color: '#000000', fontWeight: '800', marginTop: 24 }}>Cơ quan:</Text>
                                                    <Text style={{ color: '#000000', marginTop: 7 }}>{this.state.company[i] ? this.state.company[i] : ""}</Text>
                                                </View>
                                            </View> : null
                                    );
                                }) : null
                        }
                        {
                            this.state.user.id == this.props.userApp.currentUser.id && this.props.userApp.currentUser.type != 1 ?
                                <View style={{ padding: 9, flexDirection: 'row', marginTop: 0 }}>
                                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center', height: 54, backgroundColor: 'rgb(255,132,137)', marginLeft: 10, alignItems: 'center', marginRight: 9 }}>
                                        <ScaleImage source={require("@images/icdoimk.png")} height={28} />
                                        <Text style={{ color: '#FFF', fontWeight: '800', marginLeft: 11, fontSize: 16 }}>Đổi mật khẩu</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => Actions.groupChatScreen()} style={{ flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center', height: 54, backgroundColor: 'rgb(0,121,107)', marginLeft: 10, alignItems: 'center', marginRight: 9 }}>
                                        <ScaleImage source={require("@images/icnhomchat.png")} height={28} />
                                        <Text style={{ color: '#FFF', fontWeight: '800', marginLeft: 11, fontSize: 16 }}>Nhóm chat</Text>
                                    </TouchableOpacity>
                                </View>
                                : null
                        }
                    </View>
                </ScrollView >
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(MyAccountScreen);