import {
    requestUrl,
    OXFORD_DICT_URL
} from './Helper.js';

/*function getDefintionInOxfordPage(requestData) {

    return new Promise(resolve => {
        requestUrl({
            url: OXFORD_DICT_URL,
            params: [{
                    value: 'definition',
                    type: 'String'
                },
                {
                    value: 'english',
                    type: 'String'
                },
                {
                    value: requestData.value,
                    type: 'String'
                }
            ],
            query: {
                q: requestData.value
            },
            requestType: "GET",
            data: {},
            formatResponse: {
                type: 'Dom',
                format: 'text/html',
                elementType: {
                    type: 'id',
                    value: 'entryContent'
                }
            }
        }, (result, err) => {
            resolve({
                result,
                err
            })
        })
    })
} */

function getDefintionInOxfordPage(requestData) {

    return new Promise(resolve => {
        requestUrl({
            url: OXFORD_DICT_URL,
            params: [{
                    value: 'definition',
                    type: 'String'
                },
                {
                    value: 'english',
                    type: 'String'
                },
                {
                    value: requestData.value,
                    type: 'String'
                }
            ],
            query: {
                q: requestData.value
            },
            requestType: "GET",
            data: {},
            formatResponse: {
                type: 'Dom',
                format: 'text/html',
                elementType: {
                    type: 'class',
                    value: 'responsive_entry_center'
                }
            }
        }, (result, err) => {
            resolve({
                result,
                err
            })
        })
    })
}

function getDefintionInOxfordPageByUrl(url) {

    return new Promise(resolve => {
        requestUrl({
            url: url,
            requestType: "GET",
            data: {},
            formatResponse: {
                type: 'Dom',
                format: 'text/html',
                elementType: {
                    type: 'class',
                    value: 'responsive_entry_center'
                }
            }
        }, (result, err) => {
            resolve({
                result,
                err
            })
        })
    })
}

export {
    getDefintionInOxfordPage,
    getDefintionInOxfordPageByUrl
}