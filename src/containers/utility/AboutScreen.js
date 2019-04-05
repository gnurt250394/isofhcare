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
                    <Text>ISOFH được thành lập tháng 12/2015 với mục tiêu phát triển nền tảng hàng đầu về công nghệ thông tin y tế, xây dựng hệ thống y tế thông tin tại Việt Nam.</Text>
                    <Text>3 giải pháp cốt lõi trong quản lý và vận hành hệ thống thông tin y tế cũng là thế mạnh nổi bật của ISOFH gồm:</Text>
                    <Text style={{ marginTop: 10 }}>1. Giải pháp quản lý toàn diện</Text>
                    <Text>2. Giải pháp kết nối hoàn chỉnh</Text>
                    <Text>3. Giải pháp lưu trữ an toàn</Text>
                    <Text style={{ marginTop: 10 }}>Đáp ứng hiệu quả: Tối ưu quy trình khám, chữa bệnh bằng công nghệ.</Text>
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