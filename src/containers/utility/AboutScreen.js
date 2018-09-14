import React, { Component } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

class AboutScreen extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ActivityPanel
                style={{ flex: 1 }}
                title="VỀ ISOFH"
                showFullScreen={true}>
                <View style={{ padding: 15 }}>
                    <Text>Nền tảng kết nối giữa người bệnh và bác sỹ</Text>
                    <Text>Chạm để được chăm sóc, không phải mệt mỏi vì chờ đợi</Text>
                    <Text>Quan tâm bản thân tốt hơn với hồ sơ y tế điện tử</Text>
                </View>
            </ActivityPanel>
        )
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(AboutScreen);