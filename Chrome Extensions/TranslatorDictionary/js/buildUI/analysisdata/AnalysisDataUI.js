import {
    matchString,
    isValidWord,
    isValidParagraph,
    MAX_TEXT
} from '../Helpers.js';

import {
    VIETNAMESE_TYPE
} from '../../Helper.js';

import {
    analysisDataInstance
} from './AnalysisDataFactory.js';

class AnalysisDataUI {

    #data;

    constructor() {
        this.#data = "";
    }

    isInRangeLengthText() {
        return this.#data.length < MAX_TEXT;
    }

    isValidString() {
        return matchString(this.#data) && this.isInRangeLengthText() &&
            (isValidWord(this.#data) ? true : isValidParagraph(this.#data) ? true : false);
    }

    setData(data){
        this.#data = data;
    }

    getData(){
        return this.#data;
    }

    /**
        * format getDataResponse() argument
        * {
            highlightedText,
            typeText: 'noun',
            des: ['hello exclamation', 'from the Oxford Advanced Learner'],
            pro: [{ type: 'bre', pro: '/həˈləʊ/', url: '' },
                    { type: 'nAmE', pro: '/həˈləʊ/', url: '' }],
            trans: [{ type: 'danh từ', mean: ['cân nặng', 'con vật'] },
                    { type: 'động từ', mean: ['chiều cao', 'cái con ấy nhé', 'con chó màu vàng']}]
        *  }
        **/
    async getDataResponse() {
        if (this.isValidString()) {
            let analysDataFactory = await analysisDataInstance(VIETNAMESE_TYPE, this.#data);

            if (analysDataFactory && !analysDataFactory.response)
                return analysDataFactory.getDataResponse();
            else
                return !analysDataFactory ? null : analysDataFactory.response;
        }
    
        return this.#data;
    }

}

export {
    AnalysisDataUI
}