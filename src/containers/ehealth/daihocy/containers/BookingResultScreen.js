import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import constants from '@ehealth/daihocy/resources/strings';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import client from '@utils/client-utils';
import snackbar from '@utils/snackbar-utils';
import ExportPDF from '@ehealth/daihocy/components/ExportPDF';
class BookingResultScreen extends Component {
    constructor(props) {
        super(props);
        let result = this.props.navigation.getParam("result");

        this.state = {
            isLoading: false,
            result
        }
    }
    componentWillMount() {
        let result = this.props.navigation.getParam("result");
        // debugger;
        if (!result) {

        } else
            if (result.data) {
                this.setState({
                    resultSurgery: result.data.ListResulGiaiPhau,
                    resultCheckup: result.data.ListResultCheckup,
                    resultDiagnostic: result.data.ListDiagnostic,
                    resultHuyetHoc: result.data.ListResulHuyetHoc,
                    resultViSinh: result.data.ListResulViSinh,
                    resultHoaSinh: result.data.ListResulHoaSinh,
                    resultKhac: result.data.ListResulOther,
                });
            }
    }
    toggleResult(index) {
        switch (index) {
            case 0:
                if (this.state.resultCheckup && this.state.resultCheckup.length > 0) {
                    this.setState({
                        showResultCheckup: !this.state.showResultCheckup
                    });
                }
                else {
                    this.setState({
                        showResultCheckup: false
                    });
                    snackbar.show(constants.msg.ehealth.not_found_result);
                }
                break;
            case 3:

                if (this.state.resultDiagnostic && this.state.resultDiagnostic.length > 0) {
                    this.setState({
                        showResultDiagnostic: !this.state.showResultDiagnostic
                    });
                }
                else {
                    this.setState({
                        showResultDiagnostic: false
                    });
                    snackbar.show(constants.msg.ehealth.not_found_result);
                }
                break;
            case 2:

                if (this.state.resultSurgery && this.state.resultSurgery.length > 0) {
                    this.setState({
                        showResultSurgery: !this.state.showResultSurgery
                    });
                }
                else {
                    this.setState({
                        showResultSurgery: false
                    });
                    snackbar.show(constants.msg.ehealth.not_found_result);
                }
                break;
        }
    }
    viewResultCheckup(item) {
        // debugger;
        let result = this.state.result;
        item.isContract = result.profile.IsContract;
        this.props.navigation.navigate("bookingCheckupResult", { result, checkupResult: item })
    }
    viewResultSurgery(item) {
        let result = this.state.result;
        this.props.navigation.navigate("bookingSurgeryResult", { result, surgeryResult: item })
    }
    viewResultDiagnostic(item) {
        let result = this.state.result;
        this.props.navigation.navigate("bookingDiagnosticResult", { result, diagnosticResult: item })
    }
    viewResultMedicalTest() {
        var result1 = {
            resultViSinh: this.state.resultViSinh,
            resultHoaSinh: this.state.resultHoaSinh,
            resultHuyetHoc: this.state.resultHuyetHoc,
            resultKhac: this.state.resultKhac,
        }
        let result = this.state.result;
        this.props.navigation.navigate("bookingMedicalTestResult", { result, medicalTest: result1 })
    }
    exportPdf() {
        this.setState({
            isLoading: true
        })
        this.exportPdfCom.getWrappedInstance().exportPdf({
            type: "all",
            result: this.state.result,
            fileName: constants.filenamePDF + this.state.result.booking.patientHistoryId
        }, () => {
            this.setState({ isLoading: false });
        });
    }
    render() {
        let result = this.props.navigation.getParam("result");
        return (
            <ActivityPanel style={{ flex: 1, }} title="Kết quả" isLoading={this.state.isLoading} touchToDismiss={false} showFullScreen={true}>
                <ScrollView style={{ padding: 10 }}>

                    <View style={{ flexDirection: 'row' }}>
                        {result && result.profile && result.profile.Value &&
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Mã bệnh nhân</Text>
                                <Text style={{ fontWeight: 'bold', marginTop: 10, fontSize: 16, color: '#065cb4' }}>{result ? result.profile.Value : "0"}</Text>
                            </View>
                        }
                        <View style={{ marginLeft: 'auto' }}>
                            <TouchableOpacity onPress={() => this.exportPdf()}>
                                <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        this.state.resultCheckup && this.state.resultCheckup.length > 0 ?
                            <TouchableOpacity onPress={() => this.toggleResult(0)}>
                                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
                                    <Text style={styles.resultTypeText}>Kết quả khám và đơn thuốc</Text>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dropdown_color.png")} width={10} />
                                </View>
                                <View style={styles.breakline} />
                            </TouchableOpacity> : null
                    }
                    {
                        this.state.showResultCheckup ?
                            <View style={styles.resultItem} >
                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={this.state.resultCheckup}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => { this.viewResultCheckup(item) }} style={styles.resultItemItem}>
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} />
                                            <Text style={styles.resultItemItemText}>
                                                {item.ServiceName}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                />
                            </View> : null

                    }
                    {
                        ((this.state.resultHoaSinh && this.state.resultHoaSinh.length > 0) ||
                            (this.state.resultViSinh && this.state.resultViSinh.length > 0) ||
                            (this.state.resultHuyetHoc && this.state.resultHuyetHoc.length > 0)) ?
                            <TouchableOpacity onPress={() => this.viewResultMedicalTest()}>
                                <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                                    <Text style={styles.resultTypeText}>Kết quả xét nghiệm</Text>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dropdown_color.png")} width={10} />
                                </View>
                                <View style={styles.breakline} />
                            </TouchableOpacity> : null
                    }
                    {
                        this.state.resultSurgery && this.state.resultSurgery.length > 0 ?
                            <TouchableOpacity onPress={() => this.toggleResult(2)}>
                                <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                                    <Text style={styles.resultTypeText}>Kết quả giải phẫu bệnh</Text>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dropdown_color.png")} width={10} />
                                </View>
                                <View style={styles.breakline} />
                            </TouchableOpacity> : null
                    }
                    {
                        this.state.showResultSurgery ?
                            <View style={styles.resultItem} >
                                <FlatList
                                    keyExtractor={(item, index) => index}
                                    data={this.state.resultSurgery}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => { this.viewResultSurgery(item) }} style={styles.resultItemItem}>
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} />
                                            <Text style={styles.resultItemItemText}>
                                                {item.ServiceName}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                />
                            </View> : null

                    }
                    {
                        this.state.resultDiagnostic && this.state.resultDiagnostic.length > 0 ?
                            <TouchableOpacity onPress={() => this.toggleResult(3)}>
                                <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                                    <Text style={styles.resultTypeText}>Kết quả cận lâm sàng</Text>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dropdown_color.png")} width={10} />
                                </View>
                                <View style={styles.breakline} />
                            </TouchableOpacity> : null
                    }
                    {
                        this.state.showResultDiagnostic ?
                            <View style={styles.resultItem} >
                                <FlatList
                                    keyExtractor={(item, index) => index}
                                    data={this.state.resultDiagnostic}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity onPress={() => { this.viewResultDiagnostic(item) }} style={styles.resultItemItem}>
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} />
                                            <Text style={styles.resultItemItemText}>
                                                {item.ServiceName}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                />
                            </View> : null

                    }
                    <View style={{ height: 50 }}></View>
                </ScrollView>
                <ExportPDF ref={(element) => this.exportPdfCom = element} />
            </ActivityPanel >
        )
    }
}

var styles = StyleSheet.create({
    resultTypeText:
    {
        fontWeight: 'bold',
        flex: 1

    },
    resultItemItemText: {
        marginLeft: 10,
        padding: 7
    },
    resultItemItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    resultItem:
        { backgroundColor: '#ebf7f3', padding: 10 },
    breakline: {
        height: 1,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: constants.colors.breakline
    }
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        booking: state.booking
    };
}
export default connect(mapStateToProps, null, null, { withRef: true })(BookingResultScreen);