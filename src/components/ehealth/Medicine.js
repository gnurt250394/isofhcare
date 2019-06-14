import React, { Component, PropTypes } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard, Image, TouchableHighlight, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import connectionUtils from '@utils/connection-utils';
import clientUtils from '@utils/client-utils';
import scheduleProvider from '@data-access/schedule-provider';
import snackbar from '@utils/snackbar-utils';
import dateUtils from "mainam-react-native-date-utils";
import bookingProvider from '@data-access/booking-provider';
import dataCacheProvider from '@data-access/datacache-provider';
import constants from '@resources/strings';
const DEVICE_WIDTH = Dimensions.get('window').width;
import ImageLoad from 'mainam-react-native-image-loader';
import ScaledImage from "mainam-react-native-scaleimage";
import CheckupResultItem from '@components/ehealth/CheckupResultItem';
import { Table, Row } from 'react-native-table-component';


class Medicine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }
    renderMedicine(list) {
        if (list) {
            return list.map((data, i) => (
                this.renderMedicineItem(i, data)
            ))
        }
        return null;
    }
    renderMedicineItem(index, item) {
        var serviceName = "";
        if (item.ServiceName)
            serviceName += item.ServiceName + "\n";
        if (item.Measure)
            serviceName += item.Measure + "\n";
        if (item.Dosage)
            serviceName += item.Dosage + "\n";
        if (item.Usage)
            serviceName += item.Usage
        var data = [index + 1, serviceName, item.Quantity, item.Unit]
        return (<Row data={data} key={index} textStyle={styles.text} flexArr={[1, 3, 1, 1]} />);
    }


    render() {
        const tableHead = ['STT', 'Tên thuốc', 'Số lượng', 'Đơn vị'];

        let { result } = this.props;
        if (!result || !result.ListResultCheckup || !result.ListResultCheckup.length)
            return null;
        let resultCheckup = result.ListResultCheckup || [];
        let medinine = [];
        resultCheckup.forEach(item => {
            if (item.ListMedicine && item.ListMedicine.length)
                medinine = medinine.concat(item.ListMedicine);
            if (item.ListExternalMedicine && item.ListExternalMedicine.length)
                medinine = medinine.concat(item.ListExternalMedicine);
        })
        if (result.ListMedicine && result.ListMedicine.length) {
            medinine = medinine.constants(result.ListMedicine);
        }
        if (medinine && medinine.length)
            return ((<View style={{ flex: 1, padding: 10 }}>
                <View style={[styles.item, { marginTop: 0 }]}>
                    <View style={styles.round1}>
                        <View style={styles.round2} />
                    </View>
                    <View style={[styles.itemlabel, { marginTop: 0 }]}>
                        <Text style={[{ fontWeight: 'bold', fontSize: 18 }]}>THUỐC</Text>
                    </View>
                </View>
                <Table style={[styles.table, { marginTop: 10 }]} borderStyle={{ borderWidth: 0.5, borderColor: '#c8e1ff' }}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.textHead} flexArr={[1, 3, 1, 1]} />
                    {this.renderMedicine(medinine)}
                </Table>
            </View>))
        else
            return null;
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
const styles = StyleSheet.create({
    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' },
    slide: {
        flex: 1,
    },
    table: { marginTop: 30 },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    textHead: { textAlign: 'center', fontWeight: 'bold' },
    text: { padding: 4, textAlign: 'center' },
    diagnosticLabel:
    {
        color: constants.colors.primary_bold,
        fontWeight: 'bold', marginBottom: 10
    },
    breakline: {
        height: 1,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: constants.colors.breakline
    }
})
export default connect(mapStateToProps)(Medicine);