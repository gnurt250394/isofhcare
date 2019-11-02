import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import InsertInfoDrug from './InsertInfoDrug'

export default class DrugInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDrug: [{
                name: 'Paracetamol 500mg'
            }, {
                name: 'Althax 120mg'
            }, {
                name: 'Aloem cream 20g'
            }, {
                name: 'Aleradin 5mg'
            }, {
                name: 'Med-Lipid Physioderm Cleansing Gel (Gel lau rửa da sinh lý)'
            }]
        };
    }
    renderItem = ({item,index}) => {
        return (
            <View style = {styles.viewItem}>
                <Text style = {styles.txName}>{item.name}</Text>
                <TouchableOpacity><ScaledImage height = {10} source = {require('@images/new/drug/ic_cancer.png')}></ScaledImage></TouchableOpacity>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.viewInputDrug}>
                    <TextInput placeholder={'Nhập tên thuốc, vd (Paracetamol 500mg)'} style={styles.inpuNameDrug}></TextInput>
                    <ScaledImage height={20} source={require('@images/new/drug/ic_search.png')}></ScaledImage>
                </View>
                <View style={styles.listSelect}>
                    <Text style={styles.txSelect}>Danh sách thuốc đã chọn {this.state.listDrug ? `(${this.state.listDrug.length})` : '(0)'}</Text>
                    <FlatList
                        data={this.state.listDrug}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                    >
                    </FlatList>
                </View>
                <InsertInfoDrug></InsertInfoDrug>
                <View style={styles.viewBottom}></View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
    },
    viewInputDrug: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#00ba99',
        alignItems: 'center'
    },
    inpuNameDrug: {
        width: '92%',
        height: '100%',
        padding: 10,
    },
    listSelect: {
        padding: 10
    },
    txSelect: {
        fontStyle: 'italic',
    },
    viewItem:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomColor:'#cccccc',
        borderBottomWidth:0.5,
        paddingVertical:10

    },
    txName:{
        fontSize:14,
        fontWeight:'bold',
        color:'#000',
        textAlign:'left',
        maxWidth:'80%'
    },
    imgDelete:{
    }

})