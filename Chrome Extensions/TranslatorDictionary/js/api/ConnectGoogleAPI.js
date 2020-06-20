import {
    requestUrl,
    API_TRANSLATOR_URL
} from './Helper.js';

function connectGoogleAPI(request) {
    return new Promise(resolve => {
        requestUrl({
            url: API_TRANSLATOR_URL,
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
    requestUrl({
        url: API_TRANSLATOR_URL,
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