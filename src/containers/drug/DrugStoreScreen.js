import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { TouchableOpacity } from 'react-native-gesture-handler';
const devices_width = Dimensions.get('window').width
export default class DrugStoreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ScaledImage style={styles.bgdemo} width={devices_width} source={require('@images/new/drug/bg_demo.png')}></ScaledImage>
                <View style={styles.viewShop}>
                    <Text style={styles.txNameShop}>NHÀ THUỐC TẤN MINH</Text>
                    <Text style={styles.txLocation}>Toà nhà Udic Complex , Hoàng Đạo Thuý, Cầu Giấy, Hà Nội</Text><TouchableOpacity><Text>Xem bản đồ</Text></TouchableOpacity>
                    <Text style={styles.txTitle}>Thông tin nhà thuốc</Text>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Số điện thoại: </Text>
                        <Text style={styles.txContents}>0333876555</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Loại hình NT: </Text>
                        <Text style={styles.txContents}>Nhà thuốc</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Đạt chuẩn: </Text>
                        <Text style={styles.txContents}>238946894</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Số đăng ký NT: </Text>
                        <Text style={styles.txContents}>238946894</Text>
                    </View>
                    <Text style={styles.txTitle}>Thông tin người đại diện</Text>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Người đại diện: </Text>
                        <Text style={styles.txContents}>Nguyễn Đình Huấn</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Trình độ chuyên môn: </Text>
                        <Text style={styles.txContents}>Dược sĩ</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Số chứng chỉ hành nghề: </Text>
                        <Text style={styles.txContents}>238946894</Text>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    bgdemo: {
        marginTop: 20
    },
    container: {
        padding: 10,
        flex: 1
    },
    viewInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    txLabel: {
        color: '#000',
        fontSize: 14,
        textAlign: 'left',
        marginLeft:10

    },
    txContents: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    txTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        fontStyle: 'italic',
        color: '#00BA99',
        textAlign: 'right',
    },
    txBtn: {
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: '#00A3FF'
    },
    txLocation: {
        fontSize: 14,
        textAlign: 'left',
        color: '#808080'
    },
    txNameShop: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left'
    },
    viewShop: {
        alignItems: 'flex-start',
        marginVertical: 20,
        flex: 1
    }
})
