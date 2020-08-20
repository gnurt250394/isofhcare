import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import constants from '@resources/strings';
const server_url = 'http://123.24.206.9:9451'; //dev

// const server_url = "http://10.0.50.191:8080";//test local
// const server_url = "http://123.24.206.9:8000"; //test
// const server_url = "https://api.produce.isofhcare.com"; //release
// const server_url = "http://34.95.91.81"; //stable

// const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofh-care-dev/o/"; //dev
const resource_url = 'http://10.0.50.86:8288/v1/'; //test
// const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofh-care-stable/o/"; //stable
// const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofhcare-storage/o/"; //release

const httpClient = axios.create();
httpClient.defaults.timeout = 50000;
let deviceOS = DeviceInfo.getSystemVersion();
let appVersion = DeviceInfo.getReadableVersion();

String.prototype.absoluteUrl =
  String.prototype.absolute ||
  function(defaultValue) {
    var _this = this.toString();
    if (_this == '')
      if (defaultValue != undefined) return defaultValue;
      else return _this;

    if (_this.indexOf('http') == 0 || _this.indexOf('blob') == 0) {
      return _this;
    }
    let _this2 = _this.toLowerCase();
    if (
      _this2.endsWith('.jpg') ||
      _this2.endsWith('.png') ||
      _this2.endsWith('.gif') ||
      _this2.endsWith('.jpeg')
    ) {
      let image = resource_url + encodeURIComponent(_this + '') + '?alt=media';
      // console.log(image);
      return image;
    }
    if (
      !_this2.endsWith('.jpg') ||
      !_this2.endsWith('.png') ||
      _this2.endsWith('.gif') ||
      _this2.endsWith('.jpeg')
    ) {
      return defaultValue;
    }
    // if(this.startsWith("user"))

    //     return
    return 'http://123.24.206.9:38288/v1/' + _this + '';
  };

String.prototype.getServiceUrl =
  String.prototype.absolute ||
  function(defaultValue) {
    let _this = this ? this.toString() : '';
    if (_this == '')
      if (defaultValue != undefined) return defaultValue;
      else return _this;
    if (_this.indexOf('http') == 0 || _this.indexOf('blob') == 0) {
      return _this;
    }
    return server_url + _this;
  };

module.exports = {
  auth: '',
  serverApi: server_url + '/',
  serviceSchedule: 'http://123.24.206.9:8080/',
  serviceBooking: 'http://123.24.206.9:8082/',
  serviceImage: 'https://api.produce.isofhcare.com/isofhcare/',
  serviceChats: 'http://10.0.0.98:8085/',
  serviceCovid: 'http://10.0.0.88:49396/',

  response: {
    ok(data, message) {
      if (!message) message = '';
      return {
        success: true,
        data: data,
        message: message,
      };
    },
    noOk(message) {
      if (!message) message = '';
      return {
        success: false,
        message: message,
      };
    },
  },
  uploadFile(url, uri, type, funRes) {
    console.log('uri: ', uri);
    const data = new FormData();
    data.append('file', {
      uri: uri,
      type: type ? type : 'image/jpeg', // or photo.type
      name: uri
        ? uri.replace(/^.*[\\\/]/, '') + '.' + constants.MIME[type] || 'png'
        : 'test.png',
    });

    this.requestFetch(
      'post',
      this.serviceImage + url,
      {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: this.auth ? this.auth : '',
        MobileMode: 'user',
        deviceType: 'mobile',
        deviceOs: Platform.OS + ' ' + deviceOS,
        appVersion: appVersion,
        // 'MobileMode': 'vender',
      },
      data,
    )
      .then(s => {
        if (funRes) {
          if (s.data) {
            funRes(s.data);
          } else {
            funRes(undefined, e);
          }
        }
      })
      .catch(e => {
        if (funRes) funRes(undefined, e);
      });
  },
  requestApi(methodType, url, body, funRes) {
    this.requestApiWithAuthorization(
      methodType,
      url,
      body,
      this.auth ? this.auth : '',
      funRes,
    );
  },
  requestApiWithHeaderBear(methodType, url, body, funRes) {
    this.requestApiWithAuthorizationBear(
      methodType,
      url,
      body,
      this.auth ? this.auth : '',
      funRes,
    );
  },
  requestApiWithAuthorizationBear(methodType, url, body, auth, funRes) {
    var dataBody = '';
    if (!body) body = {};
    dataBody = JSON.stringify(body);

    this.requestFetch(
      methodType,
      url && url.indexOf('http') == 0 ? url : this.serverApi + url,
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `bearer ${auth}`,
        // 'MobileMode': 'vender'
      },
      dataBody,
    )
      .then(s => {
        if (funRes) {
          if (s.data) {
            funRes(s.data);
          } else {
            funRes(undefined, e);
          }
        }
      })
      .catch(e => {
        if (funRes) funRes(undefined, e);
      });
  },
  requestApiWithAuthorization(methodType, url, body, auth, funRes) {
    var dataBody = '';
    if (!body) body = {};
    dataBody = JSON.stringify(body);

    this.requestFetch(
      methodType,
      url && url.indexOf('http') == 0 ? url : this.serverApi + url,
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + auth ? auth : '',
        MobileMode: 'user',
        deviceType: 'mobile',
        deviceOs: Platform.OS + ' ' + deviceOS,
        appVersion: appVersion,

        // 'MobileMode': 'vender'
      },
      dataBody,
    )
      .then(s => {
        if (funRes) {
          if (s.data) {
            funRes(s.data);
          } else {
            funRes(undefined, e);
          }
        }
      })
      .catch(e => {
        if (e.status >= 200 && e.status < 300)
          funRes(e.data ? e.data : true, undefined);
        else funRes(undefined, e);
      });
  },

  requestApiWithHeader(methodType, url, body, header, funRes) {
    var dataBody = '';
    if (!body) body = {};
    dataBody = JSON.stringify(body);
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: this.auth ? this.auth : '',
      MobileMode: 'user',
      deviceType: 'mobile',
      deviceOs: Platform.OS + ' ' + deviceOS,
      appVersion: appVersion,
      // 'MobileMode': 'vender'
    };
    if (!header) header = {};
    for (var key in header) {
      headers[key] = header[key];
    }
    this.requestFetch(
      methodType,
      url && url.indexOf('http') == 0 ? url : this.serverApi + url,
      headers,
      dataBody,
    )
      .then(s => {
        if (funRes) {
          if (s.data) {
            funRes(s.data);
          } else {
            funRes(undefined, e);
          }
        }
      })
      .catch(e => {
        if (funRes) funRes(undefined, e);
      });
  },
  requestFetch(methodType, url, headers, body) {
    let data = {
      methodType,
      url: url.getServiceUrl(),
      headers,
      body,
    };
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      let promise1 = null;
      switch (methodType) {
        case 'post':
          promise1 = httpClient.post(url.getServiceUrl().toString(), body, {
            headers,
          });
          break;
        case 'get':
          promise1 = httpClient.get(url.getServiceUrl().toString(), {
            headers,
          });
          break;
        case 'put':
          promise1 = httpClient.put(url.getServiceUrl().toString(), body, {
            headers,
          });
          break;
        case 'delete':
          promise1 = httpClient.delete(url.getServiceUrl().toString(), {
            headers,
          });
          break;
      }

      promise1
        .then(json => {
          console.log(json);
          if (json.status != 200) {
            reject(json);
          } else resolve(json);
        })
        .catch(e => {
          if (e.response) {
            console.log('e.response: ', e.response);
          } else if (e.request) {
            console.log('e.request: ', e.request);
          } else {
            console.log(e, 'err');
          }
          reject(e);
        });
    });
  },
};
