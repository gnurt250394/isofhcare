import React, { Component } from 'react';
import constants from '@resources/strings';
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import Share from 'react-native-share';
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import permission from 'mainam-react-native-permission';
import resultUtils from '@ehealth/utils/result-utils';
import RNPrint from 'react-native-print';
class ExportPDF extends Component {
    renderResult(result, hospital) {
        if (result?.Profile?.IsContract) {

        }

        var resultSurgery = result.ListResulGiaiPhau;
        var resultCheckup = result.ListResultCheckup;
        var resultDiagnostic = result.ListDiagnostic;

        var resultMedicalTest;
        if ((result.ListResulViSinh && result.ListResulViSinh.length > 0)
            || (result.ListResulHoaSinh && result.ListResulHoaSinh.length > 0)
            || (result.ListResulHuyetHoc && result.ListResulHuyetHoc.length > 0)
            || (result.ListResulOther && result.ListResulOther.length > 0)
        )
            resultMedicalTest = {
                resultViSinh: result.ListResulViSinh,
                resultHoaSinh: result.ListResulHoaSinh,
                resultHuyetHoc: result.ListResulHuyetHoc,
                resultKhac: result.ListResulOther
            }
        var profile = result.Profile;
        var div = "";
        if (resultCheckup && resultCheckup.length > 0) {
            for (var i = 0; i < resultCheckup.length; i++) {
                var item = resultCheckup[i];
                div += this.renderResultCheckup(result, profile, item, hospital);
                div += "<style>.pagebreak { page-break-before: always; }</style><div class='pagebreak'></div>";
            }
        }
        if (resultMedicalTest) {
            if (div)
                div += "<style>.pagebreak { page-break-before: always; }</style><div class='pagebreak'></div>";
            div += this.renderResultMedicalTest(result, profile, resultMedicalTest, hospital);
        }
        if (resultDiagnostic && resultDiagnostic.length > 0) {
            for (var i = 0; i < resultDiagnostic.length; i++) {
                var item = resultDiagnostic[i];
                div += this.renderResultDiagnostic(result, profile, item, hospital);
                div += "<style>.pagebreak { page-break-before: always; }</style><div class='pagebreak'></div>";
            }
        }
        if (resultSurgery && resultSurgery.length > 0) {
            for (var i = 0; i < resultSurgery.length; i++) {
                var item = resultSurgery[i];
                div += this.renderResultSurgery(result, profile, item, hospital);
                div += "<style>.pagebreak { page-break-before: always; }</style><div class='pagebreak'></div>";
            }
        }
        return div;
    }

    renderHeader(booking, hospital) {
        
        var date = hospital.timeGoIn.toDateObject().format("dd/MM/yyyy");
        var div = "<div style='height:50px'> </div>";
        div += "<div style='width: 100%;'><strong >" + hospital.name + "</strong><strong style='float: right'>Ngày " + date + "</strong></div>";
        return div;
    }
    renderResultSurgery(booking, profile, item, hospital) {
        var unCheck = "<img style='width: 16px; margin-right:10px' src='data:image/png;base64,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SwIKICibAgggGdKSgAIIyqYAAkiGtCSgAIKyKYAAkiEtCSiAoGwKIIBkSEsCCiAomwIIIBnSkoACCMqmAAJIhrQkoACCsimAAJIhLQkogKBsCiCAZEhLAgogKJsCCCAZ0pKAAgjKpgACSIa0JKAAgrIpgACSIS0JKICgbAoggGRISwIKICibAgggGdKSgAIIyqYAAkiGtCSgAIKyKYAAkiEtCSiAoGwKIIBkSEsCCiAomwIIIBnSkoACCMqmAAJIhrQkoACCsimAAJIhLQkogKBsCiCAZEhLAgogKJsCCCAZ0pKAAgjKpgACSIa0JKAAgrIpgACSIS0JKICgbAoggGRISwIKICibAgggGdKSgAIIyqYAAkiGtCSgAIKyKYAAkiEtCSiAoGwKIIBkSEsCCiAomwIIIBnSkoACCMqmAAJIhrQkoACCsimAAJIhLQkogKBsCiCAZEhLAgogKJsCCCAZ0pKAAgjKpgACSIa0JKAAgrIpgACSIS0JKICgbAoggGRISwIKICibAgggGdKSgAIIyqYAAkiGtCSgAIKyKYAAkiEtCSiAoGwKIIBkSEsCCiAomwIIIBnSkoACCMqmAAJIhrQkoACCsimAAJIhLQkogKBsCiCAZEhLAgogKJsCCCAZ0pKAAgjKpgACSIa0JKAAgrIpgACSIS0JKICgbAoggGRISwIKICibAgggGdKSgAIIyqYAAkiGtCSgAIKyKYAAkiEtCSiAoGwKIIBkSEsCCiAomwIIIBnSkoACCMqmAAJIhrQkoACCsimAAJIhLQkogKBsCiCAZEhLAgogKJsCCCAZ0pKAAgjKpgACSIa0JKAAgrIpgACSIS0JKICgbAoggGRISwIKICibAgggGdKSgAIIyqYAAkiGtCSgAIKyKYAAkiEtCSiAoGwKIIBkSEsCCiAomwIIIBnSkoACCMqmAAJIhrQkoACCsimAAJIhLQkogKBsCiCAZEhLAgogKJsCCCAZ0pKAAgjKpgACSIa0JKAAgrIpgACSIS0JKICgbAoggGRISwIKICibAgggGdKSgAIIyqYAAkiGtCSgAIKyKYAAkiEtCSiAoGwKIIBkSEsCCiAomwIIIBnSkoACCMqmAAJIhrQkoACCsimAAJIhLQkogKBsCiCAZEhLAgogKJsCCCAZ0pKAAgjKpgACSIa0JKAAgrIpgACSIS0JKICgbAog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' alt=''>"
        var checked = "<img style='width: 16px; margin-right:10px' src='data:image/png;base64,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' alt=''>"
        var div = "<div style='margin-left: 50px; margin-right: 50px;'>";
        div += this.renderHeader(booking, hospital);
        div += "<div style='font-weight: bold;    margin-bottom: 30px; text-align: center;    margin-top: 30px;'>Phiếu kết quả giải phẫu</div>"
        div += "<div class=\"content-filter-yba\"> <p> <span>Họ và tên : </span> <span class=\"ten-nb\">" + (profile?.PatientName||'') + "</span> <br />"
        div += "<br /> </p> <p class=\"yc-kt\">Tên dịch vụ:" + item.ServiceName + "</p>";
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
                        div += "<p>" + checked + "<strong>" + item.ServiceMedicTestLine[i].NameLine + "</strong> </p>";
                    } else {
                        div += "<p>" + unCheck + "<strong>" + item.ServiceMedicTestLine[i].NameLine + "</strong> </p>";
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

    renderResultMedicalTest(booking, profile, resultMedical, hospital) {
        var result = [];
        if (resultMedical.resultKhac) {
            var item = {
                type: 'Xét Nghiệm Khác',
                value: {
                    ListMedical: [],
                    GroupId: ""
                }
            }
            result.push(item);
            resultMedical.resultKhac.forEach(function (entry) {
                item.value.ListMedical.push.apply(item.value.ListMedical, entry.ListMedical);
            });
        }
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
                div += this.renderMedItem(booking, profile, item, hospital);
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
    renderMedicalTestLine(type, item) {
        var result2 = "";
        result2 += this.renderTr(this.renderTd(item.ServiceName, "serviceName", type == "Vi Sinh" ? 2 : 4));
        item.ServiceMedicTestLine.map((item2, i) => {
            var range = resultUtils.getRangeMedicalTest(item2);
            var isHighlight = resultUtils.showHighlight(item2);
            result2 += this.renderTr((type == 'Vi Sinh' ?
                this.renderTd(item2.NameLine.trim()) +
                this.renderTd(resultUtils.getResult(item2), isHighlight ? "bold" : "")
                :
                this.renderTd(item2.NameLine.trim()) +
                this.renderTd(resultUtils.getResult(item2), isHighlight ? "bold" : "") +
                this.renderTd(range) +
                this.renderTd(item2.Unit)));
        });
        return result2;
    }
    renderItemTest(type, item) {
        var result = "";
        if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0 && item.ServiceMedicTestLine[0].NameLine != 0) {
            return (this.renderMedicalTestLine(type, item));
        }

        if (item.ServiceMedicTestLine && item.ServiceMedicTestLine.length > 0) {
            var range = resultUtils.getRangeMedicalTest(item.ServiceMedicTestLine[0]);
            var isHighlight = resultUtils.showHighlight(item.ServiceMedicTestLine[0]);

            type == 'Vi Sinh' ?
                result += this.renderTd(item.ServiceName, "serviceName") +
                this.renderTd(resultUtils.getResult(item.ServiceMedicTestLine[0]), isHighlight ? "bold" : "")
                :
                result += this.renderTd(item.ServiceName, "serviceName") +
                this.renderTd(resultUtils.getResult(item.ServiceMedicTestLine[0]), isHighlight ? "bold" : "") +
                this.renderTd(range) +
                this.renderTd(item.ServiceMedicTestLine[0].Unit);
        } else {
            var range = resultUtils.getRangeMedicalTest(item);
            var isHighlight = resultUtils.showHighlight(item);

            type == 'Vi Sinh' ?
                result += this.renderTd(item.ServiceName, "serviceName") +
                this.renderTd(resultUtils.getResult(item), isHighlight ? "bold" : "")
                :
                result += this.renderTd(item.ServiceName, "serviceName") +
                this.renderTd(resultUtils.getResult(item), isHighlight ? "bold" : "") +
                this.renderTd(range) +
                this.renderTd(item.Unit);
        }
        return this.renderTr(result);
    }
    renderMedItem(booking, profile, result, hospital) {
        
        var div = "<div style='margin-left: 50px; margin-right: 50px;'>";
        div += this.renderHeader(booking, hospital);
        div += "<div style='font-weight: bold;  margin-bottom: 30px; text-align: center;    margin-top: 30px;'>Phiếu kết quả " + (result.type == "Xét Nghiệm Khác" ? "xét nghiệm khác" : result.type) + "</div>"
        div += "<div class=\"content-filter-yba\"> <p> <span>Họ và tên : </span> <span class=\"ten-nb\">" + (profile?.PatientName ||'')+ "</span> <br />"
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
    renderMedicine(item) {
        let div = "";
        if ((item.ListMedicine && item.ListMedicine.length > 0) || item.ListExternalMedicine && item.ListExternalMedicine.length > 0) {
            div += "<p> <strong>Đơn thuốc</strong> </p>";
            div += "<style>.donthuoc {background-color: #fff; border: 1px solid #ddd; width: 100%; text-align:'center'} .donthuoc th{    border-bottom: 0;     background-color: #486677;     color: #fff;} .donthuoc td{border-right: 1px solid #ddd; 	    padding: 8px;     line-height: 1.42857143;     vertical-align: top;     border-top: 1px solid #ddd;} </style>"
            div += "<table class='donthuoc'>";
            div += "<thead><tr><th>STT</th><th>Tên thuốc</th><th>Số lượng</th><th>Đơn vị</th></tr></thead>"
            div += "<tbody>"
            if (item.ListMedicine)
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
            if (item.ListExternalMedicine)
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
        return div;
    }
    renderResultCheckup(booking, profile, item, hospital) {
        
        var div = "<div style='margin-left: 50px; margin-right: 50px;'>";
        div += this.renderHeader(booking, hospital);
        div += "<div style='font-weight: bold;    margin-bottom: 30px; text-align: center;    margin-top: 30px;'>Phiếu kết quả khám và đơn thuốc</div>"
        div += "<div class=\"content-filter-yba\"> <p> <span>Họ và tên : </span> <span class=\"ten-nb\">" + (profile?.PatientName||'') + "</span> <br />"
        div += "<br /> </p> <p class=\"yc-kt\">" + (item.ServiceName == "Đơn thuốc" ? "" : item.ServiceName) + "</p>";

        if (booking?.Profile?.IsContract) {

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
                    div += "<span> (Phân loại: " + item.CirculationClassify + ")</span>";
                }
                div += "</p>";
            }
            if (item.CheckUpDigestion) {
                div += "<p> <strong>Tiêu hóa</strong> </p>";
                div += "<p>" + item.CheckUpDigestion;
                if (item.DigestionClassify) {
                    div += "<span> (Phân loại: " + item.DigestionClassify + ")</span>";
                }
                div += "</p>";
            }
            if (item.CheckUpMusculoskel) {
                div += "<p> <strong>Cơ xương khớp</strong> </p>";
                div += "<p>" + item.CheckUpMusculoskel;
                if (item.MusculoskelClassify) {
                    div += "<span> (Phân loại: " + item.MusculoskelClassify + ")</span>";
                }
                div += "</p>";
            }
            if (item.CheckUpNerve) {
                div += "<p> <strong>Thần kinh</strong> </p>";
                div += "<p>" + item.CheckUpNerve;
                if (item.NerveClassify) {
                    div += "<span> (Phân loại: " + item.NerveClassify + ")</span>";
                }
                div += "</p>";
            }
            if (item.Mental) {
                div += "<p> <strong>Tâm thần</strong> </p>";
                div += "<p>" + item.Mental;
                if (item.MentalClassify) {
                    div += "<span> (Phân loại: " + item.MentalClassify + ")</span>";
                }
                div += "</p>";
            }
            if (item.CheckUpRespiration) {
                div += "<p> <strong>Hô hấp</strong> </p>";
                div += "<p>" + item.CheckUpRespiration;
                if (item.RespirationClassify) {
                    div += "<span> (Phân loại: " + item.RespirationClassify + ")</span>";
                }
                div += "</p>";
            }
            if (item.CheckUpUrination) {
                div += "<p> <strong>Thận tiết niệu</strong> </p>";
                div += "<p>" + item.CheckUpUrination;
                if (item.UrinationClassify) {
                    div += "<span> (Phân loại: " + item.UrinationClassify + ")</span>";
                }
                div += "</p>";
            }
            if (item.Content) {
                div += "<p> <strong>Nội tiết</strong> </p>";
                div += "<p>" + item.Content;
                if (item.ContentClassify) {
                    div += "<span> (Phân loại: " + item.ContentClassify + ")</span>";
                }
                div += "</p>";
            }
            if (item.ActUser) {
                div += "<p> <strong>Bác sĩ thực hiện</strong> </p>";
                div += "<p>" + item.ActUser + "</p>";
            }
            div += this.renderMedicine(item);
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
            div += this.renderMedicine(item);
        }
        div += " </div>"
        div += " </div>"
        return div;
    }
    renderResultDiagnostic(booking, profile, item, hospital) {
        var div = "<div style='margin-left: 50px; margin-right: 50px;'>";
        div += this.renderHeader(booking, hospital);
        div += "<div style='font-weight: bold;  margin-bottom: 30px; text-align: center;    margin-top: 30px;'>Phiếu kết quả cận lâm sàng</div>"
        div += "<div class=\"content-filter-yba\"> <p> <span>Họ và tên : </span> <span class=\"ten-nb\">" +( profile?.PatientName||'' )+ "</span> <br />"
        div += "<br /> </p> <p class=\"yc-kt\">Tên dịch vụ: " + item.ServiceName + "</p>";
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
        var profile = result.Profile;
        var filename = option.fileName;
        var hospital = result.hospital || {}
        if (!filename)
            filename = "ket_qua";
        filename += new Date().format("ddMMyyyyhhmmss");
        switch (option.type) {
            case "surgery":
                var item = option.data;
                if (item) {
                    html = this.renderResultSurgery(result, profile, item, hospital);
                }
                break;
            case "checkup":
                var item = option.data;
                if (item) {
                    html = this.renderResultCheckup(result, profile, item, hospital);
                }
                break;
            case "diagnostic":
                var item = option.data;
                if (item) {
                    html = this.renderResultDiagnostic(result, profile, item, hospital);
                }
                break;
            case "medicaltest":

                var resultMedicalTest;
                if ((result.data.ListResulViSinh && result.data.ListResulViSinh.length > 0)
                    || (result.data.ListResulHoaSinh && result.data.ListResulHoaSinh.length > 0)
                    || (result.data.ListResulHuyetHoc && result.data.ListResulHuyetHoc.length > 0)
                    || (result.data.ListResulOther && result.data.ListResulOther.length > 0)
                )
                    resultMedicalTest = {
                        resultViSinh: result.data.ListResulViSinh,
                        resultHoaSinh: result.data.ListResulHoaSinh,
                        resultHuyetHoc: result.data.ListResulHuyetHoc,
                        resultKhac: result.data.ListResulOther
                    }
                html = this.renderResultMedicalTest(result, profile, resultMedicalTest, hospital);
                break;
            default:
                html = this.renderResult(result, hospital)
        }

        


        let options = {
            html: html,
            fileName: filename,
            directory: 'docs',
            print: option.print,
            // base64: true,
        };

        await permission.requestStoragePermission((s) => {
            if (s) {
                let file = RNHTMLtoPDF.convert(options).then(async filePath => {
                    if (finish)
                        setTimeout(function () {
                            finish();
                        }, 500);
                    try {
                        // Share.shareSingle({
                        //     title: constants.share,
                        //     url: "file://" + filePath.filePath,
                        //     social: Share.Social.EMAIL
                        // });

                        // alert("file://" + filePath.filePath);
                        if (options.print) {
                            // await RNPrint.print({ filePath: 'https://graduateland.com/api/v2/users/jesper/cv' })
                            // debugger;
                            try {
                                await RNPrint.print({ filePath: filePath.filePath })
                            } catch (error) {
                                await RNPrint.print({ filePath: "file://" + filePath.filePath })
                            }
                        } else {
                            Share.open({
                                title: constants.share,
                                url: "file://" + filePath.filePath,
                            });
                        }
                    } catch (error) {
                        
                    }
                });
            } else {
                this.props.endLoading()
            }
        }).catch(err => {
            this.props.endLoading()

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
export default connect(mapStateToProps, null, null, { forwardRef: true })(ExportPDF);