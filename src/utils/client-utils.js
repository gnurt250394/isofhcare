const server_url = 'http://api.test.isofhcare.com:8382'; //dev
// const server_url = 'http://api.test.isofhcare.com:8483'; //demo
// const server_url = 'https://api.isofhcare.com'; //release

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
    if (_this.endsWith(".jpg") || _this.endsWith(".png") || _this.endsWith(".gif")) {
        return server_url + _this + "";
    }
    if (!_this.endsWith(".jpg") || !_this.endsWith(".png") || !_this.endsWith(".gif")) {
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
                'Authorization': this.auth
            }, data, (s, e) => {
                if (s) {
                    s.json().then(val => {
                        if (funRes)
                            funRes(val);
                    });
                }
                if (e) {
                    if (funRes)
                        funRes(undefined, e);
                }
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
                'Authorization': this.auth
            }, dataBody, (s, e) => {
                if (s) {
                    s.json().then(val => {
                        console.log(val);
                        if (funRes)
                            funRes(val);
                    });
                }
                if (e) {
                    if (funRes)
                        funRes(undefined, e);
                }
            });
    },
    requestFetch(methodType, url, header, body, funRes) {
        let data = {
            methodType,
            url: url.getServiceUrl(),
            header,
            body
        };
        console.log(data);
        let fetchParam = {
            method: methodType,
            headers: header,
        }

        if (methodType.toLowerCase() !== "get") {
            fetchParam.body = body;

        }
        return fetch(url, fetchParam).then((json) => {
            if (!json.ok) {
                if (funRes)
                    funRes(undefined, json);
            }
            else
                if (funRes)
                    funRes(json);
        }).catch((e) => {
            console.log(e);
            if (funRes)
                funRes(undefined, e);
        });
    }
}