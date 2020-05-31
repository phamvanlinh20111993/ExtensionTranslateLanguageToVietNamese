 
 
 import{
    AnalysisEnglishTextImage
 } from './AnalysisEnglishTextImage.js';

 import {
    ENGLISH_TYPE,
    VIETNAMESE_TYPE
 } from '../Helper.js';
 
 getAnalysisImageInstance = (type, imageUrl, checkTimeOutTranslateText) => {
    let instance;
    switch(type){
        case ENGLISH_TYPE:
            instance = new AnalysisEnglishTextImage(imageUrl, checkTimeOutTranslateText);
            break;
        case VIETNAMESE_TYPE:
            instance = new AnalysisEnglishTextImage(imageUrl, checkTimeOutTranslateText);
            break;
        default:
            instance = new AnalysisEnglishTextImage(imageUrl, checkTimeOutTranslateText);
            break;
    }

    return instance;
}


export{
    getAnalysisImageInstance
}