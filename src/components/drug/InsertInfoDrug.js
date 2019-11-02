import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { ScrollView } from 'react-native-gesture-handler';

export default class InsertInfoDrug extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.viewInput}>
                    <Text style={styles.txNameDrug}>Tên đơn thuốc</Text>
                    <TextInput underlineColorAndroid={'#fff'} style={styles.inputNameDrug} placeholder={'Nhập tên đơn thuốc'}></TextInput>
                </View>
                <View style={styles.viewInput}>
                    <Text style={styles.txNameDrug}>Ghi chú</Text>
                    <TextInput placeholder={'Viết ghi chú cho đơn thuốc'} style={styles.inputNote}></TextInput>
                </View>
                <View style={styles.viewInput}>
                    <Text style={styles.txNameDrug}>Vị trí của bạn</Text>
                    <TouchableOpacity style={styles.btnLocation}>
                        <View style={styles.inputLocation}>
                            <ScaledImage source={require('@images/new/drug/ic_location.png')} height={20}></ScaledImage>
                            <Text style={styles.txLabelLocation}>Nhập địa chỉ</Text>
                        </View>
                        <ScaledImage source={require('@images/new/drug/ic_btn_location.png')} height={10}></ScaledImage>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.btnFind}><Text style={styles.txFind}>Tìm nhà thuốc</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnSave}><Text style={styles.txSave}>Lưu lại</Text></TouchableOpacity>
                <View style={styles.viewBottom}></View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1
    },
    btnSave: {
        padding: 5
    },
    btnTabScan: {
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        width: '50%',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3161ad'
    },
    btnTabInput: {
        borderBottomRightRadius: 25,
        borderTopRightRadius: 25,
        width: '50%',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3161ad'

    },
    viewInput: {
        flex: 1,
        margin: 10
    },
    txNameDrug: {
        fontSize: 14,
        color: '#000',
        textAlign: 'left',
        fontStyle: 'italic',
    },
    inputNameDrug: {
        height: 48,
        width: '100%',
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    inputNote: {
        width: '100%',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc',
        height: 71,
        padding: 10,
    },
    btnLocation: {
        height: 41,
        width: '100%',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    inputLocation: {
        flexDirection: 'row',
        alignItems: 'center'
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
    txSave: {
        textAlign: 'center',
        color: '#3161AD',
        fontSize: 16,
        textDecorationLine: 'underline',
        fontWeight: '800',
        marginTop: 20,
    },
    viewBottom: {
        height: 50
    }
})