import {
    requestUrl,
    postFileUrl,
    API_TRANSLATE_URL,
    API_GET_TEXT_IMAGE_FILE_URL
} from './Helper.js';

function getTextInImage(request) {
    return new Promise(resolve => {
        requestUrl({
            url: API_TRANSLATE_URL,
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
    return new Promise(resolve => {
        requestUrl({
            url: API_TRANSLATE_URL,
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
    requestUrl({
        url: API_TRANSLATE_URL,
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

    requestUrl({
        url: API_TRANSLATE_URL,
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
    postFileUrl({
        url: API_GET_TEXT_IMAGE_FILE_URL,
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