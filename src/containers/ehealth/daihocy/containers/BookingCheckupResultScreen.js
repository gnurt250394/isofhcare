import React, { Component, PropTypes } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import constants from '@resources/strings';
import ActivityPanel from '@components/ActivityPanel';
import ScaleImage from 'mainam-react-native-scaleimage';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import client from '@utils/client-utils';
import { Table, Row } from 'react-native-table-component';
import ExportPDF from '@ehealth/daihocy/components/ExportPDF';

class BookingCheckupResultScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            result: this.props.navigation.getParam("result"),
            checkupResult: this.props.navigation.getParam("checkupResult")
        }
    }
    componentWillMount() {
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
    renderMedicine(index, list) {
        if (list) {
            return list.map((data, i) => (
                this.renderMedicineItem(i + index, data)
            ))
        }
        return null;
    }
    exportPdf() {
        this.setState({
            isLoading: true
        }, () => {
            this.exportPdfCom.getWrappedInstance().exportPdf({
                type: "checkup",
                data: this.state.checkupResult,
                result: this.state.result,
                fileName: constants.filenameCheckupPDF + this.state.result.booking.patientHistoryId
            }, () => {
                this.setState({ isLoading: false });
            });
        })
    }

    renderItem(lable, value) {
        if (!value || value == undefined || value == 'undefined')
            return null;
        return (
            <View>
                <View style={styles.breakline} />
                <Text style={styles.diagnosticLabel}>{lable}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                    <Text style={{ marginLeft: 10 }}>{value}</Text>
                </View>
            </View>
        )
    }

    renderListMedicine(value) {
        const tableHead = ['STT', 'Tên thuốc', 'Số lượng', 'Đơn vị'];
        if (!value)
            return null
        return (
            <View>
                <Table style={[styles.table, { marginTop: 10 }]} borderStyle={{ borderWidth: 0.5, borderColor: '#c8e1ff' }}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.textHead} flexArr={[1, 3, 1, 1]} />
                    {this.renderMedicine(0, value)}
                </Table>
            </View>
        )
    }
    render() {
        let datas = this.state.checkupResult;
        const tableHead = ['STT', 'Tên thuốc', 'Số lượng', 'Đơn vị'];
        return (
            <ActivityPanel style={{ flex: 1, }} title="Kết quả khám đơn thuốc" isLoading={this.state.isLoading} showFullScreen={true}>
                <Text>xxx</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
                        <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 15, color: constants.colors.primary_bold }}>{this.state.checkupResult.ServiceName}</Text>
                        <TouchableOpacity onPress={() => this.exportPdf()}>
                            <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.checkupResult.isContract ?
                            <View>
                                {
                                    [
                                        this.renderItem("Tiền sử bệnh", datas.Anamnesis),
                                        this.renderItem("Tiền sử gia đình", datas.AnamnesisFamily),
                                        this.renderItem("Tiền sử dị ứng thuốc", datas.AnamnesisMedicine),
                                        this.renderItem("Tiền sử thai sản", datas.AnamnesisMaternity),
                                        this.renderItem("Chiều cao", datas.Height),
                                        this.renderItem("Cân nặng", datas.Weight),
                                        this.renderItem("BMI", datas.BMI),
                                        this.renderItem("Huyết áp", datas.BloodPressure),
                                        this.renderItem("Nhịp tim", datas.Pulse),
                                        this.renderItem("Phân loại", datas.PhysicalClassify),
                                        this.renderItem("Số lượng Hồng cầu", datas.RBCCount),
                                        this.renderItem("Số lượng Bạch cầu", datas.LeukemiaCount),
                                        this.renderItem("Số lượng Tiểu cầu", datas.PlateletCount),
                                        this.renderItem("Đường máu", datas.BloodSugar),
                                        this.renderItem("Ure", datas.Ure),
                                        this.renderItem("Creatinin", datas.Creatinin),
                                        this.renderItem("Protein", datas.Protein),
                                        this.renderItem("Xét nghiệm nước tiểu khác", datas.UrineTestOther),
                                        this.renderItem("Xét nghiệm máu khác", datas.BloodTestOther),
                                        this.renderItem("Chẩn đoán hình ảnh", datas.ImageDiagnose),
                                        this.renderItem("Dị ứng miễn dịch", datas.ImmunitySpecialist),
                                        this.renderItem("Phân loại", datas.ImmunityClassifySpecialist),
                                        this.renderItem("Chuyên khoa tim mạch", datas.HeartSpecialist),
                                        this.renderItem("Phân loại", datas.HeartClassifySpecialist),
                                        this.renderItem("Chuyên khoa thận tiết niệu", datas.CheckUpUrinationSpecialist),
                                        this.renderItem("Phân loại", datas.UrinationClassifySpecialist),
                                        this.renderItem("Chuyên khoa ung bướu", datas.TumorSpecialist),
                                        this.renderItem("Phân loại", datas.TumorClassifySpecialist),
                                        this.renderItem("Chuyên khoa thần kinh", datas.CheckUpNerveSpecialist),
                                        this.renderItem("Phân loại", datas.NerveClassifySpecialist),
                                        this.renderItem("Chuyên khoa tâm thần", datas.MentalSpecialist),
                                        this.renderItem("Phân loại", datas.MentalClassifySpecialist),
                                        this.renderItem("Ngoại khoa", datas.Surgical),
                                        this.renderItem("Phân loại", datas.SurgicalClassify),
                                        this.renderItem("Mắt trái không kính", datas.CheckUpLEyeWOGlass),
                                        this.renderItem("Mắt trái với kính", datas.CheckUpLEyeWGlass),
                                        this.renderItem("Mắt phải không kính", datas.CheckUpREyeWOGlass),
                                        this.renderItem("Mắt phải với kính", datas.CheckUpREyeWGlass),
                                        this.renderItem("Bệnh về mắt", datas.EyeDisease),
                                        this.renderItem("Phân loại", datas.EyeClassify),
                                        this.renderItem("Sản phụ khoa", datas.Gynecology),
                                        this.renderItem("Phân loại", datas.GynecologyClassify),
                                        this.renderItem("Nói thường tai trái", datas.SpeakNormallyL),
                                        this.renderItem("Nói thường tai phải", datas.SpeakNormallyR),
                                        this.renderItem("Nói thầm tai trái", datas.WhisperL),
                                        this.renderItem("Nói thầm tai phải", datas.WhisperR),
                                        this.renderItem("Phân loại", datas.ENTClassify),
                                        this.renderItem("Kết luận", datas.Conclusion1),
                                        this.renderItem("Tai phải", datas.RightEar),
                                        this.renderItem("Tai trái", datas.LeftEar),
                                        this.renderItem("Mũi phải", datas.RightNose),
                                        this.renderItem("Mũi trái", datas.LeftNose),
                                        this.renderItem("Họng", datas.Throat),
                                        this.renderItem("Vách ngăn", datas.Bulkhead),
                                        this.renderItem("Vòm", datas.Nasopharynx),
                                        this.renderItem("Hạ họng - Thanh quản", datas.Laryngopharynx),
                                        this.renderItem("Kết luận", datas.ENTConclusion),
                                        this.renderItem("Phân loại", datas.EndoscopicClassify),
                                        this.renderItem("Hàm dưới", datas.LowerJaw),
                                        this.renderItem("Hàm trên", datas.UpperJaw),
                                        this.renderItem(">Bệnh R-H-M", datas.DentalDisease),
                                        this.renderItem("Phân loại", datas.DentalClassify),
                                        this.renderItem("Chuyên khoa cơ xương khớp", datas.CheckUpMusculoskelSpecialist),
                                        this.renderItem("Phân loại", datas.MusculoskelClassifySpecialist),
                                        this.renderItem("Chuyên khoa hô hấp", datas.CheckUpRespirationSpecialist),
                                        this.renderItem("Phân loại", datas.RespirationClassifySpecialist),
                                        this.renderItem("Chuyên khoa tiêu hóa", datas.CheckUpDigestionSpecialist),
                                        this.renderItem("Phân loại", datas.DigestionSpecialistClassify),
                                        this.renderItem("Chuyên khoa da liễu", datas.Dermatology),
                                        this.renderItem("Phân loại", datas.DermatologyClassify),
                                        this.renderItem("Các bệnh tật nếu có", datas.OtherDiseases),
                                        this.renderItem("Những điều cần giải quyết", datas.OtherConclusion),
                                        this.renderItem("Bác sĩ", datas.ActUser),
                                        this.renderItem("Phân loại", datas.HealthClassify),
                                        this.renderItem("Tuần hoàn", datas.CheckUpCirculation + (datas.CirculationClassify ? " (Phân loại: " + datas.CirculationClassify + ")" : "")),
                                        this.renderItem("Tiêu hóa", datas.CheckUpDigestion + (datas.DigestionClassify ? " (Phân loại: " + datas.DigestionClassify + ")" : "")),
                                        this.renderItem("Cơ xương khớp", datas.CheckUpMusculoskel + (datas.MusculoskelClassify ? " (Phân loại: " + datas.MusculoskelClassify + ")" : "")),
                                        this.renderItem("Thần kinh", datas.CheckUpNerve + (datas.NerveClassify ? " (Phân loại: " + datas.NerveClassify + ")" : "")),
                                        this.renderItem("Tâm thần", datas.Mental + (datas.MentalClassify ? " (Phân loại: " + datas.MentalClassify + ")" : "")),
                                        this.renderItem("Hô hấp", datas.CheckUpRespiration + (datas.RespirationClassify ? " (Phân loại: " + datas.RespirationClassify + ")" : "")),
                                        this.renderItem("Thận tiết niệu", datas.CheckUpUrination + (datas.UrinationClassify ? " (Phân loại: " + datas.UrinationClassify + ")" : "")),
                                        this.renderItem("Nội tiết", datas.Content + (datas.ContentClassify ? " (Phân loại: " + datas.ContentClassify + ")" : "")),
                                        this.renderListMedicine(datas.ListMedicine)
                                    ].map((item, index) => <View key={index}>{item}</View>)
                                }
                            </View>
                            :
                            <View>
                                {
                                    this.state.checkupResult.First_Diagnostic ?
                                        <View>
                                            <View style={styles.breakline} />
                                            <Text style={styles.diagnosticLabel}>Chẩn đoán</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                                <Text style={{ marginLeft: 10 }}>{this.state.checkupResult.First_Diagnostic}</Text>
                                            </View>
                                        </View> : null}
                                {
                                    this.state.checkupResult.DiseaseDiagnostic || this.state.Diagnostic ?
                                        <View>
                                            <View style={styles.breakline} />
                                            <Text style={styles.diagnosticLabel}>Chẩn đoán bệnh</Text>
                                            {
                                                this.state.checkupResult.DiseaseDiagnostic ?
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                                        <Text style={{ marginLeft: 10 }}>{this.state.checkupResult.DiseaseDiagnostic}</Text>
                                                    </View> : null
                                            }
                                            {
                                                this.state.checkupResult.Diagnostic ?
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                                        <Text style={{ marginLeft: 10 }}>{this.state.checkupResult.Diagnostic}</Text>
                                                    </View> : null
                                            }
                                        </View> : null}
                                {
                                    this.state.checkupResult.Other_DiseaseDiagnostic ?
                                        <View>
                                            <View style={styles.breakline} />
                                            <Text style={styles.diagnosticLabel}>Chẩn đoán khác</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                                <Text style={{ marginLeft: 10 }}>{this.state.checkupResult.Other_DiseaseDiagnostic}</Text>
                                            </View>
                                        </View> : null}
                                {
                                    (this.state.checkupResult.DoctorAdviceTxt || this.state.checkupResult.DoctorAdvice) ?
                                        <View>
                                            <View style={styles.breakline} />
                                            <Text style={styles.diagnosticLabel}>Lời dặn</Text>
                                            {
                                                this.state.checkupResult.DoctorAdvice ?
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                                        <Text style={{ marginLeft: 10 }}>{this.state.checkupResult.DoctorAdvice}</Text>
                                                    </View> : null
                                            }
                                            {
                                                this.state.checkupResult.DoctorAdviceTxt ?
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                                        <Text style={{ marginLeft: 10 }}>{this.state.checkupResult.DoctorAdviceTxt}</Text>
                                                    </View> : null}
                                        </View> : null
                                }
                                {
                                    this.state.checkupResult.Note ?
                                        <View>
                                            <View style={styles.breakline} />
                                            <Text style={styles.diagnosticLabel}>Ghi chú</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                                <Text style={{ marginLeft: 10 }}>{this.state.checkupResult.Note}</Text>
                                            </View>
                                        </View> : null
                                }
                                {
                                    (this.state.checkupResult.ListMedicine
                                        && this.state.checkupResult.ListMedicine.length > 0)
                                        ||
                                        (this.state.checkupResult.ListExternalMedicine
                                            && this.state.checkupResult.ListExternalMedicine.length > 0)
                                        ?
                                        <View>
                                            <Text style={[styles.diagnosticLabel, { marginBottom: 0, marginTop: 10 }]}>Đơn thuốc</Text>
                                            <Table style={[styles.table, { marginTop: 10 }]} borderStyle={{ borderWidth: 0.5, borderColor: '#c8e1ff' }}>
                                                <Row data={tableHead} style={styles.head} textStyle={styles.textHead} flexArr={[1, 3, 1, 1]} />
                                                {this.renderMedicine(0, this.state.checkupResult.ListMedicine)}
                                                {this.renderMedicine(this.state.checkupResult.ListMedicine.length, this.state.checkupResult.ListExternalMedicine)}
                                            </Table>
                                        </View> : null
                                }
                            </View>
                    }
                    <View style={{ height: 50 }}></View>
                </ScrollView>
                <ExportPDF ref={(element) => this.exportPdfCom = element} />
            </ActivityPanel >
        )
    }
}

var styles = StyleSheet.create({
    table: { marginTop: 30, marginBottom: 50 },
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
});
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps, null, null, { withRef: true })(BookingCheckupResultScreen);