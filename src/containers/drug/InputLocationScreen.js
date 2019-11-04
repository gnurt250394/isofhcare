import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import ScaledImage from 'mainam-react-native-scaleimage';
const devices_width = Dimensions.get('window').width
export default class InputLocationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ScaledImage width={devices_width} source={require('@images/new/drug/ic_bg_find_drug.png')}></ScaledImage>

                <View style={styles.viewName}>
                    <Text style={styles.txName}>Họ và tên</Text>
                    <TextInput multiline={true} style={styles.inputName} placeholder={'Nhập họ và tên'}></TextInput>
                </View>
                <View style={styles.viewName}>
                    <Text style={styles.txName}>Số điện thoại</Text>
                    <TextInput multiline={true} keyboardType={'numeric'} style={styles.inputName} placeholder={'Nhập số điện thoại'}></TextInput>
                </View>
                <TouchableOpacity style={styles.viewLocation}>
                    <Text style={styles.txName}>Tỉnh/Thành phố</Text>
                    <View style={styles.viewAddress}>
                        <Text style={styles.inputAdress}>Chọn Tỉnh/Thành phố</Text>
                        <ScaledImage height={10} source={require('@images/new/drug/ic_btn_location.png')}></ScaledImage>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewLocation}>
                    <Text style={styles.txName}>Quận/Huyện</Text>
                    <View style={styles.viewAddress}>
                        <Text style={styles.inputAdress}>Chọn Quận/Huyện</Text>
                        <ScaledImage height={10} source={require('@images/new/drug/ic_btn_location.png')}></ScaledImage>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewLocation}>
                    <Text style={styles.txName}>Phường/Xã</Text>
                    <View style={styles.viewAddress}>
                        <Text style={styles.inputAdress} >Chọn Phường/Xã</Text>
                        <ScaledImage height={10} source={require('@images/new/drug/ic_btn_location.png')}></ScaledImage>
                    </View>
                </TouchableOpacity>
                <View style={styles.viewName}>
                    <Text style={styles.txName}>Địa chỉ</Text>
                    <TextInput multiline={true} style={styles.inputName} placeholder={'Nhập địa chỉ'}></TextInput>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5'
    },
    viewName: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    txName: {
        fontSize: 16,
        color: '#808080',
        textAlign: 'left'
    },
    inputName: {
        width: '70%',
        minHeight: 48,
        textAlign: 'right',
        color: '#000'
    },
    viewLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        minHeight: 48,
    },
    viewAddress: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '70%',
        padding:5
    },
    inputAdress: {
        textAlign: 'right',
        color: '#000',
        marginRight: 5,
    }
})