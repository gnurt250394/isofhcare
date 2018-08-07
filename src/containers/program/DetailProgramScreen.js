import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, TouchableOpacity, TextInput, Keyboard, ScrollView, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';
import redux from '@redux-store';


class DetailProgramScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
        console.log(this.props.userApp.currentUser);
        console.log(this.props.conference);
        console.log(this.props.session);
        console.log(this.props.topic);
    }
    follow(item) {
        this.setState({
            isLoading: true
        });
        this.props.dispatch(redux.followSession(this.props.userApp.currentUser.id, item.id, this.props.conference.listSessionFollow[item.id], (s, e) => {
            setTimeout(() => {
                this.setState({
                    isLoading: false
                })
            }, 500);
        }));
    }
    viewMap() {
        try {
            let map = JSON.parse(this.props.conference.conference.map);
            const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
            const latLng = map.lat + "," + map.lng;
            const label = this.props.conference.conference.name;
            const url = Platform.OS === 'ios' ? scheme + label + '@' + latLng : scheme + label + '@' + latLng;
            Linking.openURL(url);

        } catch (error) {
        }
    }

    showPosition() {
        try {
            var position = JSON.parse(this.props.session.position);
            if (this.props.conference.conference.userConference.role == 1) {
                if (position.vip) {
                    return <Text style={{ marginTop: 7 }}>Vị trí ghế ngồi: {position.vip}</Text>
                }
            }
            else {
                if (position.other) {
                    return <Text style={{ marginTop: 7 }}>Vị trí ghế ngồi: {position.other}</Text>
                }
            }
        } catch (error) {
            return null;
        }
    }

    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Chi tiết phiên" showFullScreen={true} isLoading={this.state.isLoading}>
                <ScrollView style={{ flex: 1, backgroundColor: '#cacaca', marginTop: 5 }}>
                    <View style={{ backgroundColor: '#FFF' }}>
                        <Text style={{ fontSize: 17, padding: 26, fontWeight: '600', textAlign: 'center' }}>{this.props.session.name}</Text>
                        <TouchableOpacity style={{ alignItems: 'center', marginTop: 25 }} onPress={() => { this.viewMap() }}>
                            <ScaleImage source={require("@images/icmap.png")} width={30} />
                            <Text style={{ color: 'rgb(0,121,107)', fontSize: 16, marginTop: 14 }}>Địa điểm: {this.props.conference.conference.location}, {this.props.conference.conference.provinceName}</Text>
                            {
                                this.showPosition()
                            }

                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: 10, paddingRight: 10, margin: 5, marginTop: 24, backgroundColor: '#FFF', shadowColor: '#000000', shadowOpacity: 0.2, shadowOffset: {}, elevation: 5 }} >
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'center' }} onPress={this.follow.bind(this, this.props.session)}>
                                {
                                    this.props.conference.listSessionFollow[this.props.session.id] ?
                                        <ScaleImage source={require("@images/icquantampressed.png")} width={18} /> :
                                        <ScaleImage source={require("@images/ic_quantam.png")} width={18} />
                                }
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginLeft: 10 }}>Quan tâm</Text>
                            </TouchableOpacity>
                            <View style={{ width: 1, height: 50, backgroundColor: '#cacaca80' }} />
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                Actions.addQuestion({
                                    topic: this.props.topic,
                                    session: this.props.session
                                });
                            }}>

                                <ScaleImage source={require("@images/btndatcauhoi.png")} width={18} />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginLeft: 10 }}>Đặt câu hỏi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <View style={{ margin: 26 }}>
                        <Text style={{ fontWeight: 'bold' }}>Báo cáo viên</Text>
                        <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15, padding: 13, borderRadius: 8, backgroundColor: '#FFF', shadowColor: '#000000', shadowOpacity: 0.2, shadowOffset: {}, elevation: 5 }} >
                            <ScaleImage source={require("@images/doctor.png")} width={61} style={{ borderRadius: 31, borderColor: 'rgb(204,204,204)', borderWidth: 2 }} />
                            <View style={{ marginLeft: 24 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Lê Thị Lệ Hoa</Text>
                                <Text style={{ color: 'rgba(0,0,0,0.64)', marginTop: 10 }}>Giám đốc bệnh viện Việt Đức</Text>
                            </View>
                        </TouchableOpacity>
                    </View> */}
                </ScrollView>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        conference: state.conference
    };
}
export default connect(mapStateToProps)(DetailProgramScreen);