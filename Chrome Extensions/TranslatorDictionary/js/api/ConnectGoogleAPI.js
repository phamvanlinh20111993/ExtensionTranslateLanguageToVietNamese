import {
    requestUrl
} from './Helper.js';

function connectGoogleAPI(request) {

    const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com";
    return new Promise(resolve => {
        requestUrl({
            url: API_TRANSLATE_PARAGRAPH_URL,
            params: [{
                value: 'translate1'
            }],
            query: {
                to: request.originType,
                translateText: request.value
            },
            requestType: "GET",
            data: {},
        }, (result, err) => {
            resolve({
                result,
                err
            })
        });
    })
}

function connectGoogleAPICallback(request, callback) {

    const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com";
    requestUrl({
        url: API_TRANSLATE_PARAGRAPH_URL,
        params: [{
            value: 'translate1'
        }],
        query: {
            to: request.originType,
            translateText: request.value
        },
        requestType: "GET",
        data: {},
    }, (result, err) => {
        callback({
            result,
            err
        })
    });
}

export {
    connectGoogleAPI,
    connectGoogleAPICallback
}