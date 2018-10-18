import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import constants from '@resources/strings';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import dateUtils from 'mainam-react-native-date-utils';
import client from '@utils/client-utils';
const DEVICE_WIDTH = Dimensions.get('window').width;
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import ExportPDF from '@ehealth/daihocy/components/ExportPDF';

let $this = null;
class BookingMedicalTestResultScreen extends Component {
    constructor(props) {
        super(props);
        $this = this;
        this.state = {
            isLoading: false,
            checkupResult: [],
            result: this.props.navigation.getParam("result"),
        }
    }
    componentWillMount() {
        var result = [];
        let medicalTestResult = this.props.navigation.getParam("medicalTest");

        if (medicalTestResult) {
            if (medicalTestResult.resultViSinh && medicalTestResult.resultViSinh.length > 0) {
                var item = {
                    type: 'Vi Sinh',
                    value: {
                        ListMedical: [],
                        GroupId: ""
                    }
                }
                result.push(item);

                medicalTestResult.resultViSinh.forEach(function (entry) {
                    item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
                });
            }
            if (medicalTestResult.resultHoaSinh && medicalTestResult.resultHoaSinh.length > 0) {
                var item = {
                    type: 'Hóa Sinh',
                    value: {
                        ListMedical: [],
                        GroupId: ""
                    }
                }
                result.push(item);
                medicalTestResult.resultHoaSinh.forEach(function (entry) {
                    item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
                });
            }
            if (medicalTestResult.resultHuyetHoc && medicalTestResult.resultHuyetHoc.length > 0) {
                var item = {
                    type: 'Huyết Học',
                    value: {
                        ListMedical: [],
                        GroupId: ""
                    }
                }
                result.push(item);
                medicalTestResult.resultHuyetHoc.forEach(function (entry) {
                    item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
                });
            }
            if (medicalTestResult.resultKhac && medicalTestResult.resultKhac.length > 0) {
                var item = {
                    type: 'Xét Nghiệm Khác',
                    value: {
                        ListMedical: [],
                        GroupId: ""
                    }
                }
                result.push(item);
                medicalTestResult.resultKhac.forEach(function (entry) {
                    item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
                });
            }
        }
        this.setState({
            medicalTestResult: result,
            currentGroup: result[0]
        })
    }
    viewGroup(item) {
        this.setState({
            currentGroup: item
        })
    }
    renderHighLight(result, min, max) {
        try {
            if (result && result.toLowerCase() == "dương tính")
                return true;
            result = parseFloat(result);
            min = parseFloat(min);
            max = parseFloat(max);
            if (result < min || result > max)
                return true;
            return false;
        } catch (error) {
            return false;
        }
    }
    renderMedicalTestLine(item) {
        return (
            <View>
                <Cell data={item.ServiceName} textStyle={[styles.textValue, { fontWeight: 'bold' }]} style={{ backgroundColor: '#DFF5F2' }}></Cell>
                {
                    item.ServiceMedicTestLine.map((item2, i) => {
                        var range = this.getRange(item2.LowerIndicator, item2.HigherIndicator);

                        var isHighlight = this.renderHighLight(item2.Result, item2.LowerIndicator, item2.HigherIndicator);


                        return (
                            $this.state.currentGroup.type == 'Vi Sinh' ?
                                <TableWrapper style={{ flexDirection: 'row' }} key={i}>
                                    <Cell data={item2.NameLine.trim()} textStyle={[styles.textValue]}></Cell>
                                    <Cell data={item2.Result} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                                </TableWrapper>
                                :
                                <TableWrapper style={{ flexDirection: 'row' }} key={i}>
                                    <Cell data={item2.NameLine.trim()} textStyle={[styles.textValue]}></Cell>
                                    <Cell data={item2.Result} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                                    <Cell data={range} textStyle={[styles.textValue]}></Cell>
                                    <Cell data={item2.Unit} textStyle={[styles.textValue,]}></Cell>
                                </TableWrapper>
                        )
                    })
                }
            </View>
        );

    }
    getRange(low, high) {
        var range = "";
        if (low && high)
            range = low + " - " + high;
        else {
            range = low;
            if (high)
                range = high;
        }
        return range;
    }
    renderMedical(item, index) {
        if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0 && item.ServiceMedicTestLine[0].NameLine != 0) {
            return (this.renderMedicalTestLine(item));
        }
        if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0) {
            var range = this.getRange(item.ServiceMedicTestLine[0].LowerIndicator, item.ServiceMedicTestLine[0].higherIndicator);
            var isHighlight = this.renderHighLight(item.ServiceMedicTestLine[0].Result, item.ServiceMedicTestLine[0].LowerIndicator, item.ServiceMedicTestLine[0].HigherIndicator);

            var data =
                $this.state.currentGroup.type == 'Vi Sinh' ?
                    <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                        <Cell data={item.ServiceName.trim()} textStyle={[styles.textValue]}></Cell>
                        <Cell data={item.ServiceMedicTestLine[0].Result} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                    </TableWrapper>
                    :
                    <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                        <Cell data={item.ServiceName.trim()} textStyle={[styles.textValue]}></Cell>
                        <Cell data={item.ServiceMedicTestLine[0].Result} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                        <Cell data={irange} textStyle={[styles.textValue]}></Cell>
                        <Cell data={item.ServiceMedicTestLine[0].Unit} textStyle={[styles.textValue,]}></Cell>
                    </TableWrapper>
            return data;
        }
        var range = this.getRange(item.LowerIndicator, item.HigherIndicator);
        var isHighlight = this.renderHighLight(item.Result, item.LowerIndicator, item.HigherIndicator);
        var data = $this.state.currentGroup.type == 'Vi Sinh' ?
            <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                <Cell data={item.ServiceName.trim()} textStyle={[styles.textValue, { fontWeight: 'bold' }]}></Cell>
                <Cell data={item.Result} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
            </TableWrapper>
            :
            <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                <Cell data={item.ServiceName.trim()} textStyle={[styles.textValue, { fontWeight: 'bold' }]}></Cell>
                <Cell data={item.Result} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
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
    exportPdf() {
        this.setState({
            isLoading: true
        })
        this.exportPdfCom.getWrappedInstance().exportPdf({
            type: "medicaltest",
            data: this.state.medicalTestResult,
            result: this.state.result,
            fileName: constants.filenameMedicalTestPDF + this.state.result.profile.PatientHistoryId
        }, () => {
            this.setState({ isLoading: false });
        });
    }
    render() {
        const tableHead = this.state.currentGroup && this.state.currentGroup.type == 'Vi Sinh' ? ['TÊN XÉT NGHIỆM', 'KẾT QUẢ'] : ['TÊN XÉT NGHIỆM', 'KẾT QUẢ', 'GIÁ TRỊ BÌNH THƯỜNG', 'ĐƠN VỊ'];
        return (
            <ActivityPanel style={{ flex: 1, }} title="Kết quả xét nghiệm" isLoading={this.state.isLoading} showFullScreen={true}>
                <ScrollView style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={() => this.exportPdf()}>
                            <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                        </TouchableOpacity>
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
                                <Text style={{ marginTop: 20, marginBottom: 10, color: constants.colors.primary_bold }}>Dịch vụ xét nghiệm</Text>
                                <Table>
                                    <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                                    {this.renderData()}
                                </Table>
                            </View> : null
                    }
                    <View style={{ marginTop: 30 }} />
                </ScrollView>
                <ExportPDF ref={(element) => this.exportPdfCom = element} />
            </ActivityPanel >
        )
    }
}

var styles = StyleSheet.create({
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
});
function mapStateToProps(state) {
    return {
    };
}
export default connect(mapStateToProps)(BookingMedicalTestResultScreen);