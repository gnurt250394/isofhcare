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
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import resultUtils from '@ehealth/daihocy/utils/result-utils';


class MedicalTestResult extends Component {
    constructor(props) {
        super(props);
        let result1 = this.props.result;
        let hasResult = false;
        if (result1) {
            if (result1.ListResulHuyetHoc && result1.ListResulHuyetHoc.length) {
                hasResult = true;
            }
            if (result1.ListResulHoaSinh && result1.ListResulHoaSinh.length) {
                hasResult = true;
            }
            if (result1.ListResulOther && result1.ListResulOther.length) {
                hasResult = true;
            }
            if (result1.ListResulViSinh && result1.ListResulViSinh.length) {
                hasResult = true;
            }
        }
        if (!hasResult) {
            this.state = {}
            return null;
        }

        let result = [];
        if (result1.ListResulViSinh && result1.ListResulViSinh.length > 0) {
            var item = {
                type: 'Vi Sinh',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);

            result1.ListResulViSinh.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }
        if (result1.ListResulHoaSinh && result1.ListResulHoaSinh.length > 0) {
            var item = {
                type: 'Hóa Sinh',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);
            result1.ListResulHoaSinh.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }
        if (result1.ListResulHuyetHoc && result1.ListResulHuyetHoc.length > 0) {
            var item = {
                type: 'Huyết Học',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);
            result1.ListResulHuyetHoc.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }
        if (result1.ListResulOther && result1.ListResulOther.length > 0) {
            var item = {
                type: 'Xét Nghiệm Khác',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);
            result1.ListResulOther.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }

        this.state = {
            listTime: [],
            medicalTestResult: result,
            currentGroup: result[0]
        }
    }

    viewGroup(item) {
        this.setState({
            currentGroup: item
        })
    }
    renderMedicalTestLine(item, index) {
        return (
            <View key={index}>
                <Cell data={item.ServiceName} textStyle={[styles.textValue, { fontWeight: 'bold' }]} style={{ backgroundColor: '#DFF5F2' }}></Cell>
                {
                    item.ServiceMedicTestLine.map((item2, i) => {
                        var range = resultUtils.getRangeMedicalTest(item2);

                        var isHighlight = resultUtils.showHighlight(item2);


                        return (
                            this.state.currentGroup.type == 'Vi Sinh' ?
                                <TableWrapper style={{ flexDirection: 'row' }} key={i}>
                                    <Cell data={item2.NameLine.trim()} textStyle={[styles.textValue]}></Cell>
                                    <Cell data={resultUtils.getResult(item2)} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                                </TableWrapper>
                                :
                                <TableWrapper style={{ flexDirection: 'row' }} key={i}>
                                    <Cell data={item2.NameLine.trim()} textStyle={[styles.textValue]}></Cell>
                                    <Cell data={resultUtils.getResult(item2)} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                                    <Cell data={range} textStyle={[styles.textValue]}></Cell>
                                    <Cell data={item2.Unit} textStyle={[styles.textValue,]}></Cell>
                                </TableWrapper>
                        )
                    })
                }
            </View>
        );

    }

    renderMedical(item, index) {
        if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0 && item.ServiceMedicTestLine[0].NameLine != 0) {
            return (this.renderMedicalTestLine(item, index));
        }
        if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0) {
            var range = resultUtils.getRangeMedicalTest(item.ServiceMedicTestLine[0]);
            var isHighlight = resultUtils.showHighlight(item.ServiceMedicTestLine[0]);

            var data =
                this.state.currentGroup.type == 'Vi Sinh' ?
                    <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                        <Cell data={item.ServiceName.trim()} textStyle={[styles.textValue]}></Cell>
                        <Cell data={resultUtils.getResult(item.ServiceMedicTestLine[0])} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                    </TableWrapper>
                    :
                    <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                        <Cell data={item.ServiceName.trim()} textStyle={[styles.textValue]}></Cell>
                        <Cell data={resultUtils.getResult(item.ServiceMedicTestLine[0])} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                        <Cell data={irange} textStyle={[styles.textValue]}></Cell>
                        <Cell data={item.ServiceMedicTestLine[0].Unit} textStyle={[styles.textValue,]}></Cell>
                    </TableWrapper>
            return data;
        }
        var range = resultUtils.getRangeMedicalTest(item);
        var isHighlight = resultUtils.showHighlight(item);
        var data = this.state.currentGroup.type == 'Vi Sinh' ?
            <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                <Cell data={item.ServiceName.trim()} textStyle={[styles.textValue, { fontWeight: 'bold' }]}></Cell>
                <Cell data={resultUtils.getResult(item)} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
            </TableWrapper>
            :
            <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                <Cell data={item.ServiceName.trim()} textStyle={[styles.textValue, { fontWeight: 'bold' }]}></Cell>
                <Cell data={resultUtils.getResult(item)} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                <Cell data={range} textStyle={[styles.textValue]}></Cell>
                <Cell data={item.Unit} textStyle={[styles.textValue,]}></Cell>
            </TableWrapper>
        return data;
    }
    renderData() {
        return this.state.currentGroup.value.ListMedical.map((data, i) => (
            this.renderMedical(data, i)
        ))
    }
    render() {
        if (!this.state.currentGroup)
            return null;

        const tableHead = this.state.currentGroup && this.state.currentGroup.type == 'Vi Sinh' ? ['TÊN XÉT NGHIỆM', 'KẾT QUẢ'] : ['TÊN XÉT NGHIỆM', 'KẾT QUẢ', 'GIÁ TRỊ BÌNH THƯỜNG', 'ĐƠN VỊ'];

        return (<View>
            <View style={{ flexDirection: 'row', position: 'relative', flex: 1, padding: 10 }}>
                <View style={{ flex: 1, marginLeft: 16.5 }}>
                    <View style={[styles.item, { marginTop: 0 }]}>
                        <View style={styles.round1}>
                            <View style={styles.round2} />
                        </View>
                        <View style={[styles.itemlabel, { marginTop: 0 }]}>
                            <Text style={[{ fontWeight: 'bold', fontSize: 18 }]}>KẾT QUẢ XÉT NGHIỆM</Text>
                        </View>
                    </View>
                    <FlatList
                        extraData={this.state}
                        keyExtractor={(item, index) => index}
                        style={{ flex: 1, backgroundColor: '#ebf7f3' }}
                        numColumns={3}
                        data={this.state.medicalTestResult}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => { this.viewGroup(item) }}>
                                <View style={{ width: DEVICE_WIDTH / 3.5, flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                    {
                                        this.state.currentGroup == item ?
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_radio1.png")} width={15} />
                                            :
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_radio0.png")} width={15} />
                                    }
                                    <Text style={[{ fontWeight: 'bold', padding: 5 }, this.state.currentGroup == item ? styles.groupSelected : null]}>{item.type}</Text>
                                </View>
                            </TouchableOpacity>}
                    />
                    {
                        this.state.currentGroup ?
                            <View>
                                <Table>
                                    <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                                    {this.renderData()}
                                </Table>
                            </View> : null
                    }
                    <View style={{ marginTop: 30 }} />
                </View>
            </View>
        </View>)
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
const styles = StyleSheet.create({
    round1: { width: 25, height: 25, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 2, borderRadius: 12.5, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' },
    head: {
        backgroundColor: '#c8e1ff',
    },
    text: {
        marginRight: 6, textAlign: 'center', fontWeight: 'bold',
        fontSize: 12
    },
    textValue: {
        marginRight: 6,
        padding: 4,
        fontSize: 11
    },
    diagnosticLabel:
    {
        color: constants.colors.primary_bold,
        fontWeight: 'bold', marginBottom: 10,
    },
    groupSelected: {
        color: constants.colors.primary_bold
    },
    breakline: {
        height: 1,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: constants.colors.breakline
    }
})
export default connect(mapStateToProps)(MedicalTestResult);