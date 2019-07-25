import React, { Component, PropTypes, PureComponent } from 'react';
import ActivityPanel from '@components/ActivityPanel';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import bookingProvider from '@data-access/booking-provider';
import dateUtils from 'mainam-react-native-date-utils';
import stringUtils from 'mainam-react-native-string-utils';
import snackbar from '@utils/snackbar-utils';
import constants from '@resources/strings';

const DEVICE_WIDTH = Dimensions.get('window').width;

class ViewInDateScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dayInMonth: [],
            dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
            hasResult: false
        }
        this.viewCheckupResult = this.viewCheckupResult.bind(this);
        this.viewMedicalTestResult = this.viewMedicalTestResult.bind(this);
        this.viewDiagnosticResult = this.viewDiagnosticResult.bind(this);
        this.viewMedicine = this.viewMedicine.bind(this);
        this.viewMoney = this.viewMoney.bind(this);
        this.viewSurgeryResult = this.viewSurgeryResult.bind(this);
    }
    componentDidMount() {
        let _dateSelected = this.props.navigation.state.params.dateSelected;
        let date = new Date(_dateSelected);
        let month = date.format("MM");
        let year = date.format("yyyy");
        this.renderDayInMonth(month, year, date);
    }

    renderDayInMonth(month, year, _dateSelected) {
        let dateSelected = null;
        let index = -1;
        let patientHistoryId = "";
        let obj = [];
        let patient = this.props.ehealth.patient;
        let obj2 = {};
        patient.history.forEach(item => {
            let key = item.timeGoIn.toDateObject('-').ddmmyyyy();
            if (!obj2[key])
                obj2[key] = item;
        });
        for (var i = 1; i <= 31; i++) {
            try {
                var date = new Date(month + "/" + i + "/" + year);
                var time = date.getTime();
                if (!isNaN(time)) {
                    let patientHistory = obj2[date.ddmmyyyy()];
                    date.patientHistory = patientHistory;
                    if (!dateSelected && _dateSelected.format("yyyy-MM-dd") == date.format("yyyy-MM-dd")) {
                        dateSelected = date;
                        index = i - 1;
                        patientHistoryId = patientHistory.patientHistoryId;
                    }
                    obj.push(date);
                }
            } catch (e) {

            }
        }
        this.setState({
            dayInMonth: obj,
            dateSelected
        }, () => {
            if (index != -1 && this.flListDate) {
                setTimeout(() => {
                    try {
                        this.flListDate.scrollTo({ x: index * 70, y: 0, animated: true });
                    } catch (error) {

                    }
                }, 200);
            }
            if (patientHistoryId)
                this.getDetailPatientHistory(patientHistoryId)
        });
    }
    getDetailPatientHistory(patientHistoryId) {
        this.setState({ isLoading: true }, () => {
            bookingProvider.detailPatientHistory(patientHistoryId, this.props.ehealth.hospital.hospital.id).then(s => {
                this.setState({ isLoading: false }, () => {
                    switch (s.code) {
                        case 0:
                            let resultDetail = null;
                            let result = null;
                            if (s.data && s.data.data) {
                                if (s.data.data.resultDetail) {
                                    try {
                                        resultDetail = JSON.parse(s.data.data.resultDetail);
                                    } catch (error) {

                                    }
                                }
                                if (s.data.data.result) {
                                    try {
                                        result = JSON.parse(s.data.data.result);
                                        if (!result ||
                                            (
                                                !(result.ListDiagnostic && result.ListDiagnostic.length) &&
                                                !(result.ListMedicine && result.ListMedicine.length) &&
                                                !(result.ListResulGiaiPhau && result.ListResulGiaiPhau.length) &&
                                                !(result.ListResulHoaSinh && result.ListResulHoaSinh.length) &&
                                                !(result.ListResulHuyetHoc && result.ListResulHuyetHoc.length) &&
                                                !(result.ListResulHuyetHoc && result.ListResulHuyetHoc.length) &&
                                                !(result.ListResulViSinh && result.ListResulViSinh.length) &&
                                                !(result.ListResultCheckup && result.ListResultCheckup.length)

                                            )
                                        ) {
                                            this.setState({
                                                hasResult: false
                                            })
                                            snackbar.show(constants.msg.ehealth.not_result_ehealth_in_day, "danger");
                                        } else {
                                            this.setState({
                                                hasResult: true,
                                                result,
                                                resultDetail
                                            });
                                        }
                                    } catch (error) {
                                        this.setState({ hasResult: false, result: {} });
                                        snackbar.show(constants.msg.ehealth.not_result_ehealth_in_day, "danger");

                                    }
                                }
                            }

                            break;
                    }
                })
            }).catch(e => {
                this.setState({ isLoading: false }, () => {

                })
            })

        })
    }
    getItemLayout = (data, index) => (
        { length: data.length, offset: 70 * index, index }
    )
    dayPress(item) {
        if (!item.patientHistory) {
            snackbar.show(constants.msg.ehealth.not_result_of_this_date, "danger");
            return;
        };
        this.setState({ dateSelected: item }, () => {
            this.getDetailPatientHistory(item.patientHistory.patientHistoryId)
        })
    }
    viewCheckupResult() {
        this.props.navigation.navigate("viewCheckupResult", { result: this.state.result, resultDetail: this.state.resultDetail })
    }
    viewMedicalTestResult() {
        this.props.navigation.navigate("viewMedicalTestResult", { result: this.state.result, resultDetail: this.state.resultDetail })
    }
    viewDiagnosticResult() {
        this.props.navigation.navigate("viewDiagnosticResult", { result: this.state.result, resultDetail: this.state.resultDetail })
    }
    viewSurgeryResult() {
        this.props.navigation.navigate("viewSurgeryResult", { result: this.state.result, resultDetail: this.state.resultDetail })
    }
    viewMoney() {
        this.props.navigation.navigate("viewMoney", { result: this.state.result, resultDetail: this.state.resultDetail })
    }
    viewMedicine() {
        this.props.navigation.navigate("viewMedicine", { result: this.state.result, resultDetail: this.state.resultDetail })
    }
    renderCheckupResult() {
        if (this.state.result && this.state.result.ListResultCheckup && this.state.result.ListResultCheckup.length) {
            let item = this.state.result.ListResultCheckup[this.state.result.ListResultCheckup.length - 1];
            let note = item.Diagnostic;
            if (!note)
                note = item.DiseaseDiagnostic;
            if (!note)
                note = item.First_Diagnostic;
            if (note)
                return <TouchableOpacity style={styles.card} onPress={this.viewCheckupResult}>
                    <View style={styles.viewCheckupResult}></View>
                    <View style={styles.viewNote}>
                        <Text style={styles.txResultEhealth}>{constants.ehealth.result_ehealth}</Text>
                        <Text style={styles.txNote}>{note}</Text>
                    </View>
                    <View style={styles.viewMaker}></View>
                </TouchableOpacity>
        }
        return null;
    }

    renderDiagnosticResult() {
        if (this.state.result && this.state.result.ListDiagnostic && this.state.result.ListDiagnostic.length) {
            let item = this.state.result.ListDiagnostic[this.state.result.ListDiagnostic.length - 1];
            let note = item.SummaryResult;
            if (!note)
                note = item.Result;
            if (!note)
                note = item.Discussion;
            if (!note)
                note = item.Conclusion;
            if (note)
                return <TouchableOpacity style={styles.card} onPress={this.viewDiagnosticResult}>
                    <View style={styles.viewDiagnosticResult}></View>
                    <View style={styles.viewTx}>
                        <Text style={styles.txResultEhealth}>{constants.ehealth.image_result}</Text>
                        <Text style={styles.txNoteBlue}>{note}</Text>
                    </View>
                    <View style={styles.viewMakerBlue}></View>
                </TouchableOpacity>
        }
        return null;
    }

    renderMoney() {
        if (this.state.resultDetail) {
            let money = 0;
            // if (this.state.resultDetail.ListInvoice && this.state.resultDetail.ListInvoice.length > 0) {
            //     money = this.state.resultDetail.ListInvoice.reduce((a, b) => a + b.Amount, 0) -
            //         (this.state.resultDetail.ListPayment && this.state.resultDetail.ListPayment.length > 0 ? this.state.resultDetail.ListPayment.reduce((a, b) => a + b.Amount, 0) : 0);
            // }
            // else {
            // money = this.state.resultDetail.ListService.reduce((a, b) => a + (b.PriceService || 0), 0);
            if (!money)
                return null;
            // }
            return <TouchableOpacity style={styles.card} onPress={this.viewMoney}>
                <View style={styles.viewMoney}></View>
                <View style={styles.viewTxMoney}>
                    <Text style={styles.txResultEhealth}>{constants.ehealth.money}</Text>
                    <Text style={styles.txMoney}>{money.formatPrice() + " đ"}</Text>
                </View>
                <View style={styles.makerMoney}></View>
            </TouchableOpacity>
        }
        return null;
    }
    renderSurgeryResult() {
        if (this.state.result && this.state.result.ListResulGiaiPhau && this.state.result.ListResulGiaiPhau.length) {
            let item = this.state.result.ListResulGiaiPhau[this.state.result.ListResulGiaiPhau.length - 1];
            let note = item.Conclusion;
            if (!note)
                note = item.Discussion;
            if (!note)
                note = item.Result;
            if (!note)
                note = item.SummaryResult;
            if (!note)
                note = item.Macrosome;
            if (!note)
                note = item.Microsome;
            if (!note)
                note = item.BiopsyLocation;
            if (note)
                return <TouchableOpacity style={styles.card} onPress={this.viewSurgeryResult}>
                    <View style={styles.viewSurgeryResult}></View>
                    <View style={styles.viewTxSurgery}>
                        <Text style={styles.txResultEhealth}>{constants.ehealth.surgery_result}</Text>
                        <Text style={styles.txSurgery}>{note}</Text>
                    </View>
                    <View style={styles.footerSurgery}></View>
                </TouchableOpacity>
        }
        return null;
    }

    renderMedicine() {
        if (this.state.result) {
            let item = null;
            if (this.state.result.ListMedicine && this.state.result.ListMedicine.length) {
                item = this.state.result.ListMedicine[this.state.result.ListMedicine.length - 1];
            }
            if (!item) {
                if (this.state.result.ListResultCheckup && this.state.result.ListResultCheckup.length) {
                    let item2 = this.state.result.ListResultCheckup[this.state.result.ListResultCheckup.length - 1];
                    if (item2.ListMedicine && item2.ListMedicine.length)
                        item = item2.ListMedicine[item2.ListMedicine.length - 1];
                    if (!item)
                        if (item2.ListExternalMedicine && item2.ListExternalMedicine.length)
                            item = item2.ListExternalMedicine[item2.ListExternalMedicine.length - 1];

                }
            }
            if (!item)
                return null;

            let note = item.ServiceName + " " + item.Measure + ", " + item.Quantity + " " + item.Unit;
            if (note)
                return <TouchableOpacity style={styles.card} onPress={this.viewMedicine}>
                    <View style={styles.viewMedicine}></View>
                    <View style={styles.viewDrug}>
                        <Text style={styles.txResultEhealth}>{constants.ehealth.drug}</Text>
                        <Text style={styles.txMedicine}>{note}</Text>
                    </View>
                    <View style={styles.footerMedicine}></View>
                </TouchableOpacity>
        }
        return null;
    }
    renderMedicalTest() {
        
        if (this.state.result 
            && ((this.state.result.ListResulHoaSinh && this.state.result.ListResulHoaSinh.length)
            || (this.state.result.ListResulHuyetHoc && this.state.result.ListResulHuyetHoc.length)
            || (this.state.result.ListResulViSinh && this.state.result.ListResulViSinh.length)
            || (this.state.result.ListResulOther && this.state.result.ListResulOther.length))
        ) {
            let arr = [];
            if (this.state.result.ListResulHoaSinh && this.state.result.ListResulHoaSinh.length)
                arr = this.state.result.ListResulHoaSinh;
            if (!arr.length)
                if (this.state.result.ListResulHuyetHoc && this.state.result.ListResulHuyetHoc.length)
                    arr = this.state.result.ListResulHuyetHoc;
            if (!arr.length)
                if (this.state.result.ListResulViSinh && this.state.result.ListResulViSinh.length)
                    arr = this.state.result.ListResulblnh;
            if (!arr.length)
                if (this.state.result.ListResulOther && this.state.result.ListResulOther.length)
                    arr = this.state.result.ListResulOther;
            if (!arr.length)
                return null;
            arr = arr[arr.length - 1];
            let note;
            if (arr.ListMedical && arr.ListMedical.length) {
                let item = arr.ListMedical[arr.ListMedical.length - 1]
                if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length) {
                    item = item.ServiceMedicTestLine[item.ServiceMedicTestLine.length - 1];
                    note = item.NameLine + ": " + item.Result;
                }
                else
                    note = item.ServiceName + ": " + item.Result;
            } else {
                return null;
            }

            if (note)
                return <TouchableOpacity style={styles.card} onPress={this.viewMedicalTestResult}>
                    <View style={styles.viewMedical}></View>
                    <View style={styles.viewTxMedical}>
                        <Text style={styles.txResultEhealth}>{constants.ehealth.test_result}</Text>
                        <Text style={styles.txMedical}>{note}</Text>
                    </View>
                    <View style={styles.footerMedical}></View>
                </TouchableOpacity>
        }
        return null;
    }
    render() {

        return (
            <ActivityPanel style={styles.container} title={constants.title.ehealth}
                icBack={require('@images/new/left_arrow_white.png')}
                iosBarStyle={'light-content'}
                statusbarBackgroundColor="#22b060"
                actionbarStyle={styles.actionbarStyle}
                titleStyle={styles.titleStyle}
                isLoading={this.state.isLoading}>
                <View style={styles.container2}>
                    <View style={styles.viewSpaceTop}>
                        <ScrollView ref={ref => this.flListDate = ref} horizontal={true} showsHorizontalScrollIndicator={false}>
                            {this.state.dayInMonth.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={this.dayPress.bind(this, item)} style={styles.btnDate}>
                                    <Text style={styles.txDateColor}>{this.state.dayNames[item.getDay()]}</Text>
                                    {item == this.state.dateSelected ?
                                        <View style={styles.viewDateSelected}>
                                            <Text style={styles.txDay}>{item.format("dd").toNumber()}</Text>
                                        </View> :
                                        <View style={styles.viewTxDay}>
                                            <Text style={styles.txDayNotSelect}>{item.format("dd").toNumber()}</Text>
                                        </View>
                                    }
                                </TouchableOpacity>
                            })}
                        </ScrollView>
                    </View>
                    {
                        this.state.hasResult && <ScrollView style={styles.renderData}
                            showsVerticalScrollIndicator={false}
                        >
                            {
                                this.renderCheckupResult()
                            }
                            {
                                this.renderMedicalTest()
                            }
                            {
                                this.renderDiagnosticResult()
                            }
                            {
                                this.renderSurgeryResult()
                            }
                            {
                                this.renderMedicine()
                            }
                            {
                                this.renderMoney()
                            }

                            <View style={styles.viewSpaceBottom}></View>


                        </ScrollView>
                    }
                    {this.state.hasResult &&
                        <TouchableOpacity style={styles.btnInfo} onPress={() => {
                            this.props.navigation.navigate("viewDetail", { result: this.state.result, resultDetail: this.state.resultDetail })
                        }}>
                            <Text style={styles.txBtnInfo}>{constants.ehealth.full_result}</Text>
                        </TouchableOpacity>
                    }
                </View>
            </ActivityPanel>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    viewSpaceTop: { height: 100 },
    txDateColor: { color: '#bbbbbb' },
    card: {
        borderRadius: 5,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 1, marginTop: 10, padding: 10, flexDirection: 'row', shadowOpacity: 1, borderRadius: 8
    },
    style1: {
        flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 20
    },
    text1: {
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000"
    },
    hospital_selected: {
        alignItems: 'center',
        height: 105,
        width: 105,
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 3,
        borderColor: '#02c39a',
        borderRadius: 6,
        margin: 5
    },
    hospital: {
        alignItems: 'center',
        height: 105,
        width: 105,
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: 6,
        margin: 5
    },
    item_ehealth: {
        position: 'relative',
        left: 20, right: 30
    },
    item_ehealth2: {
        backgroundColor: '#f8fcf4',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(155, 155, 155, 0.47)',
        borderRadius: 6,
        marginTop: 10,
        marginLeft: 45,
        padding: 12,
    },
    dash: { width: 2, flexDirection: 'column', position: 'absolute', top: 0, left: 10, bottom: 0 },
    item_cycle: { width: 10, height: 10, backgroundColor: '#02c39a', borderRadius: 5, position: 'absolute', left: 6, top: '50%', marginTop: -5 },
    hospital_text: { alignItems: 'flex-end', textAlign: 'center', margin: 5, fontSize: 13 },
    avatar: {
        alignSelf: 'center',
        borderRadius: 25,
        width: 45,
        height: 45
    },
    viewBtn: {
        width: 252,
        maxWidth: DEVICE_WIDTH - 80,
        height: 50,
        borderRadius: 5,
        marginVertical: 20,
        backgroundColor: '#27AE60',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardView: {
        marginTop: 20,
        width: 350,
        maxWidth: DEVICE_WIDTH - 50,
        borderRadius: 5,

        padding: 25,
    },
    viewLine: {
        backgroundColor: '#4CD565',
        height: '100%',
        width: 1
    },
    viewBTnSuggest: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnReExamination: {
        padding: 2, borderRadius: 3, marginRight: 5, marginVertical: 10, paddingHorizontal: 5
    },
    txLabel: {
        color: '#9caac4',
        fontSize: 15
    },
    txContent: {
        color: '#554a4c',
        marginTop: 5, marginBottom: 25,
    },
    viewCheckupResult: { width: 10, height: 10, backgroundColor: '#ff4355', borderRadius: 5, marginTop: 22, marginLeft: 10 },
    viewNote: { flex: 1, padding: 15 },
    txResultEhealth: { fontSize: 18 },
    txNote: { paddingTop: 5, color: '#ff4355', flex: 1 },
    viewMaker: { width: 5, height: '100%', backgroundColor: '#ff4355', borderRadius: 2.5 },
    viewDiagnosticResult: { width: 10, height: 10, backgroundColor: '#2e66e7', borderRadius: 5, marginTop: 22, marginLeft: 10 },
    viewTx: { flex: 1, padding: 15 },
    txNoteBlue: { paddingTop: 5, color: '#2e66e7', flex: 1 },
    viewMakerBlue: { width: 5, height: '100%', backgroundColor: '#0063ff', borderRadius: 2.5 },
    viewMoney: { width: 10, height: 10, backgroundColor: '#ff4355', borderRadius: 5, marginTop: 22, marginLeft: 10 },
    viewTxMoney: { flex: 1, padding: 15 },
    txMoney: { paddingTop: 5, color: '#ff4355', flex: 1, fontWeight: 'bold' },
    makerMoney: { width: 5, height: '100%', backgroundColor: '#ff4355', borderRadius: 2.5 },
    viewSurgeryResult: { width: 10, height: 10, backgroundColor: '#2e66e7', borderRadius: 5, marginTop: 22, marginLeft: 10 },
    viewTxSurgery: { flex: 1, padding: 15 },
    txSurgery: { paddingTop: 5, color: '#2e66e7', flex: 1 },
    footerSurgery: { width: 5, height: '100%', backgroundColor: '#0063ff', borderRadius: 2.5 },
    viewMedicine: { width: 10, height: 10, backgroundColor: '#fbaa21', borderRadius: 5, marginTop: 22, marginLeft: 10 },
    viewDrug: { flex: 1, padding: 15 },
    txMedicine: { paddingTop: 5, color: '#fbaa21', flex: 1 },
    footerMedicine: { width: 5, height: '100%', backgroundColor: '#fbaa21', borderRadius: 2.5 },
    viewMedical: { width: 10, height: 10, backgroundColor: '#2e66e7', borderRadius: 5, marginTop: 22, marginLeft: 10 },
    viewTxMedical: { flex: 1, padding: 15 },
    txMedical: { paddingTop: 5, color: '#2e66e7' },
    footerMedical: { width: 5, height: '100%', backgroundColor: '#0063ff', borderRadius: 2.5 },
    actionbarStyle: {
        backgroundColor: '#22b060',
        borderBottomWidth: 0
    },
    titleStyle: {
        color: '#FFF'
    },
    container2: { flex: 1, alignItems: 'center' },
    viewDateSelected: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#27ae60',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(46, 231, 58, 0.35)',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 3,
        margin: 5,
        marginTop: 10,
    },
    txDate: {
        fontSize: 18,
        color: '#FFF',
    },
    btnDate: { justifyContent: 'center', alignItems: 'center', width: 70 },
    viewTxDay: {
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
        margin: 5,
        marginTop: 10,
    },
    txDayNotSelect: {
        fontSize: 18,
        color: '#2e2e39',
    },
    renderData: { flex: 1, width: DEVICE_WIDTH, padding: 10 },
    btnInfo: {
        width: 252,
        maxWidth: DEVICE_WIDTH,
        backgroundColor: '#27ae60',
        borderRadius: 5,
        height: 48,
        marginVertical: 20,
        padding: 10, alignItems: 'center'
    },
    txBtnInfo: { fontWeight: 'bold', color: '#FFF', fontSize: 17 },
    viewModal: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    viewPopup: { backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 60, borderRadius: 5 },
    txNotifi: { fontSize: 22, color: '#27AE60', textAlign: 'center', marginTop: 10, marginHorizontal: 20 },
    txErr: { textAlign: 'center', marginVertical: 20, marginHorizontal: 10 },
    btnConfirm: { justifyContent: 'center', alignItems: 'center', height: 41, backgroundColor: '#878787', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 },
    viewSpaceBottom: { height: 50 }

});

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        ehealth: state.ehealth
    };
}
export default connect(mapStateToProps)(ViewInDateScreen);