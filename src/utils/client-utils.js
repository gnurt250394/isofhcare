import snackbar from '@utils/snackbar-utils';
String.prototype.absoluteUrl = String.prototype.absolute || function (defaultValue) {
    var server_url = 'https://api.nmcevent.com';
    if (this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return this;
    if (this.startsWith("http") || this.startsWith("blob")) {
        return this;
    }
    if (this.endsWith(".jpg") || this.endsWith(".png") || this.endsWith(".gif")) {
        return server_url + this + "";
    }
    if (!this.endsWith(".jpg") || !this.endsWith(".png") || !this.endsWith(".gif")) {
        return defaultValue;
    }
    // if(this.startsWith("user"))
    //     return
    return server_url + this + ""
}

String.prototype.getServiceUrl = String.prototype.absolute || function (defaultValue) {
    var server_url = 'https://api.nmcevent.com';
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
    serverApi: "https://api.nmcevent.com/",
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
        console.log("Request url " + url + " with token: " + this.auth);
        var dataBody = "";
        if (!body)
            body = {};
        dataBody = JSON.stringify(body);
        this.requestFetch(methodType, this.serverApi + url,
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
        console.log(body);
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