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
                  !(result.medicalTest && result.medicalTest.length) &&
                  !(result.medical && result.medical.length) &&
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
    let indicator = item.normalRange.split('-');
    let lowerIndicator = indicator[0]?.trim();
    let higherIndicator = indicator[1]?.trim();

    if (
      this.checkHighlight(this.getResult(item), lowerIndicator, higherIndicator)
    ) {
      return this.checkHighlight(
        this.getResult(item),
        lowerIndicator,
        higherIndicator,
      );
    }
    if (item.normalRange) {
      if (!item.resultState) return false;
      else {
        if (item.resultState != 'N') return true;
      }
      return false;
    }
  },
  getResult(item) {
    return item.result ? item.result : item.conclusion;
  },
  getRangeMedicalTest(item2) {
    if (item2.normalRange) return item2.normalRange;
    var range = '';
    if (item2.lowerIndicator && item2.higherIndicator)
      range = item2.lowerIndicator + ' - ' + item2.higherIndicator;
    else {
      range = item2.lowerIndicator;
      if (item2.higherIndicator) range = item2.higherIndicator;
    }
    return range;
  },
};
