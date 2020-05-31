import {
    AbstrachAnalysisImage
} from './AbstractAnalysisImage.js';

class AnalysisEnglishTextImage extends AbstrachAnalysisImage {

    #checkTimeOutTranslateText;
    #imageUrl;

    constructor(imageUrl, checkTimeOutTranslateText) {
        this.#imageUrl = imageUrl;
        this.#checkTimeOutTranslateText = checkTimeOutTranslateText;
    }

    checkTextImage = (callback) => {
        // example: https://www.geeksforgeeks.org/javascript-get-the-text-of-a-span-element/
        try {
            this.#checkTimeOutTranslateText && clearTimeout(this.#checkTimeOutTranslateText)
            this.#checkTimeOutTranslateText = setTimeout(() => {
                Tesseract.recognize(
                    this.#imageUrl,
                    'eng', {
                        logger: m => console.info(m)
                    }
                ).then(({
                    data: {
                        text
                    }
                }) => {
                    chrome.runtime.sendMessage({
                        signal: PARAGRAPH_INFORMATION,
                        value: text,
                        currentType: 'en',
                        targetType: 'vi'
                    }, function (response) {
                        if (response.err)
                            callback(null, response.err)
                        response.textInImage = text
                        callback(response, null)
                    });

                })
            }, 400);
        } catch (e) {
            callback(null, `Error: ${e}`);
        }
    }
}

export {
    AnalysisEnglishTextImage
}