import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import DrugScan from '@components/drug/DrugScan'
import DrugInput from '@components/drug/DrugInput'
import { ScrollView } from 'react-native-gesture-handler';
export default class FindDrugScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isScan: true
        };
    }
    selectInputTab = () => {
        this.setState({
            isScan: false
        })
    }
    selectScanTab = () => {
        this.setState({
            isScan:true
        })
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <ScaledImage height={100} source={require('@images/new/drug/ic_bg_find_drug.png')}></ScaledImage>
                {
                    this.state.isScan ? (
                        <View><View style={styles.viewTab}>
                            <TouchableOpacity onPress={this.selectScanTab} style={[styles.btnTabScan, styles.btnSelected]}><Text style={styles.txSelected}>Chụp đơn thuốc</Text></TouchableOpacity>
                            <TouchableOpacity onPress={this.selectInputTab} style={[styles.btnTabInput, styles.btnUnselected]}><Text style={styles.txUnSelected}>Nhập đơn thuốc</Text></TouchableOpacity>
                        </View>
                            <DrugScan />
                        </View>
                    ) : (
                            <View>
                                <View style={styles.viewTab}>
                                    <TouchableOpacity onPress={this.selectScanTab} style={[styles.btnTabScan, styles.btnUnselected]}><Text style={styles.txUnSelected}>Chụp đơn thuốc</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={this.selectInputTab} style={[styles.btnTabInput, styles.btnSelected]}><Text style={styles.txSelected}>Nhập đơn thuốc</Text></TouchableOpacity>
                                </View>
                                <DrugInput></DrugInput>
                            </View>
                        )
                }

            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    viewTab: {
        flexDirection: 'row',
        borderRadius: 50,
        margin: 10
    },
    btnSelected: {
        backgroundColor: '#3161AD',
    },
    btnUnselected: {
        backgroundColor: '#fff',
    },
    txSelected: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800'
    },
    txUnSelected: {
        color: '#3161ad',
        fontSize: 16,
        fontWeight: '800'
    },
    btnTabScan: {
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        width: '50%',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3161ad',
        borderRightWidth:0
    },
    btnTabInput: {
        borderBottomRightRadius: 25,
        borderTopRightRadius: 25,
        width: '50%',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3161ad',
        borderLeftWidth:0
    },
})