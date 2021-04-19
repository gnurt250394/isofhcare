import React, { Component, } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux';
import ScaleImage from "mainam-react-native-scaleimage";
import constants from '@resources/strings';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import resultUtils from '@ehealth/utils/result-utils';
import ActionSheet from 'react-native-actionsheet'
import ImageEhealth from './ImageEhealth';
import { Card } from 'native-base';
import ScaledImage from 'mainam-react-native-scaleimage';


class MedicalTestResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        }
    }
    componentDidMount() {
        let result1 = this.props.result;
        this.onGetData(result1)

    }
    onGetData = (result1) => {


        let hasResult = false;
        if (result1) {
            if (result1?.ListResulHuyetHoc?.length && result1?.ListResulHuyetHoc[0]?.ListMedical?.length) {
                hasResult = true;
            }
            if (result1?.ListResulHoaSinh?.length && result1?.ListResulHoaSinh[0]?.ListMedical?.length) {
                hasResult = true;
            }
            if (result1?.ListResulOther?.length && result1?.ListResulOther[0]?.ListMedical?.length) {
                hasResult = true;
            }
            if (result1?.ListResulViSinh?.length && result1?.ListResulViSinh[0]?.ListMedical?.length) {
                hasResult = true;
            }
        }
        if (!hasResult) {
            this.setState({ hasResult: false, medicalTestResult: result1?.ListResulHoaSinh || [] })
            return null;
        }

        let result = [];
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
        
        this.setState({
            hasResult: true,
            listTime: [],
            medicalTestResult: result,
            currentGroup: result[0]
        })
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.result != nextProps.result) {
            let result1 = nextProps.result;
            this.onGetData(result1)
        }
    }
    viewGroup(item) {
        this.setState({
            currentGroup: item
        })
    }
    renderMedicalTestLine(item, index) {
        // let borderBottomWidth = index == ,
        return (
            <View key={index}>
                <Cell data={item.ServiceName} textStyle={[styles.textValue, { fontWeight: 'bold' }]} style={styles.containerValue}></Cell>
                {
                    item.ServiceMedicTestLine.map((item2, i) => {
                        var range = resultUtils.getRangeMedicalTest(item2);

                        var isHighlight = resultUtils.showHighlight(item2);
                        let borderBottomWidth = i == item.ServiceMedicTestLine.length - 1 ? 0.6 : 0;

                        return (
                            this.state.currentGroup.type == 'Vi Sinh' ?
                                <TableWrapper style={{ flexDirection: 'row' }} key={i}>
                                    <Cell style={[styles.LineCell, { borderBottomWidth }]} data={item2.NameLine.trim()} borderStyle={{ borderWidth: 0.6 }} textStyle={[styles.textValue]}></Cell>
                                    <Cell data={resultUtils.getResult(item2)} style={[styles.flex, { borderBottomWidth }]} borderStyle={{ borderWidth: 0.6 }} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                                </TableWrapper>
                                :
                                <TableWrapper style={{ flexDirection: 'row' }} key={i}>
                                    <Cell style={[styles.LineCell, { borderBottomWidth }]} data={item2.NameLine.trim()} borderStyle={{ borderWidth: 0.6 }} textStyle={[styles.textValue]}></Cell>
                                    <Cell data={resultUtils.getResult(item2)} style={[styles.flex, { borderBottomWidth }]} borderStyle={{ borderWidth: 0.6 }} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                                    <Cell data={range} borderStyle={{ borderWidth: 0.6, }} style={[styles.flex, { borderBottomWidth }]} textStyle={[styles.textValue]}></Cell>
                                    <Cell data={item2.Unit} borderStyle={{ borderWidth: 0.6 }} style={[styles.flex, { borderBottomWidth }]} textStyle={[styles.textValue,]}></Cell>
                                </TableWrapper>
                        )
                    })
                }
            </View>
        );

    }

    renderMedical(item, index) {
        let borderBottomWidth = index == this.state.currentGroup.value.ListMedical.length - 1 ? 0.6 : 0;
        if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0 && item.ServiceMedicTestLine[0].NameLine != 0) {
            return (this.renderMedicalTestLine(item, index));
        }
        if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0) {
            var range = resultUtils.getRangeMedicalTest(item.ServiceMedicTestLine[0]);
            var isHighlight = resultUtils.showHighlight(item.ServiceMedicTestLine[0]);

            var data =
                this.state.currentGroup.type == 'Vi Sinh' ?
                    <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                        <Cell data={item.ServiceName.trim()} borderStyle={{ borderWidth: 0.6 }} style={[styles.LineCell, { borderBottomWidth }]} textStyle={[styles.textValue]}></Cell>

                        <Cell data={resultUtils.getResult(item.ServiceMedicTestLine[0])} style={[styles.flex, { borderBottomWidth }]} borderStyle={{ borderWidth: 0.6 }} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                    </TableWrapper>
                    :
                    <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                        <Cell data={item.ServiceName.trim()} borderStyle={{ borderWidth: 0.6 }} style={{ borderLeftWidth: 0.6, flex: 1 }} textStyle={[styles.textValue]}></Cell>
                        <Cell data={resultUtils.getResult(item.ServiceMedicTestLine[0])} style={[styles.flex, { borderBottomWidth }]} borderStyle={{ borderWidth: 0.6 }} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                        <Cell data={irange} borderStyle={{ borderWidth: 0.6 }} style={[styles.flex, { borderBottomWidth }]} textStyle={[styles.textValue]}></Cell>
                        <Cell data={item.ServiceMedicTestLine[0].Unit} style={[styles.flex, { borderBottomWidth }]} borderStyle={{ borderWidth: 0.6 }} textStyle={[styles.textValue,]}></Cell>
                    </TableWrapper>
            return data;
        }
        var range = resultUtils.getRangeMedicalTest(item);
        var isHighlight = resultUtils.showHighlight(item);
        var data = this.state.currentGroup.type == 'Vi Sinh' ?
            <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                <Cell data={item.ServiceName.trim()} style={[styles.LineCell, { borderBottomWidth }]} borderStyle={{ borderWidth: 0.6 }} textStyle={[styles.textValue, { fontWeight: 'bold' }]}></Cell>
                <Cell data={resultUtils.getResult(item)} borderStyle={{ borderWidth: 0.6 }} style={[styles.flex, { borderBottomWidth }]} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
            </TableWrapper>
            :
            <TableWrapper style={{ flexDirection: 'row' }} key={index}>
                <Cell data={item.ServiceName.trim()} style={[styles.LineCell, { borderBottomWidth }]} borderStyle={{ borderWidth: 0.6 }} textStyle={[styles.textValue, { fontWeight: 'bold' }]}></Cell>
                <Cell data={resultUtils.getResult(item)} borderStyle={{ borderWidth: 0.6 }} style={[styles.flex, { borderBottomWidth }]} textStyle={[styles.textValue, isHighlight ? { fontWeight: 'bold', color: 'red' } : {}]}></Cell>
                <Cell data={range} borderStyle={{ borderWidth: 0.6 }} style={[styles.flex, { borderBottomWidth }]} textStyle={[styles.textValue]}></Cell>
                <Cell data={item.Unit} borderStyle={{ borderWidth: 0.6 }} style={[styles.flex, { borderBottomWidth }]} textStyle={[styles.textValue,]}></Cell>
            </TableWrapper>
        return data;
    }
    renderData() {
        return this.state.currentGroup.value.ListMedical.map((data, i) => (
            this.renderMedical(data, i)
        ))
    }
    onSetShow = () => {
        this.setState({ isShow: !this.state.isShow })
    }

    render() {
        
        
        if (!this.state.currentGroup || !this.state.hasResult) {


            if (this.state?.medicalTestResult?.length && (this.state?.medicalTestResult[0]?.SummaryResult || this.state?.medicalTestResult[0]?.Image?.length != 0)) {

                return this.state.medicalTestResult.map((e, i) => {
                    return (
                        <View key={i} style={{
                            flex: 1,
                            paddingHorizontal: 10
                        }}>
                            <Card>
                                <TouchableOpacity
                                    onPress={this.onSetShow}
                                    style={[styles.buttonShowInfo, this.state.isShow ? { backgroundColor: '#075BB5' } : {}]}>
                                    <ScaledImage source={require('@images/new/ehealth/ic_info.png')} height={19} style={{
                                        tintColor: this.state.isShow ? "#FFF" : '#075BB5'
                                    }} />
                                    <Text style={[styles.txtTitle, this.state.isShow ? { color: '#FFF' } : {}]}>KẾT QUẢ XÉT NGHIỆM</Text>
                                    <ScaledImage source={require('@images/new/ehealth/ic_down2.png')} height={10} style={this.state.isShow ? {
                                        tintColor: "#FFF",
                                    } : {
                                            transform: [{ rotate: '-90deg' }],
                                            tintColor: '#075BB5'
                                        }} />
                                </TouchableOpacity>
                                {this.state.isShow ?
                                    <View style={{
                                        padding: 10
                                    }}>
                                        <View style={styles.containerDescription}>
                                            {e?.SummaryResult ?
                                                <View>
                                                    <Text style={styles.diagnosticLabel}>{constants.ehealth.describe}</Text>
                                                    <View style={styles.containerTitle}>
                                                        <ScaleImage source={require("@images/new/ehealth/ic_dot.png")} width={5} style={{ marginRight: 10 }} />
                                                        <Text>{e.SummaryResult}</Text>
                                                    </View>
                                                </View> : null
                                            }

                                            <ImageEhealth images={e.Image} />
                                        </View>
                                    </View>
                                    : null
                                }
                            </Card>
                        </View>
                    )
                })
            }
            return null;

        }

        const tableHead = this.state.currentGroup && this.state.currentGroup.type == 'Vi Sinh' ? ['TÊN XÉT NGHIỆM', 'KẾT QUẢ'] : ['TÊN XÉT NGHIỆM', 'KẾT QUẢ', 'GIÁ TRỊ BÌNH THƯỜNG', 'ĐƠN VỊ'];
        let actions = this.state.medicalTestResult.map(item => item.type);
        actions.push("Hủy");

        return (<View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Card style={styles.card}>
                <TouchableOpacity
                    onPress={this.onSetShow}
                    style={[styles.buttonShowInfo, this.state.isShow ? { backgroundColor: '#075BB5' } : {}]}>
                    <ScaledImage source={require('@images/new/ehealth/ic_test_results.png')} height={19} style={{
                        tintColor: this.state.isShow ? "#FFF" : '#075BB5'
                    }} />
                    <Text style={[styles.txtTitle, this.state.isShow ? { color: '#FFF' } : {}]}>KẾT QUẢ XÉT NGHIỆM</Text>
                    <ScaledImage source={require('@images/new/ehealth/ic_down2.png')} height={10} style={this.state.isShow ? {
                        tintColor: "#FFF",
                    } : {
                            transform: [{ rotate: '-90deg' }],
                            tintColor: '#075BB5'
                        }} />
                </TouchableOpacity>
                {this.state.isShow ?
                    <View style={{
                        padding: 10
                    }}>
                        {
                            this.state.currentGroup && <View style={{ alignItems: 'flex-end', marginVertical: 10 }}><TouchableOpacity onPress={() => {
                                this.actionSheetChooseType.show();
                            }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 10 }}>{this.state.currentGroup.type}</Text>
                                <ScaleImage source={require("@images/new/down.png")} width={10} />
                            </TouchableOpacity></View>
                        }
                        {
                            this.state.currentGroup ?
                                <View>
                                    <Table>
                                        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                                        {this.renderData()}
                                    </Table>
                                </View> : null
                        }
                    </View>
                    : null
                }
            </Card>
            <ActionSheet
                ref={o => this.actionSheetChooseType = o}
                options={actions}
                cancelButtonIndex={actions.length - 1}
                destructiveButtonIndex={actions.length - 1}
                onPress={(index) => {
                    if (index <= this.state.medicalTestResult.length - 1) {
                        this.setState({ currentGroup: this.state.medicalTestResult[index] });
                    }
                }}
            />
        </View>)
    }
}

function mapStateToProps(state) {
    return {
        userApp: state.auth.userApp,
        ehealth: state.auth.ehealth
    };
}
const styles = StyleSheet.create({
    txtTitle: {
        flex: 1,
        paddingHorizontal: 10,
        color: '#075BB5',
        fontWeight: 'bold'
    },
    buttonShowInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    card: {
        borderRadius: 5
    },
    container: {
        padding: 10
    },
    containerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    containerDescription: {
        backgroundColor: "#ffffff",
        // shadowColor: "rgba(0, 0, 0, 0.05)",
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowRadius: 10,
        // shadowOpacity: 1,
        // elevation: 3,
        borderRadius: 5,
        padding: 10
    },
    containerValue: {
        backgroundColor: '#DFF5F2',
        borderLeftWidth: 0.6,
        borderRightWidth: 0.6,
        borderColor: '#111'
    },
    flex: { flex: 1 },
    LineCell: { borderLeftWidth: 0.6, flex: 1, },
    round1: { width: 20, height: 20, backgroundColor: '#FFF', borderColor: '#8fa1aa', borderWidth: 1.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    round2: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7daa3c' },
    round3: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#c74444' },
    itemlabel: { marginLeft: 5, flex: 1, marginTop: 2 },
    itemcontent: { color: '#0076ff' },
    item: { marginTop: 10, flexDirection: 'row' },
    head: {
        backgroundColor: '#c8e1ff',
        borderColor: '#111',
        borderTopWidth: 0.6,
        borderLeftWidth: 0.6,
        borderRightWidth: 0.6
    },
    text: {
        marginRight: 6,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
        paddingTop: 7,
        borderRightWidth: 0.6,
        borderRightColor: '#111',
        width: '100%',
        flex: 1,
        color: '#075BB5'
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
    cellStyle: { backgroundColor: '#DFF5F2' },
    tableWrappe: { flexDirection: 'row' },
    viewCurrentGroup: { alignItems: 'flex-end', marginVertical: 10 },
    btnCurrentGroup: { flexDirection: 'row', alignItems: 'center' },
    txCurrent: { marginRight: 10 }
})
export default connect(mapStateToProps)(MedicalTestResult);