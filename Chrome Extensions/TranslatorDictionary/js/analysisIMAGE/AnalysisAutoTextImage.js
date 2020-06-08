import {
    AbstractAnalysisImage
} from './AbstractAnalysisImage.js';

import{
    MULTI_LANGUAGE_TESSERACT
} from './Helpers.js'

class AnalysisAutoTextImage extends AbstractAnalysisImage {

    #checkTimeOutTranslateText = null;
    #imageUrl;

    constructor(imageUrl) {
        super();
        this.#imageUrl = imageUrl;
    }

    getImageText = (callback) => {
        // example: https://www.geeksforgeeks.org/javascript-get-the-text-of-a-span-element/
        // support language: https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-20x
        // text: GeeksForGeeks↵‘This is text of Span element.↵This is text of Span element.↵
        try {
            this.#checkTimeOutTranslateText && clearTimeout(this.#checkTimeOutTranslateText)
            this.#checkTimeOutTranslateText = setTimeout(() => {
                Tesseract.recognize(this.#imageUrl)
                // .process(function(process){
                //     console.info('process', process)
                // })
                .then(({
                    data: {
                        text
                    }
                }) => {
                //    Tesseract.terminate();
                    console.log('hello', text)
                    callback({
                        textInImage: text
                    })
                })
            }, 400);
        } catch (e) {
            callback(null, `Error: ${e}`);
        }
    }
}

export {
    AnalysisAutoTextImage
}