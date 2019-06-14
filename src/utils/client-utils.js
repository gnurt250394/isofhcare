// const server_url = "http://123.24.206.9:8000"; //dev
// const server_url = "http://123.24.206.9:8000"; //test
const server_url = "https://api.produce.isofhcare.com"; //release
// const server_url = "http://34.95.91.81"; //stable
import axios from 'axios';

// const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofh-care-dev/"; //dev
// const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofh-care-dev/"; //test
// const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofh-care-stable/"; //stable
const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofhcare-storage/"; //release


const httpClient = axios.create();
httpClient.defaults.timeout = 50000;

String.prototype.absoluteUrl =
  String.prototype.absolute ||
  function (defaultValue) {
    var _this = this.toString();
    if (_this == "")
      if (defaultValue != undefined) return defaultValue;
      else return _this;

    if (_this.indexOf("http") == 0 || _this.indexOf("blob") == 0) {
      return _this;
    }
    let _this2 = _this.toLowerCase();
    if (
      _this2.endsWith(".jpg") ||
      _this2.endsWith(".png") ||
      _this2.endsWith(".gif")
    ) {
      let image = resource_url + encodeURIComponent(_this + "")+"?alt=media";
      // console.log(image);
      return image;
    }
    if (
      !_this2.endsWith(".jpg") ||
      !_this2.endsWith(".png") ||
      !_this2.endsWith(".gif")
    ) {
      return defaultValue;
    }
    // if(this.startsWith("user"))

    //     return
    return server_url + _this + "";
  };

String.prototype.getServiceUrl =
  String.prototype.absolute ||
  function (defaultValue) {
    let _this = this ? this.toString() : "";
    if (_this == "")
      if (defaultValue != undefined)
        return defaultValue;
      else
        return _this;
    if (_this.indexOf("http") == 0 || _this.indexOf("blob") == 0) {
      return _this;
    }
    return server_url + _this;
  };

module.exports = {
  auth: "",
  serverApi: server_url + "/",
  response: {
    ok(data, message) {
      if (!message) message = "";
      return {
        success: true,
        data: data,
        message: message
      };
    },
    noOk(message) {
      if (!message) message = "";
      return {
        success: false,
        message: message
      };
    }
  },
  uploadFile(url, uri, funRes) {
    const data = new FormData();
    data.append("file", {
      uri: uri,
      type: "image/jpeg", // or photo.type
      name: "test.png"
    });

    this.requestFetch(
      "post",
      this.serverApi + url,
      {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: this.auth,
        MobileMode: "user"
        // 'MobileMode': 'vender',
      },
      data
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
    this.requestApiWithAuthorization(methodType, url, body, this.auth, funRes);
  },
  requestApiWithAuthorization(methodType, url, body, auth, funRes) {
    var dataBody = "";
    if (!body) body = {};
    dataBody = JSON.stringify(body);

    this.requestFetch(
      methodType,
      url && url.indexOf("http") == 0 ? url : this.serverApi + url,
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: auth ? auth : '',
        MobileMode: "user"
        // 'MobileMode': 'vender'
      },
      dataBody
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

  requestApiWithHeader(methodType, url, body, header, funRes) {
    var dataBody = "";
    if (!body) body = {};
    dataBody = JSON.stringify(body);
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: this.auth,
      MobileMode: "user"
      // 'MobileMode': 'vender'
    };
    if (!header) header = {};
    for (var key in header) {
      headers[key] = header[key];
    }
    this.requestFetch(
      methodType,
      url && url.indexOf("http") == 0 ? url : this.serverApi + url,
      headers,
      dataBody
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
      body
    };
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      let promise1 = null;
      switch (methodType) {
        case "post":
          promise1 = httpClient.post(url.getServiceUrl().toString(), body, {
            headers
          });
          break;
        case "get":
          promise1 = httpClient.get(url.getServiceUrl().toString(), {
            headers
          });
          break;
        case "put":
          promise1 = httpClient.put(url.getServiceUrl().toString(), body, {
            headers
          });
          break;
        case "delete":
          promise1 = httpClient.delete(url.getServiceUrl().toString(), {
            headers
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
          console.log(e);
          reject(e);
        });
    });
  }
};
