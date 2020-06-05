
class AbstractAnalysisImage {

    constructor() {
        if (new.target === AbstractAnalysisImage) {
            throw new TypeError("Cannot construct AbstractAnalysisImage instances directly");
        }
    }

    getImageText(imageUrl){
        throw new Error('You have to implement checkImageText(imageUrl, checkTimeOutTranslateText) method');
    }
}

export {
    AbstractAnalysisImage
}