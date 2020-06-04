function requestUrl(setting, callback) {

    if (setting.params) {
        setting.url += "/"
        for (const e of setting.params) {
            if (e.type === 'Number') {
                setting.url += parseInt(e.value)
            } else {
                setting.url += e.value + ''
            }
            setting.url += "/"
        }
        setting.url = setting.url.substr(0, setting.url.length - 1);
    }

    if (setting.query) {
        setting.url += "?"
        Object.keys(setting.query).map(key => {
            setting.url += `${key}=${setting.query[key]}&`
        });
        setting.url = setting.url.substr(0, setting.url.length - 1);
    }

    if (setting.anotherFormat) {
        setting.url += setting.anotherFormat
    }

    let headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': 60,
        'Access-Control-Allow-Credentials': true
    }
    if (setting.headers) {
        Object.keys(setting.headers).map(key => {
            headers[key + ''] = setting.headers[key]
        });
    }

    //call ajax connect get data from server
    $.ajax({
        url: setting.url,
        headers: xhr => {
            Object.keys(headers).map(key => {
                xhr.setRequestHeader(key, headers[key]);
            })
        },
        data: setting.data || {},
        type: setting.requestType,
        success: result => {

            if (setting.formatReponse) {
                if (setting.formatReponse.type === 'Json') {
                    if (typeof result === 'Object') {
                        try {
                            callback(JSON.parse(result), null)
                        } catch (e) {
                            callback(result, {
                                readyState: 0,
                                status: 0,
                                statusText: '',
                                error: `Error ${e} when parse to Json `
                            })
                        }
                    } else {
                        callback(result, {
                            readyState: 0,
                            status: 0,
                            statusText: '',
                            error: `Error parse ${typeof result} to Json`
                        })
                    }
                } else if (setting.formatReponse.type === 'Object') {
                    if (typeof result !== 'Object') {
                        try {
                            callback(JSON.parse(result), null)
                        } catch (e) {
                            callback(result, {
                                readyState: 0,
                                status: 0,
                                statusText: '',
                                error: `Error parse ${typeof result} to Object and ${e}`
                            })
                        }
                    } else {
                        callback(result, {
                            readyState: 0,
                            status: 0,
                            statusText: '',
                            error: `Error ${e} when parse to Object`
                        })
                    }
                } else if (setting.formatReponse.type === 'Dom') {
                    try {
                        let doc = new DOMParser().parseFromString(result, setting.formatReponse.format);
                        console.log('doc', doc, setting.url)
                        if (setting.formatReponse.elementType) {
                            if (setting.formatReponse.elementType.type == 'id') {
                                doc = doc.getElementById(setting.formatReponse.elementType.value + '');
                            } else if (setting.formatReponse.elementType.type == 'class') {
                                doc = doc.getElementsByClassName(setting.formatReponse.elementType.value + '');
                            } else if (setting.formatReponse.elementType.type == 'tag') {
                                doc = doc.getElementsByTagName(setting.formatReponse.elementType.value + '');
                            } else {
                                doc = doc.querySelectorAll(setting.formatReponse.elementType.value + '');
                            }
                            callback(doc, null)
                        } else {
                            callback(result, null)
                        }
                    } catch (e) {
                        callback(result, {
                            readyState: 0,
                            status: 0,
                            statusText: '',
                            error: `Error parse ${typeof result} to Dom: ${setting.formatReponse.format} and ${e}`
                        })
                    }
                }
            } else {
                callback(result, null)
            }
        },
        error: e => {
            callback(null, {
                readyState: e.readyState,
                status: e.status,
                statusText: e.statusText,
                error: ''
            })
        }
    });
}

export {
    requestUrl
};