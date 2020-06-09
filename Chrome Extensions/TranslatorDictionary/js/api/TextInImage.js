import {
    requestUrl
} from './Helper.js';

function getTextInImage(request) {
    //  const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com";
    const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555";
    return new Promise(resolve => {
        requestUrl({
            url: API_TRANSLATE_PARAGRAPH_URL,
            params: [{
                value: 'imageText/auto'
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
    // const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com";
    const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555";
    return new Promise(resolve => {
        requestUrl({
            url: API_TRANSLATE_PARAGRAPH_URL,
            params: [{
                value: 'imageText/language'
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
    //  const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com";
    const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555";

    requestUrl({
        url: API_TRANSLATE_PARAGRAPH_URL,
        params: [{
            value: 'imageText/auto'
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
    // const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com";
    const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555";

    requestUrl({
        url: API_TRANSLATE_PARAGRAPH_URL,
        params: [{
            value: 'imageText/language'
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

export {
    getTextInImage,
    getTextInImageLanguage,
    getTextInImageCallback,
    getTextInImageLanguageCallback
}