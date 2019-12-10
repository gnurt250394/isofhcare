import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions,Linking,Platform } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { TouchableOpacity } from 'react-native-gesture-handler';
const devices_width = Dimensions.get('window').width
export default class DrugStoreScreen extends Component {
    constructor(props) {
        super(props);
        let data = this.props.navigation.getParam('data',null)
        this.state = {
            name:data && data.name,
            address:data && data.address,
            phone:data && data.phone,
            type:data && data.type,
            ownerCertificateNumber:data && data.ownerCertificateNumber,
            registrationNumber:data && data.registrationNumber,
            standardNumber:data && data.standardNumber,
            ownerName:data && data.ownerName,
            ownerQualification:data && data.ownerQualification
        };
    }
    openMap = () => {
            var scheme = Platform.OS === 'ios' ? 'maps://?daddr=' : 'https://www.google.com/maps/search/?api=1&query=';
            var url = scheme + `${this.state.address}`;
            Linking.openURL(url);
    }
    render() {
        return (
            <View style={styles.container}>
                <ScaledImage style={styles.bgdemo} width={devices_width} source={require('@images/new/drug/bg_demo.png')}></ScaledImage>
                <View style={styles.viewShop}>
                    <Text style={styles.txNameShop}>{this.state.name.toUpperCase()}</Text>
                    <Text style={styles.txLocation}>{this.state.address}</Text><TouchableOpacity onPress = {this.openMap}><Text>Xem bản đồ</Text></TouchableOpacity>
                    <Text style={styles.txTitle}>Thông tin nhà thuốc</Text>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Số điện thoại: </Text>
                        <Text style={styles.txContents}>{this.state.phone}</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Loại hình NT: </Text>
                        <Text style={styles.txContents}>{this.state.type}</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Đạt chuẩn: </Text>
                        <Text style={styles.txContents}>{this.state.standardNumber}</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Số đăng ký NT: </Text>
                        <Text style={styles.txContents}>{this.state.registrationNumber}</Text>
                    </View>
                    <Text style={styles.txTitle}>Thông tin người đại diện</Text>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Người đại diện: </Text>
                        <Text style={styles.txContents}>{this.state.ownerName}</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Trình độ chuyên môn: </Text>
                        <Text style={styles.txContents}>{this.state.ownerQualification}</Text>
                    </View>
                    <View style={styles.viewInfo}>
                        <ScaledImage source={require('@images/new/drug/ic_dot_blue.png')} height={10}></ScaledImage>
                        <Text style={styles.txLabel}>Số chứng chỉ hành nghề: </Text>
                        <Text style={styles.txContents}>{this.state.ownerCertificateNumber}</Text>
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
