//const API_TRANSLATE_URL = "http://localhost:5555/translator-extension/translate";
//const API_TRANSLATOR_URL = "http://localhost:5555/translator-extension/";
//const API_GET_TEXT_IMAGE_FILE_URL = "http://localhost:5555/translator-extension/translate/image/file";

const API_TRANSLATE_URL = "https://translatorapilinhpv.herokuapp.com/translator-extension/translate";
const API_TRANSLATOR_URL = "https://translatorapilinhpv.herokuapp.com/translator-extension";
const API_GET_TEXT_IMAGE_FILE_URL = "https://translatorapilinhpv.herokuapp.com/translator-extension/translate/image/file";

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
        cache: true,
        crossDomain: true,
        //  async: false,
        data: setting.data || {},
        type: setting.requestType,
        timeout: 600000,
        complete: result => {
            console.info('complete data ', result)
        },
        success: result => {
            if (setting.formatResponse) {
                if (setting.formatResponse.type === 'Json') {
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
                } else if (setting.formatResponse.type === 'Object') {
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
                } else if (setting.formatResponse.type === 'Dom') {
                    try {
                        let doc = new DOMParser().parseFromString(result, setting.formatResponse.format);
                        console.log('doc', doc, setting.url)
                        if (setting.formatResponse.elementType) {
                            if (setting.formatResponse.elementType.type == 'id') {
                                doc = doc.getElementById(setting.formatResponse.elementType.value + '');
                            } else if (setting.formatResponse.elementType.type == 'class') {
                                doc = doc.getElementsByClassName(setting.formatResponse.elementType.value + '');
                            } else if (setting.formatResponse.elementType.type == 'tag') {
                                doc = doc.getElementsByTagName(setting.formatResponse.elementType.value + '');
                            } else {
                                doc = doc.querySelectorAll(setting.formatResponse.elementType.value + '');
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
                            error: `Error parse ${typeof result} to Dom: ${setting.formatResponse.format} and ${e}`
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

function postFileUrl(setting, callback) {
    $.ajax({
        url: setting.url,
        cache: true,
        crossDomain: true,
        processData: false,
        contentType: false,
        enctype: 'multipart/form-data',
        //  async: false,
        data: setting.data || {},
        type: 'post',
        complete: result => {
            console.info('complete data ', result)
        },
        success: result => {
            callback(result, null)
        },
        error: error => {
            callback(null, error)
        }
    });
}


export {
    requestUrl,
    postFileUrl,
    API_TRANSLATE_URL,
    API_TRANSLATOR_URL,
    API_GET_TEXT_IMAGE_FILE_URL
};