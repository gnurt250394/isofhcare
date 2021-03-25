export default {
  clone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      return null;
    }
  },
  renderAcademic(academicDegree) {
    console.log('academicDegree:1111 ', academicDegree);
    // switch (academicDegree) {
    //   case 'BS':
    //     return 'BS. ';
    //   case 'ThS':
    //     return 'ThS. ';
    //   case 'TS':
    //     return 'TS. ';
    //   case 'PGS':
    //     return 'PGS. ';
    //   case 'GS':
    //     return 'GS. ';
    //   case 'BSCKI':
    //     return 'BSCKI. ';
    //   case 'BSCKII':
    //     return 'BSCKII. ';
    //   case 'GSTS':
    //     return 'GS.TS. ';
    //   case 'PGSTS':
    //     return 'PGS.TS. ';
    //   case 'ThsBS':
    //     return 'ThS.BS. ';
    //   case 'ThsBSCKII':
    //     return 'ThS.BSCKII. ';
    //   case 'TSBS':
    //     return 'TS.BS. ';
    //   default:
    //     return '';
    // }
    if (academicDegree?.value == 'UNKNOW') {
      return '';
    } else {
      if (academicDegree?.value) {
        return academicDegree.value + ' ';
      } else if (typeof academicDegree == 'string') {
        return academicDegree + ' ';
      }else{
        return ''
      }
    }
  },
  renderTextRelations(type) {
    switch (type) {
      case 'FATHER':
        return 'BỐ';
      case 'MOTHER':
        return 'MẸ';
      case 'GRAND_MOTHER':
        return 'BÀ';
      case 'GRAND_FATHER':
        return 'ÔNG';
      case 'BROTHER':
        return 'ANH';
      case 'YOUNG_BROTHER':
        return 'EM';
      case 'SON':
        return 'CON';
      case 'GRAND_CHILDREN':
        return 'CHÁU';
      case 'SISTER':
        return 'CHỊ';
      case 'OTHER':
        return 'KHÁC';
      default:
        return '';
    }
  },
};
