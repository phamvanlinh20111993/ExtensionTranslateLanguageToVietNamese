import {
    ignoreAllOpenCloseCharacter,
    ignoreAllPunctuationLetter,
    capitalLetter,
    addSpaceCharWithSomeSpecialChar
} from './Helpers.js';

import {
    STRING_EMPTY,
    SPACE_CHARACTER
} from '../Helper.js';

import {
    getTextInImageCallback,
    getTextInImageFileCallback
} from '../api/TextInImage.js';

class AnalysisTextImage {

    #checkTimeOutTranslateText;

    constructor() {
        // if (new.target === AnalysisTextImage) {
        //     throw new TypeError("Cannot construct AnalysisTextImage instances directly");
        // }
    }

    setCheckTimeOutTranslateText(checkTimeOutTranslateText) {
        this.#checkTimeOutTranslateText = checkTimeOutTranslateText;
    }

    getCheckTimeOutTranslateText() {
        return this.#checkTimeOutTranslateText;
    }

    formatText(text) {
        if (text && text.trim() !== STRING_EMPTY) {
            //check text is multi paragraph
            text = text.split(/\n+/).join(SPACE_CHARACTER);

            text = ignoreAllPunctuationLetter(text);
            text = ignoreAllOpenCloseCharacter(text);
            text = capitalLetter(text);
            text = addSpaceCharWithSomeSpecialChar(text);
        }

        return text;
    }


    getTextFromImageClient(imageUrl, callback) {
        // example: https://www.geeksforgeeks.org/javascript-get-the-text-of-a-span-element/
        // support language: https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-20x
        try {
            this.#checkTimeOutTranslateText && clearTimeout(this.#checkTimeOutTranslateText)
            this.#checkTimeOutTranslateText = setTimeout(() => {
                Tesseract.recognize(imageUrl)
                    .then(({
                        data: {
                            text
                        }
                    }) => {
                        console.log('Response getTextFromImageClient: ', text)
                        callback({
                            text: this.formatText(text)
                        }, null);
                    })
            }, 500);
        } catch (e) {
            callback(null, `Error: ${e}`);
        }
    }

    getTextFromImageAPI(imageUrl, callback) {

        getTextInImageCallback({
            data: {
                imageUrl
            }
        }, (data) => {
            console.log('Response getTextFromImageAPIgetTextFromImageAPI: ', data)
            if(data.result)
                data.result.text = this.formatText(data.result.text);
            callback(data);
        });
    }

    getTextFromImageFile(file, callback) {
        getTextInImageFileCallback({
            data: file
        }, (data) => {
            console.log('Response getTextFromImageFile: ', data)
            if(data.result)
                data.result.text = this.formatText(data.result.text);
            callback(data);
        });
    }
}

export {
    AnalysisTextImage
}