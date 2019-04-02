const server_url = 'http://10.0.0.98:8000'; //dev
// const server_url = 'http://api.test.isofhcare.com:8483'; //demo
// const server_url = 'https://api.isofhcare.com'; //release
import axios from 'axios'

const httpClient = axios.create();
httpClient.defaults.timeout = 5000;

String.prototype.absoluteUrl = String.prototype.absolute || function (defaultValue) {
    var _this = this.toString();
    if (_this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return _this;

    if (_this.startsWith("http") || _this.startsWith("blob")) {
        return _this;
    }
    let _this2 = _this.toLowerCase();
    if (_this2.endsWith(".jpg") || _this2.endsWith(".png") || _this2.endsWith(".gif")) {
        return server_url + _this + "";
    }
    if (!_this2.endsWith(".jpg") || !_this2.endsWith(".png") || !_this2.endsWith(".gif")) {
        return defaultValue;
    }
    // if(this.startsWith("user"))
    //     return
    return server_url + _this + ""
}

String.prototype.getServiceUrl = String.prototype.absolute || function (defaultValue) {
    if (this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return this;
    if (this.startsWith("http") || this.startsWith("blob")) {
        return this;
    }
    return server_url + this;
}


module.exports = {
    auth: "",
    serverApi: server_url + "/",
    response: {
        ok(data, message) {
            if (!message)
                message = "";
            return {
                success: true,
                data: data,
                message: message
            }
        },
        noOk(message) {
            if (!message)
                message = "";
            return {
                success: false,
                message: message
            }
        }
    },
    uploadFile(url, uri, funRes) {
        const data = new FormData();
        data.append('file', {
            uri: uri,
            type: 'image/jpeg', // or photo.type
            name: 'test.png'
        });

        this.requestFetch('post', this.serverApi + url,
            {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': this.auth,
                'MobileMode':'user',
                // 'MobileMode': 'vender',
            }, data).then(s => {
                if (funRes) {
                    if (s.data) {
                        funRes(s.data);
                    } else {
                        funRes(undefined, e);
                    }
                }
            }).catch(e => {
                if (funRes)
                    funRes(undefined, e);
            });
    },
    requestApi(methodType, url, body, funRes) {
        var dataBody = "";
        if (!body)
            body = {};
        dataBody = JSON.stringify(body);
        this.requestFetch(methodType, url && url.indexOf('http') == 0 ? url : (this.serverApi + url),
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.auth,
                'MobileMode':'user',
                // 'MobileMode': 'vender'
            }, dataBody).then(s => {
                if (funRes) {
                    if (s.data) {
                        funRes(s.data);
                    } else {
                        funRes(undefined, e);
                    }
                }
            }).catch(e => {
                if (funRes)
                    funRes(undefined, e);
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
                    promise1 = httpClient.post(url.getServiceUrl().toString(), body, { headers });
                    break;
                case "get":
                    promise1 = httpClient.get(url.getServiceUrl().toString(), { headers });
                    break;
                case "put":
                    promise1 = httpClient.put(url.getServiceUrl().toString(), body, { headers });
                    break;
                case "delete":
                    promise1 = httpClient.delete(url.getServiceUrl().toString(), { headers });
                    break;
            }

            promise1.then(json => {
                console.log(json);
                if (json.status != 200) {
                    reject(json);
                }
                else
                    resolve(json);
            }).catch((e) => {
                console.log(e);
                reject(e);
            });
        });
    }
}