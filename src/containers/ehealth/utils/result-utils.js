import bookingProvider from '@data-access/booking-provider';
module.exports = {
    getDetail(patientHistoryId, hospitalId, id, shareId) {
        return new Promise((resolve, reject) => {
            bookingProvider.detailPatientHistory(patientHistoryId, hospitalId, id, shareId).then(s => {
                console.log('s: ', s);
                let resultDetail = null;
                let result = null;
                switch (s.code) {
                    case 0:
                        if (s.data && s.data.data) {
                            if (s.data.data.resultDetail) {
                                try {
                                    resultDetail = JSON.parse(s.data.data.resultDetail);
                                } catch (error) {
                                    console.log('error: ', error);

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
                                        resolve({ data: s.data.data, result, resultDetail, hasResult: false });
                                    } else {
                                        resolve({ data: s.data.data, result, resultDetail, hasResult: true });
                                    }
                                } catch (error) {
                                    resolve({ data: s.data.data, result, resultDetail, hasResult: false });
                                }
                            } else {

                                resolve({ data: s.data.data, result, resultDetail, hasResult: false });
                            }
                        }
                        break;
                }
                resolve({ result, resultDetail, hasResult: false });
            }).catch(e => {
                reject(e);
            })
        })
    },
    checkHighlight(result, min, max) {


        try {
            if (result && result.toLowerCase() == "dương tính")
                return true;
            result = parseFloat(result);
            min = parseFloat(min);
            max = parseFloat(max);
            if (result < min || result > max)
                return true;
            return false;
        } catch (error) {
            return false;
        }
    },
    showHighlight(item) {
        if (this.checkHighlight(this.getResult(item), item.LowerIndicator, item.HigherIndicator)) {
            return this.checkHighlight(this.getResult(item), item.LowerIndicator, item.HigherIndicator)
        }
        if (item.NormalRange) {
            if (!item.ResultState)
                return false;
            else {
                if (item.ResultState != "N")
                    return true;
            }
            return false;
        }
    },
    getResult(item) {
        return item.Result ? item.Result : item.Conclusion;
    },
    getRangeMedicalTest(item2) {
        if (item2.NormalRange)
            return item2.NormalRange;
        var range = "";
        if (item2.LowerIndicator && item2.HigherIndicator)
            range = item2.LowerIndicator + " - " + item2.HigherIndicator;
        else {
            range = item2.LowerIndicator;
            if (item2.HigherIndicator)
                range = item2.HigherIndicator;
        }
        return range;
    }
}