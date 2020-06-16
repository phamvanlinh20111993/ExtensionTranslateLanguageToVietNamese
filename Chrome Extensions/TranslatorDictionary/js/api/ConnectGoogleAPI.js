import {
    requestUrl
} from './Helper.js';

function connectGoogleAPI(request) {

    const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com/translator-extension";

   // const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555/translator-extension/";
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

    const API_TRANSLATE_PARAGRAPH_URL = "https://translatorapilinhpv.herokuapp.com/translator-extension";
  //  const API_TRANSLATE_PARAGRAPH_URL = "http://localhost:5555/translator-extension/";

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