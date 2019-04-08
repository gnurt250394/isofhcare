import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import constants from '@resources/strings';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import client from '@utils/client-utils';
import ExportPDF from '@ehealth/daihocy/components/ExportPDF';

class BookingDiagnosticResultScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            diagnosticResult: this.props.navigation.getParam("diagnosticResult"),
            result: this.props.navigation.getParam("result")
        }
    }
    exportPdf() {
        this.setState({
            isLoading: true
        }, () => {
            this.exportPdfCom.getWrappedInstance().exportPdf({
                type: "diagnostic",
                data: this.state.diagnosticResult,
                result: this.state.result,
                fileName: constants.filenameDiagnosticPDF + this.state.result.booking.patientHistoryId
            }, () => {
                this.setState({ isLoading: false });
            });
        })
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1, }} title="Kết quả cận lâm sàng" isLoading={this.state.isLoading} showFullScreen={true}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
                        <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 15, color: constants.colors.primary_bold }}>{this.state.diagnosticResult.ServiceName}</Text>
                        <TouchableOpacity onPress={() => this.exportPdf()}>
                            <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        (this.state.diagnosticResult.Result || this.state.diagnosticResult.SummaryResult || this.state.diagnosticResult.Discussion) ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Mô tả</Text>
                                {this.state.diagnosticResult.Result ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                        <Text style={{ marginLeft: 10 }}>{this.state.diagnosticResult.Result}</Text>
                                    </View> : null}
                                {this.state.diagnosticResult.SummaryResult ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                        <Text style={{ marginLeft: 10 }}>{this.state.diagnosticResult.SummaryResult}</Text>
                                    </View> : null}
                                {this.state.diagnosticResult.Discussion ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                        <Text style={{ marginLeft: 10 }}>{this.state.diagnosticResult.Discussion}</Text>
                                    </View> : null}
                            </View> : null}

                    {
                        (this.state.diagnosticResult.Conclusion) ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Kết luận</Text>
                                {this.state.diagnosticResult.Conclusion ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                        <Text style={{ marginLeft: 10 }}>{this.state.diagnosticResult.Conclusion}</Text>
                                    </View> : null}
                            </View> : null}
                    <View style={{ height: 50 }} />
                </ScrollView>
                <ExportPDF ref={(element) => this.exportPdfCom = element} />
            </ActivityPanel >
        )
    }
}

var styles = StyleSheet.create({
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
});
function mapStateToProps(state) {
    return {
        booking: state.booking
    };
}
export default connect(mapStateToProps)(BookingDiagnosticResultScreen);