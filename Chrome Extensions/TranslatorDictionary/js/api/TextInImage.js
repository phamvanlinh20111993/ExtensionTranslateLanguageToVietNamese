import {
    requestUrl,
    postFileUrl
} from './Helper.js';

function getTextInImage(request) {
    const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com/translator-extension/translate";
    //const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555/translator-extension/translate";
    return new Promise(resolve => {
        requestUrl({
            url: API_TRANSLATE_PARAGRAPH_URL,
            params: [{
                value: 'image/auto'
            }],
            requestType: "POST",
            data: request.data,
        }, (result, err) => {
            resolve({
                result,
                err
            })
        });
    })
}

function getTextInImageLanguage(request) {
    const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com/translator-extension/translate";
    // const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555/translator-extension/translate";
    return new Promise(resolve => {
        requestUrl({
            url: API_TRANSLATE_PARAGRAPH_URL,
            params: [{
                value: 'image/language'
            }],
            requestType: "POST",
            data: request.data,
        }, (result, err) => {
            resolve({
                result,
                err
            })
        });
    })
}

function getTextInImageCallback(request, callback) {
    const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com/translator-extension/translate";
    // const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555/translator-extension/translate";

    requestUrl({
        url: API_TRANSLATE_PARAGRAPH_URL,
        params: [{
            value: 'image/auto'
        }],
        requestType: "POST",
        data: request.data,
    }, (result, err) => {
        callback({
            result,
            err
        })
    });

}

function getTextInImageLanguageCallback(request, callback) {
    const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com/translator-extension/translate";
    // const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555/translator-extension/translate";

    requestUrl({
        url: API_TRANSLATE_PARAGRAPH_URL,
        params: [{
            value: 'image/language'
        }],
        requestType: "POST",
        data: request.data,
    }, (result, err) => {
        callback({
            result,
            err
        })
    });

}

function getTextInImageFileCallback(request, callback) {
    const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com/translator-extension/translate/image/file";
    // const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555/translator-extension/translate/image/file";

    postFileUrl({
        url: API_TRANSLATE_PARAGRAPH_URL,
        data: request.data,
    }, (result, err) => {
        callback({
            result,
            err
        })
    });

}

export {
    getTextInImage,
    getTextInImageLanguage,
    getTextInImageCallback,
    getTextInImageLanguageCallback,
    getTextInImageFileCallback
}