import React, { Component } from 'react';
import constants from '@resources/strings';
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import Share from 'react-native-share';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import permission from 'mainam-react-native-permission';


class ExportPDF extends Component {
    renderResult(result) {
        debugger;
        console.log("000000000000000000000000000000000000000000000000000000000000000000000")
        console.log(result.profile.IsContract)
        console.log("000000000000000000000000000000000000000000000000000000000000000000000")
        if (result.profile.IsContract) {

        }

        var resultSurgery = result.data.ListResulGiaiPhau;
        var resultCheckup = result.data.ListResultCheckup;
        var resultDiagnostic = result.data.ListDiagnostic;
        var resultMedicalTest;
        if ((result.data.ListResulViSinh && result.data.ListResulViSinh.length > 0)
            || (result.data.ListResulHoaSinh && result.data.ListResulHoaSinh.length > 0)
            || (result.data.ListResulHuyetHoc && result.data.ListResulHuyetHoc.length > 0))
            resultMedicalTest = {
                resultViSinh: result.data.ListResulViSinh,
                resultHoaSinh: result.data.ListResulHoaSinh,
                resultHuyetHoc: result.data.ListResulHuyetHoc,
            }
        var profile = result.profile;
        var div = "";

        if (resultSurgery && resultSurgery.length > 0) {
            for (var i = 0; i < resultSurgery.length; i++) {
                var item = resultSurgery[i];
                div += this.renderResultSurgery(result, profile, item);
                div += "<style>.pagebreak { page-break-before: always; }</style><div class='pagebreak'></div>";
            }
        }
        if (resultCheckup && resultCheckup.length > 0) {
            for (var i = 0; i < resultCheckup.length; i++) {
                var item = resultCheckup[i];
                div += this.renderResultCheckup(result, profile, item);
                div += "<style>.pagebreak { page-break-before: always; }</style><div class='pagebreak'></div>";
            }
        }
        if (resultDiagnostic && resultDiagnostic.length > 0) {
            for (var i = 0; i < resultDiagnostic.length; i++) {
                var item = resultDiagnostic[i];
                div += this.renderResultDiagnostic(result, profile, item);
                div += "<style>.pagebreak { page-break-before: always; }</style><div class='pagebreak'></div>";
            }
        }
        if (resultMedicalTest) {
            if (div)
                div += "<style>.pagebreak { page-break-before: always; }</style><div class='pagebreak'></div>";
            div += this.renderResultMedicalTest(result, profile, resultMedicalTest);
        }

        return div;
    }

    renderHeader(booking) {
        var date = booking.profile.TimeGoIn.toDateObject().format("dd/MM/yyyy");
        var div = "<div style='height:50px'> </div>";
        div += "<div style='width: 100%;'><strong >Bệnh viện Đại học y Hà Nội</strong><strong style='float: right'>Ngày " + date + "</strong></div>";
        return div;
    }
    renderResultSurgery(booking, profile, item) {
        var div = "<div style='margin-left: 50px; margin-right: 50px;'>";
        div += this.renderHeader(booking);
        div += "<div style='font-weight: bold;    margin-bottom: 30px; text-align: center;    margin-top: 30px;'>Phiếu kết quả giải phẫu</div>"
        div += "<div class=\"content-filter-yba\"> <p> <span>Họ và tên : </span> <span class=\"ten-nb\">" + profile.name + "</span> <br />"
        div += "<br /> </p> <p class=\"yc-kt\">" + item.ServiceName + "</p>";
        if (item.BiopsyLocation) {
            div += "<p> <strong>Vị trí sinh thiết</strong> </p>";
            div += "<p>" + item.BiopsyLocation + "</p>";
        }
        if (item.Microsome) {
            div += "<p> <strong>Vi thể</strong> </p>";
            div += "<p>" + item.Microsome + "</p>";
        }
        if (item.Macrosome) {
            div += "<p> <strong>Đại thể</strong> </p>";
            div += "<p>" + item.Macrosome + "</p>";
        }
        if (item.Result || item.Discussion) {
            div += "<p> <strong>Kết quả</strong> </p>";
            div += "<p>" + item.Result + item.Discussion + "</p>";
        }
        if (item.ReportTemplate == "Tebaoamdao" || item.ReportTemplate == "Thinprep") {
            if (item.ServiceMedicTestLine.length > 0) {
                for (var i = 0; i < item.ServiceMedicTestLine.length; i++) {
                    if (item.ServiceMedicTestLine[i].IsVerified) {
                        div += "<p> <strong>☑ " + item.ServiceMedicTestLine[i].NameLine + "</strong> </p>";
                    } else {
                        div += "<p> <strong>☐ " + item.ServiceMedicTestLine[i].NameLine + "</strong> </p>";
                    }
                    div += "<p style='margin-left: 15px'>" + item.ServiceMedicTestLine[i].Result2 + "</p>";
                }
            }
        }
        if (item.Conclusion) {
            div += "<p> <strong>Kết luận</strong> </p>";
            div += "<p>" + item.Conclusion + "</p>";
        }
        div += " </div>"
        div += " </div>"

        return div;
    }

    renderResultMedicalTest(booking, profile, resultMedical) {
        var result = [];
        if (resultMedical.resultViSinh) {
            var item = {
                type: 'Vi Sinh',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);

            resultMedical.resultViSinh.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }
        if (resultMedical.resultHoaSinh) {
            var item = {
                type: 'Hóa Sinh',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);
            resultMedical.resultHoaSinh.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }
        if (resultMedical.resultHuyetHoc) {
            var item = {
                type: 'Huyết Học',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);
            resultMedical.resultHuyetHoc.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }
        var div = "";
        for (var i = 0; i < result.length; i++) {
            var item = result[i];
            if (item.value.ListMedical && item.value.ListMedical.length > 0) {
                div += this.renderMedItem(booking, profile, item);
                div += "<style>.pagebreak { page-break-before: always; }.bold{font-weight:bold; color: red}</style><div class='pagebreak'></div>";
            }
        }
        return div;
    }
    renderTd(child, _class, colSpan, rowSpan) {
        var td = "<td colspan='" + colSpan + "' rowspan='" + rowSpan + "' class='" + _class + "'>";
        td += child;
        td += "</td>"
        return td;
    }
    renderTr(child, _class) {
        var tr = "<tr class='" + _class + "'>"
        tr += child;
        tr += "</tr>";
        return tr;
    }
    renderHighLight(result, min, max) {
        try {
            if (result && result.toLowerCase() == "dương tính")
                return "bold";
            result = parseFloat(result);
            min = parseFloat(min);
            max = parseFloat(max);
            if (result < min || result > max)
                return "bold";
            return "";
        } catch (error) {
            return "";
        }
    }
    renderMedicalTestLine(type, item) {
        var result2 = "";
        result2 += this.renderTr(this.renderTd(item.ServiceName, "serviceName", type == "Vi Sinh" ? 2 : 4));
        for (var i = 0; i < item.ServiceMedicTestLine.length; i++) {
            var result = "";
            var item2 = item.ServiceMedicTestLine[i];
            var range = "";
            if (item2.LowerIndicator && item2.HigherIndicator)
                range = item2.LowerIndicator + " - " + item2.HigherIndicator;
            else {
                range = item2.LowerIndicator;
                if (item2.HigherIndicator)
                    range = item2.HigherIndicator;
            }
            result += type == 'Vi Sinh' ?
                this.renderTd(item2.NameLine.trim()) + this.renderTd(item2.Result, this.renderHighLight(item2.Result)) : this.renderTd(item2.NameLine.trim()) + this.renderTd(item2.Result, this.renderHighLight(item2.Result, item2.LowerIndicator, item2.HigherIndicator)) + this.renderTd(range) + this.renderTd(item2.Unit);
            result2 += this.renderTr(result);
        }
        return result2;
    }
    renderItemTest(type, item) {
        var result = "";
        if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0 && item.ServiceMedicTestLine[0].NameLine != 0) {
            return (this.renderMedicalTestLine(type, item));
        }

        if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0) {
            var range = "";
            if (item.ServiceMedicTestLine[0].LowerIndicator && item.ServiceMedicTestLine[0].HigherIndicator)
                range = item.ServiceMedicTestLine[0].LowerIndicator + " - " + item.ServiceMedicTestLine[0].HigherIndicator;
            else {
                range = item.ServiceMedicTestLine[0].LowerIndicator;
                if (item.ServiceMedicTestLine[0].HigherIndicator)
                    range = item.ServiceMedicTestLine[0].HigherIndicator;
            }

            type == 'Vi Sinh' ?
                result += this.renderTd(item.ServiceName, "serviceName") + this.renderTd(item.ServiceMedicTestLine[0].Result, this.renderHighLight(item.ServiceMedicTestLine[0].Result)) : result += this.renderTd(item.ServiceName, "serviceName") + this.renderTd(item.ServiceMedicTestLine[0].Result, this.renderHighLight(item.ServiceMedicTestLine[0].Result, item.ServiceMedicTestLine[0].LowerIndicator, item.ServiceMedicTestLine[0].HigherIndicator)) + this.renderTd(range) + this.renderTd(item.ServiceMedicTestLine[0].Unit);
        } else {
            var range = "";
            if (item.LowerIndicator && item.HigherIndicator)
                range = item.LowerIndicator + " - " + item.HigherIndicator;
            else {
                range = item.LowerIndicator;
                if (item.HigherIndicator)
                    range = item.HigherIndicator;
            }

            type == 'Vi Sinh' ?
                result += this.renderTd(item.ServiceName, "serviceName") + this.renderTd(item.Result, this.renderHighLight(item.Result)) : result += this.renderTd(item.ServiceName, "serviceName") + this.renderTd(item.Result, this.renderHighLight(item.Result, item.LowerIndicator, item.HigherIndicator)) + this.renderTd(range) + this.renderTd(item.Unit);
        }
        return this.renderTr(result);
    }
    renderMedItem(booking, profile, result) {
        var div = "<div style='margin-left: 50px; margin-right: 50px;'>";
        div += this.renderHeader(booking);
        div += "<div style='font-weight: bold;  margin-bottom: 30px; text-align: center;    margin-top: 30px;'>Phiếu kết quả xét nghiệm " + result.type + "</div>"
        div += "<div class=\"content-filter-yba\"> <p> <span>Họ và tên : </span> <span class=\"ten-nb\">" + profile.name + "</span> <br />"
        div += "<style>.resultMedical {background-color: #fff; border: 1px solid #ddd; width: 100%; text-align:'center'} .resultMedical th{    border-bottom: 0;     background-color: #486677;     color: #fff;} .resultMedical .serviceName{font-weight: bold } .resultMedical td{border-right: 1px solid #ddd; 	    padding: 8px;     line-height: 1.42857143;     vertical-align: top;     border-top: 1px solid #ddd;} </style>"
        div += "<table style='width: 100%' class='resultMedical'>"
        div += "<thead>"
        div += "<tr>";
        div += "<th>Tên XN</th>"
        div += "<th>Kết quả</th>"
        if (result.type != "Vi Sinh") {
            div += "<th>Giá trị bình thường</th>"
            div += "<th>Đơn vị</th>"
        }
        div += "</tr>";
        div += "</thead>"
        div += "<tbody>"
        for (var i = 0; i < result.value.ListMedical.length; i++) {
            div += this.renderItemTest(result.type, result.value.ListMedical[i]);
        }
        div += "</tbody>"
        div += "</table>"
        div += " </div>"
        div += " </div>"
        return div;
    }
    renderResultCheckup(booking, profile, item) {
        debugger;
        // alert(JSON.stringify(item.ServiceName));
        var div = "<div style='margin-left: 50px; margin-right: 50px;'>";
        div += this.renderHeader(booking);
        div += "<div style='font-weight: bold;    margin-bottom: 30px; text-align: center;    margin-top: 30px;'>Phiếu kết quả khám và đơn thuốc</div>"
        div += "<div class=\"content-filter-yba\"> <p> <span>Họ và tên : </span> <span class=\"ten-nb\">" + profile.name + "</span> <br />"
        div += "<br /> </p> <p class=\"yc-kt\">" + item.ServiceName + "</p>";

        if (booking.profile.IsContract) {

            if (item.Anamnesis) {
                div += "<p> <strong>Tiền sử bệnh</strong> </p>";
                div += "<p>" + item.Anamnesis + "</p>";
            }
            if (item.AnamnesisFamily) {
                div += "<p> <strong>Tiền sử gia đình</strong> </p>";
                div += "<p>" + item.AnamnesisFamily + "</p>";
            }
            if (item.AnamnesisMedicine) {
                div += "<p> <strong>Tiền sử dị ứng thuốc</strong> </p>";
                div += "<p>" + item.AnamnesisMedicine + "</p>";
            }
            if (item.AnamnesisMaternity) {
                div += "<p> <strong>Tiền sử thai sản</strong> </p>";
                div += "<p>" + item.AnamnesisMaternity + "</p>";
            }
            if (item.Height) {
                div += "<p> <strong>Chiều cao</strong> </p>";
                div += "<p>" + item.Height + "</p>";
            }
            if (item.Weight) {
                div += "<p> <strong>Cân nặng</strong> </p>";
                div += "<p>" + item.Weight + "</p>";
            }
            if (item.BMI) {
                div += "<p> <strong>BMI</strong> </p>";
                div += "<p>" + item.BMI + "</p>";
            }
            if (item.BloodPressure) {
                div += "<p> <strong>Huyết áp</strong> </p>";
                div += "<p>" + item.BloodPressure + "</p>";
            }
            if (item.Pulse) {
                div += "<p> <strong>Nhịp tim</strong> </p>";
                div += "<p>" + item.Pulse + "</p>";
            }
            if (item.PhysicalClassify) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.PhysicalClassify + "</p>";
            }
            if (item.RBCCount) {
                div += "<p> <strong>Số lượng Hồng cầu</strong> </p>";
                div += "<p>" + item.RBCCount + "</p>";
            }
            if (item.LeukemiaCount) {
                div += "<p> <strong>Số lượng Bạch cầu</strong> </p>";
                div += "<p>" + item.LeukemiaCount + "</p>";
            }
            if (item.PlateletCount) {
                div += "<p> <strong>Số lượng Tiểu cầu</strong> </p>";
                div += "<p>" + item.PlateletCount + "</p>";
            }
            if (item.BloodSugar) {
                div += "<p> <strong>Đường máu</strong> </p>";
                div += "<p>" + item.BloodSugar + "</p>";
            }
            if (item.Ure) {
                div += "<p> <strong>Ure</strong> </p>";
                div += "<p>" + item.Ure + "</p>";
            }
            if (item.Creatinin) {
                div += "<p> <strong>Creatinin</strong> </p>";
                div += "<p>" + item.Creatinin + "</p>";
            }
            if (item.Protein) {
                div += "<p> <strong>Protein</strong> </p>";
                div += "<p>" + item.Protein + "</p>";
            }
            if (item.UrineTestOther) {
                div += "<p> <strong>Xét nghiệm nước tiểu khác</strong> </p>";
                div += "<p>" + item.UrineTestOther + "</p>";
            }
            if (item.BloodTestOther) {
                div += "<p> <strong>Xét nghiệm máu khác</strong> </p>";
                div += "<p>" + item.BloodTestOther + "</p>";
            }
            if (item.ImageDiagnose) {
                div += "<p> <strong>Chẩn đoán hình ảnh</strong> </p>";
                div += "<p>" + item.ImageDiagnose + "</p>";
            }
            if (item.ImmunitySpecialist) {
                div += "<p> <strong>Dị ứng miễn dịch</strong> </p>";
                div += "<p>" + item.ImmunitySpecialist + "</p>";
            }
            if (item.ImmunityClassifySpecialist) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.ImmunityClassifySpecialist + "</p>";
            }
            if (item.HeartSpecialist) {
                div += "<p> <strong>Chuyên khoa tim mạch</strong> </p>";
                div += "<p>" + item.HeartSpecialist + "</p>";
            }
            if (item.HeartClassifySpecialist) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.HeartClassifySpecialist + "</p>";
            }
            if (item.CheckUpUrinationSpecialist) {
                div += "<p> <strong>Chuyên khoa thận tiết niệu</strong> </p>";
                div += "<p>" + item.CheckUpUrinationSpecialist + "</p>";
            }
            if (item.UrinationClassifySpecialist) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.UrinationClassifySpecialist + "</p>";
            }
            if (item.TumorSpecialist) {
                div += "<p> <strong>Chuyên khoa ung bướu</strong> </p>";
                div += "<p>" + item.TumorSpecialist + "</p>";
            }
            if (item.TumorClassifySpecialist) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.TumorClassifySpecialist + "</p>";
            }
            if (item.CheckUpNerveSpecialist) {
                div += "<p> <strong>Chuyên khoa thần kinh</strong> </p>";
                div += "<p>" + item.CheckUpNerveSpecialist + "</p>";
            }
            if (item.NerveClassifySpecialist) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.NerveClassifySpecialist + "</p>";
            }
            if (item.MentalSpecialist) {
                div += "<p> <strong>Chuyên khoa tâm thần</strong> </p>";
                div += "<p>" + item.MentalSpecialist + "</p>";
            }
            if (item.MentalClassifySpecialist) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.MentalClassifySpecialist + "</p>";
            }
            if (item.Surgical) {
                div += "<p> <strong>Ngoại khoa</strong> </p>";
                div += "<p>" + item.Surgical + "</p>";
            }
            if (item.SurgicalClassify) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.SurgicalClassify + "</p>";
            }
            if (item.CheckUpLEyeWOGlass) {
                div += "<p> <strong>Mắt trái không kính</strong> </p>";
                div += "<p>" + item.CheckUpLEyeWOGlass + "</p>";
            }
            if (item.CheckUpLEyeWGlass) {
                div += "<p> <strong>Mắt trái với kính</strong> </p>";
                div += "<p>" + item.CheckUpLEyeWGlass + "</p>";
            }
            if (item.CheckUpREyeWOGlass) {
                div += "<p> <strong>Mắt phải không kính</strong> </p>";
                div += "<p>" + item.CheckUpREyeWOGlass + "</p>";
            }
            if (item.CheckUpREyeWGlass) {
                div += "<p> <strong>Mắt phải với kính</strong> </p>";
                div += "<p>" + item.CheckUpREyeWGlass + "</p>";
            }
            if (item.EyeDisease) {
                div += "<p> <strong>Bệnh về mắt</strong> </p>";
                div += "<p>" + item.EyeDisease + "</p>";
            }
            if (item.EyeClassify) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.EyeClassify + "</p>";
            }
            if (item.Gynecology) {
                div += "<p> <strong>Sản phụ khoa</strong> </p>";
                div += "<p>" + item.Gynecology + "</p>";
            }
            if (item.GynecologyClassify) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.GynecologyClassify + "</p>";
            }
            if (item.SpeakNormallyL) {
                div += "<p> <strong>Nói thường tai trái</strong> </p>";
                div += "<p>" + item.SpeakNormallyL + "</p>";
            }
            if (item.SpeakNormallyR) {
                div += "<p> <strong>Nói thường tai phải</strong> </p>";
                div += "<p>" + item.SpeakNormallyR + "</p>";
            }
            if (item.WhisperL) {
                div += "<p> <strong>Nói thầm tai trái</strong> </p>";
                div += "<p>" + item.WhisperL + "</p>";
            }
            if (item.WhisperR) {
                div += "<p> <strong>Nói thầm tai phải</strong> </p>";
                div += "<p>" + item.WhisperR + "</p>";
            }
            if (item.ENTClassify) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.ENTClassify + "</p>";
            }
            if (item.Conclusion1) {
                div += "<p> <strong>Kết luận</strong> </p>";
                div += "<p>" + item.Conclusion1 + "</p>";
            }

            if (item.RightEar) {
                div += "<p> <strong>Tai phải</strong> </p>";
                div += "<p>" + item.RightEar + "</p>";
            }
            if (item.LeftEar) {
                div += "<p> <strong>Tai trái</strong> </p>";
                div += "<p>" + item.LeftEar + "</p>";
            }
            if (item.RightNose) {
                div += "<p> <strong>Mũi phải</strong> </p>";
                div += "<p>" + item.RightNose + "</p>";
            }
            if (item.LeftNose) {
                div += "<p> <strong>Mũi trái</strong> </p>";
                div += "<p>" + item.LeftNose + "</p>";
            }
            if (item.Throat) {
                div += "<p> <strong>Họng</strong> </p>";
                div += "<p>" + item.Throat + "</p>";
            }
            if (item.Bulkhead) {
                div += "<p> <strong>Vách ngăn</strong> </p>";
                div += "<p>" + item.Bulkhead + "</p>";
            }

            if (item.Nasopharynx) {
                div += "<p> <strong>Vòm</strong> </p>";
                div += "<p>" + item.Nasopharynx + "</p>";
            }
            if (item.Laryngopharynx) {
                div += "<p> <strong>Hạ họng - Thanh quản</strong> </p>";
                div += "<p>" + item.Laryngopharynx + "</p>";
            }
            if (item.ENTConclusion) {
                div += "<p> <strong>Kết luận</strong> </p>";
                div += "<p>" + item.ENTConclusion + "</p>";
            }
            if (item.EndoscopicClassify) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.EndoscopicClassify + "</p>";
            }
            if (item.LowerJaw) {
                div += "<p> <strong>Hàm dưới</strong> </p>";
                div += "<p>" + item.LowerJaw + "</p>";
            }
            if (item.UpperJaw) {
                div += "<p> <strong>Hàm trên</strong> </p>";
                div += "<p>" + item.UpperJaw + "</p>";
            }
            if (item.DentalDisease) {
                div += "<p> <strong>>Bệnh R-H-M</strong> </p>";
                div += "<p>" + item.DentalDisease + "</p>";
            }
            if (item.DentalClassify) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.DentalClassify + "</p>";
            }
            if (item.CheckUpMusculoskelSpecialist) {
                div += "<p> <strong>Chuyên khoa cơ xương khớp</strong> </p>";
                div += "<p>" + item.CheckUpMusculoskelSpecialist + "</p>";
            }
            if (item.MusculoskelClassifySpecialist) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.MusculoskelClassifySpecialist + "</p>";
            }
            if (item.CheckUpRespirationSpecialist) {
                div += "<p> <strong>Chuyên khoa hô hấp</strong> </p>";
                div += "<p>" + item.CheckUpRespirationSpecialist + "</p>";
            }
            if (item.RespirationClassifySpecialist) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.RespirationClassifySpecialist + "</p>";
            }
            if (item.CheckUpDigestionSpecialist) {
                div += "<p> <strong>Chuyên khoa tiêu hóa</strong> </p>";
                div += "<p>" + item.CheckUpDigestionSpecialist + "</p>";
            }
            if (item.DigestionSpecialistClassify) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.DigestionSpecialistClassify + "</p>";
            }
            if (item.Dermatology) {
                div += "<p> <strong>Chuyên khoa da liễu</strong> </p>";
                div += "<p>" + item.Dermatology + "</p>";
            }
            if (item.DermatologyClassify) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.DermatologyClassify + "</p>";
            }
            if (item.OtherDiseases) {
                div += "<p> <strong>Các bệnh tật nếu có</strong> </p>";
                div += "<p>" + item.OtherDiseases + "</p>";
            }
            if (item.OtherConclusion) {
                div += "<p> <strong>Những điều cần giải quyết</strong> </p>";
                div += "<p>" + item.OtherConclusion + "</p>";
            }
            if (item.HealthClassify) {
                div += "<p> <strong>Phân loại</strong> </p>";
                div += "<p>" + item.HealthClassify + "</p>";
            }
            if (item.CheckUpCirculation) {
                div += "<p> <strong>Tuần hoàn</strong> </p>";
                div += "<p>" + item.CheckUpCirculation;
                if (item.CirculationClassify) {
                    div += "<span> (Phân loại: " + item.CirculationClassify + "</span>";
                }
                div += "</p>";
            }
            if (item.CheckUpDigestion) {
                div += "<p> <strong>Tiêu hóa</strong> </p>";
                div += "<p>" + item.CheckUpDigestion;
                if (item.DigestionClassify) {
                    div += "<span> (Phân loại: " + item.DigestionClassify + "</span>";
                }
                div += "</p>";
            }
            if (item.CheckUpMusculoskel) {
                div += "<p> <strong>Cơ xương khớp</strong> </p>";
                div += "<p>" + item.CheckUpMusculoskel;
                if (item.MusculoskelClassify) {
                    div += "<span> (Phân loại: " + item.MusculoskelClassify + "</span>";
                }
                div += "</p>";
            }
            if (item.CheckUpNerve) {
                div += "<p> <strong>Thần kinh</strong> </p>";
                div += "<p>" + item.CheckUpNerve;
                if (item.NerveClassify) {
                    div += "<span> (Phân loại: " + item.NerveClassify + "</span>";
                }
                div += "</p>";
            }
            if (item.Mental) {
                div += "<p> <strong>Tâm thần</strong> </p>";
                div += "<p>" + item.Mental;
                if (item.MentalClassify) {
                    div += "<span> (Phân loại: " + item.MentalClassify + "</span>";
                }
                div += "</p>";
            }
            if (item.CheckUpRespiration) {
                div += "<p> <strong>Hô hấp</strong> </p>";
                div += "<p>" + item.CheckUpRespiration;
                if (item.RespirationClassify) {
                    div += "<span> (Phân loại: " + item.RespirationClassify + "</span>";
                }
                div += "</p>";
            }
            if (item.CheckUpUrination) {
                div += "<p> <strong>Thận tiết niệu</strong> </p>";
                div += "<p>" + item.CheckUpUrination;
                if (item.UrinationClassify) {
                    div += "<span> (Phân loại: " + item.UrinationClassify + "</span>";
                }
                div += "</p>";
            }
            if (item.ActUser) {
                div += "<p> <strong>Bác sĩ thực hiện</strong> </p>";
                div += "<p>" + item.ActUser + "</p>";
            }
        } else {
            if (item.First_Diagnostic) {
                div += "<p> <strong>Chẩn đoán</strong> </p>";
                div += "<p>" + item.First_Diagnostic + "</p>";
            }
            if (item.DiseaseDiagnostic || item.Diagnostic) {
                div += "<p> <strong>Chẩn đoán bệnh</strong> </p>";
                if (item.DiseaseDiagnostic)
                    div += "<p>" + item.DiseaseDiagnostic + "</p>";
                if (item.Diagnostic)
                    div += "<p>" + item.Diagnostic + "</p>";
            }
            if (item.Other_DiseaseDiagnostic) {
                div += "<p> <strong>Chẩn đoán khác</strong> </p>";
                div += "<p>" + item.Other_DiseaseDiagnostic + "</p>";
            }
            if (item.DoctorAdviceTxt || item.DoctorAdvice) {
                div += "<p> <strong>Lời dặn</strong> </p>";
                if (item.DoctorAdviceTxt)
                    div += "<p>" + item.DoctorAdviceTxt + "</p>";
                if (item.DoctorAdvice)
                    div += "<p>" + item.DoctorAdvice + "</p>";
            }
            if (item.Note) {
                div += "<p> <strong>Ghi chú</strong> </p>";
                div += "<p>" + item.Note + "</p>";
            }
            if ((item.ListMedicine && item.ListMedicine.length > 0) || item.ListExternalMedicine && item.ListExternalMedicine.length > 0) {
                div += "<p> <strong>Đơn thuốc</strong> </p>";
                div += "<style>.donthuoc {background-color: #fff; border: 1px solid #ddd; width: 100%; text-align:'center'} .donthuoc th{    border-bottom: 0;     background-color: #486677;     color: #fff;} .donthuoc td{border-right: 1px solid #ddd; 	    padding: 8px;     line-height: 1.42857143;     vertical-align: top;     border-top: 1px solid #ddd;} </style>"
                div += "<table class='donthuoc'>";
                div += "<thead><tr><th>STT</th><th>Tên thuốc</th><th>Số lượng</th><th>Đơn vị</th></tr></thead>"
                div += "<tbody>"
                for (var i = 0; i < item.ListMedicine.length; i++) {
                    var med = item.ListMedicine[i];
                    div += "<tr>";
                    var medName = "";
                    if (med.ServiceName)
                        medName += med.ServiceName + "<br />";
                    if (med.Measure)
                        medName += med.Measure + "<br />";
                    if (med.Dosage)
                        medName += med.Dosage + "<br />";
                    if (med.Usage)
                        medName += med.Usage
                    div += "<td>" + (i + 1) + "</td>";
                    div += "<td>" + medName + "</td>";
                    div += "<td>" + med.Quantity + "</td>";
                    div += "<td>" + med.Unit + "</td>";
                    div += "</tr>";
                }
                for (var i = 0; i < item.ListExternalMedicine.length; i++) {
                    var med = item.ListExternalMedicine[i];
                    div += "<tr>";
                    var medName = "";
                    if (med.ServiceName)
                        medName += med.ServiceName + "<br />";
                    if (med.Measure)
                        medName += med.Measure + "<br />";
                    if (med.Dosage)
                        medName += med.Dosage + "<br />";
                    if (med.Usage)
                        medName += med.Usage
                    div += "<td>" + (i + 1 + (item.ListMedicine ? item.ListMedicine.length : 0)) + "</td>";
                    div += "<td>" + medName + "</td>";
                    div += "<td>" + med.Quantity + "</td>";
                    div += "<td>" + med.Unit + "</td>";
                    div += "</tr>";
                }
                div += "</tbody>"
                div += "</table>";
            }
        }
        div += " </div>"
        div += " </div>"
        return div;
    }
    renderResultDiagnostic(booking, profile, item) {
        var div = "<div style='margin-left: 50px; margin-right: 50px;'>";
        div += this.renderHeader(booking);
        div += "<div style='font-weight: bold;  margin-bottom: 30px; text-align: center;    margin-top: 30px;'>Phiếu kết quả cận lâm sàng</div>"
        div += "<div class=\"content-filter-yba\"> <p> <span>Họ và tên : </span> <span class=\"ten-nb\">" + profile.name + "</span> <br />"
        div += "<br /> </p> <p class=\"yc-kt\">" + item.ServiceName + "</p>";
        if (item.Result || item.SummaryResult || item.Discussion) {
            div += "<p> <strong>Kết quả</strong> </p>";
            if (item.Result)
                div += "<p>" + item.Result + "</p>";
            if (item.SummaryResult)
                div += "<p>" + item.SummaryResult + "</p>";
            if (item.Discussion)
                div += "<p>" + item.Discussion + "</p>";
        }
        if (item.Conclusion) {
            div += "<p> <strong>Kết luận</strong> </p>";
            div += "<p>" + item.Conclusion + "</p>";
        }
        div += " </div>"
        div += " </div>"
        console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        console.log(div)
        console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        return div;
    }



    async exportPdf(option, finish) {
        if (!option)
            if (finish)
                setTimeout(function () {
                    finish();
                }, 500);
        var html = "";
        var result = option.result;
        let booking = result.booking;
        var profile = booking.Profile;
        var filename = option.fileName;
        if (!filename)
            filename = "Kết_quả";
        filename += new Date().format("ddMMyyyyhhmmss");
        switch (option.type) {
            case "surgery":
                var item = option.data;
                if (item) {
                    html = this.renderResultSurgery(result, profile, item);
                }
                break;
            case "checkup":
                var item = option.data;
                if (item) {
                    html = this.renderResultCheckup(result, profile, item);
                }
                break;
            case "diagnostic":
                var item = option.data;
                if (item) {
                    html = this.renderResultDiagnostic(result, profile, item);
                }
                break;
            case "medicaltest":
                var item = option.data;
                if (item) {
                    html = this.renderResultMedicalTest(result, profile, item);
                }
                break;
            default:
                html = this.renderResult(result)
        }

        console.log(html);


        let options = {
            html: html,
            fileName: filename,
            directory: 'docs',
        };

        await permission.requestStoragePermission((s) => {
            if (s) {
                let file = RNHTMLtoPDF.convert(options).then(filePath => {
                    if (finish)
                        setTimeout(function () {
                            finish();
                        }, 500);
                    try {
                        Share.open({
                            title: constants.share,
                            url: "file://" + filePath.filePath,
                        });
                    } catch (error) {
                        console.log(error);
                    }
                });
            }
        })
    }

    componentDidMount() {

    }
    render() {
        return null;
    }
}
function mapStateToProps(state) {
    return {
        booking: state.booking
    };
}
export default connect(mapStateToProps, null, null, { withRef: true })(ExportPDF);