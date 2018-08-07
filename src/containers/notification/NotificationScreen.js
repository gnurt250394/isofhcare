import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from 'mainam-react-native-scaleimage';

class NotificationScreen extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <ActivityPanel style={{ flex: 1 }} title="Thông báo" showFullScreen={true}>
                <TouchableOpacity style={{ backgroundColor: 'rgb(238,248,247)', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Bạn</Text> có một sự kiện mới vào 22/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'rgb(238,248,247)' }}>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Bạn</Text> có một sự kiện mới vào 22/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'rgb(238,248,247)' }}>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Bạn</Text> có một sự kiện mới vào 22/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Bạn</Text> có một sự kiện mới vào 22/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Bạn</Text> có một sự kiện mới vào 22/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Bạn</Text> có một sự kiện mới vào 22/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Bạn</Text> có một sự kiện mới vào 22/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Bạn</Text> có một sự kiện mới vào 22/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={{ flexDirection: 'row', padding: 11, paddingLeft: 13, paddingRight: 13 }}>
                        <ScaleImage source={require("@images/doctor.png")} width={47} />
                        <View style={{ paddingTop: 4, marginLeft: 19 }}>
                            <Text style={{ fontSize: 14 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}>Bạn</Text> có một sự kiện mới vào 22/10/2018</Text>
                            <Text style={{ fontSize: 12, color: '#00000060', marginTop: 8 }}>5 giờ trước</Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: "rgb(204,204,204)" }} />
                </TouchableOpacity>
            </ActivityPanel >
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(NotificationScreen);