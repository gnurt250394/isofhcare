import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import ScaleImage from 'mainam-react-native-scaleimage';
import constants from '@resources/strings'
import { connect } from 'react-redux';
import snackbar from '@utils/snackbar-utils';
import dateUtils from 'mainam-react-native-date-utils';
import bookingProvider from '@data-access/booking-provider'
import Barcode from 'react-native-barcode-builder';

import {
    StyleSheet
} from 'react-native';

class DetailBookingHasCheckin extends Component {
    constructor(props) {
        super(props);
    }
    hasResult(datas) {
        return datas.Anamnesis ||
            datas.AnamnesisFamily ||
            datas.AnamnesisMedicine ||
            datas.AnamnesisMaternity ||
            datas.Height ||
            datas.Weight ||
            datas.BMI ||
            datas.BloodPressure ||
            datas.Pulse ||
            datas.PhysicalClassify ||
            datas.RBCCount ||
            datas.LeukemiaCount ||
            datas.PlateletCount ||
            datas.BloodSugar ||
            datas.Ure ||
            datas.Creatinin ||
            datas.Protein ||
            datas.UrineTestOther ||
            datas.BloodTestOther ||
            datas.ImageDiagnose ||
            datas.ImmunitySpecialist ||
            datas.ImmunityClassifySpecialist ||
            datas.HeartSpecialist ||
            datas.HeartClassifySpecialist ||
            datas.CheckUpUrinationSpecialist ||
            datas.UrinationClassifySpecialist ||
            datas.TumorSpecialist ||
            datas.TumorClassifySpecialist ||
            datas.CheckUpNerveSpecialist ||
            datas.NerveClassifySpecialist ||
            datas.MentalSpecialist ||
            datas.MentalClassifySpecialist ||
            datas.Surgical ||
            datas.SurgicalClassify ||
            datas.CheckUpLEyeWOGlass ||
            datas.CheckUpLEyeWGlass ||
            datas.CheckUpREyeWOGlass ||
            datas.CheckUpREyeWGlass ||
            datas.EyeDisease ||
            datas.EyeClassify ||
            datas.Gynecology ||
            datas.GynecologyClassify ||
            datas.SpeakNormallyL ||
            datas.SpeakNormallyR ||
            datas.WhisperL ||
            datas.WhisperR ||
            datas.ENTClassify ||
            datas.Conclusion1 ||
            datas.RightEar ||
            datas.LeftEar ||
            datas.RightNose ||
            datas.LeftNose ||
            datas.Throat ||
            datas.Bulkhead ||
            datas.Nasopharynx ||
            datas.Laryngopharynx ||
            datas.ENTConclusion ||
            datas.EndoscopicClassify ||
            datas.LowerJaw ||
            datas.UpperJaw ||
            datas.DentalDisease ||
            datas.DentalClassify ||
            datas.CheckUpMusculoskelSpecialist ||
            datas.MusculoskelClassifySpecialist ||
            datas.CheckUpRespirationSpecialist ||
            datas.RespirationClassifySpecialist ||
            datas.CheckUpDigestionSpecialist ||
            datas.DigestionSpecialistClassify ||
            datas.Dermatology ||
            datas.DermatologyClassify ||
            datas.OtherDiseases ||
            datas.OtherConclusion ||
            datas.ActUser ||
            datas.HealthClassify ||
            datas.ListMedicine ||
            datas.CheckUpCirculation ||
            datas.CheckUpDigestion ||
            datas.CheckUpMusculoskel ||
            datas.CheckUpNerve ||
            datas.Mental ||
            datas.CheckUpRespiration ||
            datas.CheckUpUrination ||
            datas.Content
    }

    viewResult() {
        if (!this.props.bookingResult || !this.props.bookingResult.Profile) {
            snackbar.show(constants.msg.ehealth.not_found_result_of_this_booking);
            return;
        }
        let result = {
            data: this.props.bookingResult
        }
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        // console.log(result.data.ResultContractCheckup)
        // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        if (this.props.bookingResult.Profile.IsContract) {
            result.data.ListResultCheckup = [];
            if (result.data.ResultContractCheckup) {
                var result1 = result.data.ResultContractCheckup;
                if (result1.ResultTheLuc) {
                    result1.ResultTheLuc.ServiceName = "Kết quả Khám Thể lực";
                    result1.ResultTheLuc.Type = "ResultTheLuc";
                    result1.ResultTheLuc.HIS_Service_ID = "ResultTheLuc";
                    result.data.ListResultCheckup.push(result1.ResultTheLuc);
                }
                if (result1.ResultNoiKhoa) {
                    result1.ResultNoiKhoa.ServiceName = "Kết quả Khám Nội khoa";
                    result1.ResultNoiKhoa.Type = "ResultNoiKhoa";
                    result1.ResultNoiKhoa.HIS_Service_ID = "ResultNoiKhoa";
                    result.data.ListResultCheckup.push(result1.ResultNoiKhoa);
                }
                if (result1.ResultNgoaiKhoa) {
                    result1.ResultNgoaiKhoa.ServiceName = "Kết quả Khám Ngoại khoa";
                    result1.ResultNgoaiKhoa.Type = "ResultNgoaiKhoa";
                    result1.ResultNgoaiKhoa.HIS_Service_ID = "ResultNgoaiKhoa";
                    result.data.ListResultCheckup.push(result1.ResultNgoaiKhoa);
                }
                if (result1.ResultSanPhuKhoa) {
                    result1.ResultSanPhuKhoa.ServiceName = "Kết quả Khám Sản phụ khoa";
                    result1.ResultSanPhuKhoa.Type = "ResultSanPhuKhoa";
                    result1.ResultSanPhuKhoa.HIS_Service_ID = "ResultSanPhuKhoa";
                    result.data.ListResultCheckup.push(result1.ResultSanPhuKhoa);
                }

                if (result1.ResultMat) {
                    result1.ResultMat.ServiceName = "Kết quả Khám mắt";
                    result1.ResultMat.Type = "ResultMat";
                    result1.ResultMat.HIS_Service_ID = "ResultMat";
                    result.data.ListResultCheckup.push(result1.ResultMat);
                }

                if (result1.ResultTMH) {
                    result1.ResultTMH.ServiceName = "Kết quả Khám Tai Mũi Họng";
                    result1.ResultTMH.Type = "ResultTMH";
                    result1.ResultTMH.HIS_Service_ID = "ResultTMH";
                    result.data.ListResultCheckup.push(result1.ResultTMH);
                }
                if (result1.ResultRHM) {
                    result1.ResultRHM.ServiceName = "Kết quả Khám Răng hàm mặt";
                    result1.ResultRHM.Type = "ResultRHM";
                    result1.ResultRHM.HIS_Service_ID = "ResultRHM";
                    result.data.ListResultCheckup.push(result1.ResultRHM);
                }

                if (result1.ResultNSTMH) {
                    result1.ResultNSTMH.ServiceName = "Kết quả Nội soi Tai Mũi Họng";
                    result1.ResultNSTMH.Type = "ResultNSTMH";
                    result1.ResultNSTMH.HIS_Service_ID = "ResultNSTMH";
                    result.data.ListResultCheckup.push(result1.ResultNSTMH);
                }
                if (result1.ResultDaLieu) {
                    result1.ResultDaLieu.ServiceName = "Kết quả Khám Da liễu";
                    result1.ResultDaLieu.Type = "ResultDaLieu";
                    result1.ResultDaLieu.HIS_Service_ID = "ResultDaLieu";
                    result.data.ListResultCheckup.push(result1.ResultDaLieu);
                }
                if (result1.ResultTimMach) {
                    result1.ResultTimMach.ServiceName = "Kết quả Khám Tim mạch";
                    result1.ResultTimMach.Type = "ResultTimMach";
                    result1.ResultTimMach.HIS_Service_ID = "ResultTimMach";
                    result.data.ListResultCheckup.push(result1.ResultTimMach);
                }
                if (result1.ResultNoiTiet) {
                    result1.ResultNoiTiet.ServiceName = "Kết quả Khám Nội tiết";
                    result1.ResultNoiTiet.Type = "ResultNoiTiet";
                    result1.ResultNoiTiet.HIS_Service_ID = "ResultNoiTiet";
                    result.data.ListResultCheckup.push(result1.ResultNoiTiet);
                }
                if (result1.ResultUngBuou) {
                    result1.ResultUngBuou.ServiceName = "Kết quả Khám Ung bướu";
                    result1.ResultUngBuou.Type = "ResultUngBuou";
                    result1.ResultUngBuou.HIS_Service_ID = "ResultUngBuou";
                    result.data.ListResultCheckup.push(result1.ResultUngBuou);
                }
                if (result1.ResultHoHap) {
                    result1.ResultHoHap.ServiceName = "Kết quả Khám Hô hấp";
                    result1.ResultHoHap.Type = "ResultHoHap";
                    result1.ResultHoHap.HIS_Service_ID = "ResultHoHap";
                    result.data.ListResultCheckup.push(result1.ResultHoHap);
                }
                if (result1.ResultCoXuongKhop) {
                    result1.ResultCoXuongKhop.ServiceName = "Kết quả Khám Cơ xương khớp";
                    result1.ResultCoXuongKhop.Type = "ResultCoXuongKhop";
                    result1.ResultCoXuongKhop.HIS_Service_ID = "ResultCoXuongKhop";
                    result.data.ListResultCheckup.push(result1.ResultCoXuongKhop);
                }
                if (result1.ResultDiUng) {
                    result1.ResultDiUng.ServiceName = "Kết quả Khám Dị ứng";
                    result1.ResultDiUng.Type = "ResultDiUng";
                    result1.ResultDiUng.HIS_Service_ID = "ResultDiUng";
                    result.data.ListResultCheckup.push(result1.ResultDiUng);
                }
                if (result1.ResultTieuHoa) {
                    result1.ResultTieuHoa.ServiceName = "Kết quả Khám Tiêu hóa";
                    result1.ResultTieuHoa.Type = "ResultTieuHoa";
                    result1.ResultTieuHoa.HIS_Service_ID = "ResultTieuHoa";
                    result.data.ListResultCheckup.push(result1.ResultTieuHoa);
                }
                if (result1.ResultThanKinh) {
                    result1.ResultThanKinh.ServiceName = "Kết quả Khám Thần kinh";
                    result1.ResultThanKinh.Type = "ResultThanKinh";
                    result1.ResultThanKinh.HIS_Service_ID = "ResultThanKinh";
                    result.data.ListResultCheckup.push(result1.ResultThanKinh);
                }
                if (result1.ResultTamThan) {
                    result1.ResultTamThan.ServiceName = "Kết quả Khám Tâm thần";
                    result1.ResultTamThan.Type = "ResultTamThan";
                    result1.ResultTamThan.HIS_Service_ID = "ResultTamThan";
                    result.data.ListResultCheckup.push(result1.ResultTamThan);
                }
                if (result1.ResultCLS) {
                    result1.ResultCLS.ServiceName = "Kết quả Cận Lâm Sàng";
                    result1.ResultCLS.Type = "ResultCLS";
                    result1.ResultCLS.HIS_Service_ID = "ResultCLS";
                    result.data.ListResultCheckup.push(result1.ResultCLS);
                }

                if (result1.Conclusion) {
                    result1.Conclusion.ServiceName = "Kết luận";
                    result1.Conclusion.Type = "Conclusion";
                    result1.Conclusion.HIS_Service_ID = "Conclusion";
                    result.data.ListResultCheckup.push(result1.Conclusion);
                }
                if (result1.ListMedicine && result1.ListMedicine.length > 0) {
                    result.data.ListResultCheckup.push({
                        ListMedicine: result1.ListMedicine,
                        ServiceName: "Đơn thuốc",
                        Type: "ListMedicine",
                        HIS_Service_ID: "ListMedicine"
                    });
                }
                result.data.ListResultCheckup = result.data.ListResultCheckup.filter(item => this.hasResult(item));
            }

        }
        result.profile = this.props.bookingResult.Profile;
        if ((result.data.ListResultCheckup && result.data.ListResultCheckup.length > 0)
            || (result.data.ListResulHuyetHoc && result.data.ListResulHuyetHoc.length > 0)
            || (result.data.ListResulViSinh && result.data.ListResulViSinh.length > 0)
            || (result.data.ListResulHoaSinh && result.data.ListResulHoaSinh.length > 0)
            || (result.data.ListResulGiaiPhau && result.data.ListResulGiaiPhau.length > 0)
            || (result.data.ListDiagnostic && result.data.ListDiagnostic.length > 0)
            || (result.data.ListResulOther && result.data.ListResulOther.length > 0)
        ) {
            debugger;
            result.booking = this.props.booking;
            this.props.navigation.navigate("viewBookingResult", { result })
            return;
        }
        snackbar.show(constants.msg.ehealth.not_found_result_of_this_booking);

    }


    render() {
        let bookingDetail = this.props.bookingDetail;
        debugger;
        return (
            <View style={{ flexDirection: 'column', padding: 10, flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Mã bệnh nhân</Text>
                            <View style={{ marginLeft: -10 }}>
                                <Barcode value={bookingDetail.Profile.Value + ""} height={60} width={1.17} />
                            </View>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: constants.colors.primaryColor }}>{bookingDetail.Profile.Value}</Text>
                        </View>
                        <View style={{ marginLeft: 'auto' }}>
                            <TouchableOpacity onPress={this.viewResult.bind(this)}>
                                <Text style={{ borderColor: constants.colors.primaryColor, borderWidth: 2, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 20, color: constants.colors.primaryColor, fontWeight: 'bold' }}>Xem kết quả</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        bookingDetail.ListService && bookingDetail.ListService.length > 0 ?
                            <View >
                                {
                                    bookingDetail.ListService && bookingDetail.ListService.length > 0 && bookingDetail.ListService[0].DepartmentName ?
                                        <View>
                                            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Khoa</Text>
                                            <View style={{ width: 60, height: 3, backgroundColor: constants.colors.primaryColor, marginTop: 10 }}></View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                <Text style={{ flex: 1 }}>
                                                    {bookingDetail.ListService[0].DepartmentName}
                                                </Text>
                                            </View>
                                        </View> : null
                                }
                                <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Dịch vụ: {bookingDetail.Profile.IsContract ? '' : '(giá tạm tính)'} </Text>
                                <View style={{ width: 60, height: 3, backgroundColor: constants.colors.primaryColor, marginTop: 10 }}></View>
                                {bookingDetail.ListService.map((item, i) =>
                                    <View key={i}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                            <ScaleImage width={7} source={require("@ehealth/daihocy/resources/images/ic_dot.png")} />
                                            <Text style={{ flex: 1, marginLeft: 10 }}> {item.Name.trim()} </Text>
                                            <Text> {bookingDetail.Profile.IsContract ? "" : item.PriceService.formatPrice() + " đ"} </Text>
                                        </View>
                                        {!bookingDetail.Profile.IsContract &&
                                            (item.ServiceType == "CheckUp" && (item.RoomName || item.Location)) ?
                                            <View style={{ marginTop: 10, marginLeft: 17, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginRight: 10 }}> Nơi khám: </Text>
                                                <Text style={{ flexWrap: 'wrap', flex: 1 }}>
                                                    {item.RoomName} {item.Location}
                                                </Text>
                                            </View> : null
                                        }
                                        {!bookingDetail.Profile.IsContract && item.DoctorFullName ?
                                            <View style={{ flexDirection: 'row', marginLeft: 17, alignItems: 'center', marginTop: 10 }}>
                                                <Text style={{ fontWeight: 'bold', marginRight: 10 }}> Bác sĩ: </Text>
                                                <Text> {item.DoctorFullName} </Text>
                                            </View> : null}

                                        {item.SequenceNoInt ?
                                            <View style={{ marginTop: 10, marginLeft: 17, flexDirection: 'row' }}>
                                                <Text style={{ fontWeight: 'bold', marginRight: 10 }}> Số khám: </Text>
                                                <Text> {item.SequenceNoInt} </Text>
                                            </View> : null}
                                    </View>

                                )}
                                {
                                    !bookingDetail.Profile.IsContract &&
                                    <View>
                                        {bookingDetail.ListInvoice && bookingDetail.ListInvoice.length > 0 ?
                                            <View>
                                                <View style={{ marginLeft: 17, width: 150, height: 3, backgroundColor: constants.colors.primaryColor, marginTop: 10 }}></View>
                                                <View style={{ marginLeft: 17, marginTop: 10, flexDirection: 'row' }}>
                                                    <Text style={{ fontWeight: 'bold' }}>Tổng tiền thanh toán:</Text>
                                                    <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>
                                                        {
                                                            (
                                                                bookingDetail.ListInvoice.reduce((a, b) => a + b.Amount, 0) -
                                                                (bookingDetail.ListPayment && bookingDetail.ListPayment.length > 0 ? bookingDetail.ListPayment.reduce((a, b) => a + b.Amount, 0) : 0)
                                                            ).formatPrice() + " đ"
                                                        }</Text>
                                                </View>
                                            </View> :
                                            <View>
                                                <View style={{ marginLeft: 17, width: 150, height: 2, backgroundColor: constants.colors.primaryColor, marginTop: 10 }}></View>
                                                <View style={{ marginLeft: 17, marginTop: 10, flexDirection: 'row' }}>
                                                    <Text style={{ fontWeight: 'bold' }}>Tổng tiền dịch vụ:</Text>
                                                    <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>
                                                        {
                                                            bookingDetail.ListService.reduce((a, b) => a + b.PriceService, 0).formatPrice() + " đ"
                                                        }</Text>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                }

                            </View> : null}
                    <Text style={{ marginTop: 20, fontWeight: 'bold' }}> Thông tin cá nhân</Text>
                    <View style={{ width: 60, height: 3, backgroundColor: constants.colors.primaryColor, marginTop: 10 }}></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <ScaleImage width={20} source={require("@ehealth/daihocy/resources/images/ic_info.png")} style={{ marginTop: 5 }} />
                        <Text style={{ marginLeft: 10 }}>
                            {
                                this.props.bookingDetail.Profile.PatientName
                            }
                        </Text>

                    </View>
                    {
                        this.props.bookingDetail.Profile.Address ? <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <ScaleImage width={18} source={require("@ehealth/daihocy/resources/images/ic_location.png")} style={{ marginTop: 5 }} />
                            <Text style={{ marginLeft: 10 }}>
                                {
                                    this.props.bookingDetail.Profile.Address
                                }
                            </Text>
                        </View> : null
                    }
                    {
                        this.props.bookingDetail.Profile.PhoneNumber ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <ScaleImage width={20} source={require("@ehealth/daihocy/resources/images/ic_phone.png")} style={{ marginTop: 5 }} />
                                <Text style={{ marginLeft: 10 }}>
                                    {
                                        this.props.bookingDetail.Profile.PhoneNumber
                                    }
                                </Text>
                            </View> : null}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <ScaleImage width={20} source={require("@ehealth/daihocy/resources/images/ic_bookingDate.png")} style={{ marginTop: 5 }} />
                        <Text style={{ marginLeft: 10 }}>
                            {
                                (bookingDetail.Profile.TimeGoIn).toDateObject().format("hh:mm Ngày dd/MM/yyyy")
                            }
                        </Text>
                    </View>
                </ScrollView>
            </View >
        )
    };
}

function mapStateToProps(state) {
    return {
        userApp: state.userApp,
        navigation: state.navigation
    }
}
export default connect(mapStateToProps)(DetailBookingHasCheckin);