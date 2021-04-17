import ehealthProvider from '@data-access/ehealth-provider';
import bookingProvider from '@data-access/booking-provider';
export default {
  getDetail(id) {
    return new Promise((resolve, reject) => {
      ehealthProvider
        .getDetail(id)
        .then(s => {
          console.log('s: ', s);
          let resultDetail = null;
          let result = null;
          if (s.resultDetail) {
            try {
              resultDetail = JSON.parse(s.resultDetail);
            } catch (error) {
              console.log('error: ', error);
            }
          }
          if (s.result) {
            try {
              result = JSON.parse(s.result);
              console.log('result: 111', result);
              if (
                !result ||
                (!(result.prescription && result.prescription.length) &&
                  !(result.diagnosticImage && result.diagnosticImage.length) &&
                  !(
                    result.medicalTest && result.medicalTest.length
                  ) &&
                  !(
                    result.medical && result.medical.length
                  ) &&
                  !(
                    result.ListResulHuyetHoc && result.ListResulHuyetHoc.length
                  ) &&
                  !(
                    result.ListResulHuyetHoc && result.ListResulHuyetHoc.length
                  ) &&
                  !(result.ListResulViSinh && result.ListResulViSinh.length) &&
                  !(
                    result.ListResultCheckup && result.ListResultCheckup.length
                  ))
              ) {
                resolve({
                  data: s,
                  result,
                  resultDetail,
                  hasResult: false,
                });
              } else {
                resolve({
                  data: s,
                  result,
                  resultDetail,
                  hasResult: true,
                });
              }
            } catch (error) {
              resolve({
                data: s,
                result,
                resultDetail,
                hasResult: false,
              });
            }
          } else {
            resolve({
              data: s,
              result,
              resultDetail,
              hasResult: false,
            });
          }
          resolve({result, resultDetail, hasResult: false});
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  checkHighlight(result, min, max) {
    try {
      if (result && result.toLowerCase() == 'dương tính') return true;
      result = parseFloat(result);
      min = parseFloat(min);
      max = parseFloat(max);
      if (result < min || result > max) return true;
      return false;
    } catch (error) {
      return false;
    }
  },
  showHighlight(item) {
    if (
      this.checkHighlight(
        this.getResult(item),
        item.LowerIndicator,
        item.HigherIndicator,
      )
    ) {
      return this.checkHighlight(
        this.getResult(item),
        item.LowerIndicator,
        item.HigherIndicator,
      );
    }
    if (item.NormalRange) {
      if (!item.ResultState) return false;
      else {
        if (item.ResultState != 'N') return true;
      }
      return false;
    }
  },
  getResult(item) {
    return item.Result ? item.Result : item.Conclusion;
  },
  getRangeMedicalTest(item2) {
    if (item2.NormalRange) return item2.NormalRange;
    var range = '';
    if (item2.LowerIndicator && item2.HigherIndicator)
      range = item2.LowerIndicator + ' - ' + item2.HigherIndicator;
    else {
      range = item2.LowerIndicator;
      if (item2.HigherIndicator) range = item2.HigherIndicator;
    }
    return range;
  },
};
