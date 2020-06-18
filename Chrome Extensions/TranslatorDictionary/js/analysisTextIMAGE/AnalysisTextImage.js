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
                    // .process(function(process){
                    //     console.info('process', process)
                    // })
                    .then(({
                        data: {
                            text
                        }
                    }) => {
                        //    Tesseract.terminate();
                        console.log('getImageText', text)
                        callback({
                            textInImage: this.formatText(text)
                        });
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