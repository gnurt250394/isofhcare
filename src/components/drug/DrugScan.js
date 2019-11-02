import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { ScrollView } from 'react-native-gesture-handler';
import InsertInfoDrug from './InsertInfoDrug'
export default class DrugScan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isScan: true
        };
    }
    selectTab = () => {
        let isScan = this.state.isScan
        this.setState({
            isScan: !isScan
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.btnCamera}>
                    <ScaledImage source={require('@images/new/drug/ic_scan.png')} height={20}></ScaledImage>
                    <Text style={styles.txCamera}>Chụp đơn thuốc</Text></TouchableOpacity>
                <View></View>
                <InsertInfoDrug></InsertInfoDrug>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
    },

    btnCamera: {
        marginTop: 20,
        backgroundColor: '#FF8A00',
        borderRadius: 6,
        height: 48,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20
    },
    txCamera: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },

})