import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class DetailsDrugScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    selectLocation = () => {
        this.props.navigation.navigate('selectLocation')
    }
    render() {
        return (
            <View style = {styles.container}>
                <ScaledImage height={100} source={require('@images/new/drug/ic_bg_find_drug.png')}></ScaledImage>
                <View style = {styles.viewTitle}>
                    <Text style = {styles.txTitle}>Đơn thuốc da liễu BS Huấn</Text>
                    <Text style = {styles.txContent}>Ngày tạo: 21/10/2019</Text>
                    <Text><Text style = {styles.txContent}>Trạng thái: </Text><Text style = {styles.txStatus}>Đã lưu</Text></Text>
                </View>
                <View style = {styles.viewImg}>
                    <Text style = {styles.txLabel}>Hình ảnh đơn thuốc(5)</Text>
                    <View>
                    </View>
                    <Text style = {styles.txLabel}>Ghi chú</Text>
                    <Text style = {styles.txContent}>Đơn thuốc uống trong 15 ngày, dừng 7 ngày mới có thể tiếp tục uống lại, kiêng thực phẩm tanh</Text>
                </View>
                <View style = {styles.viewLocation}>
                    <Text style = {styles.txLocation}>Nhập địa chỉ của bạn để tìm nhà thuốc gần nhất</Text>
                    <TouchableOpacity onPress={this.selectLocation} style={styles.btnLocation}>
                        <View style={styles.inputLocation}>
                            <ScaledImage source={require('@images/new/drug/ic_location.png')} height={20}></ScaledImage>
                            <Text style={styles.txLabelLocation}>Nhập địa chỉ</Text>
                        </View>
                        <ScaledImage source={require('@images/new/drug/ic_btn_location.png')} height={10}></ScaledImage>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnFind}><Text style={styles.txFind}>Tìm nhà thuốc</Text></TouchableOpacity>

                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f2f2f2'
    },
    btnLocation: {
        minHeight: 41,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    inputLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    txLabelLocation: {
        color: '#00A3FF',
        textDecorationLine: 'underline',
        fontSize: 14,
        marginLeft: 10,
        fontStyle: 'italic',
    },
    btnFind: {
        borderRadius: 6,
        alignSelf: 'center',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CBA7',
        paddingHorizontal: 60,
        marginTop: 30
    },
    txFind: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center'
    },
    txLocation: {
        fontSize: 14,
        color: '#000',
        textAlign: 'left',
        fontStyle: 'italic',
    },
    viewLocation:{
        padding:10,
        marginTop:10,
        backgroundColor:'#fff',
        flex:1,
    },
    txLabel:{
        fontSize:14,
        fontWeight:'bold',
        color:'#00BA99',
        fontStyle:'italic'
    },
    txContent:{
        fontSize:14,
        color:'#808080',
        textAlign:'left'
    },
    viewImg:{
        padding:10,marginTop:10,backgroundColor:'#fff'
    },
    viewTitle:{
        backgroundColor:'#fff',
        justifyContent:'center',
        padding:10
    },
    txTitle:{
        fontSize:16,
        fontWeight:'bold',
        color:'#000',
        textAlign:'left'
    },
    txStatus:{
        fontSize:14,
        fontWeight:'bold',
        color:'#3161ad'
    }
})