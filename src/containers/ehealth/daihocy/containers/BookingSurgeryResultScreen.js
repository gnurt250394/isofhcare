import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import constants from '@resources/strings';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import client from '@utils/client-utils';
import ExportPDF from '@ehealth/daihocy/components/ExportPDF';

class BookingSurgeryResultScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            result: this.props.navigation.getParam("result"),
            surgeryResult: this.props.navigation.getParam("surgeryResult")
        }
    }
    exportPdf() {
        this.setState({
            isLoading: true
        })
        this.exportPdfCom.getWrappedInstance().exportPdf({
            type: "surgery",
            data: this.state.surgeryResult,
            result: this.state.result,
            fileName: constants.filenameSurgeryPDF + this.state.result.booking.patientHistoryId
        }, () => {
            this.setState({ isLoading: false });
        });
    }
    render() {
        return (
            <ActivityPanel style={{ flex: 1, }} title="Kết quả giải phẫu" isLoading={this.state.isLoading} showFullScreen={true}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
                        <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 15, color: constants.colors.primary_bold }}>{this.state.surgeryResult.ServiceName}</Text>
                        <TouchableOpacity onPress={() => this.exportPdf()}>
                            <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.surgeryResult.BiopsyLocation ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Vị trí sinh thiết</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{this.state.surgeryResult.BiopsyLocation}</Text>
                                </View>
                            </View> : null
                    }

                    {
                        this.state.surgeryResult.Microsome ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Vị thể</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{this.state.surgeryResult.Microsome}</Text>
                                </View>
                            </View> : null
                    }

                    {
                        this.state.surgeryResult.Macrosome ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Đại thể</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{this.state.surgeryResult.Macrosome}</Text>
                                </View>
                            </View> : null
                    }

                    {
                        (this.state.surgeryResult.Result || this.state.surgeryResult.Discussion) ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Kết quả</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{this.state.surgeryResult.Result} {this.state.surgeryResult.Discussion} </Text>
                                </View>
                            </View> : null
                    }

                    {
                        this.state.surgeryResult.ReportTemplate == "Tebaoamdao" || this.state.surgeryResult.ReportTemplate == "Thinprep"
                            && (this.state.surgeryResult.ServiceMedicTestLine && this.state.surgeryResult.ServiceMedicTestLine.length > 0) ?
                            this.state.surgeryResult.ServiceMedicTestLine.map((item, i) => {
                                return (<View key={i}>
                                    <View style={styles.breakline} />
                                    <View style={{ flexDirection: 'row' }}>
                                        {
                                            item.IsVerified ?
                                                <ScaleImage source={require("@ehealth/daihocy/resources/images/check.png")} width={12} style={{ marginTop: 4, marginRight: 7 }} />
                                                :
                                                <ScaleImage source={require("@ehealth/daihocy/resources/images/uncheck.png")} width={12} style={{ marginTop: 4, marginRight: 7 }} />
                                        }
                                        <Text style={styles.diagnosticLabel}>{item.NameLine}</Text>
                                    </View>
                                    {item.Result2 ? <Text style={{ marginLeft: 10 }}>{item.Result2}</Text> : null}
                                </View>)
                            })
                            : <View></View>
                    }

                    {
                        this.state.surgeryResult.Conclusion ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Kết luận</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{this.state.surgeryResult.Conclusion}</Text>
                                </View>
                            </View> : null
                    }
                    <View style={{ height: 100 }}></View>
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
export default connect(mapStateToProps, null, null, { withRef: true })(BookingSurgeryResultScreen);