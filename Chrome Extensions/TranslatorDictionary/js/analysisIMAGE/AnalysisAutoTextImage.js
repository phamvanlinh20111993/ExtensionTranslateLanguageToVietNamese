import {
    AbstractAnalysisImage
} from './AbstractAnalysisImage.js';

class AnalysisAutoTextImage extends AbstractAnalysisImage {

    #checkTimeOutTranslateText = null;
    #imageUrl;

    constructor(imageUrl) {
        super();
        this.#imageUrl = imageUrl;
    }

    getImageText = (callback) => {
        // example: https://www.geeksforgeeks.org/javascript-get-the-text-of-a-span-element/
        try {
            this.#checkTimeOutTranslateText && clearTimeout(this.#checkTimeOutTranslateText)
            this.#checkTimeOutTranslateText = setTimeout(() => {
                Tesseract.recognize(
                    this.#imageUrl,
                    'eng',
                    {
                        logger: m => console.info(m)
                    }
                ).then(({
                    data: {
                        text
                    }
                }) => {
                    Tesseract.terminate();
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