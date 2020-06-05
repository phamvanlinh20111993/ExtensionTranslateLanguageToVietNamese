 import {
     AnalysisEnglishTextImage
 } from './AnalysisEnglishTextImage.js';

 import {
     AnalysisVietNamesesTextImage
 } from './AnalysisVietNamsesImage.js';

 import {
     AnalysisAutoTextImage
 } from './AnalysisAutoTextImage.js';

 import {
     ENGLISH_TYPE,
     VIETNAMESE_TYPE
 } from '../Helper.js';

 function getAnalysisImageInstance(type, imageUrl){
     let instance;

     switch (type) {

         case ENGLISH_TYPE:
             instance = new AnalysisEnglishTextImage(imageUrl);
             break;

         case VIETNAMESE_TYPE:
             instance = new AnalysisVietNamesesTextImage(imageUrl);
             break;

         default:
             instance = new AnalysisAutoTextImage(imageUrl);
             break;
     }

     return instance;
 }


 export {
     getAnalysisImageInstance
 }