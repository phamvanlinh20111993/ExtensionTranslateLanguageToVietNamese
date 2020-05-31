import {
    AbstractAnalysisData
} from './AbstractAnalysisData.js';

import {
    matchWord,
    TEXT_INFORMATION,
    PARAGRAPH_INFORMATION
} from '../Helpers.js';


class AnalysisVietNameseData extends AbstractAnalysisData {

    #type;//private field
    #dataInput;
    #dataResponse;

    constructor(type, dataInput, dataResponse) {
        super();
        // now not use in this case
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
        if (this.#dataInput) {
            return new Promise(revolve => revolve({
                type: this.isWord() ? TEXT_INFORMATION : PARAGRAPH_INFORMATION,
                response: this.#dataResponse
            }));
        }
        return new Promise(resolve => resolve(this.#dataResponse))
    }

}

export {
    AnalysisVietNameseData
}