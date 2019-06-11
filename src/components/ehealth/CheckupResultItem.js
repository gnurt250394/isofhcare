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
import { Table, Row } from 'react-native-table-component';
import ExportPDF from '@ehealth/daihocy/components/ExportPDF';

class CheckupResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listTime: []
        }
    }

    renderItemCheckup(item) {
        const tableHead = ['STT', 'Tên thuốc', 'Số lượng', 'Đơn vị'];
        return <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 15, color: constants.colors.primary_bold }}>{item.ServiceName}</Text>
                {/* <TouchableOpacity onPress={() => this.exportPdf()}>
                        <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                    </TouchableOpacity> */}
            </View>
            <View style={styles.slide}>

                <View>
                    {
                        item.First_Diagnostic ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Chẩn đoán</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{item.First_Diagnostic}</Text>
                                </View>
                            </View> : null}
                    {
                        item.DiseaseDiagnostic || this.state.Diagnostic ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Chẩn đoán bệnh</Text>
                                {
                                    item.DiseaseDiagnostic ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                            <Text style={{ marginLeft: 10 }}>{item.DiseaseDiagnostic}</Text>
                                        </View> : null
                                }
                                {
                                    item.Diagnostic ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                            <Text style={{ marginLeft: 10 }}>{item.Diagnostic}</Text>
                                        </View> : null
                                }
                            </View> : null}
                    {
                        item.Other_DiseaseDiagnostic ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Chẩn đoán khác</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{item.Other_DiseaseDiagnostic}</Text>
                                </View>
                            </View> : null}
                    {
                        (item.DoctorAdviceTxt || item.DoctorAdvice) ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Lời dặn</Text>
                                {
                                    item.DoctorAdvice ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                            <Text style={{ marginLeft: 10 }}>{item.DoctorAdvice}</Text>
                                        </View> : null
                                }
                                {
                                    item.DoctorAdviceTxt ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                            <Text style={{ marginLeft: 10 }}>{item.DoctorAdviceTxt}</Text>
                                        </View> : null}
                            </View> : null
                    }
                    {
                        item.Note ?
                            <View>
                                <View style={styles.breakline} />
                                <Text style={styles.diagnosticLabel}>Ghi chú</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScaleImage source={require("@ehealth/daihocy/resources/images/ic_dot.png")} width={5} style={{ marginTop: 7 }} />
                                    <Text style={{ marginLeft: 10 }}>{item.Note}</Text>
                                </View>
                            </View> : null
                    }
                    {/* {
                            (item.ListMedicine && item.ListMedicine.length > 0) || (item.ListExternalMedicine && item.ListExternalMedicine.length > 0)
                                ?
                                <View style={{flex: 1}}>
                                    <Text style={[styles.diagnosticLabel, { marginBottom: 0, marginTop: 10 }]}>Đơn thuốc</Text>
                                    <Table style={[styles.table, { marginTop: 10 }]} borderStyle={{ borderWidth: 0.5, borderColor: '#c8e1ff' }}>
                                        <Row data={tableHead} style={styles.head} textStyle={styles.textHead} flexArr={[1, 3, 1, 1]} />
                                        {this.renderMedicine(0, item.ListMedicine)}
                                        {this.renderMedicine(item.ListMedicine.length, item.ListExternalMedicine)}
                                    </Table>
                                </View> : null
                        } */}
                </View>
            </View>
        </View>
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
    renderMedicine(index, list) {
        if (list) {
            return list.map((data, i) => (
                this.renderMedicineItem(i + index, data)
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
    renderItemCheckupContract(item, index) {

        return <View style={{ flex: 1 }} key={index}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ padding: 10 }} key={index}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
                    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 15, color: constants.colors.primary_bold }}>{item.ServiceName}</Text>
                    <TouchableOpacity onPress={() => this.exportPdf()}>
                        <Text style={{ borderColor: '#065cb4', borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: "#065cb4", fontWeight: 'bold' }}>Xuất PDF</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.slide}>

                    <View>
                        {
                            [
                                this.renderItem("Tiền sử bệnh", item.Anamnesis),
                                this.renderItem("Tiền sử gia đình", item.AnamnesisFamily),
                                this.renderItem("Tiền sử dị ứng thuốc", item.AnamnesisMedicine),
                                this.renderItem("Tiền sử thai sản", item.AnamnesisMaternity),
                                this.renderItem("Chiều cao", item.Height),
                                this.renderItem("Cân nặng", item.Weight),
                                this.renderItem("BMI", item.BMI),
                                this.renderItem("Huyết áp", item.BloodPressure),
                                this.renderItem("Nhịp tim", item.Pulse),
                                this.renderItem("Phân loại", item.PhysicalClassify),
                                this.renderItem("Số lượng Hồng cầu", item.RBCCount),
                                this.renderItem("Số lượng Bạch cầu", item.LeukemiaCount),
                                this.renderItem("Số lượng Tiểu cầu", item.PlateletCount),
                                this.renderItem("Đường máu", item.BloodSugar),
                                this.renderItem("Ure", item.Ure),
                                this.renderItem("Creatinin", item.Creatinin),
                                this.renderItem("Protein", item.Protein),
                                this.renderItem("Xét nghiệm nước tiểu khác", item.UrineTestOther),
                                this.renderItem("Xét nghiệm máu khác", item.BloodTestOther),
                                this.renderItem("Chẩn đoán hình ảnh", item.ImageDiagnose),
                                this.renderItem("Dị ứng miễn dịch", item.ImmunitySpecialist),
                                this.renderItem("Phân loại", item.ImmunityClassifySpecialist),
                                this.renderItem("Chuyên khoa tim mạch", item.HeartSpecialist),
                                this.renderItem("Phân loại", item.HeartClassifySpecialist),
                                this.renderItem("Chuyên khoa thận tiết niệu", item.CheckUpUrinationSpecialist),
                                this.renderItem("Phân loại", item.UrinationClassifySpecialist),
                                this.renderItem("Chuyên khoa ung bướu", item.TumorSpecialist),
                                this.renderItem("Phân loại", item.TumorClassifySpecialist),
                                this.renderItem("Chuyên khoa thần kinh", item.CheckUpNerveSpecialist),
                                this.renderItem("Phân loại", item.NerveClassifySpecialist),
                                this.renderItem("Chuyên khoa tâm thần", item.MentalSpecialist),
                                this.renderItem("Phân loại", item.MentalClassifySpecialist),
                                this.renderItem("Ngoại khoa", item.Surgical),
                                this.renderItem("Phân loại", item.SurgicalClassify),
                                this.renderItem("Mắt trái không kính", item.CheckUpLEyeWOGlass),
                                this.renderItem("Mắt trái với kính", item.CheckUpLEyeWGlass),
                                this.renderItem("Mắt phải không kính", item.CheckUpREyeWOGlass),
                                this.renderItem("Mắt phải với kính", item.CheckUpREyeWGlass),
                                this.renderItem("Bệnh về mắt", item.EyeDisease),
                                this.renderItem("Phân loại", item.EyeClassify),
                                this.renderItem("Sản phụ khoa", item.Gynecology),
                                this.renderItem("Phân loại", item.GynecologyClassify),
                                this.renderItem("Nói thường tai trái", item.SpeakNormallyL),
                                this.renderItem("Nói thường tai phải", item.SpeakNormallyR),
                                this.renderItem("Nói thầm tai trái", item.WhisperL),
                                this.renderItem("Nói thầm tai phải", item.WhisperR),
                                this.renderItem("Phân loại", item.ENTClassify),
                                this.renderItem("Kết luận", item.Conclusion1),
                                this.renderItem("Tai phải", item.RightEar),
                                this.renderItem("Tai trái", item.LeftEar),
                                this.renderItem("Mũi phải", item.RightNose),
                                this.renderItem("Mũi trái", item.LeftNose),
                                this.renderItem("Họng", item.Throat),
                                this.renderItem("Vách ngăn", item.Bulkhead),
                                this.renderItem("Vòm", item.Nasopharynx),
                                this.renderItem("Hạ họng - Thanh quản", item.Laryngopharynx),
                                this.renderItem("Kết luận", item.ENTConclusion),
                                this.renderItem("Phân loại", item.EndoscopicClassify),
                                this.renderItem("Hàm dưới", item.LowerJaw),
                                this.renderItem("Hàm trên", item.UpperJaw),
                                this.renderItem(">Bệnh R-H-M", item.DentalDisease),
                                this.renderItem("Phân loại", item.DentalClassify),
                                this.renderItem("Chuyên khoa cơ xương khớp", item.CheckUpMusculoskelSpecialist),
                                this.renderItem("Phân loại", item.MusculoskelClassifySpecialist),
                                this.renderItem("Chuyên khoa hô hấp", item.CheckUpRespirationSpecialist),
                                this.renderItem("Phân loại", item.RespirationClassifySpecialist),
                                this.renderItem("Chuyên khoa tiêu hóa", item.CheckUpDigestionSpecialist),
                                this.renderItem("Phân loại", item.DigestionSpecialistClassify),
                                this.renderItem("Chuyên khoa da liễu", item.Dermatology),
                                this.renderItem("Phân loại", item.DermatologyClassify),
                                this.renderItem("Các bệnh tật nếu có", item.OtherDiseases),
                                this.renderItem("Những điều cần giải quyết", item.OtherConclusion),
                                this.renderItem("Bác sĩ", item.ActUser),
                                this.renderItem("Phân loại", item.HealthClassify),
                                this.renderItem("Tuần hoàn", item.CheckUpCirculation + (item.CirculationClassify ? " (Phân loại: " + item.CirculationClassify + ")" : "")),
                                this.renderItem("Tiêu hóa", item.CheckUpDigestion + (item.DigestionClassify ? " (Phân loại: " + item.DigestionClassify + ")" : "")),
                                this.renderItem("Cơ xương khớp", item.CheckUpMusculoskel + (item.MusculoskelClassify ? " (Phân loại: " + item.MusculoskelClassify + ")" : "")),
                                this.renderItem("Thần kinh", item.CheckUpNerve + (item.NerveClassify ? " (Phân loại: " + item.NerveClassify + ")" : "")),
                                this.renderItem("Tâm thần", item.Mental + (item.MentalClassify ? " (Phân loại: " + item.MentalClassify + ")" : "")),
                                this.renderItem("Hô hấp", item.CheckUpRespiration + (item.RespirationClassify ? " (Phân loại: " + item.RespirationClassify + ")" : "")),
                                this.renderItem("Thận tiết niệu", item.CheckUpUrination + (item.UrinationClassify ? " (Phân loại: " + item.UrinationClassify + ")" : "")),
                                this.renderItem("Nội tiết", item.Content + (item.ContentClassify ? " (Phân loại: " + item.ContentClassify + ")" : "")),
                                this.renderListMedicine(item.ListMedicine)
                            ].map((item, index) => <View key={index}>{item}</View>)
                        }
                    </View>
                </View>
                <View style={{ height: 50 }}></View>
            </ScrollView>
        </View>
    }
    render() {
        let { item } = this.props;
        return <View style={{ flex: 1 }} key={this.props.key}>
            {
                this.renderItemCheckup(item)
            }
        </View>
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
    slide: {
        flex: 1,
    },
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
})
export default connect(mapStateToProps)(CheckupResult);