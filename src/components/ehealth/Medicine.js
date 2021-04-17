import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import constants from '@resources/strings';
import { Table, Row } from 'react-native-table-component';
import ImageEhealth from './ImageEhealth';
import { Card } from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';
import ReminderMedicine from './ReminderMedicine';

class Medicine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: [],
            resultSelected: this.props.resultSelected || {},
            isShow: this.props.showDrug,
            listResult: this.props.listResult || {},
        };
        console.log('this.props.resultSelected: ', this.props.resultSelected);
    }
    componentWillReceiveProps(preProps) {
        if (preProps.resultSelected != this.props.resultSelected) {
            this.setState({ resultSelected: preProps.resultSelected });
        }
    }
    renderMedicine() {
        let list = this.props.medicine;
        if (list && list.length) {
            return list.map((data, i) => this.renderMedicineItem(i, data));
        }
        return null;
    }
    renderMedicineItem(index, item) {


        var serviceName = '';
        if (item.medicineName) serviceName += item.medicineName + '\n';
        if (item.measure) serviceName += item.measure + '\n';
        if (item.dosage) serviceName += item.dosage + '\n';
        if (item.usage) serviceName += item.usage;
        var data = [index + 1, serviceName, item.quantity, item.unit];
        return (
            <Row
                data={data}
                key={index}
                style={
                    index % 2 == 0
                        ? { backgroundColor: '#fff' }
                        : { backgroundColor: '#f5f5f5' }
                }
                textStyle={styles.text}
                flexArr={[1, 3, 1, 1]}
            />
        );
    }
    onSetShow = () => {
        this.setState({ isShow: !this.state.isShow });
    };
    render() {
        let list = this.props.medicine;

        if (!list?.length) {
            return null;
        }
        const tableHead = ['STT', 'Tên thuốc', 'SL', 'Đơn vị'];
        return (
            <View style={styles.viewMedinine}>
                <Card style={styles.card}>
                    <TouchableOpacity
                        onPress={this.onSetShow}
                        style={[
                            styles.buttonShowInfo,
                            this.state.isShow ? { backgroundColor: '#3161AD' } : {},
                        ]}>
                        <ScaledImage
                            source={require('@images/new/ehealth/ic_drug.png')}
                            height={19}
                            style={{
                                tintColor: this.state.isShow ? '#FFF' : '#3161AD',
                            }}
                        />
                        <Text
                            style={[
                                styles.txtTitle,
                                this.state.isShow ? { color: '#FFF' } : {},
                            ]}>
                            THUỐC
            </Text>
                        <ScaledImage
                            source={require('@images/new/ehealth/ic_down2.png')}
                            height={10}
                            style={
                                this.state.isShow
                                    ? {
                                        tintColor: '#FFF',
                                    }
                                    : {
                                        transform: [{ rotate: '-90deg' }],
                                        tintColor: '#3161AD',
                                    }
                            }
                        />
                    </TouchableOpacity>
                    {this.state.isShow ? (
                        <View>
                            <ReminderMedicine
                                resultSelected={this.state.resultSelected}

                                listResult={this.state.listResult}
                            />
                            <Table style={[styles.table, { marginTop: 10 }]}>
                                <Row
                                    data={tableHead}
                                    style={styles.head}
                                    textStyle={styles.textHead}
                                    flexArr={[1, 3, 1, 1]}
                                />
                                {this.renderMedicine()}
                            </Table>
                        </View>
                    ) : null}
                </Card>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth,
    };
}
const styles = StyleSheet.create({
    txtTitle: {
        flex: 1,
        paddingHorizontal: 10,
        color: '#3161AD',
        fontWeight: 'bold',
    },
    buttonShowInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    card: {
        borderRadius: 5,
    },
    round1: {
        width: 20,
        height: 20,
        backgroundColor: '#FFF',
        borderColor: '#8fa1aa',
        borderWidth: 1.5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0291E1' },
    item: { marginTop: 10, flexDirection: 'row' },
    slide: {
        flex: 1,
    },
    table: { marginTop: 30 },
    head: {
        height: 40,
        backgroundColor: '#0291E120',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        width: '100%',
    },
    textHead: { textAlign: 'center', fontWeight: 'bold', color: '#0291E1' },
    text: { padding: 4, textAlign: 'center' },
    diagnosticLabel: {
        color: constants.colors.primary_bold,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    breakline: {
        height: 1,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: constants.colors.breakline,
    },
    viewMedinine: { flex: 1, paddingHorizontal: 10 },
    txDrug: { fontWeight: 'bold', fontSize: 18 },
    borderStyle: { borderWidth: 0.5, borderColor: '#c8e1ff' },
});
export default connect(mapStateToProps)(Medicine);
