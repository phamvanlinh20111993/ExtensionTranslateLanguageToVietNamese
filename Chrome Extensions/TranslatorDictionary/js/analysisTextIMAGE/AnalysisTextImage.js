import {
    ignoreAllOpenCloseCharacter,
    ignoreAllPunctuationLetter,
    capitalLetter,
    addSpaceCharWithSomeSpecialChar
} from './Helpers.js';

import {
    STRING_EMPTY
} from '../Helper.js';

import {
    getTextInImageCallback,
    getTextInImageFileCallback
} from '../api/TextInImage.js';

class AnalysisTextImage {

    constructor() {
        // if (new.target === AnalysisTextImage) {
        //     throw new TypeError("Cannot construct AnalysisTextImage instances directly");
        // }
    }

   /* #formatText(text) {
        if (text && text.trim() !== STRING_EMPTY) {
            text = ignoreAllPunctuationLetter(text)
            text = ignoreAllOpenCloseCharacter(text);
            text = capitalLetter(text);
            text = addSpaceCharWithSomeSpecialChar(text);
        }

        return text;
    } */

    getTextFromImage(imageUrl, callback) {
        getTextInImageCallback({
            data: imageUrl
        }, (data) => {
            callback(data)
        });
    }

    getTextFromImageFile(file, callback) {
        getTextInImageFileCallback({
            data: file
        }, (data) => {
            callback(data)
        });
    }
}

export {
    AnalysisTextImage
}