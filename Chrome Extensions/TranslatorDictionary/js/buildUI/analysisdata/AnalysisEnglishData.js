import {
    AbstractAnalysisData
} from './AbstractAnalysisData.js';

import {
    matchWord,
    TEXT_INFORMATION,
    PARAGRAPH_INFORMATION,
    isNull
} from '../Helpers.js';

import {
    ENGLISH_TYPE
} from '../../Helper.js';

class AnalysisEnglishData extends AbstractAnalysisData {

    #type;
    #dataInput;
    #dataResponse;

    constructor(type, dataInput, dataResponse) {
        super();
        this.#type = type;
        this.#dataInput = dataInput;
        this.#dataResponse = dataResponse;
    }

    isWord() {
        return matchWord(this.#dataInput);
    }

    isParagraph() {
        return this.#dataInput && this.#dataInput.split(/\s+/).length > 0;
    }

    getDataResponse() {
        let checkTypeMessageSignal = this.isWord() ? TEXT_INFORMATION :
            this.isParagraph() ? PARAGRAPH_INFORMATION : null;

        if (!isNull(checkTypeMessageSignal)) {
            return new Promise(resolve => {
                chrome.runtime.sendMessage({
                    signal: checkTypeMessageSignal,
                    value: this.#dataInput,
                    targetType: this.#type,
                    currentType: ENGLISH_TYPE
                }, function (res) {
                    if (res.err)
                        resolve(null)
                    resolve({
                        type: checkTypeMessageSignal,
                        lang: ENGLISH_TYPE,
                        response: res
                    })
                })
            })
        }

        return new Promise(resolve => resolve(this.#dataResponse));
    }
}

export {
    AnalysisEnglishData
}