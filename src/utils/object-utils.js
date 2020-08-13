export default {
  clone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      return null;
    }
  },
  renderAcademic(academicDegree) {
    switch (academicDegree) {
      case 'BS':
        return 'BS. ';
      case 'ThS':
        return 'ThS. ';
      case 'TS':
        return 'TS. ';
      case 'PGS':
        return 'PGS. ';
      case 'GS':
        return 'GS. ';
      case 'BSCKI':
        return 'BSCKI. ';
      case 'BSCKII':
        return 'BSCKII. ';
      case 'GSTS':
        return 'GS.TS. ';
      case 'PGSTS':
        return 'PGS.TS. ';
      case 'ThsBS':
        return 'ThS.BS. ';
      case 'ThsBSCKII':
        return 'ThS.BSCKII. ';
      case 'TSBS':
        return 'TS.BS. ';
      default:
        return '';
    }
  },

};
String.prototype.format = function(format) {

    var self = this;
    var half = false;

    if (format && format[0] === '!') {
        half = true;
        format = format.substring(1);
    }

    if (format === undefined || format === null || format === '')
        return self.getFullYear() + '-' + (self.getMonth() + 1).toString().padLeft(2, '0') + '-' + self.getDate().toString().padLeft(2, '0') + 'T' + self.getHours().toString().padLeft(2, '0') + ':' + self.getMinutes().toString().padLeft(2, '0') + ':' + self.getSeconds().toString().padLeft(2, '0') + '.' + self.getMilliseconds().toString().padLeft(3, '0') + 'Z';

    var h = self.getHours();

    if (half) {
        if (h >= 12)
            h -= 12;
    }

    return format.replace(regexpDATEFORMAT, function(key) {
        switch (key) {
            case 'yyyy':
                return self.getFullYear();
            case 'yy':
                return self.getYear();
            case 'MM':
                return (self.getMonth() + 1).toString().padLeft(2, '0');
            case 'M':
                return (self.getMonth() + 1);
            case 'dd':
                return self.getDate().toString().padLeft(2, '0');
            case 'd':
                return self.getDate();
            case 'HH':
            case 'hh':
                return h.toString().padLeft(2, '0');
            case 'H':
            case 'h':
                return self.getHours();
            case 'mm':
                return self.getMinutes().toString().padLeft(2, '0');
            case 'm':
                return self.getMinutes();
            case 'ss':
                return self.getSeconds().toString().padLeft(2, '0');
            case 's':
                return self.getSeconds();
            case 'w':
            case 'ww':
                var tmp = new Date(+self);
                tmp.setHours(0, 0, 0);
                tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
                tmp = Math.ceil((((tmp - new Date(tmp.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
                if (key === 'ww')
                    return tmp.toString().padLeft(2, '0');
                return tmp;
            case 'a':
                var a = 'AM';
                if (self.getHours() >= 12)
                    a = 'PM';
                return a;
        }
    });
};