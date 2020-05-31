import {
    AnalysisEnglishData
} from './AnalysisEnglishData.js';

import {
    AnalysisVietNameseData
} from './AnalysisVietNameseData.js';

import {
    ENGLISH_TYPE,
    VIETNAMESE_TYPE
} from '../../Helper.js';

import {
    CHECK_LANGUAGE
} from '../Helpers.js';

//call api
function checkLanguageType(data, toTargetLanguage) {

    if (checkVietNameseChar(data)) {
        return new Promise(resolve => resolve({
            type: VIETNAMESE_TYPE,
            data
        }));
    }

    return new Promise(resolve => {
        chrome.runtime.sendMessage({
            signal: CHECK_LANGUAGE,
            value: data,
            currentType:'none',
            targetType: toTargetLanguage
        }, function (response) {
            if (response.error)
                resolve(null)
            resolve({
                type: response.data.detectLanguage.signal,
                data: response
            });
        });
    });
}

function checkVietNameseChar(text) {
    return /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/.test(text);
}

// TODO in advance
async function analysisDataInstanceAd(originType, targetType, data) {

    const objectType = await checkLanguageType(data, targetType);
    switch (objectType.type) {
        default:
            break;
    }
    let instance = null;

    return instance;
}

// targetType fixed type is vi
async function analysisDataInstance(targetType, data) {

    let objectType = await checkLanguageType(data, targetType);
    console.info('object type in analysisDataInstance - AnalysDataFactory', objectType)
    let instance;
    switch (objectType.type) {
        case ENGLISH_TYPE:
            instance = new AnalysisEnglishData(targetType, data, objectType.data);
            break;

        case VIETNAMESE_TYPE:
            instance = new AnalysisVietNameseData(targetType, data, objectType.data);
            break;

        default:
            instance = !objectType ? null : {
                response: objectType.data
            };
            break;
    }

    return instance;
}

export {
    analysisDataInstance
}