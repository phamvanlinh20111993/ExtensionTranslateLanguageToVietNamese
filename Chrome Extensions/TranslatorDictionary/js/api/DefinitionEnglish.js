import {
    requestUrl
} from './Helper.js';

function getDefintionInOxfordPage(requestData) {
    
    const OXFORD_DICT_URL = "https://www.oxfordlearnersdictionaries.com";
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
}

export {
    getDefintionInOxfordPage
}